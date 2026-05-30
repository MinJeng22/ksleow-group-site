import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  WORKER_URL, SendIcon,
  Message, ChatbotKeyframes, streamChat,
  AnimatedGreeting, autoResizeTextarea,
} from "../components/chatbotShared.jsx";

function getOmniPageUrl(machineId) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://ksleow.vercel.app";
  const baseUrl = `${origin}/omni`;
  return machineId ? `${baseUrl}?mid=${encodeURIComponent(machineId)}` : baseUrl;
}

function getQrUrl(pageUrl) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}&bgcolor=ffffff&color=2f315a&margin=12`;
}

/* Upload limits + accepted types.
 *   • Images:    5 MB cap (jpg / png / webp / gif / etc.)
 *   • Documents: 10 MB cap (PDF / CSV / TXT). The Cloudflare Worker
 *     routes these to Gemini's document API and the response is
 *     truncated at 2 000 chars on the way back, so a hard cap on the
 *     way up keeps memory + bandwidth sane.
 * Anything else (Excel, Word, ZIP, …) is rejected client-side with a
 * friendly message that matches the worker's server-side check. */
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_FILE_ACCEPT = "image/*";
const IMAGE_EXTENSION_RE = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;
/* Extensions for the file picker's `accept` attribute — covers the
 * cases where mobile browsers don't send the right MIME type. */
const ACCEPT_ATTR = IMAGE_FILE_ACCEPT;

function isImageFile(f) {
  return !!f && (f.type?.startsWith("image/") || IMAGE_EXTENSION_RE.test(f.name || ""));
}

/* ── QR Code modal ── */
function QRModal({ onClose, pageUrl, qrUrl, qrReady }) {
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
        <div style={{
          width: 226, height: 226,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "0.75rem", borderRadius: 16,
          border: "2px solid rgba(47,49,90,0.1)",
          background: "#f8f8fb", marginBottom: "1.25rem",
        }}>
          {qrReady ? (
            <img src={qrUrl} alt="QR code" width={200} height={200} loading="eager" decoding="async" style={{ display: "block", borderRadius: 8 }} />
          ) : (
            <div aria-label="Loading QR code" style={{
              width: 34, height: 34,
              border: "3px solid rgba(47,49,90,0.14)",
              borderTopColor: "#2f315a",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          )}
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

/* ── Page-specific icons (Send / Close come from chatbotShared) ── */
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
/* Paperclip — generic "attach a file" since the picker accepts both
 * images and documents (PDF / CSV / TXT) now. */
const ImageUploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
const CloseSmallIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Gemini-style two-line greeting ──
 * Rendered above the centered input box on the empty state.
 * Mirrors Gemini's home screen: small lighter top line + large gradient prompt. */
function EmptyGreeting() {
  return <AnimatedGreeting />;
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

  const containerRef = useRef(null);  /* Machine ID read from URL (?mid=XXXX) — passed to worker silently, not shown in UI */
  const [machineId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mid") || null;
  });
  const pageUrl = useMemo(() => getOmniPageUrl(machineId), [machineId]);
  const qrUrl = useMemo(() => getQrUrl(pageUrl), [pageUrl]);
  const [qrReady, setQrReady] = useState(false);

  const inputRef     = useRef(null);
  const abortRef     = useRef(null);
  const chatScrollRef = useRef(null);

  const isEmpty = messages.length === 0;

  function focusInputSoon(delay = 50) {
    window.setTimeout(() => {
      try {
        inputRef.current?.focus({ preventScroll: true });
      } catch {
        inputRef.current?.focus();
      }
    }, delay);
  }

  function scrollChatToBottom() {
    const el = chatScrollRef.current;
    if (!el) return;

    const pageX = window.scrollX;
    const pageY = window.scrollY;
    el.scrollTop = el.scrollHeight;
    window.requestAnimationFrame(() => window.scrollTo(pageX, pageY));
  }

  /* Scroll only when message count changes (not on every streaming update) */
  const prevMsgLen = useRef(0);
  useEffect(() => {
    if (messages.length !== prevMsgLen.current) {
      prevMsgLen.current = messages.length;
      scrollChatToBottom();
    }
  }, [messages.length]);

  useEffect(() => { focusInputSoon(200); }, []);
  useEffect(() => {
    if (!loading) focusInputSoon(50);
  }, [loading]);
  useEffect(() => {
    autoResizeTextarea(inputRef.current);
  }, [input, isMobile]);
  useEffect(() => {
    setQrReady(false);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => setQrReady(true);
    img.onerror = () => setQrReady(true);
    img.src = qrUrl;
  }, [qrUrl]);

  useEffect(() => {
    const onOpenQR = () => setShowQR(true);
    window.addEventListener("openOmniQR", onOpenQR);
    return () => window.removeEventListener("openOmniQR", onOpenQR);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const updateViewport = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.visualViewport.height}px`;
        containerRef.current.style.top = `${window.visualViewport.offsetTop}px`;
      }
      window.scrollTo(0, 0);
    };
    window.visualViewport.addEventListener("resize", updateViewport);
    window.visualViewport.addEventListener("scroll", updateViewport);
    updateViewport();
    return () => {
      window.visualViewport.removeEventListener("resize", updateViewport);
      window.visualViewport.removeEventListener("scroll", updateViewport);
    };
  }, []);

  function handleInputChange(e) {
    setInput(e.target.value);
    autoResizeTextarea(e.currentTarget);
  }

  function clearChat() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setAttachedImage(null);
    setPasteError("");
  }

  /* Try the browser back stack first — keeps users on whatever page
   * they came from (Sales2DO, AutoCount, homepage). Falls back to "/"
   * when /omni was opened directly (no prior history entry). */
  function goHome() {
    abortRef.current?.abort();
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  /* ── Shared upload pipeline (paste OR file picker) ──
   * Accepts both images and supported documents (PDF / CSV / TXT) and
   * sends them to the worker's /upload endpoint. The returned gsUri is
   * later embedded in the user's chat text — `[image:gs://...]` for
   * images or `[document:gs://...]` for docs — and the worker routes
   * each to the correct Gemini API (vision vs document). */
  async function uploadFile(file) {
    if (!file) return;

    const asImage = isImageFile(file);
    const asDoc   = false;

    if (!asImage) {
      setPasteError("Only image files are supported.");
      return;
    }

    if (!asImage && !asDoc) {
      setPasteError(
        `Unsupported file type. We accept images, PDF, CSV, and plain text. ` +
        `Excel / Word files aren't supported — please export to PDF or take a screenshot.`
      );
      return;
    }

    const maxBytes = MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      const limitMB = (maxBytes / 1024 / 1024).toFixed(0);
      setPasteError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${limitMB} MB.`);
      return;
    }

    setPasteError("");
    setAttachedImage(null);

    try {
      // Images get a local preview thumbnail (data URL). Documents skip
      // the FileReader pass — we'd just be reading 5–10 MB to throw away.
      let dataUrl = null;
      if (asImage) {
        dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload  = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      }
      const sizeKb = Math.round(file.size / 1024);

      setAttachedImage({
        gsUri: null, dataUrl, sizeKb, uploading: true,
        kind: asImage ? "image" : "doc",
        filename: file.name || (asImage ? "image" : "document"),
      });

      // Multipart upload — browser sets the correct Content-Type with boundary
      const formData = new FormData();
      // Ensure the file has a name with an extension so the worker can detect mime
      const named = file.name && file.name.includes(".")
        ? file
        : new File(
            [file],
            `paste-${Date.now()}.${(file.type.split("/")[1] || "png")}`,
            { type: file.type }
          );
      formData.append("file", named);
      if (machineId) formData.append("machine_id", machineId);

      const res = await fetch(`${WORKER_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload error ${res.status}`);
      const data = await res.json();
      if (data.error || !data.gsUri) throw new Error(data.error || "No gsUri in response");

      setAttachedImage({
        gsUri: data.gsUri, dataUrl, sizeKb, uploading: false,
        kind: asImage ? "image" : "doc",
        filename: file.name || (asImage ? "image" : "document"),
      });
    } catch (err) {
      setAttachedImage(null);
      setPasteError(`Failed to upload image: ${err.message}`);
    }
  }

  /* ── Capture file from clipboard paste (images only — paste of a doc
   * is exceedingly rare and browsers usually don't expose it) ── */
  async function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
      const file = item.getAsFile();
      if (!file) continue;
      e.preventDefault();
      await uploadFile(file);
      return;
    }
  }

  /* ── Trigger hidden file input from the upload button ── */
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  function openFilePicker() {
    if (loading || attachedImage?.uploading) return;
    fileInputRef.current?.click();
  }
  function openCameraPicker() {
    if (loading || attachedImage?.uploading) return;
    cameraInputRef.current?.click();
  }
  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    e.target.value = ""; // allow selecting the same file again later
  }

  async function sendMessage() {
    const text       = input.trim();
    const hasFile    = attachedImage?.gsUri && !attachedImage?.uploading;
    if ((!text && !hasFile) || loading || attachedImage?.uploading) return;

    /* Snapshot the attachment, then clear input + preview */
    const att = attachedImage;
    setInput("");
    setAttachedImage(null);
    setPasteError("");
    setLoading(true);

    /* Carry the right preview metadata in the bubble:
     *   - images keep their data-URL thumbnail
     *   - documents keep a filename chip (no thumbnail rendered) */
    const userMsg = {
      role: "user",
      text,
      ...(att?.gsUri && att.kind === "image"
        ? { gsUri: att.gsUri, imagePreviewUrl: att.dataUrl }
        : {}),
      ...(att?.gsUri && att.kind === "doc"
        ? { gsUri: att.gsUri, attachedFilename: att.filename }
        : {}),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessages(prev => [...prev, { role: "assistant", text: "", streaming: true }]);

    /* Worker inspects the LAST user message text. Images go through the
     * vision pipeline via `[image:gs://...]`, documents through Gemini's
     * document API via `[document:gs://...]`. */
    let apiText = text;
    if (att?.gsUri) {
      const marker = att.kind === "doc"
        ? `[document:${att.gsUri}]`
        : `[image:${att.gsUri}]`;
      const filler = att.kind === "doc"
        ? `(${att.filename || "Document"} attached)`
        : "(Image attached)";
      apiText = text ? `${text} ${marker}` : `${filler} ${marker}`;
    }

    abortRef.current = new AbortController();
    try {
      const final = await streamChat({
        payload: {
          messages: [{ role: "user", text: apiText }],
          ...(machineId ? { machine_id: machineId } : {}),
        },
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
      focusInputSoon(50);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  /* ── Reusable attachment preview tile.
   * Image attachments → square thumbnail.
   * Document attachments → square card showing the file-type letters
   * (PDF / CSV / TXT) above a truncated filename.
   * Spinner state is identical to the old image-only behaviour. */
  function renderAttachmentTile(size) {
    if (!attachedImage) return null;
    const sq = { width: size, height: size, borderRadius: 10 };
    if (attachedImage.uploading) {
      return (
        <div style={{
          ...sq, background: "#dadbe6",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: size * 0.32, height: size * 0.32,
            border: "2px solid rgba(47,49,90,0.18)", borderTopColor: "#2f315a",
            borderRadius: "50%", animation: "spin 0.7s linear infinite",
          }} />
        </div>
      );
    }
    if (attachedImage.kind === "doc") {
      const ext = (attachedImage.filename || "")
        .split(".").pop().toUpperCase().slice(0, 4) || "DOC";
      return (
        <div title={attachedImage.filename} style={{
          ...sq, background: "#ffffff",
          border: "1px solid rgba(47,49,90,0.15)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 4, padding: 6, textAlign: "center",
        }}>
          <span style={{
            fontSize: size <= 56 ? "0.62rem" : "0.7rem",
            fontWeight: 700, color: "#c9a84c", letterSpacing: "0.05em",
          }}>{ext}</span>
          <span style={{
            fontSize: size <= 56 ? "0.56rem" : "0.6rem",
            color: "#6b6f91", lineHeight: 1.2,
            maxWidth: "100%", overflow: "hidden",
            whiteSpace: "nowrap", textOverflow: "ellipsis",
          }}>{attachedImage.filename}</span>
        </div>
      );
    }
    // image
    return (
      <img src={attachedImage.dataUrl} alt="attachment preview"
        style={{ ...sq, objectFit: "cover", display: "block",
          border: "1px solid rgba(47,49,90,0.15)" }} />
    );
  }

  /* ══════════════════════════════════════════════════════════
   * UNIFIED LAYOUT: Fullscreen chat for both Desktop and Mobile
   * ══════════════════════════════════════════════════════════ */
  return (
    <div ref={containerRef} style={{ position: "fixed", top: 0, left: 0, right: 0, height: "100dvh", zIndex: 300, display: "flex", flexDirection: "column", background: "radial-gradient(circle at 85% 15%, rgba(201, 168, 76, 0.15) 0%, transparent 50%), linear-gradient(to bottom, #f8f9fd, #eef1f8)" }}>
      <ChatbotKeyframes />
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes typingPulse{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        
        .omni-lg-glass {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 24px rgba(47, 49, 90, 0.05);
        }
        
        .omni-lg-glass-btn {
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.2s;
          color: rgba(0,0,0,0.6);
        }
        .omni-lg-glass-btn:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-2px);
        }
        .omni-lg-glass-btn:active {
          transform: translateY(0) scale(0.96);
        }
        
        .omni-top-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: max(12px, env(safe-area-inset-top)) 12px 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          pointer-events: none;
          z-index: 1000;
        }
        .omni-top-group {
          display: flex;
          gap: 0.25rem;
          pointer-events: auto;
          border-radius: 50px;
          padding: 0.35rem;
        }
        .omni-btn-pill {
          height: 38px;
          border-radius: 20px;
          padding: 0 1rem;
          font-size: 0.82rem;
          font-weight: 600;
          gap: 0.4rem;
        }
        .omni-btn-circle {
          width: 38px; height: 38px;
          border-radius: 50%;
        }
      `}</style>

      {/* ── Top Liquid Glass Navigation ── */}
      <div className="omni-top-bar">
        {/* Left Group: Back (desktop) + KS Omni Branding */}
        <div className="omni-top-group">
          {!isMobile && (
            <button className="omni-lg-glass-btn omni-btn-pill" onClick={goHome} aria-label="Back" title="Back">
              <BackIcon />
              <span>Back</span>
            </button>
          )}
          <div className="omni-lg-glass-btn omni-btn-pill" style={{ cursor: "default", paddingLeft: "0.4rem", paddingRight: "0.8rem", pointerEvents: "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(201,168,76,0.5)", flexShrink: 0 }}>
              <img src="/images/branding/ksl-logo-circle.webp" alt="KSL" loading="eager" decoding="async" fetchPriority="high" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2f315a", whiteSpace: "nowrap" }}>KS Omni</span>
          </div>
        </div>

        {/* Right Group: Phone + Search (desktop) + Menu (desktop) + Clear */}
        <div className="omni-top-group" style={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
          {!isMobile && (
            <button 
              className="omni-lg-glass-btn omni-btn-pill" 
              onClick={() => setShowQR(true)} 
              aria-label="Open on Phone"
              title="Open on Phone"
            >
              <QRIcon />
              <span>Open on Phone</span>
            </button>
          )}
          
          <button 
            className="omni-lg-glass-btn omni-btn-pill" 
            onClick={clearChat} 
            aria-label="Clear chat"
            title="Clear chat"
          >
            <TrashIcon />
            <span>Clear Chat</span>
          </button>
          
          {!isMobile && (
            <>
              <button 
                className="omni-lg-glass-btn omni-btn-pill" 
                onClick={() => window.dispatchEvent(new Event("openGlobalSearch"))} 
                aria-label="Search"
                title="Search"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Search</span>
              </button>
              <div className="omni-divider" />
              <button 
                className="omni-lg-glass-btn omni-btn-pill" 
                onClick={() => window.dispatchEvent(new Event("openGlobalMenu"))} 
                aria-label="Menu"
                title="Menu"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                <span>Menu</span>
              </button>
            </>
          )}

        </div>
      </div>

      {/* Hidden file input shared by both desktop & mobile InputRow upload buttons */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={IMAGE_FILE_ACCEPT}
        capture="environment"
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      {/* ── Chat Content Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 900, margin: "0 auto", width: "100%", paddingTop: "max(80px, env(safe-area-inset-top) + 80px)", minHeight: 0 }}>
        <div ref={chatScrollRef} style={{
          flex: 1, overflowY: "auto",
          padding: isEmpty ? "1rem 1.25rem 1rem" : "1rem 1.25rem 0",
          display: "flex", flexDirection: "column",
          justifyContent: isEmpty ? "center" : "flex-start",
        }}>
          {isEmpty
            ? <EmptyGreeting />
            : messages.map((msg, i) => <Message key={i} msg={msg} fontSize={isMobile ? "0.88rem" : "0.95rem"} />)
          }
        </div>
      </div>

      {/* ── Liquid Glass Input Row ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "0.5rem 1rem" }}>
        <div className="omni-lg-glass" style={{
          marginBottom: isMobile ? "max(64px, env(safe-area-inset-bottom) + 64px)" : "max(0.5rem, env(safe-area-inset-bottom))",
          padding: "0.65rem 0.8rem 0.5rem",
          borderRadius: 24,
          display: "flex", flexDirection: "column", gap: "0.35rem",
        }}>
          {/* Inline attachment preview (inside the input container) */}
          {attachedImage && (
            <div style={{ position: "relative", display: "inline-block", alignSelf: "flex-start", margin: "0.1rem 0 0.2rem" }}>
              {renderAttachmentTile(56)}
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
            onChange={handleInputChange}
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
              maxHeight: "34dvh", overflowY: "hidden",
              color: "#2f315a",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)}
              style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "rgba(47,49,90,0.12)" : "#2f315a",
                border: "none",
                color: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "rgba(47,49,90,0.4)" : "#ffffff",
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
      </div>

      {showQR && <QRModal onClose={() => setShowQR(false)} pageUrl={pageUrl} qrUrl={qrUrl} qrReady={qrReady} />}

      {/* ── Mobile Float Bar (Back, Search, Menu) ── */}
      {isMobile && (
        <div className="mobile-float-bar lg-glass" style={{ display: "flex" }}>
          <button className="mfb-btn mfb-action" onClick={goHome} aria-label="Back">
            <span className="mfb-action-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </span>
            <span className="mfb-action-label">Back</span>
          </button>
          <div className="mfb-divider" aria-hidden="true" />
          <button className="mfb-btn mfb-search" onClick={() => window.dispatchEvent(new Event("openGlobalSearch"))} aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 1 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span className="mfb-label">Search</span>
          </button>
          <button className="mfb-btn mfb-menu" onClick={() => window.dispatchEvent(new Event("openGlobalMenu"))} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            <span className="mfb-label">Menu</span>
          </button>
        </div>
      )}
    </div>
  );
}
