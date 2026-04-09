"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FirmSettings {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  apiKey: string;
  plan: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<FirmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/settings");
        if (res.ok) setSettings(await res.json());
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // Handle silently
    } finally {
      setSaving(false);
    }
  };

  const copyApiKey = () => {
    if (settings) {
      navigator.clipboard.writeText(settings.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">General Settings</h1>
          <p className="text-gray-400 mt-1">Manage your firm details</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white",
          )}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* API Key */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-semibold text-white">API Key</h2>
        <p className="text-sm text-gray-400">
          Use this key to embed the widget on your website
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-emerald-400 text-sm font-mono overflow-x-auto">
            {settings.apiKey}
          </code>
          <button
            onClick={copyApiKey}
            className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            Plan: <span className="text-white">{settings.plan}</span>
          </p>
        </div>
      </div>

      {/* Firm Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Firm Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Firm Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) =>
                setSettings({ ...settings, name: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              value={settings.phone || ""}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={settings.email || ""}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Logo URL
            </label>
            <input
              type="url"
              value={settings.logoUrl || ""}
              onChange={(e) =>
                setSettings({ ...settings, logoUrl: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Widget Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
                className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) =>
                  setSettings({ ...settings, primaryColor: e.target.value })
                }
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    secondaryColor: e.target.value,
                  })
                }
                className="w-10 h-10 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    secondaryColor: e.target.value,
                  })
                }
                className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
