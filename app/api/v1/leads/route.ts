import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm associated" }, { status: 403 });
  }

  const url = req.nextUrl;
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const where: Record<string, unknown> = { firmId };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        conversations: {
          select: { id: true, messages: { select: { id: true } } },
        },
        template: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return Response.json({
    leads,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm associated" }, { status: 403 });
  }

  const { leadId, status, assignedTo } = await req.json();

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, firmId },
  });

  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...(status && { status }),
      ...(assignedTo !== undefined && { assignedTo }),
    },
  });

  return Response.json(updated);
}
