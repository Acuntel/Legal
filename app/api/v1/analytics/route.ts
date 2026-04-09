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

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [allLeads, qualified, byStatus, byCaseType, bySource] =
    await Promise.all([
      prisma.lead.count({ where: { firmId } }),
      prisma.lead.count({
        where: { firmId, status: { in: ["QUALIFIED", "SIGNED"] } },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        where: { firmId },
        _count: true,
      }),
      prisma.lead.groupBy({
        by: ["caseType"],
        where: { firmId },
        _count: true,
        orderBy: { _count: { caseType: "desc" } },
        take: 10,
      }),
      prisma.lead.groupBy({
        by: ["source"],
        where: { firmId },
        _count: true,
      }),
    ]);

  const avgScore = await prisma.lead.aggregate({
    where: { firmId, qualScore: { not: null } },
    _avg: { qualScore: true },
  });

  // Build daily counts for last 30 days
  const recentLeads = await prisma.lead.findMany({
    where: { firmId, createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
  });

  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().split("T")[0], 0);
  }
  for (const lead of recentLeads) {
    const day = lead.createdAt.toISOString().split("T")[0];
    if (dayMap.has(day)) {
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    }
  }

  return Response.json({
    totalLeads: allLeads,
    qualifiedLeads: qualified,
    conversionRate: allLeads > 0 ? Math.round((qualified / allLeads) * 100) : 0,
    avgQualScore: Math.round(avgScore._avg.qualScore || 0),
    byStatus: byStatus.map((s: { status: string; _count: number }) => ({
      status: s.status,
      count: s._count,
    })),
    byCaseType: byCaseType.map(
      (c: { caseType: string | null; _count: number }) => ({
        caseType: c.caseType,
        count: c._count,
      }),
    ),
    bySource: bySource.map((s: { source: string | null; _count: number }) => ({
      source: s.source,
      count: s._count,
    })),
    byDay: Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    })),
  });
}
