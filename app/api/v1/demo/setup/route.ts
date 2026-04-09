import { prisma } from "@/lib/db/prisma";

const DEMO_API_KEY = "lgl_demo_kryder_law_public";

export async function GET() {
  try {
    // Check if demo firm exists
    const existing = await prisma.firm.findUnique({
      where: { apiKey: DEMO_API_KEY },
    });

    if (existing) {
      return Response.json({ apiKey: DEMO_API_KEY, status: "exists" });
    }

    // Create demo firm
    await prisma.firm.create({
      data: {
        name: "Kryder Law Group",
        slug: "kryder-law-demo",
        phone: "(312) 223-1700",
        email: "info@kryderlaw.com",
        primaryColor: "#1e3a5f",
        secondaryColor: "#d4a535",
        apiKey: DEMO_API_KEY,
        plan: "ENTERPRISE",
        intakeConfigs: {
          create: {
            name: "Demo Config",
            greeting:
              "Hi! I'm the Kryder Law Group virtual assistant. I can help you determine if you have a viable personal injury case. How can I help you today?",
            systemPrompt: `You are the AI intake assistant for The Kryder Law Group, a Chicago personal injury law firm with 22+ years of experience and over $100M recovered for clients.

FIRM DETAILS:
- Founded 2002 by Andrew S. Kryder, Esq.
- 4.9 stars, 535+ Google Reviews
- 17 offices across 8 states
- Fee: Contingency only — no fees unless we win
- Available 24/7
- Phone: (312) 223-1700

PRACTICE AREAS: Car Accidents, Truck Accidents, Motorcycle Accidents, Medical Malpractice, Construction Accidents, Slip and Fall, Workers Compensation, Wrongful Death, Catastrophic Injury

QUALIFICATION FOCUS:
Naturally gather: type of accident, when it happened, where, injuries sustained, medical treatment status, insurance situation, and any evidence.

KEY RULES:
- NEVER give specific legal advice
- NEVER guarantee outcomes
- Be warm, compassionate — these people are hurting
- Keep responses to 2-4 sentences
- Guide toward scheduling a free case review
- Emphasize: free consultation, no fees unless we win, available 24/7`,
            serviceOptions: [
              "Car Accident",
              "Truck Accident",
              "Motorcycle Accident",
              "Medical Malpractice",
              "Construction Accident",
              "Slip and Fall",
              "Workers Compensation",
              "Wrongful Death",
              "Other Injury",
            ],
            aiMode: "QUALIFY",
            qualThreshold: 65,
          },
        },
      },
    });

    return Response.json({ apiKey: DEMO_API_KEY, status: "created" });
  } catch (error) {
    console.error("Demo setup error:", error);
    return Response.json({ error: "Failed to setup demo" }, { status: 500 });
  }
}
