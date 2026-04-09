"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Stats {
  totalLeads: number;
  qualified: number;
  pending: number;
  notQualified: number;
  conversionRate: number;
  activeConversations: number;
}

interface RecentLead {
  id: string;
  name: string;
  caseType: string | null;
  status: string;
  qualScore: number | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/leads?limit=5");
        if (res.ok) {
          const data = await res.json();
          setRecentLeads(data.leads || []);

          // Calculate stats from leads
          const leads = data.leads || [];
          const total = data.pagination?.total || 0;
          const qual = leads.filter(
            (l: RecentLead) =>
              l.status === "QUALIFIED" || l.status === "SIGNED",
          ).length;
          const pend = leads.filter(
            (l: RecentLead) =>
              l.status === "PENDING_REVIEW" || l.status === "IN_PROGRESS",
          ).length;
          const notQual = leads.filter(
            (l: RecentLead) => l.status === "NOT_QUALIFIED",
          ).length;

          setStats({
            totalLeads: total,
            qualified: qual,
            pending: pend,
            notQualified: notQual,
            conversionRate: total > 0 ? Math.round((qual / total) * 100) : 0,
            activeConversations: leads.filter(
              (l: RecentLead) => l.status === "IN_PROGRESS",
            ).length,
          });
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Leads",
          value: stats.totalLeads,
          icon: Users,
          color: "text-blue-400",
          bg: "bg-blue-400/10",
        },
        {
          label: "Qualified",
          value: stats.qualified,
          icon: CheckCircle2,
          color: "text-emerald-400",
          bg: "bg-emerald-400/10",
        },
        {
          label: "Pending Review",
          value: stats.pending,
          icon: Clock,
          color: "text-amber-400",
          bg: "bg-amber-400/10",
        },
        {
          label: "Conversion Rate",
          value: `${stats.conversionRate}%`,
          icon: TrendingUp,
          color: "text-purple-400",
          bg: "bg-purple-400/10",
        },
        {
          label: "Active Chats",
          value: stats.activeConversations,
          icon: MessageSquare,
          color: "text-cyan-400",
          bg: "bg-cyan-400/10",
        },
        {
          label: "Not Qualified",
          value: stats.notQualified,
          icon: XCircle,
          color: "text-red-400",
          bg: "bg-red-400/10",
        },
      ]
    : [];

  const statusColors: Record<string, string> = {
    NEW: "bg-gray-500/20 text-gray-400",
    IN_PROGRESS: "bg-blue-500/20 text-blue-400",
    QUALIFIED: "bg-emerald-500/20 text-emerald-400",
    NOT_QUALIFIED: "bg-red-500/20 text-red-400",
    PENDING_REVIEW: "bg-amber-500/20 text-amber-400",
    SIGNED: "bg-purple-500/20 text-purple-400",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your intake pipeline</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  card.bg,
                )}
              >
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {recentLeads.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-500">
              No leads yet. Install the widget on your website to start
              receiving leads.
            </div>
          ) : (
            recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{lead.name}</p>
                    <p className="text-sm text-gray-500">
                      {lead.caseType || "Unknown case type"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {lead.qualScore !== null && (
                    <span className="text-sm text-gray-400">
                      Score: {lead.qualScore}
                    </span>
                  )}
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      statusColors[lead.status] || statusColors.NEW,
                    )}
                  >
                    {lead.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
