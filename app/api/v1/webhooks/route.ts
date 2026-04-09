import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { v4 as uuid } from "uuid";
import crypto from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm" }, { status: 403 });
  }

  const webhooks = await prisma.webhook.findMany({
    where: { firmId },
    select: { id: true, url: true, events: true, isActive: true },
  });

  return Response.json({ webhooks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm" }, { status: 403 });
  }

  const { url, events } = await req.json();

  if (!url || !events?.length) {
    return Response.json({ error: "URL and events required" }, { status: 400 });
  }

  const webhook = await prisma.webhook.create({
    data: {
      firmId,
      url,
      events,
      secret: `whsec_${crypto.randomBytes(24).toString("hex")}`,
    },
    select: { id: true, url: true, events: true, isActive: true },
  });

  return Response.json(webhook);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.webhook.deleteMany({ where: { id, firmId } });

  return Response.json({ success: true });
}
