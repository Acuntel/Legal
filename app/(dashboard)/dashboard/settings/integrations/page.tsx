"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
}

const availableEvents = [
  { value: "lead.new", label: "New Lead Created" },
  { value: "lead.qualified", label: "Lead Qualified" },
  { value: "lead.not_qualified", label: "Lead Not Qualified" },
  { value: "conversation.ended", label: "Conversation Ended" },
  { value: "lead.status_changed", label: "Lead Status Changed" },
];

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/webhooks");
        if (res.ok) {
          const data = await res.json();
          setWebhooks(data.webhooks || []);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addWebhook = async () => {
    if (!newUrl.trim() || newEvents.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, events: newEvents }),
      });
      if (res.ok) {
        const wh = await res.json();
        setWebhooks([...webhooks, wh]);
        setNewUrl("");
        setNewEvents([]);
      }
    } catch {
      // Handle silently
    } finally {
      setSaving(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      await fetch(`/api/v1/webhooks?id=${id}`, { method: "DELETE" });
      setWebhooks(webhooks.filter((w) => w.id !== id));
    } catch {
      // Handle silently
    }
  };

  const toggleEvent = (event: string) => {
    setNewEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-gray-400 mt-1">
          Connect your intake data to CRMs and other tools via webhooks
        </p>
      </div>

      {/* CRM Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-blue-300 font-medium">CRM Integration</p>
            <p className="text-blue-400/70 text-sm mt-1">
              Use webhooks to push lead data to Lead Docket, Filevine,
              SmartAdvocate, or any CRM that accepts webhooks. Each webhook
              receives a JSON payload with full lead details when events fire.
            </p>
          </div>
        </div>
      </div>

      {/* Existing Webhooks */}
      {webhooks.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl divide-y divide-gray-800">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="p-5 flex items-start justify-between gap-4"
            >
              <div>
                <code className="text-sm text-emerald-400 font-mono">
                  {wh.url}
                </code>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {wh.events.map((e) => (
                    <span
                      key={e}
                      className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => deleteWebhook(wh.id)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Webhook */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Add Webhook</h2>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Webhook URL
          </label>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://your-crm.com/api/webhook"
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Events
          </label>
          <div className="flex flex-wrap gap-2">
            {availableEvents.map((event) => (
              <button
                key={event.value}
                onClick={() => toggleEvent(event.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm border transition-colors",
                  newEvents.includes(event.value)
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-gray-700 text-gray-400 hover:border-gray-600",
                )}
              >
                {event.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={addWebhook}
          disabled={!newUrl.trim() || newEvents.length === 0 || saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Webhook
        </button>
      </div>
    </div>
  );
}
