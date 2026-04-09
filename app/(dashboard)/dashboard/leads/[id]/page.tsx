"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LeadDetail {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  caseType: string | null;
  incidentDate: string | null;
  incidentLocation: string | null;
  description: string | null;
  injuryDetails: string | null;
  status: string;
  qualScore: number | null;
  qualSummary: string | null;
  qualFlags: string[];
  qualData: Record<string, unknown> | null;
  source: string | null;
  referrer: string | null;
  createdAt: string;
  conversations: {
    id: string;
    channel: string;
    startedAt: string;
    messages: {
      id: string;
      role: string;
      content: string;
      createdAt: string;
    }[];
  }[];
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/v1/leads/${id}`);
        if (res.ok) {
          const data = await res.json();
          setLead(data);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Lead not found</p>
        <Link
          href="/dashboard/leads"
          className="text-blue-400 mt-2 inline-block"
        >
          Back to leads
        </Link>
      </div>
    );
  }

  const scoreColor =
    lead.qualScore !== null
      ? lead.qualScore >= 70
        ? "text-emerald-400"
        : lead.qualScore >= 50
          ? "text-amber-400"
          : "text-red-400"
      : "text-gray-500";

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
          <p className="text-gray-400 mt-1">
            {lead.caseType || "Unknown case type"} &middot;{" "}
            {new Date(lead.createdAt).toLocaleDateString()}
          </p>
        </div>
        {lead.qualScore !== null && (
          <div className="text-right">
            <p className={cn("text-4xl font-bold", scoreColor)}>
              {lead.qualScore}
            </p>
            <p className="text-xs text-gray-500 mt-1">Qualification Score</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Qualification Summary */}
          {lead.qualSummary && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                AI Qualification Summary
              </h2>
              <p className="text-gray-300">{lead.qualSummary}</p>
              {lead.qualFlags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {lead.qualFlags.map((flag) => {
                    const isPositive = [
                      "clear_liability",
                      "severe_injury",
                      "insured_defendant",
                      "within_sol",
                      "documented_treatment",
                      "multiple_witnesses",
                    ].includes(flag);
                    return (
                      <span
                        key={flag}
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                          isPositive
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400",
                        )}
                      >
                        {isPositive ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {flag.replace(/_/g, " ")}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Conversation Transcript */}
          {lead.conversations.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Conversation Transcript
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {lead.conversations[0].messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.role === "USER" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                        msg.role === "USER"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-800 text-gray-300 rounded-bl-md",
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Info */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Contact Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{lead.name}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {lead.email}
                  </a>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Case Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">
                  {lead.caseType || "Not specified"}
                </span>
              </div>
              {lead.incidentDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300">
                    {new Date(lead.incidentDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {lead.incidentLocation && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300">{lead.incidentLocation}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">
                  Source: {lead.source || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">
                  {lead.conversations.length} conversation(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
