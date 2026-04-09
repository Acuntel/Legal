"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ConversationPreview {
  id: string;
  channel: string;
  startedAt: string;
  endedAt: string | null;
  lead: {
    id: string;
    name: string;
    caseType: string | null;
    status: string;
  };
  messages: { id: string; role: string; content: string; createdAt: string }[];
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Conversations</h1>
        <p className="text-gray-400 mt-1">
          All chat transcripts from your intake widget
        </p>
      </div>

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No conversations yet</p>
            <p className="text-gray-600 text-sm mt-1">
              Conversations will appear here when leads chat with your widget
            </p>
          </div>
        ) : (
          conversations.map((convo) => {
            const lastMsg = convo.messages[convo.messages.length - 1];
            const msgCount = convo.messages.length;

            return (
              <Link
                key={convo.id}
                href={`/dashboard/leads/${convo.lead.id}`}
                className="block bg-gray-900 border border-gray-800 rounded-xl p-5 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-medium shrink-0">
                      {convo.lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {convo.lead.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {convo.lead.caseType || "General inquiry"} &middot;{" "}
                        {msgCount} messages
                      </p>
                      {lastMsg && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(convo.startedAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
