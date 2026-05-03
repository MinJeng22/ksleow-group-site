import { useState, useRef, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
 * AIChatbot — Sales2DO Plugin AI Assistant
 * ──────────────────────────────────────────────────────────────
 * SETUP (one-time):
 *   1. Deploy the Cloudflare Worker in  cloudflare-worker.js
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
const WORKER_URL = "https://ksl-omni.chiaminjeng.workers.dev";
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
export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm the exclusive assistant for the Sales2DO plugin by KSL Business Solutions. Ask me anything about installation, features, pricing, or licensing. 😊",
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
      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter(m => m.text && !m.streaming && !m.error)
              .map(m => ({ role: m.role, text: m.text })),
            { role: "user", text },
          ],
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      // Read SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // SSE format: "data: {...}\n\n"
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const parsed = JSON.parse(raw);
            const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
            accumulated += token;
            setMessages(prev => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", text: accumulated, streaming: true };
              return next;
            });
          } catch { /* skip malformed chunks */ }
        }
      }

      // Finalise (remove cursor)
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text: accumulated || "Sorry, I couldn't generate a response.", streaming: false };
        return next;
      });

    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant", text: "",
          error: "Connection error. Please check your internet and try again.",
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

      {/* ── Chat window ── */}
      {open && (
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
                AutoCount Plugin Assistant
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Powered by Gemini AI
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
            {/* Text input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about Sales2DO…"
              disabled={loading}
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
            AI responses may be inaccurate. Contact KSL for official support.
          </div>
        </div>
      )}

      {/* ── FAB trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        title="AutoCount Plugin Assistant"
        style={{
          position: "fixed",
          bottom: 92,   /* upper slot — sits above BackToTop (which is at 28) */
          right: 28,
          zIndex: 600,
          width: 52,    /* matches BackToTop size exactly */
          height: 52,
          borderRadius: "50%",
          /* When open on mobile (fullscreen): hide FAB — header already has close button */
          display: (open && window.innerWidth < 640) ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2f315a",
          border: "2px solid rgba(201,168,76,0.5)",  /* gold border always visible */
          color: "#c9a84c",
          cursor: "pointer",
          padding: 0,
          fontSize: 26, fontWeight: 700, fontFamily: "inherit", lineHeight: 1,
          boxShadow: "0 6px 24px rgba(47,49,90,0.35)",
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseOver={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = "#3d4075"; }}
        onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#2f315a"; }}
      >
        {open ? <CloseIcon /> : "?"}
      </button>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}