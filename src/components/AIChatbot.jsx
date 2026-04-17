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
/* ── Compress image client-side before upload ── */
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

/* ── Upload image → GCS via Worker signed URL ── */
async function uploadImage(file) {
  const compressed = await compressImage(file);
  const ext = "jpg";

  // Step 1: get signed URL from worker
  const res = await fetch(`${WORKER_URL}/signed-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ext, size: compressed.size }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  const { signedUrl, gsPath } = await res.json();

  // Step 2: PUT directly to GCS (image never touches Worker)
  const putRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: compressed,
  });
  if (!putRes.ok) throw new Error("Image upload failed");

  return gsPath; // e.g. "gs://your-bucket/uploads/abc123.jpg"
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
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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
        {/* Image preview */}
        {msg.imagePreview && (
          <img src={msg.imagePreview} alt="uploaded"
            style={{ maxWidth: 180, borderRadius: 10, border: "1px solid rgba(47,49,90,0.12)" }} />
        )}

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
            {msg.text}
            {msg.streaming && (
              <span style={{
                display: "inline-block", width: 8, height: 14,
                background: "#2f315a", marginLeft: 3, borderRadius: 2,
                animation: "blink 0.75s step-end infinite",
              }} />
            )}
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const bottomRef = useRef(null);
  const fileRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  async function sendMessage() {
    const text = input.trim();
    if ((!text && !imageFile) || loading) return;

    setInput("");
    setLoading(true);

    // Add user message
    const userMsg = {
      role: "user",
      text: text || "",
      imagePreview: imagePreview || null,
    };
    setMessages(prev => [...prev, userMsg]);
    setImageFile(null);
    setImagePreview(null);

    // Add empty streaming assistant message
    const assistantIdx = messages.length + 1;
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    try {
      let gsPath = null;

      // Upload image if present
      if (imageFile) {
        try {
          gsPath = await uploadImage(imageFile);
        } catch {
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", text: "", error: "Image upload failed. Please try again.", streaming: false };
            return next;
          });
          setLoading(false);
          return;
        }
      }

      // Call Worker for streaming response
      abortRef.current = new AbortController();
      const res = await fetch(`${WORKER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter(m => (m.text || m.imagePreview) && !m.streaming && !m.error)
              .map(m => ({
                role: m.role,
                text: m.text || "",
                gsPath: null,
              })),
            { role: "user", text, gsPath },
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
          /* Mobile (<640px): full screen overlay */
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
          animation: "chatSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
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

          {/* Image preview strip */}
          {imagePreview && (
            <div style={{
              padding: "0.5rem 1rem 0",
              display: "flex", alignItems: "center", gap: "0.5rem",
              borderTop: "0.5px solid rgba(47,49,90,0.08)",
            }}>
              <div style={{ position: "relative" }}>
                <img src={imagePreview} alt="preview"
                  style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(47,49,90,0.15)" }} />
                <button
                  onClick={removeImage}
                  style={{
                    position: "absolute", top: -6, right: -6,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "#2f315a", border: "none", color: "#ffffff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", padding: 0,
                  }}
                >
                  <XIcon />
                </button>
              </div>
              <span style={{ fontSize: "0.75rem", color: "#6b6f91" }}>Image attached</span>
            </div>
          )}

          {/* Input row */}
          <div style={{
            padding: "0.75rem 0.85rem",
            borderTop: "0.5px solid rgba(47,49,90,0.08)",
            display: "flex", alignItems: "flex-end", gap: "0.5rem",
            flexShrink: 0,
          }}>
            {/* Image upload button */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              title="Attach screenshot"
              style={{
                width: 36, height: 36, borderRadius: "50%",
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
              disabled={loading || (!input.trim() && !imageFile)}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: (loading || (!input.trim() && !imageFile)) ? "rgba(47,49,90,0.15)" : "#2f315a",
                border: "none",
                color: (loading || (!input.trim() && !imageFile)) ? "#a8abcc" : "#ffffff",
                cursor: (loading || (!input.trim() && !imageFile)) ? "not-allowed" : "pointer",
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
          bottom: 28,
          right: 28,
          zIndex: 600,
          width: 56,
          height: 56,
          borderRadius: "50%",
          /* When open on mobile (fullscreen): hide FAB — header already has close button */
          display: (open && window.innerWidth < 640) ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          /* When showing X (open): dark bg + gold border */
          background: open ? "#2f315a" : "transparent",
          border: open ? "2px solid rgba(201,168,76,0.5)" : "none",
          color: "#c9a84c",
          cursor: "pointer",
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(47,49,90,0.35)",
          transition: "transform 0.2s",
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open
          ? <CloseIcon />
          : <img
            src="/ksl-logo-circle.png"
            alt="KSL Business Solutions"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
          />
        }
      </button>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}