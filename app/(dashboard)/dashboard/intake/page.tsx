"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface IntakeConfig {
  id: string;
  name: string;
  isActive: boolean;
  greeting: string;
  systemPrompt: string;
  collectName: boolean;
  collectEmail: boolean;
  collectPhone: boolean;
  collectService: boolean;
  serviceOptions: string[];
  aiMode: string;
  qualThreshold: number;
}

export default function IntakeConfigPage() {
  const [config, setConfig] = useState<IntakeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newService, setNewService] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/intake-config");
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/intake-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
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

  const addService = () => {
    if (!newService.trim() || !config) return;
    setConfig({
      ...config,
      serviceOptions: [...config.serviceOptions, newService.trim()],
    });
    setNewService("");
  };

  const removeService = (index: number) => {
    if (!config) return;
    setConfig({
      ...config,
      serviceOptions: config.serviceOptions.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center py-12 text-gray-400">
        No intake configuration found. Contact support.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Intake Configuration
          </h1>
          <p className="text-gray-400 mt-1">
            Customize how your AI intake assistant behaves
          </p>
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

      {/* AI Mode */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">AI Behavior Mode</h2>
        <p className="text-sm text-gray-400">
          Control how much your AI assistant handles
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              value: "COLLECT",
              label: "Collect Only",
              desc: "AI gathers info, staff decides",
            },
            {
              value: "QUALIFY",
              label: "Qualify & Score",
              desc: "AI scores leads, staff confirms",
            },
            {
              value: "FULL",
              label: "Full Intake",
              desc: "AI qualifies and initiates signing",
            },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setConfig({ ...config, aiMode: mode.value })}
              className={cn(
                "p-4 rounded-lg border text-left transition-colors",
                config.aiMode === mode.value
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 hover:border-gray-600",
              )}
            >
              <p className="text-white font-medium text-sm">{mode.label}</p>
              <p className="text-gray-500 text-xs mt-1">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Greeting */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Chat Greeting</h2>
        <textarea
          value={config.greeting}
          onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
          placeholder="Hi! I'm your virtual legal assistant..."
        />
      </div>

      {/* Custom Instructions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Custom AI Instructions
        </h2>
        <p className="text-sm text-gray-400">
          Add firm-specific instructions for the AI (practice areas, office
          info, special handling rules, etc.)
        </p>
        <textarea
          value={config.systemPrompt}
          onChange={(e) =>
            setConfig({ ...config, systemPrompt: e.target.value })
          }
          rows={8}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none font-mono"
          placeholder="Focus on personal injury cases. Our firm specializes in..."
        />
      </div>

      {/* Qualification Threshold */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Qualification Threshold
        </h2>
        <p className="text-sm text-gray-400">
          Score above this threshold = Qualified (0-100)
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={config.qualThreshold}
            onChange={(e) =>
              setConfig({
                ...config,
                qualThreshold: parseInt(e.target.value),
              })
            }
            className="flex-1 accent-blue-500"
          />
          <span className="text-white font-mono text-lg w-12 text-right">
            {config.qualThreshold}
          </span>
        </div>
      </div>

      {/* Service Options */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Service Options</h2>
        <p className="text-sm text-gray-400">
          Case types shown in the lead form dropdown
        </p>
        <div className="flex flex-wrap gap-2">
          {config.serviceOptions.map((service, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300"
            >
              {service}
              <button
                onClick={() => removeService(i)}
                className="text-gray-500 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addService()}
            placeholder="Add a service..."
            className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={addService}
            className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lead Form Fields */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Lead Form Fields</h2>
        <p className="text-sm text-gray-400">
          Choose which fields to collect before chat starts
        </p>
        <div className="space-y-3">
          {[
            { key: "collectName", label: "Name" },
            { key: "collectEmail", label: "Email" },
            { key: "collectPhone", label: "Phone" },
            { key: "collectService", label: "Service / Case Type" },
          ].map((field) => (
            <label
              key={field.key}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer"
            >
              <span className="text-gray-300 text-sm">{field.label}</span>
              <input
                type="checkbox"
                checked={config[field.key as keyof IntakeConfig] as boolean}
                onChange={(e) =>
                  setConfig({ ...config, [field.key]: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-gray-700"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
