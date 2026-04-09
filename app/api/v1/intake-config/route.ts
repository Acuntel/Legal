import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm associated" }, { status: 403 });
  }

  const config = await prisma.intakeConfig.findFirst({
    where: { firmId, isActive: true },
  });

  if (!config) {
    return Response.json({ error: "No config found" }, { status: 404 });
  }

  return Response.json(config);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm associated" }, { status: 403 });
  }

  const body = await req.json();

  const config = await prisma.intakeConfig.findFirst({
    where: { firmId, isActive: true },
  });

  if (!config) {
    return Response.json({ error: "No config found" }, { status: 404 });
  }

  const updated = await prisma.intakeConfig.update({
    where: { id: config.id },
    data: {
      greeting: body.greeting,
      systemPrompt: body.systemPrompt,
      collectName: body.collectName,
      collectEmail: body.collectEmail,
      collectPhone: body.collectPhone,
      collectService: body.collectService,
      serviceOptions: body.serviceOptions,
      aiMode: body.aiMode,
      qualThreshold: body.qualThreshold,
    },
  });

  return Response.json(updated);
}
