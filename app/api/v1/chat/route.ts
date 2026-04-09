import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db/prisma";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { qualifyLead } from "@/lib/ai/qualification";

// Rate limiting: simple in-memory store
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRate(ip: string, limit = 20): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRate(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { apiKey, messages, leadInfo, conversationId } = body;

    if (!apiKey) {
      return Response.json({ error: "API key required" }, { status: 401 });
    }

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }

    // Look up firm by API key
    const firm = await prisma.firm.findUnique({
      where: { apiKey },
      include: {
        intakeConfigs: { where: { isActive: true }, take: 1 },
      },
    });

    if (!firm || !firm.widgetEnabled) {
      return Response.json({ error: "Invalid API key" }, { status: 401 });
    }

    const config = firm.intakeConfigs[0];
    if (!config) {
      return Response.json(
        { error: "No intake configuration found" },
        { status: 500 },
      );
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt({
      firmName: firm.name,
      phone: firm.phone,
      email: firm.email,
      customPrompt: config.systemPrompt,
      aiMode: config.aiMode,
      serviceOptions: config.serviceOptions,
    });

    // Create or update lead
    let lead = null;
    let convo = null;

    if (leadInfo?.name) {
      lead = await prisma.lead.upsert({
        where: {
          id: leadInfo.leadId || "nonexistent",
        },
        create: {
          firmId: firm.id,
          name: leadInfo.name,
          email: leadInfo.email || null,
          phone: leadInfo.phone || null,
          caseType: leadInfo.service || null,
          source: "widget",
          referrer: leadInfo.referrer || null,
          status: "IN_PROGRESS",
        },
        update: {
          name: leadInfo.name,
          email: leadInfo.email || undefined,
          phone: leadInfo.phone || undefined,
        },
      });

      // Create or get conversation
      if (conversationId) {
        convo = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });
      }
      if (!convo) {
        convo = await prisma.conversation.create({
          data: {
            firmId: firm.id,
            leadId: lead.id,
            channel: "WEB_CHAT",
          },
        });
      }

      // Save user message
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg?.role === "user") {
        await prisma.message.create({
          data: {
            conversationId: convo.id,
            role: "USER",
            content: lastUserMsg.content,
          },
        });
      }
    }

    // Prepare messages for Claude
    let contextPrompt = systemPrompt;
    if (leadInfo) {
      contextPrompt += `\n\nCURRENT USER INFO:\n- Name: ${leadInfo.name}`;
      if (leadInfo.email) contextPrompt += `\n- Email: ${leadInfo.email}`;
      if (leadInfo.phone) contextPrompt += `\n- Phone: ${leadInfo.phone}`;
      if (leadInfo.service)
        contextPrompt += `\n- Interested in: ${leadInfo.service}`;
    }

    const anthropicMessages = messages
      .slice(-20)
      .filter(
        (msg: { role: string; content: string }, i: number) =>
          !(i === 0 && msg.role === "assistant"),
      )
      .map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    // Stream response
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: contextPrompt,
      messages: anthropicMessages,
    });

    let fullResponse = "";
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              fullResponse += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          // After streaming, save assistant message and possibly qualify
          if (convo) {
            await prisma.message.create({
              data: {
                conversationId: convo.id,
                role: "ASSISTANT",
                content: fullResponse,
              },
            });

            // Auto-qualify after enough messages (6+ messages = 3 exchanges)
            if (lead && messages.length >= 6) {
              try {
                const allMessages = [
                  ...messages,
                  { role: "assistant", content: fullResponse },
                ];
                const result = await qualifyLead(
                  allMessages,
                  config.systemPrompt,
                  config.qualThreshold,
                );
                await prisma.lead.update({
                  where: { id: lead.id },
                  data: {
                    qualScore: result.score,
                    qualSummary: result.summary,
                    qualFlags: result.flags,
                    qualData: JSON.parse(JSON.stringify(result.extractedData)),
                    status: result.status,
                    caseType:
                      (result.extractedData as Record<string, string>)
                        .caseType || lead.caseType,
                  },
                });
              } catch {
                // Don't block chat for qualification errors
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
        "X-Conversation-Id": convo?.id || "",
        "X-Lead-Id": lead?.id || "",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
