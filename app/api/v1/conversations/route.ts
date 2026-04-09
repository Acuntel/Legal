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

  const conversations = await prisma.conversation.findMany({
    where: { firmId },
    include: {
      lead: {
        select: { id: true, name: true, caseType: true, status: true },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return Response.json({ conversations });
}
