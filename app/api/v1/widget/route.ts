import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const apiKey = req.nextUrl.searchParams.get("key");
  if (!apiKey) {
    return Response.json({ error: "API key required" }, { status: 401 });
  }

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

  return Response.json(
    {
      firmName: firm.name,
      greeting: config?.greeting || "Hi! How can I help you today?",
      primaryColor: firm.primaryColor,
      secondaryColor: firm.secondaryColor,
      logoUrl: firm.logoUrl,
      serviceOptions: config?.serviceOptions || [],
      collectName: config?.collectName ?? true,
      collectEmail: config?.collectEmail ?? true,
      collectPhone: config?.collectPhone ?? true,
      collectService: config?.collectService ?? true,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    },
  );
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
