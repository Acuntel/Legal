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

  const firm = await prisma.firm.findUnique({
    where: { id: firmId },
    select: {
      id: true,
      name: true,
      slug: true,
      phone: true,
      email: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
      apiKey: true,
      plan: true,
    },
  });

  if (!firm) {
    return Response.json({ error: "Firm not found" }, { status: 404 });
  }

  return Response.json(firm);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  const role = (session.user as { role?: string }).role;

  if (!firmId) {
    return Response.json({ error: "No firm associated" }, { status: 403 });
  }

  if (role !== "OWNER" && role !== "ADMIN") {
    return Response.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  const body = await req.json();

  const updated = await prisma.firm.update({
    where: { id: firmId },
    data: {
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      logoUrl: body.logoUrl || null,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
    },
  });

  return Response.json(updated);
}
