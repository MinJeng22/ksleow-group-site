import { useState, useRef, useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const WORKER_URL = "https://ksl-omni.chiaminjeng.workers.dev";
const PAGE_URL = "https://ksl-business-solutions-site.vercel.app/omni";

/* ── QR Code modal ── */
function QRModal({ onClose }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(PAGE_URL)}&bgcolor=ffffff&color=2f315a&margin=12`;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(15,17,40,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", backdropFilter: "blur(4px)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#ffffff", borderRadius: 24, padding: "2rem",
        maxWidth: 320, width: "100%", textAlign: "center",
        boxShadow: "0 32px 80px rgba(15,17,40,0.35)",
        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.4rem" }}>Scan to Continue</div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.4rem" }}>Open on Mobile</h3>
        <p style={{ fontSize: "0.78rem", color: "#6b6f91", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          Scan this QR code with your phone to open KSL Omni on your mobile device.
        </p>
        <div style={{ display: "inline-block", padding: "0.75rem", borderRadius: 16, border: "2px solid rgba(47,49,90,0.1)", background: "#f8f8fb", marginBottom: "1.25rem" }}>
          <img src={qrUrl} alt="QR code" width={200} height={200} style={{ display: "block", borderRadius: 8 }} />
        </div>
        <div style={{ background: "#f0f0f6", borderRadius: 10, padding: "0.55rem 0.85rem", fontSize: "0.72rem", color: "#6b6f91", fontFamily: "monospace", wordBreak: "break-all", marginBottom: "1.25rem" }}>
          {PAGE_URL}
        </div>
        <button onClick={onClose} style={{
          width: "100%", padding: "0.7rem", background: "#2f315a", color: "#ffffff",
          border: "none", borderRadius: 50, fontSize: "0.85rem", fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
        }}
          onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
          onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
        >Close</button>
      </div>
    </div>
  );
}

/* ── Icons ── */
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const QRIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h1v1h-1zM18 14h2v2h-2zM14 19h3v2h-1v-1h-2zM21 19v2h-1v-1" />
  </svg>
);

/* ── Message bubble ── */
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "0.85rem", gap: "0.5rem", alignItems: "flex-end",
    }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "1px solid rgba(47,49,90,0.1)" }}>
          <img src="/ksl-logo-circle.png" alt="KSL" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {(msg.text || msg.streaming) && (
          <div style={{
            background: isUser ? "#2f315a" : "#f0f0f6",
            color: isUser ? "#ffffff" : "#2f315a",
            padding: "0.65rem 0.95rem",
            borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            fontSize: "0.88rem", lineHeight: 1.65,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {msg.text}
          </div>
        )}
        {msg.error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "0.6rem 0.9rem", borderRadius: 12, fontSize: "0.82rem", border: "1px solid #fecaca" }}>
            {msg.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Use mobile detection ── */
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ── Main page ── */
export default function KSLOmniPage({ onContact }) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "Hello! I'm the KSL Omni assistant, powered by Gemini AI. I specialise in answering questions about the Sales2DO plugin — installation, features, pricing, and licensing. How can I help you today? 😊",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);

  function clearChat() {
    abortRef.current?.abort();
    setMessages([{ role: "assistant", text: "Chat cleared. How can I help you? 😊" }]);
    setInput("");
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

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const token = JSON.parse(raw).candidates?.[0]?.content?.parts?.[0]?.text || "";
            accumulated += token;
            setMessages(prev => {
              const next = [...prev];
              next[next.length - 1] = { role: "assistant", text: accumulated, streaming: true };
              return next;
            });
          } catch { /* skip */ }
        }
      }
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text: accumulated || "Sorry, I couldn't generate a response.", streaming: false };
        return next;
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text: "", error: "Connection error. Please try again.", streaming: false };
        return next;
      });
    } finally { setLoading(false); }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  /* ══════════════════════════════════════════════════════════
   * MOBILE: fullscreen chat — no Nav/Hero/Footer
   * ══════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#ffffff" }}>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Mobile header */}
        <div style={{
          background: "#2f315a", padding: "0.9rem 1rem",
          display: "flex", alignItems: "center", gap: "0.75rem",
          flexShrink: 0,
          paddingTop: "max(0.9rem, env(safe-area-inset-top))",
        }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(201,168,76,0.5)", flexShrink: 0 }}>
            <img src="/ksl-logo-circle.png" alt="KSL" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>KSL Omni</div>
            <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Powered by Gemini AI
            </div>
          </div>
          <button onClick={clearChat} title="Clear chat" style={{
            background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)",
            width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrashIcon />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column" }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div style={{
          borderTop: "0.5px solid rgba(47,49,90,0.1)",
          padding: "0.6rem 0.75rem",
          paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))",
          background: "#fafafa",
          display: "flex", alignItems: "flex-end", gap: "0.5rem",
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about Sales2DO…"
            disabled={loading}
            rows={1}
            style={{
              flex: 1, padding: "0.6rem 0.85rem",
              borderRadius: 20, border: "1px solid rgba(47,49,90,0.18)",
              fontSize: "0.9rem", fontFamily: "inherit",
              resize: "none", outline: "none", lineHeight: 1.5,
              maxHeight: 100, overflowY: "auto",
              background: "#ffffff", color: "#2f315a",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: (loading || !input.trim()) ? "rgba(47,49,90,0.12)" : "#2f315a",
              border: "none",
              color: (loading || !input.trim()) ? "#a8abcc" : "#ffffff",
              cursor: (loading || !input.trim()) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {loading
              ? <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : <SendIcon />
            }
          </button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        {showQR && <QRModal onClose={() => setShowQR(false)} />}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
   * DESKTOP: full page with Nav + Hero + Footer
   * ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <Nav onContact={onContact} />

      {/* Hero */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "3rem" }}>
        <div className="content-wrap">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(201,168,76,0.5)" }}>
                <img src="/ksl-logo-circle.png" alt="KSL Omni" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.25rem" }}>Powered by Gemini AI</div>
                <h1 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>KSL Omni</h1>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem" }}>AutoCount Plugin AI Assistant</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.65rem" }}>
              <button onClick={() => setShowQR(true)} style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)",
                color: "#c9a84c", padding: "0.55rem 1.1rem", borderRadius: 50,
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(201,168,76,0.25)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(201,168,76,0.15)"}
              ><QRIcon /> Open on Phone</button>
              <button onClick={clearChat} style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.65)", padding: "0.55rem 1.1rem", borderRadius: 50,
                fontSize: "0.8rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              ><TrashIcon /> Clear Chat</button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="content-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem var(--px) 2rem" }}>
          <div style={{
            flex: 1, background: "#ffffff", borderRadius: 20,
            border: "1px solid rgba(47,49,90,0.09)",
            boxShadow: "0 4px 24px rgba(47,49,90,0.07)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            minHeight: "calc(100dvh - 340px)",
          }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column" }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div style={{
              padding: "0.75rem 1rem", borderTop: "0.5px solid rgba(47,49,90,0.08)",
              display: "flex", alignItems: "flex-end", gap: "0.5rem",
              flexShrink: 0, background: "#fafafa",
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about Sales2DO plugin — installation, pricing, features, activation…"
                disabled={loading}
                rows={1}
                style={{
                  flex: 1, padding: "0.65rem 1rem", borderRadius: 14,
                  border: "1px solid rgba(47,49,90,0.18)",
                  fontSize: "0.9rem", fontFamily: "inherit",
                  resize: "none", outline: "none", lineHeight: 1.55,
                  maxHeight: 120, overflowY: "auto",
                  background: loading ? "#f0f0f5" : "#ffffff", color: "#2f315a",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2f315a"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)"}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: (loading || !input.trim()) ? "rgba(47,49,90,0.12)" : "#2f315a",
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
                  ? <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : <SendIcon />
                }
              </button>
            </div>

            <div style={{ padding: "0.5rem 1.25rem 0.75rem", fontSize: "0.68rem", color: "#c8cadd", textAlign: "center" }}>
              AI responses may be inaccurate. Contact KSL for official support. · Enter to send, Shift+Enter for new line.
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {showQR && <QRModal onClose={() => setShowQR(false)} />}
    </div>
  );
}