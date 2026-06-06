import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  WORKER_URL, SendIcon,
  Message, ChatbotKeyframes, streamChat,
  AnimatedGreeting, autoResizeTextarea,
} from "../components/chatbotShared.jsx";
import { BackIcon, MenuGlyph } from "../components/icons.jsx";

const DEFAULT_OMNI_ORIGIN = "https://ksleow.vercel.app";
const SSR_SESSION_ID = "pending-session";

function getOmniPageUrl(machineId, origin = DEFAULT_OMNI_ORIGIN) {
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
function QRModal({ onClose, pageUrl, qrUrl, qrReady, onMouseEnter, onMouseLeave }) {
  return (
    <div 
      className="ks-nav-glass-panel"
      onClick={e => e.stopPropagation()} 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed", 
        top: "4.55rem", 
        right: "6rem",
        zIndex: 1101,
        borderRadius: "26px", 
        padding: "1.5rem",
        maxWidth: 320, 
        width: "100%", 
        textAlign: "center",
        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.4rem" }}>Open on Mobile</h3>
      <p style={{ fontSize: "0.78rem", color: "#6b6f91", lineHeight: 1.6, marginBottom: "1.25rem" }}>
        Scan this QR code with your phone to open KS Omni on your mobile device.
      </p>
      <div style={{
        width: 180, height: 180,
        margin: "0 auto 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0.75rem", borderRadius: 16,
        border: "2px solid rgba(47,49,90,0.1)",
        background: "#f8f8fb",
      }}>
        {qrReady ? (
          <img src={qrUrl} alt="QR code" width={180} height={180} loading="eager" decoding="async" style={{ display: "block", borderRadius: 8 }} />
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
    </div>
  );
}

/* ── Page-specific icons (Send / Close come from chatbotShared) ── */
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
const CloseSidebarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <path d="M9 3v18" />
    <path d="m16 15-3-3 3-3" />
  </svg>
);
const DeleteIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const EditIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const NewChatIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 8v6" />
    <path d="M9 11h6" />
  </svg>
);
const QRIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h1v1h-1zM18 14h2v2h-2zM14 19h3v2h-1v-1h-2zM21 19v2h-1v-1" />
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
  return (
    <div className="omni-dark-greeting">
      <style suppressHydrationWarning>{`
        .omni-dark-greeting > div > div:first-child { color: rgba(255,255,255,0.35) !important; }
        .omni-dark-greeting > div > div:last-child { background: linear-gradient(90deg, rgba(255,255,255,0.85) 0%, #c9a84c 100%) !important; -webkit-background-clip: text !important; }
      `}</style>
      <AnimatedGreeting />
    </div>
  );
}

/* ── Mobile detection ── */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
function getSessionsListKey(machineId) {
  return `ks_omni_sessions_${machineId || "default"}`;
}
function getSessionMessagesKey(machineId, sessionId) {
  return `ks_omni_chat_${machineId || "default"}_${sessionId}`;
}

/* ── Main page ── */
export default function KSLOmniPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [pageOrigin, setPageOrigin] = useState(DEFAULT_OMNI_ORIGIN);
  const [machineId, setMachineId] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(SSR_SESSION_ID);
  const [messages, setMessages] = useState([]);

  function switchSession(newId) {
    abortRef.current?.abort();
    setActiveSessionId(newId);
    try {
      const saved = localStorage.getItem(getSessionMessagesKey(machineId, newId));
      setMessages(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setMessages([]);
    }
  }


  const [isIOS, setIsIOS] = useState(false);

  const [input, setInput]                  = useState("");
  const [loading, setLoading]              = useState(false);
  const [showQR, setShowQR]                = useState(false);
  const qrHoverTimer                       = useRef(null);
  
  const handleQREnter = () => {
    if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches) {
      clearTimeout(qrHoverTimer.current);
      setShowQR(true);
      window.dispatchEvent(new Event("closeGlobalMenu"));
    }
  };

  const handleQRLeave = () => {
    if (window.innerWidth >= 1024 && window.matchMedia("(hover: hover)").matches) {
      qrHoverTimer.current = setTimeout(() => setShowQR(false), 300);
    }
  };

  const [attachedImage, setAttachedImage]  = useState(null);   /* { gsUri, dataUrl, sizeKb, uploading } */
  const [pasteError, setPasteError]        = useState("");
  const [keyboardOpen, setKeyboardOpen]    = useState(false);
  const [menuOpen, setMenuOpen]            = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const maxHeights = useRef({ portrait: 0, landscape: 0 });
  const pageUrl = useMemo(() => getOmniPageUrl(machineId, pageOrigin), [machineId, pageOrigin]);
  const qrUrl = useMemo(() => getQrUrl(pageUrl), [pageUrl]);
  const [qrReady, setQrReady] = useState(false);

  const inputRef     = useRef(null);
  const abortRef     = useRef(null);
  const chatScrollRef = useRef(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextMachineId = params.get("mid") || null;
    const nextSessionId = generateId();

    setPageOrigin(window.location.origin);
    setMachineId(nextMachineId);
    setSidebarOpen(window.innerWidth >= 768);
    setActiveSessionId(nextSessionId);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    try {
      const saved = localStorage.getItem(getSessionsListKey(nextMachineId));
      setSessions(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setSessions([]);
    }
  }, []);

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

    // Save messages and update session list preview
  useEffect(() => {
    if (messages.length === 0 || activeSessionId === SSR_SESSION_ID) return;
    const msgKey = getSessionMessagesKey(machineId, activeSessionId);
    localStorage.setItem(msgKey, JSON.stringify(messages));

    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === activeSessionId);
      const userMsg = messages.find(m => m.role === "user");
      const preview = userMsg ? userMsg.text.substring(0, 50) : "New Conversation";
      
      const newSessionInfo = {
        id: activeSessionId,
        date: new Date().toISOString(),
        preview: preview
      };

      let next;
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = { ...next[existingIdx], preview, date: existingIdx === 0 ? next[existingIdx].date : new Date().toISOString() };
      } else {
        next = [newSessionInfo, ...prev];
      }
      localStorage.setItem(getSessionsListKey(machineId), JSON.stringify(next));
      return next;
    });
  }, [messages, activeSessionId, machineId]);
  useEffect(() => {
    setQrReady(false);
    const img = new Image();
    img.decoding = "async";
    img.onload = () => setQrReady(true);
    img.onerror = () => setQrReady(true);
    img.src = qrUrl;
  }, [qrUrl]);

  useEffect(() => {
    // Match background so any iOS rubber-band overscroll
    // shows the same color instead of white
    const savedBodyBg = document.body.style.background;
    const savedHtmlBg = document.documentElement.style.background;

    document.body.style.background = "#0c0e1a";
    document.documentElement.style.background = "#0c0e1a";

    const onOpenQR = () => setShowQR(true);
    const onCloseQR = () => setShowQR(false);
    const onToggleQR = () => setShowQR(prev => {
      if (!prev) window.dispatchEvent(new Event("closeGlobalMenu"));
      return !prev;
    });
    const onMenuChange = (e) => setMenuOpen(e.detail);
    window.addEventListener("openOmniQR", onOpenQR);
    window.addEventListener("closeOmniQR", onCloseQR);
    window.addEventListener("toggleOmniQR", onToggleQR);
    window.addEventListener("globalMenuStateChange", onMenuChange);
    
    return () => {
      document.body.style.background = savedBodyBg;
      document.documentElement.style.background = savedHtmlBg;
      window.removeEventListener("openOmniQR", onOpenQR);
      window.removeEventListener("closeOmniQR", onCloseQR);
      window.removeEventListener("toggleOmniQR", onToggleQR);
      window.removeEventListener("globalMenuStateChange", onMenuChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const threshold = 150; 

    const updateViewport = () => {
      const vv = window.visualViewport;
      
      const isLandscape = window.innerWidth > window.innerHeight;
      const orientation = isLandscape ? 'landscape' : 'portrait';
      const currentHeight = isIOS ? window.innerHeight : vv.height; // Android native viewport shrinks, iOS doesn't
      
      if (currentHeight > maxHeights.current[orientation]) {
         maxHeights.current[orientation] = currentHeight;
      }
      
      const maxKnownHeight = maxHeights.current[orientation];
      const isOpen = maxKnownHeight - vv.height > threshold;

      if (isIOS) {
        if (contentRef.current) {
          contentRef.current.style.height = `${vv.height}px`;
          contentRef.current.style.top = `${vv.offsetTop}px`;
        }
      }
      
      setKeyboardOpen(isOpen);
    };
    
    window.visualViewport.addEventListener("resize", updateViewport);
    window.visualViewport.addEventListener("scroll", updateViewport);
    updateViewport();
    
    return () => {
      window.visualViewport.removeEventListener("resize", updateViewport);
      window.visualViewport.removeEventListener("scroll", updateViewport);
    };
  }, [isIOS]);

  function handleInputChange(e) {
    setInput(e.target.value);
    autoResizeTextarea(e.currentTarget);
  }

  function startNewChat() {
    switchSession(generateId());
    setInput("");
    setAttachedImage(null);
    setPasteError("");
    if (isMobile) setSidebarOpen(false);
  }

  function renameSession(id, newLabel) {
    if (!newLabel || !newLabel.trim()) return;
    setSessions(prev => {
      const next = prev.map(s => s.id === id ? { ...s, preview: newLabel.trim() } : s);
      localStorage.setItem(getSessionsListKey(machineId), JSON.stringify(next));
      return next;
    });
  }

  function deleteSession(id) {
    localStorage.removeItem(getSessionMessagesKey(machineId, id));
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(getSessionsListKey(machineId), JSON.stringify(next));
      if (id === activeSessionId) {
        if (next.length > 0) switchSession(next[0].id);
        else startNewChat();
      }
      return next;
    });
  }

  function deleteAllSessions() {
    if (window.confirm("Are you sure you want to delete all chat history?")) {
      sessions.forEach(s => localStorage.removeItem(getSessionMessagesKey(machineId, s.id)));
      localStorage.setItem(getSessionsListKey(machineId), JSON.stringify([]));
      setSessions([]);
      startNewChat();
    }
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
          session_id: activeSessionId,
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
    <div suppressHydrationWarning style={{ position: "absolute", inset: 0, zIndex: 300, background: "radial-gradient(ellipse at 50% 0%, rgba(47, 49, 90, 0.5) 0%, transparent 60%), radial-gradient(circle at 85% 15%, rgba(201, 168, 76, 0.08) 0%, transparent 45%), linear-gradient(to bottom, #111328, #0c0e1a)", display: "flex", overflow: "hidden" }}>
      
      {/* -- Sidebar (Desktop Fixed, Mobile Overlay) -- */}
      <div style={{
        width: isMobile ? 320 : (sidebarOpen ? 300 : 0),
        position: isMobile ? "fixed" : "relative",
        top: 0, bottom: 0, left: 0, zIndex: 2000,
        background: isMobile ? "rgba(12, 14, 26, 0.95)" : "rgba(12, 14, 26, 0.3)",
        backdropFilter: "blur(20px)",
        borderRight: (isMobile || sidebarOpen) ? "1px solid rgba(255,255,255,0.05)" : "none",
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "none",
        transition: "width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
        overflow: "hidden",
      }}>
        <div style={{ width: isMobile ? 320 : 300, padding: "max(1rem, env(safe-area-inset-top)) 1rem 1rem", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(201,168,76,0.5)", flexShrink: 0 }}>
                <img src="/images/branding/ksl-logo-circle.webp" alt="KSL" loading="eager" decoding="async" fetchpriority="high" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.02em", whiteSpace: "nowrap", lineHeight: 1 }}>KS Omni</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                  <span style={{ color: "#8a8ea8", fontSize: "0.7rem", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>K.S. Leow Group AI Assistant</span>
                </div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#6b6f91", padding: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close Sidebar">
              <CloseSidebarIcon />
            </button>
          </div>
          <button onClick={startNewChat} className="lg-glass lg-glass-btn lg-glass-pill" style={{ width: "100%", justifyContent: "center", marginBottom: "1.5rem", color: "#ffffff", gap: "0.4rem" }}>
            <NewChatIcon />
            <span>New Chat</span>
          </button>
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem", paddingRight: "0.25rem" }}>
            {sessions.map(s => (
              <div key={s.id} onClick={() => { switchSession(s.id); if(isMobile) setSidebarOpen(false); }}
                   style={{ padding: "0.85rem 1rem", borderRadius: "12px", background: activeSessionId === s.id ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer", transition: "background 0.2s", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
                 <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, color: "rgba(255,255,255,0.8)", fontSize: "0.85rem" }}>
                   {s.preview || "New Conversation"}
                 </div>
                 <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
                   <button onClick={(e) => { 
                     e.stopPropagation(); 
                     const newLabel = window.prompt("Rename chat:", s.preview || "");
                     if (newLabel) renameSession(s.id, newLabel);
                   }} style={{ background: "transparent", border: "none", color: "#6b6f91", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Rename">
                     <EditIcon size={14} />
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }} style={{ background: "transparent", border: "none", color: "#6b6f91", padding: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Delete">
                     <DeleteIcon size={14} />
                   </button>
                 </div>
              </div>
            ))}
            {sessions.length > 0 && (
              <button onClick={deleteAllSessions} style={{ marginTop: "1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#e17d7d", padding: "0.75rem", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", transition: "background 0.2s" }} onMouseEnter={e => e.target.style.background = "rgba(225, 125, 125, 0.1)"} onMouseLeave={e => e.target.style.background = "transparent"}>
                <DeleteIcon size={14} />
                <span>Clear History</span>
              </button>
            )}
            {sessions.length === 0 && (
              <div style={{ color: "#6b6f91", fontSize: "0.85rem", textAlign: "center", marginTop: "2rem" }}>No history found</div>
            )}
          </div>
        </div>
      </div>

{/* -- Mobile Overlay -- */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1999 }} />
      )}

      {/* -- Main Chat Area -- */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={contentRef} style={{ position: isIOS ? "absolute" : "relative", top: 0, left: 0, right: 0, height: isIOS ? "100dvh" : "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: "100%", overflowX: "hidden" }}>
            <ChatbotKeyframes />
            <style suppressHydrationWarning>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes typingPulse{0%,80%,100%{opacity:0.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
        
        .omni-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: max(12px, env(safe-area-inset-top)) 12px 12px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          pointer-events: none;
          z-index: 1000;
        }
        @media (min-width: 1024px) {
          /* Inherit all floating button styles from MenuButton.jsx for perfect consistency */
        }
      `}</style>

      {/* ── Desktop & Tablet Controls ── */}
      {!isMobile && (
        <>
          <div className="top-left-controls" style={{ transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", transform: sidebarOpen ? "translateX(300px)" : "none" }}>
            <button className="back-fab lg-glass lg-glass-btn" style={{ color: "#ffffff" }} onClick={goHome} aria-label="Back">
              <BackIcon />
              <span>Back</span>
            </button>
            {!sidebarOpen && (
              <button className="back-fab lg-glass lg-glass-btn" style={{ color: "#ffffff" }} onClick={() => setSidebarOpen(true)} aria-label="History">
                <HistoryIcon />
                <span>History</span>
              </button>
            )}
          </div>

          <div className="top-right-controls">
            <button 
              className="search-fab lg-glass lg-glass-btn omni-qr-fab" 
              style={{ color: "#ffffff" }}
              onClick={() => setShowQR(true)} 
              onMouseEnter={handleQREnter}
              onMouseLeave={handleQRLeave}
              aria-label="Open on Mobile"
            >
              <QRIcon />
              <span>Open on Mobile</span>
            </button>
            <button 
              className="menu-fab lg-glass lg-glass-btn" 
              style={{ color: "#ffffff" }}
              onMouseEnter={() => window.dispatchEvent(new Event("globalMenuEnter"))}
              onMouseLeave={() => window.dispatchEvent(new Event("globalMenuLeave"))}
              onClick={() => window.dispatchEvent(new Event("toggleGlobalMenu"))} 
              aria-label="Menu"
            >
              <MenuGlyph open={menuOpen} size={15} />
              <span>Menu</span>
            </button>
          </div>
        </>
      )}

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

      {/* ── Main Flex Container for Chat + Input ── */}
      <div style={{
        flex: 1, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: isEmpty ? "center" : "space-between",
        paddingTop: "max(80px, env(safe-area-inset-top) + 80px)", 
        paddingBottom: (isEmpty && !keyboardOpen) ? "15vh" : 0,
        minHeight: 0
      }}>
        {/* ── Chat Content Area ── */}
        <div ref={chatScrollRef} style={{
          flex: isEmpty ? "none" : 1, 
          overflowY: isEmpty ? "visible" : "auto",
          overscrollBehavior: "none",
          WebkitOverflowScrolling: "touch",
          padding: isEmpty ? "0 1.25rem 1.5rem" : "1rem 1.25rem 0",
          display: "flex", flexDirection: "column",
          justifyContent: isEmpty ? "center" : "flex-start",
          maxWidth: 900, margin: "0 auto", width: "100%"
        }}>
          {isEmpty
            ? <EmptyGreeting />
            : messages.map((msg, i) => <Message key={i} msg={msg} fontSize={isMobile ? "0.88rem" : "0.95rem"} />)
          }
        </div>

        {/* ── Liquid Glass Input Row ── */}
        <div style={{ maxWidth: 900, margin: "0 auto", width: "100%", padding: "0.5rem 1rem" }}>
          <div style={{
            position: "relative",
            marginBottom: 0,
            padding: "0.65rem 0.8rem 0.5rem",
            display: "flex", flexDirection: "column", gap: "0.35rem",
          }}>
            {/* Sibling glass background to prevent WebKit IME bug (backdrop-filter messes up input coords) */}
            <div className="lg-glass" style={{ position: "absolute", inset: 0, zIndex: -1, borderRadius: 24, pointerEvents: "none" }} />

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
              color: "rgba(255,255,255,0.9)",
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
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: (loading || attachedImage?.uploading) ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.6)",
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
                background: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "rgba(255,255,255,0.08)" : "#c9a84c",
                border: "none",
                color: (loading || attachedImage?.uploading || (!input.trim() && !attachedImage?.gsUri)) ? "rgba(255,255,255,0.2)" : "#0c0e1a",
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
          
        {/* Disclaimer text under input */}
        <div style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: "0.4rem", marginBottom: keyboardOpen ? "0.2rem" : (isMobile ? "max(64px, env(safe-area-inset-bottom) + 64px)" : "max(0.5rem, env(safe-area-inset-bottom))") }}>
          AI Responses may be inaccurate
        </div>
      </div>
    </div>

      {/* ── QR Modal ── */}
      {showQR && <QRModal onClose={() => setShowQR(false)} pageUrl={pageUrl} qrUrl={qrUrl} qrReady={qrReady} onMouseEnter={handleQREnter} onMouseLeave={handleQRLeave} />}

      {/* ── Mobile Float Bar (Back, Search, Menu) ── */}
      {isMobile && !keyboardOpen && (
        <div className="mobile-float-bar lg-glass" style={{ display: "flex" }}>
          <button className="mfb-btn mfb-action" style={{ color: "#ffffff" }} onClick={goHome} aria-label="Back">
            <span className="mfb-action-icon" aria-hidden="true">
              <BackIcon />
            </span>
            <span className="mfb-action-label">Back</span>
          </button>
          <div className="mfb-divider" style={{ background: "rgba(255,255,255,0.25)" }} aria-hidden="true" />
          <button className="mfb-btn mfb-menu" style={{ color: "#ffffff" }} onClick={() => window.dispatchEvent(new Event("toggleGlobalMenu"))} aria-label="Menu">
            <MenuGlyph open={menuOpen} size={15} />
            <span className="mfb-label">Menu</span>
          </button>
          <div className="mfb-divider" style={{ background: "rgba(255,255,255,0.25)" }} aria-hidden="true" />
          <button className="mfb-btn mfb-action" style={{ color: "#ffffff" }} onClick={() => setSidebarOpen(true)} aria-label="History">
            <span className="mfb-action-icon" aria-hidden="true">
              <HistoryIcon />
            </span>
            <span className="mfb-action-label">History</span>
          </button>
        </div>
      )}
    </div>
      </div>
    </div>
    </div>
  );
}
