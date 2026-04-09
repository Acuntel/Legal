(function () {
  "use strict";

  const SCRIPT = document.currentScript;
  const API_KEY = SCRIPT?.getAttribute("data-api-key");
  const API_BASE =
    SCRIPT?.getAttribute("data-api-base") ||
    SCRIPT?.src.replace(/\/widget\/legal-intake\.js.*$/, "");

  if (!API_KEY) {
    console.error("[Legal Intake] Missing data-api-key attribute");
    return;
  }

  // ─── State ───────────────────────────────────────────────
  let state = "closed"; // closed | lead-form | chatting
  let config = null;
  let messages = [];
  let leadInfo = { name: "", email: "", phone: "", service: "" };
  let conversationId = null;
  let leadId = null;
  let isStreaming = false;
  let container = null;

  // ─── Styles ──────────────────────────────────────────────
  function injectStyles(primary, secondary) {
    const style = document.createElement("style");
    style.textContent = `
      #li-widget-root{position:fixed;bottom:24px;right:24px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;line-height:1.5;color:#1a1a1a}
      #li-widget-root *{box-sizing:border-box;margin:0;padding:0}
      .li-fab{width:60px;height:60px;border-radius:50%;background:${primary};color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(0,0,0,.25);transition:transform .2s,box-shadow .2s}
      .li-fab:hover{transform:scale(1.08);box-shadow:0 6px 32px rgba(0,0,0,.3)}
      .li-fab svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
      .li-panel{position:absolute;bottom:72px;right:0;width:380px;max-width:calc(100vw - 32px);max-height:min(540px,calc(100vh - 140px));background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.2);overflow:hidden;display:flex;flex-direction:column;animation:li-slide-up .25s ease-out}
      @keyframes li-slide-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      .li-header{background:${primary};padding:14px 16px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
      .li-header-info{display:flex;align-items:center;gap:10px}
      .li-header-avatar{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center}
      .li-header-avatar svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2}
      .li-header-name{color:#fff;font-weight:600;font-size:14px}
      .li-header-status{color:rgba(255,255,255,.6);font-size:11px}
      .li-close{background:none;border:none;color:rgba(255,255,255,.6);cursor:pointer;padding:8px;border-radius:8px;transition:color .15s}
      .li-close:hover{color:#fff}
      .li-close svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
      .li-form{padding:16px;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
      .li-form p{font-size:13px;color:#666}
      .li-input{width:100%;padding:10px 14px;border:1px solid #e5e5e5;border-radius:10px;font-size:13px;outline:none;transition:border-color .15s,box-shadow .15s;font-family:inherit}
      .li-input:focus{border-color:${primary};box-shadow:0 0 0 3px ${primary}22}
      .li-select{width:100%;padding:10px 14px;border:1px solid #e5e5e5;border-radius:10px;font-size:13px;outline:none;background:#fff;color:#666;font-family:inherit;cursor:pointer}
      .li-select:focus{border-color:${primary};box-shadow:0 0 0 3px ${primary}22}
      .li-btn{width:100%;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s;font-family:inherit}
      .li-btn-primary{background:${secondary};color:#fff}
      .li-btn-primary:hover{filter:brightness(1.1)}
      .li-btn-primary:disabled{opacity:.5;cursor:not-allowed}
      .li-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;min-height:0}
      .li-msg{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.55;word-break:break-word}
      .li-msg-user{align-self:flex-end;background:${primary};color:#fff;border-bottom-right-radius:6px}
      .li-msg-assistant{align-self:flex-start;background:#f3f4f6;color:#1a1a1a;border-bottom-left-radius:6px}
      .li-input-bar{border-top:1px solid #f0f0f0;padding:10px 12px;display:flex;align-items:center;gap:8px;flex-shrink:0}
      .li-input-bar input{flex:1;padding:10px 14px;border:1px solid #e5e5e5;border-radius:999px;font-size:13px;outline:none;font-family:inherit}
      .li-input-bar input:focus{border-color:${primary};box-shadow:0 0 0 3px ${primary}22}
      .li-send{width:40px;height:40px;border-radius:50%;background:${primary};color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}
      .li-send:disabled{opacity:.35;cursor:not-allowed}
      .li-send svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
      .li-spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:li-spin .6s linear infinite}
      @keyframes li-spin{to{transform:rotate(360deg)}}
      .li-error{color:#ef4444;font-size:12px;text-align:center;padding:4px 0}
      .li-input-error{border-color:#ef4444!important}
      @media(max-width:480px){.li-panel{width:calc(100vw - 16px);right:-16px;bottom:68px;max-height:calc(100vh - 100px)}}
    `;
    document.head.appendChild(style);
  }

  // ─── Icons ───────────────────────────────────────────────
  const icons = {
    chat: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    send: '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    arrow:
      '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  };

  // ─── Render ──────────────────────────────────────────────
  function render() {
    if (!container) return;
    const isOpen = state !== "closed";

    let html = "";

    if (isOpen && config) {
      html += '<div class="li-panel">';
      // Header
      html += `<div class="li-header">
        <div class="li-header-info">
          <div class="li-header-avatar">${icons.chat}</div>
          <div>
            <div class="li-header-name">${esc(config.firmName)}</div>
            <div class="li-header-status">${state === "chatting" ? "Online" : "Virtual Assistant"}</div>
          </div>
        </div>
        <button class="li-close" data-action="toggle">${icons.x}</button>
      </div>`;

      if (state === "lead-form") {
        html += '<form class="li-form" data-action="submit-lead">';
        html += "<p>Quick intro so we can help you better:</p>";
        if (config.collectName)
          html += `<input class="li-input" data-field="name" placeholder="Your name *" value="${esc(leadInfo.name)}" required>`;
        if (config.collectEmail)
          html += `<input class="li-input" data-field="email" type="email" placeholder="Email address *" value="${esc(leadInfo.email)}" required>`;
        if (config.collectPhone)
          html += `<input class="li-input" data-field="phone" type="tel" placeholder="Phone (optional)" value="${esc(leadInfo.phone)}">`;
        if (config.collectService && config.serviceOptions?.length) {
          html += '<select class="li-select" data-field="service">';
          html += '<option value="">What can we help with?</option>';
          config.serviceOptions.forEach(function (opt) {
            html += `<option value="${esc(opt)}"${leadInfo.service === opt ? " selected" : ""}>${esc(opt)}</option>`;
          });
          html += "</select>";
        }
        html += `<button type="submit" class="li-btn li-btn-primary">Start Chat ${icons.arrow}</button>`;
        html += "</form>";
      }

      if (state === "chatting") {
        html += '<div class="li-messages" id="li-messages">';
        messages.forEach(function (msg) {
          html += `<div class="li-msg li-msg-${msg.role}">${esc(msg.content) || '<div class="li-spinner"></div>'}</div>`;
        });
        html += "</div>";
        html += '<div class="li-input-bar">';
        html += `<input type="text" id="li-chat-input" placeholder="Type your question..." ${isStreaming ? "disabled" : ""}>`;
        html += `<button class="li-send" data-action="send" ${!isStreaming ? "" : "disabled"}>${isStreaming ? '<div class="li-spinner"></div>' : icons.send}</button>`;
        html += "</div>";
      }

      html += "</div>";
    }

    // FAB
    html += `<button class="li-fab" data-action="toggle" style="background:${config?.primaryColor || "#1e40af"}">${isOpen ? icons.x : icons.chat}</button>`;

    container.innerHTML = html;

    // Scroll to bottom
    if (state === "chatting") {
      const msgEl = container.querySelector("#li-messages");
      if (msgEl) msgEl.scrollTop = msgEl.scrollHeight;
      const input = container.querySelector("#li-chat-input");
      if (input && !isStreaming) input.focus();
    }
  }

  function esc(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ─── Event Handlers ──────────────────────────────────────
  function handleClick(e) {
    const action = e.target
      .closest("[data-action]")
      ?.getAttribute("data-action");
    if (!action) return;

    if (action === "toggle") {
      state = state === "closed" ? "lead-form" : "closed";
      render();
    }
    if (action === "send") sendMessage();
  }

  function handleSubmitLead(e) {
    if (e.target.closest("[data-action='submit-lead']")) {
      e.preventDefault();
      // Read form values
      container.querySelectorAll("[data-field]").forEach(function (el) {
        leadInfo[el.getAttribute("data-field")] = el.value;
      });

      if (config.collectName && !leadInfo.name.trim()) return;
      if (config.collectEmail && !leadInfo.email.trim()) return;

      // Start chatting
      const firstName = leadInfo.name.split(" ")[0] || "there";
      const serviceText = leadInfo.service
        ? " I see you're reaching out about " +
          leadInfo.service.toLowerCase() +
          "."
        : "";
      messages = [
        {
          role: "assistant",
          content:
            config.greeting ||
            "Hi " +
              firstName +
              "!" +
              serviceText +
              " How can I help you today?",
        },
      ];
      state = "chatting";
      render();
    }
  }

  function handleKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey && e.target.id === "li-chat-input") {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleInput(e) {
    if (e.target.hasAttribute("data-field")) {
      leadInfo[e.target.getAttribute("data-field")] = e.target.value;
    }
  }

  async function sendMessage() {
    const input = container.querySelector("#li-chat-input");
    const text = input?.value?.trim();
    if (!text || isStreaming) return;

    messages.push({ role: "user", content: text });
    messages.push({ role: "assistant", content: "" });
    isStreaming = true;
    render();

    try {
      const res = await fetch(API_BASE + "/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: API_KEY,
          messages: messages
            .filter(function (m) {
              return m.content;
            })
            .map(function (m) {
              return { role: m.role, content: m.content };
            }),
          leadInfo: {
            ...leadInfo,
            leadId: leadId,
            referrer: window.location.href,
          },
          conversationId: conversationId,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      // Capture IDs from response headers
      const cId = res.headers.get("X-Conversation-Id");
      const lId = res.headers.get("X-Lead-Id");
      if (cId) conversationId = cId;
      if (lId) leadId = lId;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        messages[messages.length - 1].content = full;
        render();
      }
    } catch (err) {
      messages.pop(); // Remove empty assistant message
      render();
    } finally {
      isStreaming = false;
      render();
    }
  }

  // ─── Init ────────────────────────────────────────────────
  async function init() {
    try {
      const res = await fetch(
        API_BASE + "/api/v1/widget?key=" + encodeURIComponent(API_KEY),
      );
      if (!res.ok) throw new Error("Failed to load widget config");
      config = await res.json();
    } catch (err) {
      console.error("[Legal Intake] Failed to load config:", err);
      return;
    }

    injectStyles(
      config.primaryColor || "#1e40af",
      config.secondaryColor || "#f59e0b",
    );

    container = document.createElement("div");
    container.id = "li-widget-root";
    document.body.appendChild(container);

    container.addEventListener("click", handleClick);
    container.addEventListener("submit", handleSubmitLead);
    container.addEventListener("keydown", handleKeydown);
    container.addEventListener("input", handleInput);

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
