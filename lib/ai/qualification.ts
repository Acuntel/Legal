import Anthropic from "@anthropic-ai/sdk";
import type { QualificationResult } from "@/lib/types";

const QUALIFICATION_PROMPT = `You are a legal intake qualification AI. Analyze the conversation transcript and extract key case information.

You must return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "status": "QUALIFIED" | "NOT_QUALIFIED" | "PENDING_REVIEW",
  "summary": "<2-3 sentence case summary>",
  "flags": ["<array of relevant flags>"],
  "extractedData": {
    "caseType": "<type of case>",
    "incidentDate": "<date if mentioned>",
    "incidentLocation": "<location if mentioned>",
    "injuries": "<injuries described>",
    "medicalTreatment": "<treatment status>",
    "liabilityIndicators": "<liability factors>",
    "insuranceStatus": "<insurance info>",
    "statuteOfLimitations": "<relevant SOL info>",
    "estimatedSeverity": "LOW | MEDIUM | HIGH | CRITICAL"
  }
}

SCORING GUIDELINES:
- 80-100: Strong case indicators (clear liability, documented injuries, within SOL, insured defendant)
- 60-79: Moderate case (some liability questions, treatment gaps, but potentially viable)
- 40-59: Weak case (unclear liability, minor injuries, possible SOL issues)
- 0-39: Not qualified (no liability, SOL expired, no injuries, excluded case type)

FLAGS TO CHECK:
- "clear_liability" (positive)
- "severe_injury" (positive)
- "insured_defendant" (positive)
- "within_sol" (positive)
- "documented_treatment" (positive)
- "multiple_witnesses" (positive)
- "sol_concern" (negative)
- "no_treatment" (negative)
- "pre_existing_condition" (negative)
- "shared_fault" (negative)
- "no_insurance" (negative)
- "minor_injury" (neutral)

Return ONLY the JSON object, no other text.`;

export async function qualifyLead(
  transcript: { role: string; content: string }[],
  firmContext: string,
  threshold: number = 70,
): Promise<QualificationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const client = new Anthropic({ apiKey });

  const conversationText = transcript
    .map(
      (m) => `${m.role === "user" ? "Client" : "AI Assistant"}: ${m.content}`,
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system:
      QUALIFICATION_PROMPT +
      (firmContext ? `\n\nFIRM-SPECIFIC CONTEXT:\n${firmContext}` : ""),
    messages: [
      {
        role: "user",
        content: `Analyze this intake conversation and qualify the lead:\n\n${conversationText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  try {
    const result = JSON.parse(text) as QualificationResult;

    // Override status based on firm threshold
    if (result.score >= threshold) {
      result.status = "QUALIFIED";
    } else if (result.score >= threshold - 20) {
      result.status = "PENDING_REVIEW";
    } else {
      result.status = "NOT_QUALIFIED";
    }

    return result;
  } catch {
    return {
      score: 50,
      status: "PENDING_REVIEW",
      summary: "Unable to fully qualify — manual review recommended.",
      flags: [],
      extractedData: {},
    };
  }
}
