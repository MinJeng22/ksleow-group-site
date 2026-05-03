import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const WORKER_URL = "https://ksl-omni.kslbs.workers.dev";
const PAGE_URL   = "https://ksl-business-solutions-site.vercel.app/omni";

/* Max upload size — applies to the original file. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

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
const ImageUploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
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

/* ── Gemini-style two-line greeting ──
 * Rendered above the centered input box on the empty state.
 * Mirrors Gemini's home screen: small lighter top line + large gradient prompt. */
function EmptyGreeting() {
  return (
    <div style={{ textAlign: "left", width: "100%", maxWidth: 720, animation: "fadeIn 0.4s ease", marginBottom: "1.5rem" }}>
      <div style={{
        fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)",
        fontWeight: 500,
        color: "#a8abcc",
        lineHeight: 1.2,
        marginBottom: "0.25rem",
      }}>
        Hello
      </div>
      <div style={{
        fontSize: "clamp(1.75rem, 3.5vw, 2.4rem)",
        fontWeight: 600,
        background: "linear-gradient(90deg, #2f315a 0%, #c9a84c 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1.2,
      }}>
        How can I help you today?
      </div>
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
  const [attachedImage, setAttachedImage]  = useState(null);   /* { gsUri, dataUrl, sizeKb, uploading } */
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

  /* ── Shared image upload pipeline (paste OR file picker) ──
   * Worker expects multipart/form-data with `file` + optional `machine_id`.
   * Returns { success, gsUri }. The gsUri is later embedded inline in the
   * user message text as `[image:gs://...]` for the chat call. */
  async function uploadImageFile(file) {
    if (!file || !file.type?.startsWith("image/")) {
      setPasteError("Only image files are supported.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setPasteError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`);
      return;
    }
    setPasteError("");
    setAttachedImage(null);

    try {
      // Local preview via data URL (no canvas re-encoding — keeps original quality)
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      const sizeKb = Math.round(file.size / 1024);

      setAttachedImage({ gsUri: null, dataUrl, sizeKb, uploading: true });

      // Multipart upload — browser sets the correct Content-Type with boundary
      const formData = new FormData();
      // Ensure the file has a name with an extension so the worker can detect mime
      const named = file.name && file.name.includes(".")
        ? file
        : new File([file], `paste-${Date.now()}.${(file.type.split("/")[1] || "png")}`, { type: file.type });
      formData.append("file", named);
      if (machineId) formData.append("machine_id", machineId);

      const res = await fetch(`${WORKER_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload error ${res.status}`);
      const data = await res.json();
      if (data.error || !data.gsUri) throw new Error(data.error || "No gsUri in response");

      setAttachedImage({ gsUri: data.gsUri, dataUrl, sizeKb, uploading: false });
    } catch (err) {
      setAttachedImage(null);
      setPasteError(`Failed to upload image: ${err.message}`);
    }
  }

  /* ── Capture image from clipboard paste ── */
  async function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
      const file = item.getAsFile();
      if (!file) continue;
      e.preventDefault();
      await uploadImageFile(file);
      return;
    }
  }

  /* ── Trigger hidden file input from the upload button ── */
  const fileInputRef = useRef(null);
  function openFilePicker() {
    if (loading || attachedImage?.uploading) return;
    fileInputRef.current?.click();
  }
  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (file) await uploadImageFile(file);
    e.target.value = ""; // allow selecting the same file again later
  }

  async function sendMessage() {
    const text = input.trim();
    const hasImage = attachedImage?.gsUri && !attachedImage?.uploading;
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
      ...(img?.gsUri ? { gsUri: img.gsUri, imagePreviewUrl: img.dataUrl } : {}),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    try {
      abortRef.current = new AbortController();

      /* Worker only inspects the LAST user message and looks for [image:gs://...]
       * embedded in its text. Build that text now. */
      const apiText = img?.gsUri
        ? (text ? `${text} [image:${img.gsUri}]` : `(Image attached) [image:${img.gsUri}]`)
        : text;

      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: apiText }],
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

        {/* Messages OR empty greeting.
         * When empty: vertically center, but the greeting block itself stays
         * left-aligned (textAlign: left inside EmptyGreeting). */}
        <div ref={chatScrollRef} style={{
          flex: 1, overflowY: "auto",
          padding: isEmpty ? "1rem 1.25rem 1rem" : "1rem",
          display: "flex", flexDirection: "column",
          justifyContent: isEmpty ? "center" : "flex-start",
        }}>
          {isEmpty
            ? <EmptyGreeting />
            : messages.map((msg, i) => <Message key={i} msg={msg} />)
          }
        </div>

        {/* Hidden file input for the upload button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          style={{ display: "none" }}
        />

        {/* Gemini-style input box (mobile) — textarea on top, action row below */}
        <div style={{
          margin: "0.6rem 0.75rem",
          marginBottom: "max(0.6rem, env(safe-area-inset-bottom))",
          padding: "0.65rem 0.8rem 0.5rem",
          background: "#f0f0f6",
          border: "1px solid rgba(47,49,90,0.1)",
          borderRadius: 22,
          display: "flex", flexDirection: "column", gap: "0.35rem",
          flexShrink: 0,
        }}>
          {/* Inline image preview thumbnail (inside the input container) */}
          {attachedImage && (
            <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start", margin: "0.1rem 0 0.2rem" }}>
              {attachedImage.uploading ? (
                <div style={{ width: 56, height: 56, borderRadius: 10, background: "#dadbe6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(47,49,90,0.18)", borderTopColor: "#2f315a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                </div>
              ) : (
                <img src={attachedImage.dataUrl} alt="attachment preview"
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, display: "block", border: "1px solid rgba(47,49,90,0.15)" }} />
              )}
              {!attachedImage.uploading && (
                <button
                  onClick={() => setAttachedImage(null)}
                  title="Remove attachment"
                  aria-label="Remove attachment"
                  style={{
                    position: "absolute", top: -6, right: -6,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#2f315a", color: "#ffffff",
                    border: "2px solid #f0f0f6", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                  }}
                ><CloseSmallIcon /></button>
              )}
            </div>
          )}
          {pasteError && (
            <div style={{ fontSize: "0.7rem", color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.3rem 0.55rem" }}>
              {pasteError}
            </div>
          )}
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
              width: "100%",
              padding: "0.4rem 0.25rem",
              border: "none", outline: "none",
              background: "transparent",
              fontSize: "0.95rem", fontFamily: "inherit",
              resize: "none", lineHeight: 1.5,
              maxHeight: 120, overflowY: "auto",
              color: "#2f315a",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button
              onClick={openFilePicker}
              disabled={loading || attachedImage?.uploading}
              title="Upload image"
              aria-label="Upload image"
              style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: "transparent",
                border: "1px solid rgba(47,49,90,0.18)",
                color: (loading || attachedImage?.uploading) ? "#a8abcc" : "#2f315a",
                cursor: (loading || attachedImage?.uploading) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            ><ImageUploadIcon /></button>
            <button
              onClick={sendMessage}
              disabled={loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)}
              style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "rgba(47,49,90,0.18)" : "#2f315a",
                border: "none",
                color: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "#a8abcc" : "#ffffff",
                cursor:  (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {loading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <SendIcon />
              }
            </button>
          </div>
        </div>
        {showQR && <QRModal onClose={() => setShowQR(false)} machineId={machineId} />}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
   * DESKTOP: site Nav at top, Gemini-style centered empty state,
   * input falls to the bottom once the conversation starts.
   * ══════════════════════════════════════════════════════════ */

  /* Reusable Gemini-style input box — image preview + textarea on top,
   * action row below. Same component in centered (empty state) and
   * bottom (active chat) layouts. */
  function InputRow({ centered = false }) {
    const sendDisabled = loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri);
    const uploadBusy   = loading || attachedImage?.uploading;
    return (
      <div style={{
        margin: centered ? "0" : "0.75rem 1rem",
        padding: "0.75rem 0.85rem 0.55rem",
        background: "#f0f0f6",
        border: "1px solid rgba(47,49,90,0.1)",
        borderRadius: 24,
        boxShadow: centered ? "0 2px 12px rgba(47,49,90,0.05)" : "none",
        display: "flex", flexDirection: "column", gap: "0.4rem",
        flexShrink: 0,
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        {/* Inline image preview thumbnail (sits inside the input container, above the textarea) */}
        {attachedImage && (
          <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start", margin: "0.15rem 0 0.25rem" }}>
            {attachedImage.uploading ? (
              <div style={{ width: 64, height: 64, borderRadius: 10, background: "#dadbe6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 20, height: 20, border: "2px solid rgba(47,49,90,0.18)", borderTopColor: "#2f315a", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : (
              <img
                src={attachedImage.dataUrl}
                alt="attachment preview"
                style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, display: "block", border: "1px solid rgba(47,49,90,0.15)" }}
              />
            )}
            {!attachedImage.uploading && (
              <button
                onClick={() => setAttachedImage(null)}
                title="Remove attachment"
                aria-label="Remove attachment"
                style={{
                  position: "absolute", top: -6, right: -6,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#2f315a", color: "#ffffff",
                  border: "2px solid #f0f0f6", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 0,
                }}
              ><CloseSmallIcon /></button>
            )}
          </div>
        )}
        {pasteError && (
          <div style={{ fontSize: "0.72rem", color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.3rem 0.55rem", margin: "0 0 0.15rem" }}>
            {pasteError}
          </div>
        )}

        {/* Textarea with no visible border, blends into the container */}
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
            width: "100%",
            padding: "0.45rem 0.3rem",
            border: "none", outline: "none",
            background: "transparent",
            color: "#2f315a",
            fontSize: centered ? "1rem" : "0.95rem",
            fontFamily: "inherit",
            resize: "none", lineHeight: 1.55,
            maxHeight: centered ? 180 : 140, overflowY: "auto",
          }}
        />

        {/* Bottom action row: upload (left) + send (right) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={openFilePicker}
            disabled={uploadBusy}
            title="Upload image"
            aria-label="Upload image"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "transparent",
              border: "1px solid rgba(47,49,90,0.18)",
              color: uploadBusy ? "#a8abcc" : "#2f315a",
              cursor: uploadBusy ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.2s",
            }}
            onMouseOver={e => { if (!uploadBusy) e.currentTarget.style.background = "rgba(47,49,90,0.08)"; }}
            onMouseOut={e => { if (!uploadBusy) e.currentTarget.style.background = "transparent"; }}
          >
            <ImageUploadIcon />
          </button>

          <button
            onClick={sendMessage}
            disabled={sendDisabled}
            title="Send"
            aria-label="Send"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: sendDisabled ? "rgba(47,49,90,0.18)" : "#2f315a",
              border: "none",
              color: sendDisabled ? "#a8abcc" : "#ffffff",
              cursor: sendDisabled ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.2s",
            }}
            onMouseOver={e => { if (!sendDisabled) e.currentTarget.style.background = "#3d4075"; }}
            onMouseOut={e => { if (!sendDisabled) e.currentTarget.style.background = "#2f315a"; }}
          >
            {loading
              ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : <SendIcon />
            }
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes typingPulse{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
      `}</style>

      {/* Hidden file input shared by both desktop & mobile InputRow upload buttons */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      {/* Chatbot header — navy bar with KS Omni branding + Back / QR / Clear actions */}
      <div style={{ background: "#2f315a", borderBottom: "1px solid rgba(0,0,0,0.2)" }}>
        <div className="content-wrap" style={{ padding: "1.4rem var(--px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", minHeight: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(201,168,76,0.55)" }}>
              <img src="/ksl-logo-circle.png" alt="KS Omni" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.2 }}>KS Omni</div>
              <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Powered by Gemini AI
              </div>
            </div>
          </div>
          <HeaderActions variant="dark" />
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
            minHeight: "calc(100dvh - 320px)",
          }}>
            {isEmpty ? (
              /* ── Gemini-style centered empty state ── */
              <div style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "2rem 1.5rem",
                animation: "fadeIn 0.4s ease",
              }}>
                <EmptyGreeting />
                <div style={{ width: "100%", maxWidth: 720 }}>
                  <InputRow centered />
                </div>
              </div>
            ) : (
              /* ── Active chat: messages scroll, input pinned bottom ── */
              <>
                <div ref={chatScrollRef} style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column" }}>
                  {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                </div>
                <InputRow />
              </>
            )}

            <div style={{ padding: "0.5rem 1.25rem 0.75rem", fontSize: "0.68rem", color: "#c8cadd", textAlign: "center" }}>
              AI responses may be inaccurate. · Enter to send, Shift+Enter for new line. · Paste an image with Ctrl+V.
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {showQR && <QRModal onClose={() => setShowQR(false)} machineId={machineId} />}
    </div>
  );
}
