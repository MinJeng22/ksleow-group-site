import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const WORKER_URL = "https://ksl-omni.chiaminjeng.workers.dev";
const PAGE_URL   = "https://ksl-business-solutions-site.vercel.app/omni";

/* Max original file size before canvas conversion. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * Convert any pasted image (PNG, WebP, GIF, …) to a JPEG data URL via canvas.
 * JPEG is required by the GCS signed URL the worker generates (content-type is
 * hardcoded to image/jpeg in the V4 signing canonical request).
 */
function toJpegDataUrl(file, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("Failed to decode image")); };
    img.src = objectUrl;
  });
}

/* ── QR Code modal ── */
function QRModal({ onClose, machineId }) {
  const pageUrl = machineId ? `${PAGE_URL}?mid=${encodeURIComponent(machineId)}` : PAGE_URL;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}&bgcolor=ffffff&color=2f315a&margin=12`;
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
          Scan this QR code with your phone to open KS Omni on your mobile device.
        </p>
        <div style={{ display: "inline-block", padding: "0.75rem", borderRadius: 16, border: "2px solid rgba(47,49,90,0.1)", background: "#f8f8fb", marginBottom: "1.25rem" }}>
          <img src={qrUrl} alt="QR code" width={200} height={200} style={{ display: "block", borderRadius: 8 }} />
        </div>
        <div style={{ background: "#f0f0f6", borderRadius: 10, padding: "0.55rem 0.85rem", fontSize: "0.68rem", color: "#6b6f91", fontFamily: "monospace", wordBreak: "break-all", marginBottom: "1.25rem" }}>
          {pageUrl}
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
const BackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const CloseSmallIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

/* ── Animated typing indicator (three pulsing dots) ── */
function TypingDots() {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "0.7rem 0.95rem",
      background: "#f0f0f6",
      borderRadius: "16px 16px 16px 4px",
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#9095b8",
          animation: `typingPulse 1.3s ${i * 0.18}s infinite ease-in-out`,
        }} />
      ))}
    </div>
  );
}

/* ── Message bubble ── */
function Message({ msg }) {
  const isUser     = msg.role === "user";
  const showTyping = !isUser && msg.streaming && !msg.text;

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
      <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {/* Pasted image preview inside the bubble (local data URL, not the GCS URI) */}
        {msg.imagePreviewUrl && (
          <img
            src={msg.imagePreviewUrl}
            alt="attachment"
            style={{
              maxWidth: 220, maxHeight: 220, borderRadius: 12,
              border: "1px solid rgba(47,49,90,0.12)",
              objectFit: "cover", display: "block",
            }}
          />
        )}
        {showTyping
          ? <TypingDots />
          : (msg.text && (
              <div style={{
                background: isUser ? "#2f315a" : "#f0f0f6",
                color:      isUser ? "#ffffff" : "#2f315a",
                padding: "0.65rem 0.95rem",
                borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: "0.88rem", lineHeight: 1.65,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {renderText(msg.text)}
              </div>
            ))
        }
        {msg.error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "0.6rem 0.9rem", borderRadius: 12, fontSize: "0.82rem", border: "1px solid #fecaca" }}>
            {msg.error}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Gemini-style empty-state greeting (shown until user sends first msg) ── */
function EmptyGreeting() {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "1.5rem", textAlign: "center",
      animation: "fadeIn 0.4s ease",
    }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(201,168,76,0.5)", marginBottom: "1.25rem" }}>
        <img src="/ksl-logo-circle.png" alt="KS Omni" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
        Ask KS Omni
      </div>
      <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 600, color: "#2f315a", lineHeight: 1.25, marginBottom: "0.5rem" }}>
        Hello, how can I assist you today?
      </h2>
    </div>
  );
}

/* ── Mobile detection ── */
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 1200);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 1200);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

/* ── Main page ── */
export default function KSLOmniPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [messages, setMessages]            = useState([]);    /* empty until user sends first msg */
  const [input, setInput]                  = useState("");
  const [loading, setLoading]              = useState(false);
  const [showQR, setShowQR]                = useState(false);
  const [attachedImage, setAttachedImage]  = useState(null);   /* { gsPath, dataUrl, sizeKb, uploading } */
  const [pasteError, setPasteError]        = useState("");

  /* Machine ID read from URL (?mid=XXXX) — passed to worker silently, not shown in UI */
  const [machineId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mid") || null;
  });

  const inputRef     = useRef(null);
  const abortRef     = useRef(null);
  const chatScrollRef = useRef(null);

  const isEmpty = messages.length === 0;

  function scrollChatToBottom() {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }

  /* Scroll only when message count changes (not on every streaming update) */
  const prevMsgLen = useRef(0);
  useEffect(() => {
    if (messages.length !== prevMsgLen.current) {
      prevMsgLen.current = messages.length;
      scrollChatToBottom();
    }
  }, [messages.length]);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 200); }, []);
  useEffect(() => {
    if (!loading) setTimeout(() => inputRef.current?.focus(), 50);
  }, [loading]);

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setAttachedImage(null);
    setPasteError("");
  }

  function goHome() {
    abortRef.current?.abort();
    navigate("/");
  }

  /* ── Capture image from clipboard paste ── */
  async function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
      const file = item.getAsFile();
      if (!file) continue;
      if (file.size > MAX_IMAGE_BYTES) {
        setPasteError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`);
        e.preventDefault();
        return;
      }
      e.preventDefault();
      setPasteError("");
      setAttachedImage(null);

      try {
        /* 1. Convert to JPEG via canvas (required format for GCS signed URL) */
        const dataUrl = await toJpegDataUrl(file);
        const base64  = dataUrl.split(",")[1] ?? "";
        const sizeKb  = Math.round(base64.length * 0.75 / 1024); // decoded size

        /* 2. Show chip with spinner immediately so the user knows something is happening */
        setAttachedImage({ gsPath: null, dataUrl, sizeKb, uploading: true });

        /* 3. POST base64 to worker → worker generates signed URL → PUTs to GCS */
        const res = await fetch(`${WORKER_URL}/upload`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ image_base64: base64 }),
        });
        if (!res.ok) throw new Error(`Upload error ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        /* 4. Image is on GCS — store the path reference, drop the base64 */
        setAttachedImage({ gsPath: data.gsPath, dataUrl, sizeKb, uploading: false });
      } catch (err) {
        setAttachedImage(null);
        setPasteError(`Failed to upload image: ${err.message}`);
      }
      return;
    }
  }

  async function sendMessage() {
    const text = input.trim();
    const hasImage = attachedImage?.gsPath && !attachedImage?.uploading;
    if ((!text && !hasImage) || loading || attachedImage?.uploading) return;

    /* Snapshot the attached image, then clear input + preview */
    const img = attachedImage;
    setInput("");
    setAttachedImage(null);
    setPasteError("");
    setLoading(true);

    /* imagePreviewUrl is kept in messages state for display only — never sent to worker */
    const userMsg = {
      role: "user",
      text,
      ...(img?.gsPath ? { gsPath: img.gsPath, imagePreviewUrl: img.dataUrl } : {}),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    try {
      abortRef.current = new AbortController();
      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter(m => (m.text || m.gsPath) && !m.streaming && !m.error)
              .map(m => ({
                role: m.role,
                text: m.text || "",
                ...(m.gsPath ? { gsPath: m.gsPath } : {}),
                /* imagePreviewUrl intentionally omitted — display-only */
              })),
            { role: "user", text, ...(img?.gsPath ? { gsPath: img.gsPath } : {}) },
          ],
          ...(machineId ? { machine_id: machineId } : {}),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const reader   = res.body.getReader();
      const decoder  = new TextDecoder();
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
        next[next.length - 1] = {
          role: "assistant",
          text: accumulated || "Sorry, I couldn't generate a response.",
          streaming: false,
        };
        return next;
      });
    } catch (err) {
      if (err.name === "AbortError") return;
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant", text: "",
          error: "Connection error. Please try again.",
          streaming: false,
        };
        return next;
      });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  /* ── Reusable: header action buttons (Back / QR / Clear) ── */
  function HeaderActions({ variant }) {
    const dark = variant === "dark";
    const baseBtn = {
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      padding: "0.45rem 0.95rem", borderRadius: 50,
      fontSize: "0.78rem", fontWeight: 600,
      cursor: "pointer", fontFamily: "inherit",
      transition: "background 0.2s, border-color 0.2s",
    };
    const ghost = dark
      ? { ...baseBtn, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.78)" }
      : { ...baseBtn, background: "rgba(47,49,90,0.06)",   border: "1px solid rgba(47,49,90,0.15)",     color: "#2f315a" };
    const gold  = dark
      ? { ...baseBtn, background: "rgba(201,168,76,0.18)", border: "1px solid rgba(201,168,76,0.45)",   color: "#e8c97a" }
      : { ...baseBtn, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.4)",    color: "#a17f1e" };
    return (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button onClick={goHome} style={ghost}><BackIcon /> Back to Homepage</button>
        <button onClick={() => setShowQR(true)} style={gold}><QRIcon /> Open on Phone</button>
        <button onClick={clearChat} style={ghost}><TrashIcon /> Clear Chat</button>
      </div>
    );
  }

  /* ── Reusable: pasted-image preview chip + error banner ── */
  function AttachmentChip() {
    if (!attachedImage && !pasteError) return null;
    const { dataUrl, sizeKb, uploading } = attachedImage || {};
    return (
      <div style={{ padding: "0.5rem 0.75rem 0", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {attachedImage && (
          <div style={{
            display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "0.6rem",
            background: "#f0f0f6", border: "1px solid rgba(47,49,90,0.12)",
            borderRadius: 12, padding: "0.4rem 0.5rem 0.4rem 0.4rem",
            maxWidth: "100%",
          }}>
            {/* Thumbnail or spinner */}
            {uploading ? (
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#e4e5f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, border: "2px solid rgba(47,49,90,0.15)", borderTopColor: "#2f315a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : (
              <img src={dataUrl} alt="paste preview"
                style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, display: "block", flexShrink: 0 }} />
            )}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2f315a" }}>Pasted image</span>
              <span style={{ fontSize: "0.68rem", color: "#6b6f91" }}>{uploading ? "Uploading…" : `${sizeKb} KB`}</span>
            </div>
            {/* ✕ only available after upload completes */}
            {!uploading && (
              <button
                onClick={() => setAttachedImage(null)}
                title="Remove attachment"
                style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(47,49,90,0.08)", border: "none", color: "#2f315a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}
              ><CloseSmallIcon /></button>
            )}
          </div>
        )}
        {pasteError && (
          <div style={{ fontSize: "0.75rem", color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.4rem 0.65rem" }}>
            {pasteError}
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
   * MOBILE: fullscreen chat
   * ══════════════════════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", background: "#ffffff" }}>
        <style>{`
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes typingPulse{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        `}</style>

        {/* Mobile header — Back button on the left, title, Clear on the right */}
        <div style={{
          background: "#2f315a",
          padding: "0.7rem 0.85rem",
          paddingTop: "max(0.7rem, env(safe-area-inset-top))",
          display: "flex", alignItems: "center", gap: "0.55rem", flexShrink: 0,
        }}>
          <button onClick={goHome} title="Back to Homepage" aria-label="Back to Homepage"
            style={{
              background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.85)",
              width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><BackIcon /></button>
          <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(201,168,76,0.5)", flexShrink: 0 }}>
            <img src="/ksl-logo-circle.png" alt="KSL" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>KS Omni</div>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />
              K.S. Leow Group AI Assistant
            </div>
          </div>
          <button onClick={clearChat} title="Clear chat" aria-label="Clear chat"
            style={{
              background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.7)",
              width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}><TrashIcon /></button>
        </div>

        {/* Messages OR empty greeting */}
        <div ref={chatScrollRef} style={{ flex: 1, overflowY: "auto", padding: isEmpty ? 0 : "1rem", display: "flex", flexDirection: "column" }}>
          {isEmpty
            ? <EmptyGreeting />
            : messages.map((msg, i) => <Message key={i} msg={msg} />)
          }
        </div>

        <AttachmentChip />

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
            onPaste={handlePaste}
            placeholder="Ask KS Omni."
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
            disabled={loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)}
            style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)) ? "rgba(47,49,90,0.12)" : "#2f315a",
              border: "none",
              color: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)) ? "#a8abcc" : "#ffffff",
              cursor:  (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {loading
              ? <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : <SendIcon />
            }
          </button>
        </div>
        {showQR && <QRModal onClose={() => setShowQR(false)} machineId={machineId} />}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
   * DESKTOP: clean chat layout — no Nav, slim header, footer
   * ══════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes typingPulse{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
      `}</style>

      {/* Slim header — replaces previous Nav + Hero */}
      <div style={{ background: "#ffffff", borderBottom: "0.5px solid rgba(47,49,90,0.1)" }}>
        <div className="content-wrap" style={{ padding: "0.85rem var(--px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(201,168,76,0.45)" }}>
              <img src="/ksl-logo-circle.png" alt="KS Omni" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a", lineHeight: 1.15 }}>KS Omni</div>
              <div style={{ fontSize: "0.68rem", color: "#6b6f91", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Powered by Gemini AI
              </div>
            </div>
          </div>
          <HeaderActions variant="light" />
        </div>
      </div>

      {/* Chat card */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="content-wrap" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1.5rem var(--px) 2rem" }}>
          <div style={{
            flex: 1, background: "#ffffff", borderRadius: 20,
            border: "1px solid rgba(47,49,90,0.09)",
            boxShadow: "0 4px 24px rgba(47,49,90,0.07)",
            display: "flex", flexDirection: "column", overflow: "hidden",
            minHeight: "calc(100dvh - 280px)",
          }}>
            <div ref={chatScrollRef} style={{ flex: 1, overflowY: "auto", padding: isEmpty ? 0 : "1.5rem 1.75rem", display: "flex", flexDirection: "column" }}>
              {isEmpty
                ? <EmptyGreeting />
                : messages.map((msg, i) => <Message key={i} msg={msg} />)
              }
            </div>

            <AttachmentChip />

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
                onPaste={handlePaste}
                placeholder="Ask KS Omni."
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
                disabled={loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)) ? "rgba(47,49,90,0.12)" : "#2f315a",
                  border: "none",
                  color: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)) ? "#a8abcc" : "#ffffff",
                  cursor:  (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsPath)) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.2s",
                }}
                onMouseOver={e => { if (!loading && !attachedImage?.uploading && (input.trim() || attachedImage?.gsPath)) e.currentTarget.style.background = "#3d4075"; }}
                onMouseOut={e => { if (!loading && !attachedImage?.uploading && (input.trim() || attachedImage?.gsPath)) e.currentTarget.style.background = "#2f315a"; }}
              >
                {loading
                  ? <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : <SendIcon />
                }
              </button>
            </div>

            <div style={{ padding: "0.5rem 1.25rem 0.75rem", fontSize: "0.68rem", color: "#c8cadd", textAlign: "center" }}>
              AI responses may be inaccurate. Contact KSL for official support. · Enter to send, Shift+Enter for new line. · Paste an image with Ctrl+V.
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {showQR && <QRModal onClose={() => setShowQR(false)} machineId={machineId} />}
    </div>
  );
}
