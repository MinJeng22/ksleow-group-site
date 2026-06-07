import { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import ProductHero from "../../components/ProductHero.jsx";
import { PageSectionDivider } from "../../components/PageSections.jsx";
import CarouselProgress from "../../components/CarouselProgress.jsx";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import StepRow from "../../components/StepRow.jsx";
import { Vid, Img } from "../../components/Media.jsx";
/* Sales2DO-specific WhatsApp link — addressed to KSL Support Team with a product-aware message */
const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent(
  "HI KS Support Team, I would like to learn more about AutoCount Plugin Sales2DO. Thank you."
)}`;
import AIChatbot from "../../components/AIChatbot.jsx";
import sales2doContent from "../../content/sales2do.json";
import acPluginIcon     from "../../assets/images/apps/ac-plugin-icon.webp";
import { IconClipboard, IconSettings, IconStar, IconShield, IconVideo } from "../../components/SectionDivider.jsx";
import imgOutstanding   from "../../assets/images/apps/sales2do/outstanding.webp";
import imgPreset        from "../../assets/images/apps/sales2do/preset-delivery.webp";
import imgSettings      from "../../assets/images/apps/sales2do/settings.webp";
/* Online/Offline activation screenshots are swapped — the file named
 * `license-online.webp` was originally captured for the offline flow and
 * vice versa. Re-binding the imports is cheaper than renaming the files
 * on disk. */
import imgLicenseOnline  from "../../assets/images/apps/sales2do/license-offline.webp";
import imgLicenseOffline from "../../assets/images/apps/sales2do/license-online.webp";

/* Sales2DO sidebar anchor items */
const S2D_SECTIONS = [
  { id: "overview", label: "Overview", icon: IconVideo, color: "#c9a84c" },
  { id: "outstanding", label: "Outstanding DO", icon: IconClipboard, color: "#c9a84c" },
  { id: "preset", label: "Preset", icon: IconStar, color: "#c9a84c" },
  { id: "settings", label: "Settings", icon: IconSettings, color: "#c9a84c" },
  { id: "license", label: "License", icon: IconShield, color: "#c9a84c" },
];

/* ── Video segments ── */
const VIDEO_SEGMENTS = [
  {
    src: "/videos/sales2do/copy-to-do-method1.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: "Method 1 — Via Right-Click Menu",
    desc: "The fastest method for processing single documents.",
    steps: [
      <span key="a">Navigate to <strong>Sales → Invoice</strong> or <strong>Cash Sale</strong> to open the document listing.</span>,
      <span key="b">Right-click on the specific row you wish to copy and select <strong>"Copy to a new Delivery Order"</strong>.</span>,
      <span key="c"><em>Note: this option is only visible for <strong>Approved</strong> documents — not Draft or Voided entries.</em></span>,
      <span key="d">A new Delivery Order entry screen opens with all details pre-filled.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method2.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 2 — Via the "Copy To" Icon',
    desc: "Ideal when you are already reviewing a document.",
    steps: [
      <span key="a">Open any Invoice or Cash Sale in <strong>View Mode</strong>.</span>,
      <span key="b">On the top ribbon under the <strong>Home</strong> tab, click the <strong>"Copy to a new Delivery Order"</strong> button.</span>,
      <span key="c">A new Delivery Order will be generated based on the viewed document.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method3.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 3 — Via "Copy From" in DO Entry',
    desc: "The best way to combine multiple sales documents into a single Delivery Order.",
    steps: [
      <span key="a">Go to <strong>Sales → Delivery Order</strong> and create a <strong>New</strong> entry.</span>,
      <span key="b">On the top ribbon under the <strong>Home</strong> tab, click <strong>"Copy from Invoice"</strong> or <strong>"Copy from Cash Sale"</strong>.</span>,
      <span key="c">A search window will appear. Select the desired source document(s) and click <strong>OK</strong>. <em>(Search results only include Approved invoices by default.)</em></span>,
      <span key="d">All items from the selected documents will automatically populate the Delivery Order.</span>,
    ],
  },
  {
    src: "/videos/sales2do/smart-quantity-control.mp4",
    group: "Smart Quantity Control",
    title: "Smart Quantity Control — Partial Copy & Full Copy Warning",
    desc: "Prevents accidental over-delivery when copying partially or fully delivered documents.",
    steps: [
      <span key="a"><strong>Partial Copy:</strong> When copying a partially delivered document, the system calculates the remaining balance and only loads the <strong>Outstanding Quantity</strong>.</span>,
      <span key="b"><strong>Full Copy Warning:</strong> If a document is already fully delivered, the system will prompt a warning to prevent accidental over-delivery.</span>,
    ],
  },
  {
    src: "/videos/sales2do/ks-omni.mp4",
    group: "AI Assistant and Feedback",
    title: "KS-Omni — 24-Hour AI Support & Feedback",
    desc: "Access 24-hour AI support or send feedback directly to the KSL developer team.",
    steps: [
      <span key="a">Navigate to <strong>Sales2DO → AI Assistant and Feedback</strong>.</span>,
      <span key="b">The AI <strong>Chatbot</strong> will open.</span>,
      <span key="c"><strong>Support:</strong> Ask questions or upload images / screenshots for troubleshooting.</span>,
      <span key="d"><strong>Feedback:</strong> Submit bug reports or feature suggestions directly to the <strong>KSL Development Team</strong>.</span>,
    ],
  },
];

/* ── Shared styles ── */
const S = {
  label: { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" },
  h2:    { fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" },
  h3:    { fontSize: "1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.6rem" },
  body:  { fontSize: "0.92rem", color: "#555", lineHeight: 1.82 },
  section: { padding: "4rem 0" },
};

/* ── Screenshot slot ── */
function ImgSlot({ src, alt, caption, maxWidth = 860, maxHeight = 480 }) {
  return (
    <div style={{ margin: "1.25rem 0 0.5rem" }}>
      <div style={{
        maxWidth, margin: "0 auto", borderRadius: 10,
        border: "1px solid rgba(47,49,90,0.1)", overflow: "hidden",
        background: src ? "transparent" : "#f0f0f5",
        minHeight: src ? "auto" : 140,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {src
          ? <Img src={src} alt={alt || ""} style={{ width: "100%", display: "block", maxHeight, objectFit: "contain", objectPosition: "top" }} />
          : <div style={{ padding: "1.75rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", opacity: 0.25, marginBottom: "0.4rem" }}>🖼️</div>
              <div style={{ fontSize: "0.72rem", color: "#a8abcc", fontWeight: 500 }}>{alt || "Screenshot"}</div>
            </div>
        }
      </div>
      {caption && <p style={{ fontSize: "0.75rem", color: "#a8abcc", textAlign: "center", fontStyle: "italic", marginTop: "0.35rem" }}>{caption}</p>}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: "1.1rem", margin: "0.5rem 0" }}>
      {items.map((item, i) => <li key={i} className="ks-body-text" style={{ marginBottom: "0.4rem" }}>{item}</li>)}
    </ul>
  );
}

function RichText({ children }) {
  return <span dangerouslySetInnerHTML={{ __html: children || "" }} />;
}

function richList(items = []) {
  return items.map((item, i) => <RichText key={i}>{item}</RichText>);
}

/* ── Two-column layout: image on the LEFT, text on the RIGHT ──
 * Used by Outstanding DO, Preset Delivery, and Plugin Settings sections.
 * Column proportions mirror the Video Tutorial grid (58% image, 42%
 * text) so screenshots and the video player feel like the same size.
 * Collapses to single column at <760px (image first, then text). */
function SectionRow({ image, alt, caption, children, sticky = true }) {
  return (
    <>
      <style>{`
        .sr-grid { display: grid; grid-template-columns: 58% 1fr; gap: 2.5rem; align-items: start; margin-top: 1.5rem; }
        @media (max-width: 760px) { .sr-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
      `}</style>
      <div className="sr-grid">
        <div style={sticky ? { position: "sticky", top: 90 } : undefined}>
          <ImgSlot src={image} alt={alt} caption={caption} maxWidth={720} maxHeight={560} />
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
 * VideoGuide — seamless dual-video crossfade
 *
 * Two <video> elements stay mounted permanently. The active one is
 * visible (opacity 1); the inactive one preloads the next segment in
 * the background (opacity 0). When ready to transition we:
 *   1. Seek inactive video to 0 and call play()
 *   2. Wait for requestVideoFrameCallback to confirm an actual painted
 *      first frame on the inactive video
 *   3. Flip the `active` state — both videos stay on screen during the
 *      0.3s opacity crossfade, so the viewer never sees a black gap
 *      (the previous video keeps showing its last frame until faded out)
 *   4. After fade, pause the now-idle slot and preload the next-next seg
 * ══════════════════════════════════════════════════════════════ */
function VideoGuide() {
  const [idx,    setIdx]    = useState(0);
  const [active, setActive] = useState("a");   // which slot is visible
  const [paused, setPaused] = useState(false); // play/pause toggle
  const [videoRemaining, setVideoRemaining] = useState(1);

  const aRef         = useRef(null);
  const bRef         = useRef(null);
  const containerRef = useRef(null);  // wraps both videos — what we send fullscreen
  /* Mutable mirrors for stale-closure-free callback access. */
  const idxRef    = useRef(0);
  const activeRef = useRef("a");
  const busyRef   = useRef(false);
  const videoRemainingRef = useRef(1);
  idxRef.current    = idx;
  activeRef.current = active;

  /* Helper: assign a src to a video if not already set, and load(). */
  const ensureSrc = (vid, src) => {
    if (!vid) return;
    const want = new URL(src, window.location.href).href;
    if (vid.src !== want) {
      vid.src = src;
      vid.preload = "auto";
      vid.load();
    }
  };

  /* Initial mount: A plays seg 0; B preloads seg 1. */
  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (a) {
      a.muted = true; a.playsInline = true;
      ensureSrc(a, VIDEO_SEGMENTS[0].src);
      a.play().catch(() => {});
    }
    if (b && VIDEO_SEGMENTS.length > 1) {
      b.muted = true; b.playsInline = true;
      ensureSrc(b, VIDEO_SEGMENTS[1].src);
    }
  }, []);

  useEffect(() => {
    let frameId;
    const updateRemaining = () => {
      const vid = activeRef.current === "a" ? aRef.current : bRef.current;
      if (vid && Number.isFinite(vid.duration) && vid.duration > 0) {
        const remaining = Math.max(0, Math.min(1, 1 - (vid.currentTime / vid.duration)));
        if (Math.abs(videoRemainingRef.current - remaining) > 0.004) {
          videoRemainingRef.current = remaining;
          setVideoRemaining(remaining);
        }
      } else {
        if (videoRemainingRef.current !== 1) {
          videoRemainingRef.current = 1;
          setVideoRemaining(1);
        }
      }
      frameId = requestAnimationFrame(updateRemaining);
    };
    updateRemaining();
    return () => cancelAnimationFrame(frameId);
  }, []);

  /* Transition to a target segment with crossfade. */
  const transitionTo = (rawIdx) => {
    const N = VIDEO_SEGMENTS.length;
    const toIdx = ((rawIdx % N) + N) % N;
    if (toIdx === idxRef.current) return;
    if (busyRef.current) return;
    busyRef.current = true;

    const fromSlot = activeRef.current;
    const toSlot   = fromSlot === "a" ? "b" : "a";
    const fromVid  = fromSlot === "a" ? aRef.current : bRef.current;
    const toVid    = toSlot   === "a" ? aRef.current : bRef.current;
    if (!fromVid || !toVid) { busyRef.current = false; return; }

    const targetSrc = VIDEO_SEGMENTS[toIdx].src;

    /* Once toVid has its target loaded — start playback then crossfade. */
    const playAndSwap = () => {
      try { toVid.currentTime = 0; } catch { /* ignore */ }
      const playPromise = toVid.play();

      const fireSwap = () => {
        setActive(toSlot);
        setIdx(toIdx);
        videoRemainingRef.current = 1;
        setVideoRemaining(1);
        /* Switching segments always auto-plays the new clip — sync the
         * pause-button icon back to "playing" so it doesn't stick on the
         * play-triangle from a previous pause. */
        setPaused(false);
        /* Instant cut — pause the old slot and preload next-next on the
         * idle slot right away, on the next animation frame. */
        requestAnimationFrame(() => {
          try { fromVid.pause(); } catch { /* ignore */ }
          const nextNext = (toIdx + 1) % N;
          ensureSrc(fromVid, VIDEO_SEGMENTS[nextNext].src);
          busyRef.current = false;
        });
      };

      /* Wait until the inactive video has actually painted a frame. */
      if (typeof toVid.requestVideoFrameCallback === "function") {
        toVid.requestVideoFrameCallback(() => requestAnimationFrame(fireSwap));
      } else if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => requestAnimationFrame(fireSwap))
                   .catch(() => fireSwap());
      } else {
        setTimeout(fireSwap, 80);
      }
    };

    /* Make sure toVid is loaded with the target source. */
    const wantHref = new URL(targetSrc, window.location.href).href;
    if (toVid.src === wantHref && toVid.readyState >= 2) {
      playAndSwap();
    } else {
      const onLoaded = () => {
        toVid.removeEventListener("loadeddata", onLoaded);
        playAndSwap();
      };
      toVid.addEventListener("loadeddata", onLoaded);
      ensureSrc(toVid, targetSrc);
      /* Safety net in case loadeddata never fires (unlikely). */
      setTimeout(() => {
        toVid.removeEventListener("loadeddata", onLoaded);
        if (busyRef.current) playAndSwap();
      }, 1500);
    }
  };

  const goTo   = (i) => transitionTo(i);
  const goPrev = () => transitionTo(idxRef.current - 1);
  const goNext = () => transitionTo(idxRef.current + 1);

  /* ── Fullscreen toggle — targets the container so the play/pause
   * overlay stays reachable while fullscreen. Safari uses the webkit
   * vendor-prefixed APIs (different element + Element method names),
   * so handle both branches. ── */
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onChange = () => {
      const el = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(!!el && el === containerRef.current);
    };
    document.addEventListener("fullscreenchange",       onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange",       onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    const inFS = document.fullscreenElement || document.webkitFullscreenElement;
    if (inFS) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    }
  };

  /* ── Play / pause toggle ── */
  const togglePlay = () => {
    const vid = (activeRef.current === "a" ? aRef.current : bRef.current);
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
  };

  /* ── Touch-swipe handlers — swipe left = next, swipe right = previous ── */
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    /* require horizontal-dominant swipe of at least 50px */
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) goPrev(); else goNext();
  };

  /* Per-slot ended handlers — only react if event is from active slot. */
  const onEndedA = () => { if (activeRef.current === "a") transitionTo(idxRef.current + 1); };
  const onEndedB = () => { if (activeRef.current === "b") transitionTo(idxRef.current + 1); };

  const seg = VIDEO_SEGMENTS[idx];

  return (
    <>
      <style>{`
        /* Text on the LEFT (1fr), video on the RIGHT (58%) */
        .vg-grid { display: grid; grid-template-columns: 1fr 58%; gap: 2.5rem; align-items: start; }
        @media (max-width: 760px) { .vg-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
        /* Lock the left-column height so segment changes don't shift layout. */
        .vg-text-wrap { min-height: 360px; }
        @media (max-width: 760px) { .vg-text-wrap { min-height: 0; } }
        /* On mobile, show video first (above the text) */
        @media (max-width: 760px) {
          .vg-video-col { order: 0; }
          .vg-text-wrap { order: 1; }
        }
      `}</style>

      {/* Group tabs */}
      <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {[
          { label: "3 Ways to Copy a Sales Document", start: 0, range: [0, 2] },
          { label: "Smart Quantity Control",          start: 3, range: [3, 3] },
          { label: "AI Assistant and Feedback",       start: 4, range: [4, 4] },
        ].map(({ label, start, range }) => {
          const isActive = idx >= range[0] && idx <= range[1];
          return (
            <button key={label} onClick={() => goTo(start)} style={{
              padding: "0.45rem 1.2rem", borderRadius: 50, border: "none",
              background: isActive ? "#2f315a" : "rgba(47,49,90,0.08)",
              color: isActive ? "#fff" : "#6b6f91",
              fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s, color 0.2s",
            }}>{label}</button>
          );
        })}
      </div>

      <div className="vg-grid">
        {/* ── Left: text description (min-height locked to prevent layout jitter) ── */}
        <div className="vg-text-wrap" style={{ paddingTop: "0.25rem" }}>
          <div style={{ ...S.label, marginBottom: "0.35rem" }}>{seg.group}</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2f315a", lineHeight: 1.3, marginBottom: "0.6rem" }}>{seg.title}</h3>
          <p className="ks-body-text" style={{ color: "#6b6f91", fontStyle: "italic", marginBottom: "1.1rem" }}>{seg.desc}</p>
          {seg.steps.map((step, i) => (
            <StepRow key={i} n={i + 1} color="#c9a84c" className="step-row-compact">
              {step}
            </StepRow>
          ))}
          <div style={{ marginTop: "1.25rem", fontSize: "0.7rem", color: "#a8abcc", fontWeight: 500 }}>
            {idx + 1} / {VIDEO_SEGMENTS.length}
            {idx < VIDEO_SEGMENTS.length - 1
              ? <span style={{ marginLeft: 6 }}>— Next: {VIDEO_SEGMENTS[idx + 1].title}</span>
              : <span style={{ marginLeft: 6 }}>— End of guide</span>
            }
          </div>
        </div>

        {/* ── Right: dual-video crossfade ── */}
        <div className="vg-video-col">
          {/* 16 : 9 container — swipe left/right to navigate. Also the
              element we send fullscreen so the overlay buttons stay visible. */}
          <div
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position: "relative", width: "100%", paddingBottom: isFullscreen ? 0 : "56.25%", height: isFullscreen ? "100%" : 0, background: "#000", borderRadius: isFullscreen ? 0 : 14, overflow: "hidden", boxShadow: "0 12px 36px rgba(47,49,90,0.18)", touchAction: "pan-y" }}
          >
            {/* Loading spinner visible before video paints */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "1rem"
            }}>
               <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#c9a84c", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
               <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.05em" }}>Loading Video...</div>
            </div>

            {/* Slot A — instant z-index/opacity swap (no fade) so we never
                blend two videos against the black backdrop. requestVideoFrameCallback
                guarantees the new slot has painted before the swap, so the cut is
                imperceptible. */}
            <Vid
              ref={aRef}
              muted
              onEnded={onEndedA}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
                visibility: active === "a" ? "visible" : "hidden",
                zIndex: active === "a" ? 2 : 1,
              }}
            />
            {/* Slot B */}
            <Vid
              ref={bRef}
              muted
              onEnded={onEndedB}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
                visibility: active === "b" ? "visible" : "hidden",
                zIndex: active === "b" ? 2 : 1,
              }}
            />

            {/* ── Fullscreen toggle (bottom-left, mirrors play/pause style) ── */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              style={{
                position: "absolute", bottom: 12, left: 12, zIndex: 4,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(0,0,0,0.6)",
                color: "#ffffff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
            >
              {isFullscreen ? (
                /* exit-fullscreen — inward-facing corner brackets */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3v3a2 2 0 0 1-2 2H4M15 3v3a2 2 0 0 0 2 2h3M9 21v-3a2 2 0 0 0-2-2H4M15 21v-3a2 2 0 0 1 2-2h3"/>
                </svg>
              ) : (
                /* enter-fullscreen — outward-facing corner brackets */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/>
                </svg>
              )}
            </button>

            {/* ── Play / Pause toggle (bottom-right, same look as Hero pause) ── */}
            <button
              onClick={togglePlay}
              title={paused ? "Play" : "Pause"}
              aria-label={paused ? "Play video" : "Pause video"}
              style={{
                position: "absolute", bottom: 12, right: 12, zIndex: 4,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(0,0,0,0.6)",
                color: "#ffffff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
            >
              {paused
                ? <svg width="11" height="13" viewBox="0 0 12 14" fill="white"><polygon points="0,0 12,7 0,14"/></svg>
                : <svg width="11" height="13" viewBox="0 0 12 14" fill="white"><rect x="0" y="0" width="4" height="14"/><rect x="8" y="0" width="4" height="14"/></svg>
              }
            </button>
          </div>

          <CarouselProgress
            className="sales2do-video-progress"
            count={VIDEO_SEGMENTS.length}
            activeIndex={idx}
            fillProgress={videoRemaining}
            tone="light"
            onSelect={goTo}
            getTitle={(i) => VIDEO_SEGMENTS[i]?.title}
          />
        </div>

      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
 * Page
 * ══════════════════════════════════════════════════════════════ */
export default function Sales2DOPage({ onContact }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [licenseTab, setLicenseTab] = useState("online");
  const {
    hero = {},
    overview = {},
    outstanding = {},
    preset = {},
    settings = {},
    license = {},
    cta = {},
  } = sales2doContent;

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>

      <SectionSidebar sections={S2D_SECTIONS} themeColor="#c9a84c" />

      {/* ── Hero banner — shared ProductHero component (same look as AutoCount) ── */}
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          body={hero.body}
          iconSrc={hero.iconSrc || acPluginIcon}
          iconAlt={hero.iconAlt}
          primaryCta={{ label: hero.primaryLabel, href: hero.primaryHref, download: hero.primaryHref?.split("/").pop() }}
          secondaryCta={{ label: hero.secondaryLabel, href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">

      {/* ── Overview + Video Guide ── */}
      <div id="overview" className="product-app-section product-app-section-paper product-app-section-to-mist">
        <div className="content-wrap">
          <div style={{ ...S.label, marginBottom: "0.5rem" }}>{overview.label}</div>
          <h2 className="ks-section-title" style={{ marginBottom: "1.5rem" }}>{overview.heading}</h2>
          <VideoGuide />
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="outstanding" />
      </div>

      {/* ── Outstanding Delivery Order ── */}
      <div id="outstanding" className="product-app-section product-app-section-mist product-app-section-to-ice">
        <div className="content-wrap">
          <div className="ks-eyebrow">{outstanding.label}</div>
          <h2 className="ks-section-title">{outstanding.heading}</h2>

          <SectionRow image={outstanding.image || imgOutstanding} alt={outstanding.imageAlt} caption={outstanding.imageCaption}>
            <p className="ks-body-text" style={{ marginBottom: "1rem" }}><RichText>{outstanding.intro}</RichText></p>

            <h3 className="ks-card-title" style={{ marginTop: "1.5rem" }}>{outstanding.filterTitle}</h3>
            <BulletList items={richList(outstanding.filterItems)} />

            <h3 className="ks-card-title" style={{ marginTop: "1.75rem" }}>{outstanding.drillTitle}</h3>
            <p className="ks-body-text" style={{ marginBottom: "1rem" }}><RichText>{outstanding.drillIntro}</RichText></p>
            {(outstanding.tierCards || []).map(({ tier, title, color, items }) => (
              <div key={tier} style={{ background: "#f5f5f8", borderRadius: 14, padding: "1rem 1.2rem", marginBottom: "0.7rem", border: "1px solid rgba(47,49,90,0.09)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: color, color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>{tier}</span>
                  <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "0.95rem" }}>{title}</h3>
                </div>
                <BulletList items={richList(items)} />
              </div>
            ))}
          </SectionRow>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="preset" />
      </div>

      {/* ── Preset "Delivery?" in Stock Item Maintenance ── */}
      <div id="preset" className="product-app-section product-app-section-ice product-app-section-to-cloud">
        <div className="content-wrap">
          <div className="ks-eyebrow">{preset.label}</div>
          <h2 className="ks-section-title">{preset.heading}</h2>

          <SectionRow image={preset.image || imgPreset} alt={preset.imageAlt} caption={preset.imageCaption}>
            <p className="ks-body-text" style={{ marginBottom: "1rem" }}><RichText>{preset.intro}</RichText></p>
            {(preset.steps || []).map((step, i) => (
              <StepRow key={i} n={i + 1}><RichText>{step}</RichText></StepRow>
            ))}
            <BulletList items={richList(preset.bulletItems)} />
            <div style={{ marginTop: "1rem", padding: "0.85rem 1.1rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <p className="ks-list-text" style={{ margin: 0 }}>
                <RichText>{preset.note}</RichText>
              </p>
            </div>
          </SectionRow>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-cloud)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="settings" />
      </div>

      {/* ── Plugin Settings ── */}
      <div id="settings" className="product-app-section product-app-section-cloud product-app-section-to-warm">
        <div className="content-wrap">
          <div className="ks-eyebrow">{settings.label}</div>
          <h2 className="ks-section-title">{settings.heading}</h2>
          <p style={{ ...S.body }}><RichText>{settings.intro}</RichText></p>

          <SectionRow image={settings.image || imgSettings} alt={settings.imageAlt} caption={settings.imageCaption}>
            <h3 className="ks-card-title" style={{ marginBottom: "0.4rem" }}>{settings.transferTitle}</h3>
            <p className="ks-body-text" style={{ marginBottom: "0.9rem" }}><RichText>{settings.transferIntro}</RichText></p>
            <BulletList items={richList(settings.transferItems)} />
            <div style={{ marginTop: "0.5rem", marginBottom: "1.75rem", padding: "0.85rem 1.1rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <p className="ks-list-text" style={{ margin: 0 }}>
                <RichText>{settings.transferNote}</RichText>
              </p>
            </div>

            <h3 className="ks-card-title" style={{ marginBottom: "0.4rem" }}><RichText>{settings.deliveryTitle}</RichText></h3>
            <p className="ks-body-text" style={{ marginBottom: "0.9rem" }}><RichText>{settings.deliveryIntro}</RichText></p>
            <BulletList items={richList(settings.deliveryItems)} />
          </SectionRow>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-cloud)", "--section-to": "var(--ks-page-warm)" }}>
        <PageSectionDivider sections={S2D_SECTIONS} id="license" />
      </div>

      {/* ── Activate Plugin License ── */}
      <div id="license" className="product-app-section product-app-section-warm">
        <div className="content-wrap">
          <div className="ks-eyebrow">{license.label}</div>
          <h2 className="ks-section-title">{license.heading}</h2>

          {/* ── General License Info (Pricing, Trial, Transfer) ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3.5rem" }}>
            <div style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", border: "1px solid rgba(47,49,90,0.09)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#2f315a", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>Pricing</span>
                <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "1.05rem" }}>{license.pricingTitle}</h3>
              </div>
              <BulletList items={richList(license.pricingInfo)} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", border: "1px solid rgba(47,49,90,0.09)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#4a5090", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>Trial</span>
                  <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "1.05rem" }}>{license.trialTitle}</h3>
                </div>
                <p className="ks-body-text" style={{ margin: 0 }}><RichText>{license.trialInfo}</RichText></p>
              </div>
              <div style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", border: "1px solid rgba(47,49,90,0.09)", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#6b6f91", color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>Transfer</span>
                  <h3 className="ks-card-title" style={{ marginBottom: 0, fontSize: "1.05rem" }}>{license.transferTitle}</h3>
                </div>
                <p className="ks-body-text" style={{ margin: 0 }}><RichText>{license.transferInfo}</RichText></p>
              </div>
            </div>
          </div>

          <h3 className="ks-card-title" style={{ marginBottom: "1rem" }}>Activation Instructions</h3>

          {/* Tabs — only shown on tablet/mobile (hidden on desktop via CSS) */}
          <div className="license-tabs" style={{ display: "flex", background: "#e8e8f0", borderRadius: 50, padding: 4, gap: 2, marginBottom: "2rem", width: "fit-content" }}>
            {[["online", "Online Activation"], ["offline", "Offline Activation"]].map(([key, label]) => (
              <button key={key} onClick={() => setLicenseTab(key)} style={{
                fontSize: "0.82rem", fontWeight: 600, padding: "0.45rem 1.3rem", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: licenseTab === key ? "#2f315a" : "transparent",
                color: licenseTab === key ? "#fff" : "#6b6f91",
                transition: "background 0.2s, color 0.2s",
              }}>{label}</button>
            ))}
          </div>

          <style>{`
            /* Desktop: hide tabs; show both columns side-by-side. The
               !important here overrides the inline display set by the
               tab state, so both blocks render regardless of licenseTab. */
            @media (min-width: 1025px) {
              .license-tabs { display: none !important; }
              .license-grid {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 2.5rem !important;
                align-items: start !important;
              }
              .license-block-online,
              .license-block-offline {
                display: block !important;
                max-width: none !important;
              }
              .license-col-title { display: block !important; }
            }
          `}</style>

          <div className="license-grid">
            {/* ── Online block ── */}
            <div className="license-block-online" style={{ maxWidth: 680, display: licenseTab === "online" ? "block" : "none" }}>
              <h3 className="license-col-title ks-card-title" style={{ fontSize: "1.1rem", color: "#2f315a", marginBottom: "0.85rem", display: "none" }}>{license.onlineTitle}</h3>
              <ImgSlot src={license.onlineImage || imgLicenseOnline} alt={license.onlineAlt} caption={license.onlineCaption} />
              <p className="ks-body-text" style={{ margin: "1.25rem 0 1rem" }}><RichText>{license.onlineIntro}</RichText></p>
              {(license.onlineSteps || []).map((step, i) => (
                <StepRow key={i} n={i + 1}><RichText>{step}</RichText></StepRow>
              ))}
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p className="ks-list-text">
                  <RichText>{license.onlineNote}</RichText>
                </p>
              </div>
            </div>

            {/* ── Offline block ── */}
            <div className="license-block-offline" style={{ maxWidth: 680, display: licenseTab === "offline" ? "block" : "none" }}>
              <h3 className="license-col-title ks-card-title" style={{ fontSize: "1.1rem", color: "#2f315a", marginBottom: "0.85rem", display: "none" }}>{license.offlineTitle}</h3>
              <ImgSlot src={license.offlineImage || imgLicenseOffline} alt={license.offlineAlt} caption={license.offlineCaption} />
              <p className="ks-body-text" style={{ margin: "1.25rem 0 1rem" }}><RichText>{license.offlineIntro}</RichText></p>
              {(license.offlineSteps || []).map((step, i) => (
                <StepRow key={i} n={i + 1}><RichText>{step}</RichText></StepRow>
              ))}
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p className="ks-list-text">
                  <RichText>{license.offlineNote}</RichText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── CTA ── */}
      <EnquireNowCTA
        heading={cta.heading}
        body={cta.body}
        buttons={[{ label: cta.buttonLabel, href: WA_LINK, className: "enquire-now-btn" }]}
      />

      <Footer />
      </main>
      {/* <AIChatbot app="Sales2DO" /> */}
    </div>
  );
}
