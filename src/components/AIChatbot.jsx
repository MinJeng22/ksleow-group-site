import { useState, useRef, useEffect } from "react";
import {
  WORKER_URL, SendIcon, CloseIcon,
  Message, ChatbotKeyframes, streamChat,
  AnimatedGreeting, autoResizeTextarea,
} from "./chatbotShared.jsx";

/* ══════════════════════════════════════════════════════════════
 * AIChatbot — floating in-page assistant for product / app pages.
 * Shares messaging primitives with the full /omni page via
 * chatbotShared.jsx so logic stays in one place.
 * ══════════════════════════════════════════════════════════════ */

// Suppress unused-import lint for the no-op alias. WORKER_URL is consumed
// indirectly through streamChat but kept exported for downstream callers.
void WORKER_URL;

export default function AIChatbot({ app }) {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const abortRef  = useRef(null);

  useEffect(() => {
    const sync = () => setIsCompactViewport(window.innerWidth < 640);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => {
      try {
        inputRef.current?.focus({ preventScroll: true });
      } catch {
        inputRef.current?.focus();
      }
    }, 100);
  }, [open]);
  useEffect(() => {
    autoResizeTextarea(inputRef.current);
  }, [input, open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function handleInputChange(e) {
    if (loading) return;
    setInput(e.target.value);
    autoResizeTextarea(e.currentTarget);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMessages(prev => [...prev, { role: "user", text }]);
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    /* Build conversation history in the { role, text } shape the worker
     * expects (matches the KSOmni page payload exactly). */
    const history = messages
      .filter(m => m.text && !m.streaming && !m.error)
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", text: m.text }));
    history.push({ role: "user", text });

    abortRef.current = new AbortController();
    try {
      const final = await streamChat({
        payload: { messages: history, ...(app ? { app } : {}) },
        signal:  abortRef.current.signal,
        onToken: acc => setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", text: acc, streaming: true };
          return next;
        }),
      });
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          text: final || "Sorry, I couldn't generate a response.",
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

  /* Floating Action Button — same in-page modal on every device. */
  const fab = (
    <button
      onClick={() => setOpen(o => !o)}
      aria-label={open ? "Close AI assistant" : "Open AI assistant"}
      title="AutoCount Plugin Assistant"
      style={{
        position: "fixed", bottom: 92, right: 28, zIndex: 600,
        width: 52, height: 52, borderRadius: "50%",
        display: open ? "none" : "flex",
        alignItems: "center", justifyContent: "center",
        background: "#2f315a", border: "2px solid rgba(201,168,76,0.5)",
        color: "#c9a84c", cursor: "pointer", padding: 0,
        fontSize: 26, fontWeight: 700, fontFamily: "inherit", lineHeight: 1,
        boxShadow: "0 6px 24px rgba(47,49,90,0.35)",
        transition: "transform 0.2s, background 0.2s",
      }}
      onMouseOver={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.background = "#3d4075"; }}
      onMouseOut ={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.background = "#2f315a"; }}
    >
      {open ? <CloseIcon /> : "?"}
    </button>
  );

  return (
    <>
      <ChatbotKeyframes />
      <style>{`@keyframes chatSlideUp{from{opacity:0;transform:translateY(16px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

      {/* Modal — opens on every device (mobile / tablet / desktop). */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: isCompactViewport ? 0 : 92,
          right:  isCompactViewport ? 0 : 28,
          left:   isCompactViewport ? 0 : "auto",
          top:    isCompactViewport ? 0 : "auto",
          zIndex: 600,
          width:  isCompactViewport ? "100%" : "min(380px, calc(100% - 32px))",
          height: isCompactViewport ? "100svh" : "min(560px, calc(100vh - 120px))",
          background: "#ffffff",
          borderRadius: isCompactViewport ? 0 : 20,
          boxShadow: "0 24px 72px rgba(47,49,90,0.22), 0 0 0 1px rgba(47,49,90,0.08)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          animation: "chatSlideUp 0.25s ease",
        }}>
          {/* Header */}
          <div style={{ background: "#2f315a", padding: "1rem 1.1rem", display: "flex", alignItems: "center", gap: "0.7rem", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(201,168,76,0.4)" }}>
          <img src="/images/branding/ksl-logo-circle.webp" alt="KSL" loading="eager" decoding="async" fetchpriority="high" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>KS Omni</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                K.S. Leow Group AI Assistant
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); abortRef.current?.abort(); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#ffffff", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
              onMouseOut ={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column" }}>
            {messages.length === 0
              ? (
                <div style={{ margin: "auto 0", padding: "1.25rem 0.2rem" }}>
                  <AnimatedGreeting compact />
                </div>
              )
              : messages.map((msg, i) => <Message key={i} msg={msg} />)
            }
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div style={{
            padding: "0.75rem 0.85rem",
            borderTop: "0.5px solid rgba(47,49,90,0.08)",
            display: "flex", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={e => { if (loading) { e.preventDefault(); return; } handleKey(e); }}
              placeholder={loading ? "Waiting for AI reply…" : "Ask KS Omni..."}
              disabled={loading} readOnly={loading} rows={1}
              style={{
                flex: 1, padding: "0.55rem 0.8rem", borderRadius: 12,
                border: "1px solid rgba(47,49,90,0.18)",
                fontSize: "0.86rem", fontFamily: "inherit",
                resize: "none", outline: "none", lineHeight: 1.5,
                maxHeight: isCompactViewport ? "34dvh" : 240,
                overflowY: "hidden",
                background: loading ? "#f5f5f8" : "#ffffff",
                color: "#2f315a", transition: "border-color 0.2s",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#2f315a"}
              onBlur ={e => e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)"}
            />
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
              onMouseOut ={e => { if (!loading && input.trim()) e.currentTarget.style.background = "#2f315a"; }}
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

      {fab}
    </>
  );
}
