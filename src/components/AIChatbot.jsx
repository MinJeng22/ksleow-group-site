import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
 * AIChatbot — Sales2DO Plugin AI Assistant
 * ──────────────────────────────────────────────────────────────
 * SETUP (one-time):
 *   1. Deploy the Cloudflare Worker (code is maintained directly in
 *      the Cloudflare dashboard, not in this repo).
 *   2. Set your Worker URL in WORKER_URL below
 *
 * FEATURES:
 *   • Text questions with streaming (SSE) typewriter output
 *   • Image upload (compressed client-side before upload)
 *   • Uploads image to GCS via signed URL from Worker,
 *     then sends gs:// path + question to Gemini 2.5
 *   • IP rate-limiting handled by the Worker
 * ══════════════════════════════════════════════════════════════ */

/* ── CONFIG — set your Cloudflare Worker URL here ── */
const WORKER_URL = "https://ksl-omni.kslbs.workers.dev";
/* On tablet/mobile (≤ 1024 px) the FAB opens the KSOmni web page instead of
 * the inline chat panel. The `app` prop appends `?app=<name>` so the omni
 * portal can scope itself to that product context. */
const OMNI_PAGE_BASE = "https://ksleow.vercel.app/omni";
/* ── Icons ── */
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M9 9h1M14 9h1M9 12c0 0 1.5 2 3 2s3-2 3-2" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Parse **bold** markdown into <strong> elements ── */
function renderText(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/* ── Message bubble ── */
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "0.9rem",
      gap: "0.5rem",
      alignItems: "flex-end",
    }}>
      {/* Bot avatar */}
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          overflow: "hidden", flexShrink: 0,
          border: "1px solid rgba(47,49,90,0.1)",
        }}>
          <img src="/ksl-logo-circle.png" alt="KSL"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}

      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {/* Text bubble */}
        {(msg.text || msg.streaming) && (
          <div style={{
            background: isUser ? "#2f315a" : "#f0f0f6",
            color: isUser ? "#ffffff" : "#2f315a",
            padding: "0.65rem 0.95rem",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            fontSize: "0.86rem", lineHeight: 1.65,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {renderText(msg.text)}
          </div>
        )}

        {/* Error */}
        {msg.error && (
          <div style={{
            background: "#fef2f2", color: "#991b1b",
            padding: "0.6rem 0.9rem", borderRadius: 12,
            fontSize: "0.82rem", border: "1px solid #fecaca",
          }}>
            {msg.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main chatbot component ── */
export default function AIChatbot({ app }) {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, how can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* image upload removed */
  function _unused(e) { // placeholder
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", text }]);
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    try {
      abortRef.current = new AbortController();

      /* Build conversation history in the SAME shape the KS Omni page uses
       * — alternating user/assistant turns with `{role, content}`. The
       * worker accepts both Gemini and OpenAI-style payloads, but most
       * recent versions standardise on `messages: [{role, content}]`. */
      /* The KS-Omni worker expects messages in the shape { role, text }
       * (not OpenAI-style { role, content }) — the same shape KSOmni.jsx
       * uses when it talks to the same worker. */
      const history = messages
        .filter(m => m.text && !m.streaming && !m.error)
        .map(m => ({
          role: m.role === "assistant" ? "assistant" : "user",
          text: m.text,
        }));
      history.push({ role: "user", text });

      const payload = { messages: history };
      if (app) payload.app = app;

      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        let detail = "";
        try { detail = (await res.text()).slice(0, 240); } catch { /* ignore */ }
        // eslint-disable-next-line no-console
        console.error("[AIChatbot] worker", res.status, detail);
        throw new Error(`Worker returned ${res.status}${detail ? `: ${detail}` : ""}`);
      }

      const contentType = (res.headers.get("content-type") || "").toLowerCase();

      /* ── Helper: pluck the text out of a parsed payload, regardless of
            whether it came from Gemini, OpenAI-style, or a custom shape ── */
      const extractText = (obj) => {
        if (!obj) return "";
        if (typeof obj === "string") return obj;
        // Gemini stream chunk
        const gem = obj.candidates?.[0]?.content?.parts?.[0]?.text;
        if (gem) return gem;
        // OpenAI Chat Completions (streaming or non-streaming)
        const oai = obj.choices?.[0]?.delta?.content
                 ?? obj.choices?.[0]?.message?.content;
        if (oai) return oai;
        // Common ad-hoc fields
        return obj.text || obj.message || obj.response || obj.output || obj.delta || "";
      };

      let accumulated = "";

      if (res.body && (contentType.includes("event-stream") || contentType.includes("stream") || contentType === "")) {
        /* ── Streaming response (SSE or plain chunked text) ── */
        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          /* Try to consume complete SSE events first */
          let nlIdx;
          while ((nlIdx = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nlIdx).trimEnd();
            buffer = buffer.slice(nlIdx + 1);

            if (!line) continue;
            const raw = line.startsWith("data:") ? line.slice(5).trim() : line;
            if (!raw || raw === "[DONE]") continue;

            let token = "";
            try { token = extractText(JSON.parse(raw)); }
            catch { token = line.startsWith("data:") ? "" : line; }
            if (token) {
              accumulated += token;
              setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", text: accumulated, streaming: true };
                return next;
              });
            }
          }
        }
        /* flush any trailing buffer */
        if (buffer.trim()) {
          try { accumulated += extractText(JSON.parse(buffer.trim())) || ""; }
          catch { /* leave as-is */ }
        }
      } else if (contentType.includes("application/json")) {
        /* ── Non-streaming JSON response ── */
        const data = await res.json();
        accumulated = extractText(data);
      } else {
        /* ── Plain text fallback ── */
        accumulated = await res.text();
      }

      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          text: accumulated.trim() || "Sorry, I couldn't generate a response.",
          streaming: false,
        };
        return next;
      });

    } catch (err) {
      if (err.name === "AbortError") return;
      // eslint-disable-next-line no-console
      console.error("[AIChatbot] error:", err);
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant", text: "",
          error: err?.message
            ? `Connection error — ${err.message}`
            : "Connection error. Please check your internet and try again.",
          streaming: false,
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(16px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>

      {/* ── Chat window — desktop only (> 1024 px) ── */}
      {open && window.innerWidth > 1024 && (
        <div style={{
          position: "fixed",
          bottom: window.innerWidth < 640 ? 0 : 92,
          right: window.innerWidth < 640 ? 0 : 28,
          left: window.innerWidth < 640 ? 0 : "auto",
          top: window.innerWidth < 640 ? 0 : "auto",
          zIndex: 600,
          width: window.innerWidth < 640 ? "100vw" : "min(380px, calc(100vw - 32px))",
          height: window.innerWidth < 640 ? "100dvh" : "min(560px, calc(100vh - 120px))",
          background: "#ffffff",
          borderRadius: window.innerWidth < 640 ? 0 : 20,
          boxShadow: "0 24px 72px rgba(47,49,90,0.22), 0 0 0 1px rgba(47,49,90,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            background: "#2f315a",
            padding: "1rem 1.1rem",
            display: "flex", alignItems: "center", gap: "0.7rem",
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              overflow: "hidden", flexShrink: 0,
              border: "1px solid rgba(201,168,76,0.4)",
            }}>
              <img src="/ksl-logo-circle.png" alt="KSL"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>
                KS Omni
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                K.S. Leow Group AI Assistant
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); abortRef.current?.abort(); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#ffffff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "1rem",
            display: "flex", flexDirection: "column",
          }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={{
            padding: "0.75rem 0.85rem",
            borderTop: "0.5px solid rgba(47,49,90,0.08)",
            display: "flex", alignItems: "flex-end", gap: "0.5rem",
            flexShrink: 0,
          }}>
            {/* Text input — locked while AI is composing a reply */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => { if (!loading) setInput(e.target.value); }}
              onKeyDown={e => { if (loading) { e.preventDefault(); return; } handleKey(e); }}
              placeholder={loading ? "Waiting for AI reply…" : "Ask KS Omni..."}
              disabled={loading}
              readOnly={loading}
              rows={1}
              style={{
                flex: 1,
                padding: "0.55rem 0.8rem",
                borderRadius: 12,
                border: "1px solid rgba(47,49,90,0.18)",
                fontSize: "0.86rem", fontFamily: "inherit",
                resize: "none", outline: "none",
                lineHeight: 1.5,
                maxHeight: 100,
                overflowY: "auto",
                background: loading ? "#f5f5f8" : "#ffffff",
                color: "#2f315a",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#2f315a"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)"}
            />

            {/* Send button */}
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: (loading || !input.trim()) ? "rgba(47,49,90,0.15)" : "#2f315a",
                border: "none",
                color: (loading || !input.trim()) ? "#a8abcc" : "#ffffff",
                cursor: (loading || !input.trim()) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.2s",
              }}
              onMouseOver={e => { if (!loading && input.trim()) e.currentTarget.style.background = "#3d4075"; }}
              onMouseOut={e => { if (!loading && input.trim()) e.currentTarget.style.background = "#2f315a"; }}
            >
              {loading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <SendIcon />
              }
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: "0 0.85rem 0.6rem", fontSize: "0.65rem", color: "#c8cadd", textAlign: "center" }}>
            AI responses may be inaccurate.
          </div>
        </div>
      )}

      {/* ── FAB trigger — render as <a> on tablet/mobile (reliable native tap),
            <button> on desktop (toggles the inline panel) ── */}
      {(() => {
        const fabStyle = {
          position: "fixed",
          bottom: 92,
          right: 28,
          zIndex: 600,
          width: 52, height: 52,
          borderRadius: "50%",
          display: open ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2f315a",
          border: "2px solid rgba(201,168,76,0.5)",
          color: "#c9a84c",
          cursor: "pointer",
          padding: 0,
          fontSize: 26, fontWeight: 700, fontFamily: "inherit", lineHeight: 1,
          boxShadow: "0 6px 24px rgba(47,49,90,0.35)",
          transition: "transform 0.2s, background 0.2s",
          textDecoration: "none",
        };
        const hoverIn  = e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = "#3d4075"; };
        const hoverOut = e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.background = "#2f315a"; };

        /* Use the same in-page modal on every device — touch users used
         * to be punted to a new tab via target="_blank", which broke
         * navigation continuity. */
        return (
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close AI assistant" : "Open AI assistant"}
            title="AutoCount Plugin Assistant"
            style={fabStyle}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}
          >
            {open ? <CloseIcon /> : "?"}
          </button>
        );
      })()}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}