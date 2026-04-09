"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  caseType: string | null;
  status: string;
  qualScore: number | null;
  qualSummary: string | null;
  qualFlags: string[];
  source: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusOptions = [
  "ALL",
  "NEW",
  "IN_PROGRESS",
  "QUALIFIED",
  "NOT_QUALIFIED",
  "PENDING_REVIEW",
  "SIGNED",
  "LOST",
];

const statusColors: Record<string, string> = {
  NEW: "bg-gray-500/20 text-gray-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  QUALIFIED: "bg-emerald-500/20 text-emerald-400",
  NOT_QUALIFIED: "bg-red-500/20 text-red-400",
  PENDING_REVIEW: "bg-amber-500/20 text-amber-400",
  SIGNED: "bg-purple-500/20 text-purple-400",
  LOST: "bg-gray-500/20 text-gray-500",
  ARCHIVED: "bg-gray-500/20 text-gray-600",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", pagination.page.toString());
    params.set("limit", "20");
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/v1/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setPagination(data.pagination);
      }
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  }, [pagination.page, search, statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    await fetch("/api/v1/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, status: newStatus }),
    });
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-gray-400 mt-1">
          Manage and review all incoming leads
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All Statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Case Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-white font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">
                          {lead.email || lead.phone || "No contact"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-300">
                      {lead.caseType || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {lead.qualScore !== null ? (
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                lead.qualScore >= 70
                                  ? "bg-emerald-500"
                                  : lead.qualScore >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500",
                              )}
                              style={{ width: `${lead.qualScore}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">
                            {lead.qualScore}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead.id, e.target.value)
                        }
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none",
                          statusColors[lead.status] || statusColors.NEW,
                        )}
                      >
                        {statusOptions
                          .filter((s) => s !== "ALL")
                          .map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {lead.source || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-800 px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {pagination.total} total leads
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page - 1 }))
                }
                disabled={pagination.page <= 1}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((p) => ({ ...p, page: p.page + 1 }))
                }
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
