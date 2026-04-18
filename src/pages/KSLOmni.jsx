import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

/* ══════════════════════════════════════════════════════════════
 * KSL Omni — Full-page AI Assistant
 * Same chat engine as AIChatbot.jsx, but as a standalone page.
 * URL: /omni
 * ══════════════════════════════════════════════════════════════ */

const WORKER_URL = "https://ksl-omni.chiaminjeng.workers.dev";
const PAGE_URL = "https://ksl-business-solutions-site.vercel.app/omni";

/* ── Image compression ── */
async function compressImage(file, maxSizeKB = 1024) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      const maxDim = 1280;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

async function uploadImage(file) {
  const compressed = await compressImage(file);
  const res = await fetch(`${WORKER_URL}/signed-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ext: "jpg", size: compressed.size }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  const { signedUrl, gsPath } = await res.json();
  const putRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: compressed,
  });
  if (!putRes.ok) throw new Error("Image upload failed");
  return gsPath;
}

/* ── Icons ── */
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const QRIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h1v1h-1zM18 14h3v1h-1v2h1v1h-3v-1h1v-2h-1zM14 18h3v3h-1v-2h-2z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

/* ── QR Code modal — uses Google Charts API ── */
function QRModal({ onClose }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(PAGE_URL)}&bgcolor=ffffff&color=2f315a&margin=12`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(15,17,40,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff", borderRadius: 24,
          padding: "2rem",
          maxWidth: 320, width: "100%",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(15,17,40,0.35)",
          animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.4rem" }}>
            Scan to Continue
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.4rem" }}>
            Open on Mobile
          </h3>
          <p style={{ fontSize: "0.78rem", color: "#6b6f91", lineHeight: 1.6 }}>
            Scan this QR code with your phone to open KSL Omni and continue the conversation on your mobile device.
          </p>
        </div>

        {/* QR Code */}
        <div style={{
          display: "inline-block",
          padding: "0.75rem",
          borderRadius: 16,
          border: "2px solid rgba(47,49,90,0.1)",
          background: "#f8f8fb",
          marginBottom: "1.25rem",
        }}>
          <img
            src={qrUrl}
            alt="QR code for KSL Omni"
            width={200} height={200}
            style={{ display: "block", borderRadius: 8 }}
          />
        </div>

        {/* URL */}
        <div style={{
          background: "#f0f0f6", borderRadius: 10,
          padding: "0.55rem 0.85rem",
          fontSize: "0.72rem", color: "#6b6f91",
          fontFamily: "monospace", wordBreak: "break-all",
          marginBottom: "1.25rem",
        }}>
          {PAGE_URL}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "0.7rem",
            background: "#2f315a", color: "#ffffff",
            border: "none", borderRadius: 50,
            fontSize: "0.85rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
          onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ── Message bubble ── */
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: "1rem",
      gap: "0.6rem",
      alignItems: "flex-end",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          overflow: "hidden", flexShrink: 0,
          border: "1px solid rgba(47,49,90,0.1)",
        }}>
          <img src="/ksl-logo-circle.png" alt="KSL"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {msg.imagePreview && (
          <img src={msg.imagePreview} alt="uploaded"
            style={{ maxWidth: 220, borderRadius: 12, border: "1px solid rgba(47,49,90,0.12)" }} />
        )}
        {(msg.text || msg.streaming) && (
          <div style={{
            background: isUser ? "#2f315a" : "#f0f0f6",
            color: isUser ? "#ffffff" : "#2f315a",
            padding: "0.75rem 1.05rem",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            fontSize: "0.9rem", lineHeight: 1.68,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {msg.text}

          </div>
        )}
        {msg.error && (
          <div style={{
            background: "#fef2f2", color: "#991b1b",
            padding: "0.65rem 1rem", borderRadius: 12,
            fontSize: "0.85rem", border: "1px solid #fecaca",
          }}>
            {msg.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function KSLOmniPage({ onContact }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm the KSL Omni assistant, powered by Gemini AI. I specialise in answering questions about the Sales2DO plugin — installation, features, pricing, and licensing. How can I help you today? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);

  function pickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  function removeImage() { setImageFile(null); setImagePreview(null); }
  function clearChat() {
    abortRef.current?.abort();
    setMessages([{
      role: "assistant",
      text: "Chat cleared. How can I help you? 😊",
    }]);
    setInput(""); setImageFile(null); setImagePreview(null);
  }

  async function sendMessage() {
    const text = input.trim();
    if ((!text && !imageFile) || loading) return;
    setInput("");
    setLoading(true);
    const userMsg = { role: "user", text: text || "", imagePreview: imagePreview || null };
    setMessages(prev => [...prev, userMsg]);
    setImageFile(null); setImagePreview(null);
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    try {
      let gsPath = null;
      if (imageFile) {
        try { gsPath = await uploadImage(imageFile); }
        catch {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", text: "", error: "Image upload failed. Please try again.", streaming: false };
            return next;
          });
          setLoading(false); return;
        }
      }

      abortRef.current = new AbortController();
      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter(m => (m.text || m.imagePreview) && !m.streaming && !m.error)
              .map(m => ({ role: m.role, text: m.text || "", gsPath: null })),
            { role: "user", text, gsPath },
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
            const parsed = JSON.parse(raw);
            const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
        next[next.length - 1] = { role: "assistant", text: "", error: "Connection error. Please check your internet and try again.", streaming: false };
        return next;
      });
    } finally { setLoading(false); }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn     { from{opacity:0} to{opacity:1} }
        @keyframes slideUp    { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>

      <Nav onContact={onContact} />

      {/* ── Hero banner ── */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "3rem" }}>
        <div className="content-wrap">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem" }}>

            {/* Left: title + desc */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                overflow: "hidden", flexShrink: 0,
                border: "2px solid rgba(201,168,76,0.5)",
              }}>
                <img src="/ksl-logo-circle.png" alt="KSL Omni"
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    backgroundSize: "105%", backgroundPosition: "center"
                  }} />
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.25rem" }}>
                  Powered by Gemini AI
                </div>
                <h1 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>
                  KSL Omni
                </h1>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginTop: "0.2rem" }}>
                  AutoCount Plugin AI Assistant
                </p>
              </div>
            </div>

            {/* Right: QR + clear buttons */}
            <div style={{ display: "flex", gap: "0.65rem", alignItems: "center" }}>
              <button
                onClick={() => setShowQR(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                  background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)",
                  color: "#c9a84c", padding: "0.55rem 1.1rem",
                  borderRadius: 50, fontSize: "0.8rem", fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(201,168,76,0.25)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(201,168,76,0.15)"}
              >
                <QRIcon />
                Open on Phone
              </button>
              <button
                onClick={clearChat}
                title="Clear conversation"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.65)", padding: "0.55rem 1.1rem",
                  borderRadius: 50, fontSize: "0.8rem", fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                <TrashIcon />
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="content-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem var(--px) 2rem" }}>
          <div style={{
            flex: 1,
            background: "#ffffff",
            borderRadius: 20,
            border: "1px solid rgba(47,49,90,0.09)",
            boxShadow: "0 4px 24px rgba(47,49,90,0.07)",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            /* On mobile: fill viewport height minus hero */
            minHeight: "calc(100dvh - 220px)",
          }}>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "1.25rem 1.25rem",
              display: "flex", flexDirection: "column",
            }}>
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              <div ref={bottomRef} />
            </div>

            {/* Image preview strip */}
            {imagePreview && (
              <div style={{
                padding: "0.6rem 1.25rem 0",
                display: "flex", alignItems: "center", gap: "0.6rem",
                borderTop: "0.5px solid rgba(47,49,90,0.08)",
              }}>
                <div style={{ position: "relative" }}>
                  <img src={imagePreview} alt="preview"
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10, border: "1px solid rgba(47,49,90,0.15)" }} />
                  <button onClick={removeImage} style={{
                    position: "absolute", top: -7, right: -7,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#2f315a", border: "none", color: "#ffffff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", padding: 0,
                  }}>
                    <XIcon />
                  </button>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#6b6f91" }}>Image attached</span>
              </div>
            )}

            {/* Input row */}
            <div style={{
              padding: "0.75rem 1rem",
              borderTop: "0.5px solid rgba(47,49,90,0.08)",
              display: "flex", alignItems: "flex-end", gap: "0.5rem",
              flexShrink: 0,
              background: "#fafafa",
            }}>
              {/* Image button */}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={loading}
                title="Attach screenshot"
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "transparent",
                  border: "1px solid rgba(47,49,90,0.18)",
                  color: "#6b6f91", cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseOver={e => { if (!loading) { e.currentTarget.style.borderColor = "#2f315a"; e.currentTarget.style.color = "#2f315a"; } }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)"; e.currentTarget.style.color = "#6b6f91"; }}
              >
                <ImageIcon />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} style={{ display: "none" }} />

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about Sales2DO plugin — installation, pricing, features, activation…"
                disabled={loading}
                rows={1}
                style={{
                  flex: 1,
                  padding: "0.65rem 1rem",
                  borderRadius: 14,
                  border: "1px solid rgba(47,49,90,0.18)",
                  fontSize: "0.9rem", fontFamily: "inherit",
                  resize: "none", outline: "none",
                  lineHeight: 1.55,
                  maxHeight: 120,
                  overflowY: "auto",
                  background: loading ? "#f0f0f5" : "#ffffff",
                  color: "#2f315a",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2f315a"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)"}
              />

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={loading || (!input.trim() && !imageFile)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: (loading || (!input.trim() && !imageFile)) ? "rgba(47,49,90,0.12)" : "#2f315a",
                  border: "none",
                  color: (loading || (!input.trim() && !imageFile)) ? "#a8abcc" : "#ffffff",
                  cursor: (loading || (!input.trim() && !imageFile)) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.2s",
                }}
                onMouseOver={e => { if (!loading && input.trim()) e.currentTarget.style.background = "#3d4075"; }}
                onMouseOut={e => { if (!loading && (input.trim() || imageFile)) e.currentTarget.style.background = "#2f315a"; }}
              >
                {loading
                  ? <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : <SendIcon />
                }
              </button>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: "0.5rem 1.25rem 0.75rem", fontSize: "0.68rem", color: "#c8cadd", textAlign: "center" }}>
              AI responses may be inaccurate. Contact KSL for official support. · Press Enter to send, Shift+Enter for new line.
            </div>
          </div>

          {/* Suggested questions */}
          <div style={{ marginTop: "1.25rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#a8abcc", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.6rem" }}>
              Suggested Questions
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                "How much does Sales2DO cost?",
                "How do I install the plugin?",
                "How do I activate the license offline?",
                "What is Smart Qty Deduction?",
                "Can I copy multiple Sales to one DO?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  style={{
                    background: "#ffffff", border: "1px solid rgba(47,49,90,0.14)",
                    borderRadius: 50, padding: "0.4rem 0.9rem",
                    fontSize: "0.78rem", color: "#2f315a", fontWeight: 500,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.18s, border-color 0.18s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = "#2f315a"; e.currentTarget.style.color = "#ffffff"; }}
                  onMouseOut={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#2f315a"; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* ── QR Code modal ── */}
      {showQR && <QRModal onClose={() => setShowQR(false)} />}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}