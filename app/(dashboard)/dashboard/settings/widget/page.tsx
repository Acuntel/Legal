"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Code2, ExternalLink } from "lucide-react";

export default function WidgetSettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/settings");
        if (res.ok) {
          const data = await res.json();
          setApiKey(data.apiKey);
        }
      } catch {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const embedCode = `<!-- Legal Intake Widget -->
<script
  src="${typeof window !== "undefined" ? window.location.origin : "https://yourdomain.com"}/widget/legal-intake.js"
  data-api-key="${apiKey}"
  async
></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <h1 className="text-2xl font-bold text-white">Widget Installation</h1>
        <p className="text-gray-400 mt-1">
          Add the AI intake widget to your website in seconds
        </p>
      </div>

      {/* Embed Code */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Embed Code</h2>
        </div>
        <p className="text-sm text-gray-400">
          Copy this snippet and paste it before the closing{" "}
          <code className="text-emerald-400">&lt;/body&gt;</code> tag on your
          website. Works with any platform — WordPress, Squarespace, Webflow,
          custom HTML, etc.
        </p>
        <div className="relative">
          <pre className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
            {embedCode}
          </pre>
          <button
            onClick={copyCode}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-xs text-gray-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          Platform-Specific Instructions
        </h2>
        <div className="space-y-4">
          {[
            {
              platform: "WordPress",
              steps:
                "Go to Appearance > Theme File Editor > footer.php. Paste the code before </body>. Or use a plugin like 'Insert Headers and Footers' to add it to the footer section.",
            },
            {
              platform: "Squarespace",
              steps:
                "Go to Settings > Advanced > Code Injection. Paste the code in the Footer section and save.",
            },
            {
              platform: "Webflow",
              steps:
                "Go to Project Settings > Custom Code. Paste the code in the Footer Code section. Publish your site.",
            },
            {
              platform: "Wix",
              steps:
                "Go to Settings > Advanced > Custom Code. Click 'Add Custom Code', paste the snippet, set placement to 'Body - end'.",
            },
            {
              platform: "Custom HTML",
              steps:
                "Paste the code before the closing </body> tag in your HTML file.",
            },
          ].map((item) => (
            <div key={item.platform} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-white font-medium text-sm">{item.platform}</p>
              <p className="text-gray-400 text-sm mt-1">{item.steps}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preview hint */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <ExternalLink className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-blue-300 font-medium">Test Your Widget</p>
            <p className="text-blue-400/70 text-sm mt-1">
              After adding the code to your site, visit the page and look for
              the chat bubble in the bottom-right corner. Click it to test the
              full intake flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
