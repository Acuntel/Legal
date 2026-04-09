import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const firmId = (session.user as { firmId?: string }).firmId;
  if (!firmId) {
    return Response.json({ error: "No firm associated" }, { status: 403 });
  }

  const { id } = await params;

  const lead = await prisma.lead.findFirst({
    where: { id, firmId },
    include: {
      conversations: {
        include: {
          messages: { orderBy: { createdAt: "asc" } },
        },
        orderBy: { startedAt: "desc" },
      },
      documents: true,
      template: true,
    },
  });

  if (!lead) {
    return Response.json({ error: "Lead not found" }, { status: 404 });
  }

  return Response.json(lead);
}
