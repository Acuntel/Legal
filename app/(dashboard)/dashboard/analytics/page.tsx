"use client";

import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AnalyticsData {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  avgQualScore: number;
  byStatus: { status: string; count: number }[];
  byCaseType: { caseType: string; count: number }[];
  bySource: { source: string; count: number }[];
  byDay: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/analytics");
        if (res.ok) {
          setData(await res.json());
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-400">
        Unable to load analytics
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    QUALIFIED: "bg-emerald-500",
    NOT_QUALIFIED: "bg-red-500",
    PENDING_REVIEW: "bg-amber-500",
    IN_PROGRESS: "bg-blue-500",
    NEW: "bg-gray-500",
    SIGNED: "bg-purple-500",
    LOST: "bg-gray-600",
  };

  const maxByDay = Math.max(...data.byDay.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Track your intake performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Leads",
            value: data.totalLeads,
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "Qualified",
            value: data.qualifiedLeads,
            icon: CheckCircle2,
            color: "text-emerald-400",
          },
          {
            label: "Conversion Rate",
            value: `${data.conversionRate}%`,
            icon: TrendingUp,
            color: "text-purple-400",
          },
          {
            label: "Avg Score",
            value: data.avgQualScore,
            icon: BarChart3,
            color: "text-amber-400",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <kpi.icon className={cn("w-5 h-5 mb-3", kpi.color)} />
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Leads Over Time - Simple Bar Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Leads (Last 30 Days)
        </h2>
        <div className="flex items-end gap-1 h-40">
          {data.byDay.map((day) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center justify-end h-full group relative"
            >
              <div
                className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-400 min-h-[2px]"
                style={{ height: `${(day.count / maxByDay) * 100}%` }}
              />
              <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                {day.date}: {day.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* By Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">By Status</h2>
          <div className="space-y-3">
            {data.byStatus.map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    statusColors[item.status] || "bg-gray-500",
                  )}
                />
                <span className="text-sm text-gray-300 flex-1">
                  {item.status.replace("_", " ")}
                </span>
                <span className="text-sm text-white font-medium">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* By Case Type */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">
            By Case Type
          </h2>
          <div className="space-y-3">
            {data.byCaseType.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              data.byCaseType.map((item) => (
                <div key={item.caseType} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 flex-1">
                    {item.caseType || "Unknown"}
                  </span>
                  <span className="text-sm text-white font-medium">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* By Source */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">By Source</h2>
          <div className="space-y-3">
            {data.bySource.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              data.bySource.map((item) => (
                <div key={item.source} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 flex-1">
                    {item.source || "Unknown"}
                  </span>
                  <span className="text-sm text-white font-medium">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
