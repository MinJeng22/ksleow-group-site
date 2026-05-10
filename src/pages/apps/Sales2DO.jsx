import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { WA_LINK } from "../../constants/contact.js";
import AIChatbot from "../../components/AIChatbot.jsx";
import acPluginIcon     from "../../assets/images/apps/ac-plugin-icon.png";
import imgOutstanding   from "../../assets/images/apps/sales2do/outstanding.png";
import imgSettings      from "../../assets/images/apps/sales2do/settings.png";
import imgLicenseOnline  from "../../assets/images/apps/sales2do/license-online.png";
import imgLicenseOffline from "../../assets/images/apps/sales2do/license-offline.png";

/* Sales2DO sidebar anchor items */
const S2D_SIDEBAR_ITEMS = [
  { id: "overview",    label: "Overview"       },
  { id: "outstanding", label: "Outstanding DO" },
  { id: "settings",    label: "Settings"       },
  { id: "license",     label: "License"        },
];

/* ── Video segments ── */
const VIDEO_SEGMENTS = [
  {
    src: "/videos/sales2do/copy-to-do-method1.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: "Method 1 — Via Right-Click Menu",
    desc: "The quickest method when working in the listing screen.",
    steps: [
      <span key="a">Go to <strong>Sales → Invoice</strong> or <strong>Sales → Cash Sale</strong> to open the listing screen.</span>,
      <span key="b">Locate the document you wish to copy.</span>,
      <span key="c">Right-click on the row and select <strong>"Copy to a new Delivery Order"</strong>.</span>,
      <span key="d">A new Delivery Order entry screen opens with all details pre-filled.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method2.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 2 — Via the "Copy To" Icon',
    desc: "Works when you already have a document open in View Mode.",
    steps: [
      <span key="a">Open any Invoice or Cash Sale document in <strong>View Mode</strong>.</span>,
      <span key="b">On the top ribbon under the <strong>Home</strong> tab, find the <strong>Copy</strong> group.</span>,
      <span key="c">Click <strong>"Copy to a new Delivery Order"</strong>.</span>,
      <span key="d">A Delivery Order is generated and pre-filled from the viewed document.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method3.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 3 — Via "Copy From" in DO Entry',
    desc: "Start a new Delivery Order first, then pull in items from a sales document.",
    steps: [
      <span key="a">Go to <strong>Sales → Delivery Order</strong> and create a new entry.</span>,
      <span key="b">On the top ribbon, click <strong>"Copy from Invoice"</strong> or <strong>"Copy from Cash Sale"</strong>.</span>,
      <span key="c">A search window appears — select the source document(s) and click <strong>OK</strong>.</span>,
      <span key="d">Items are automatically populated into the Delivery Order.</span>,
    ],
  },
  {
    src: "/videos/sales2do/ks-omni.mp4",
    group: "AI Assistant and Feedback",
    title: "KS-Omni — Built-in AI Support Portal",
    desc: "Get instant technical assistance or send feedback directly to the KSL team.",
    steps: [
      <span key="a">Navigate to <strong>Sales2DO → AI Assistant and Feedback</strong> from the top navigation bar.</span>,
      <span key="b">The KS-Omni portal opens in your browser.</span>,
      <span key="c">Ask the AI any question — error messages, configuration steps, usage tips.</span>,
      <span key="d">Use the <strong>Feedback</strong> tab to submit suggestions or bug reports to the KSL team.</span>,
    ],
  },
];

/* ── Shared styles ── */
const S = {
  label: { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" },
  h2:    { fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" },
  h3:    { fontSize: "1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.6rem" },
  body:  { fontSize: "0.92rem", color: "#555", lineHeight: 1.82 },
  section: { padding: "4rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" },
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
          ? <img src={src} alt={alt || ""} style={{ width: "100%", display: "block", maxHeight, objectFit: "contain", objectPosition: "top" }} />
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

function StepNum({ n, color = "#2f315a" }) {
  return (
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: color, color: color === "#2f315a" ? "#fff" : "#1e2040", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, flexShrink: 0 }}>{n}</div>
  );
}
function Step({ n, children, gold }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.9rem" }}>
      <StepNum n={n} color={gold ? "#c9a84c" : "#2f315a"} />
      <div style={{ ...S.body, paddingTop: 3, flex: 1 }}>{children}</div>
    </div>
  );
}
function BulletList({ items }) {
  return (
    <ul style={{ paddingLeft: "1.1rem", margin: "0.5rem 0" }}>
      {items.map((item, i) => <li key={i} style={{ ...S.body, marginBottom: "0.4rem" }}>{item}</li>)}
    </ul>
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

  const aRef = useRef(null);
  const bRef = useRef(null);
  /* Mutable mirrors for stale-closure-free callback access. */
  const idxRef    = useRef(0);
  const activeRef = useRef("a");
  const busyRef   = useRef(false);
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
        .vg-grid { display: grid; grid-template-columns: 58% 1fr; gap: 2.5rem; align-items: start; }
        @media (max-width: 760px) { .vg-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
        /* Lock the right-column height so segment changes don't shift layout. */
        .vg-text-wrap { min-height: 360px; }
        @media (max-width: 760px) { .vg-text-wrap { min-height: 0; } }
      `}</style>

      {/* Group tabs */}
      <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {[
          { label: "3 Ways to Copy a Sales Document", start: 0 },
          { label: "AI Assistant and Feedback",       start: 3 },
        ].map(({ label, start }) => {
          const isActive = start === 0 ? idx <= 2 : idx === 3;
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
        {/* ── Left: dual-video crossfade ── */}
        <div>
          {/* 16 : 9 container — swipe left/right to navigate */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ position: "relative", width: "100%", paddingBottom: "56.25%", height: 0, background: "#000", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 36px rgba(47,49,90,0.18)", touchAction: "pan-y" }}
          >
            {/* Slot A — instant z-index/opacity swap (no fade) so we never
                blend two videos against the black backdrop. requestVideoFrameCallback
                guarantees the new slot has painted before the swap, so the cut is
                imperceptible. */}
            <video
              ref={aRef}
              muted playsInline
              onEnded={onEndedA}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
                visibility: active === "a" ? "visible" : "hidden",
                zIndex: active === "a" ? 2 : 1,
              }}
            />
            {/* Slot B */}
            <video
              ref={bRef}
              muted playsInline
              onEnded={onEndedB}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "contain",
                visibility: active === "b" ? "visible" : "hidden",
                zIndex: active === "b" ? 2 : 1,
              }}
            />

            {/* ── Play / Pause toggle (bottom-right, same look as Hero pause) ── */}
            <button
              onClick={togglePlay}
              title={paused ? "Play" : "Pause"}
              aria-label={paused ? "Play video" : "Pause video"}
              style={{
                position: "absolute", bottom: 12, right: 12, zIndex: 4,
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
              onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            >
              {paused
                ? <svg width="11" height="13" viewBox="0 0 12 14" fill="white"><polygon points="0,0 12,7 0,14"/></svg>
                : <svg width="11" height="13" viewBox="0 0 12 14" fill="white"><rect x="0" y="0" width="4" height="14"/><rect x="8" y="0" width="4" height="14"/></svg>
              }
            </button>
          </div>

          {/* Segment dot indicators */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "0.9rem", alignItems: "center" }}>
            {VIDEO_SEGMENTS.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} title={s.title}
                style={{ width: i === idx ? 22 : 8, height: 8, borderRadius: 4, border: "none", background: i === idx ? "#c9a84c" : "rgba(47,49,90,0.2)", cursor: "pointer", padding: 0, transition: "width 0.3s, background 0.3s" }}
              />
            ))}
          </div>
        </div>

        {/* ── Right: text description (min-height locked to prevent layout jitter,
             no animations — content swaps instantly with the video) ── */}
        <div className="vg-text-wrap" style={{ paddingTop: "0.25rem" }}>
          <div style={{ ...S.label, marginBottom: "0.35rem" }}>{seg.group}</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2f315a", lineHeight: 1.3, marginBottom: "0.6rem" }}>{seg.title}</h3>
          <p style={{ ...S.body, color: "#6b6f91", fontStyle: "italic", marginBottom: "1.1rem" }}>{seg.desc}</p>
          {seg.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.8rem" }}>
              <StepNum n={i + 1} color="#c9a84c" />
              <div style={{ ...S.body, paddingTop: 4, flex: 1 }}>{step}</div>
            </div>
          ))}
          <div style={{ marginTop: "1.25rem", fontSize: "0.7rem", color: "#a8abcc", fontWeight: 500 }}>
            {idx + 1} / {VIDEO_SEGMENTS.length}
            {idx < VIDEO_SEGMENTS.length - 1
              ? <span style={{ marginLeft: 6 }}>— Next: {VIDEO_SEGMENTS[idx + 1].title}</span>
              : <span style={{ marginLeft: 6 }}>— End of guide</span>
            }
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
 * Page
 * ══════════════════════════════════════════════════════════════ */
export default function Sales2DOPage({ onContact }) {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [licenseTab, setLicenseTab] = useState("online");

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      <SectionSidebar items={S2D_SIDEBAR_ITEMS} />

      {/* ── Hero ── */}
      <div className="product-hero" style={{ background: "#2f315a", paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="content-wrap">
          <button className="product-hero-back" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >← Back</button>

          <div className="product-hero-row" style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            <div className="product-hero-textgroup" style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flex: 1, minWidth: 280 }}>
              <div className="product-hero-icon" style={{ width: 76, height: 76, borderRadius: 18, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }}>
                <img src={acPluginIcon} alt="Sales2DO Plugin" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div className="product-hero-eyebrow" style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>AutoCount Plugin</div>
                <h1 className="product-hero-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "0.9rem" }}>Sales2DO Plugin</h1>
                <p className="product-hero-body" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 580, marginBottom: "1.5rem" }}>
                  In AutoCount Accounting's standard business workflow, the process typically flows from Delivery Orders (DO) to Sales (Invoices or Cash Sales). However, for companies that operate with a Sales-to-DO workflow, the Sales2DO plugin bridges this gap. It enables users to generate a DO directly from existing Invoices or Cash Sales via integrated "Copy to DO" and "Copy from Invoice / Cash Sale" functions.
                </p>
                <div className="product-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/Sales2DO.app" download="Sales2DO.app"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "#c9a84c", color: "#1e2040", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Now
                  </a>
                  <a href={WA_LINK} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >WhatsApp Us</a>
                </div>
              </div>
            </div>
            <div className="product-hero-image" style={{ flex: "0 1 460px", maxWidth: 500 }}>
              <img src={imgOutstanding} alt="Sales2DO Outstanding Delivery Order dashboard" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Overview + Video Guide ── */}
      <div id="overview" style={{ background: "#fff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={{ ...S.label, marginBottom: "0.5rem" }}>Video Tutorial</div>
          <h2 style={{ ...S.h2, marginBottom: "1.5rem" }}>See It In Action</h2>
          <VideoGuide />
        </div>
      </div>

      {/* ── Outstanding Delivery Order ── */}
      <div id="outstanding" style={{ background: "#f5f5f8", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Monitoring</div>
          <h2 style={S.h2}>Outstanding Delivery Order</h2>
          <ImgSlot src={imgOutstanding} alt="Outstanding Delivery Order dashboard" caption="Outstanding Delivery Order — 3-tier drill-down dashboard" />
          <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>
            To monitor which Invoices or Cash Sales have been transferred to Delivery Orders, and to
            track exact outstanding balances (dynamically adjusted by Credit Notes and Delivery Returns),
            utilize the <strong>Outstanding Delivery Order</strong> dashboard.
          </p>

          <h3 style={{ ...S.h3, marginTop: "1.5rem" }}>How to Use the Dashboard</h3>
          <Step n={1}>Navigate to <strong>Sales2DO → Outstanding Delivery Order</strong> from the top navigation bar.</Step>
          <Step n={2}>Use the <strong>Date Range</strong> and <strong>Keyword</strong> filters to locate specific documents quickly.</Step>
          <Step n={3}>Toggle the checkboxes at the top to filter between Invoices or Cash Sales.</Step>
          <Step n={4}>Uncheck <strong>"Show Completed Delivery Order"</strong> to hide fully delivered sales and focus on pending items.</Step>

          <h3 style={{ ...S.h3, marginTop: "1.75rem" }}>The 3-Tier Drill-Down Grid</h3>
          <p style={{ ...S.body, marginBottom: "1rem" }}>
            Expand the <strong>+</strong> icon on any row to dive deeper into the fulfillment process.
          </p>
          {[
            { tier: "Tier 1", color: "#2f315a", title: "Master Document (Overview)", items: [
              "Displays the source Invoice or Cash Sale and its overall Delivery Status (Pending, Partial Delivery, or Full Delivery).",
              "Double-click any row to instantly open the source document.",
            ]},
            { tier: "Tier 2", color: "#4a5090", title: "Item Codes (Quantity Breakdown)", items: [
              "Original Qty — The initial quantity billed in the sales document.",
              "CN Returned Qty — Quantity credited or cancelled via Credit Notes.",
              "Net Original Qty — Actual required delivery quantity (Original Qty − CN Returned Qty).",
              "Delivered Qty — Quantity already transferred to Delivery Orders.",
              "DR Returned Qty — Quantity returned by the customer via Delivery Returns.",
              "Outstanding Qty — Final remaining balance pending delivery.",
            ]},
            { tier: "Tier 3", color: "#6b6f91", title: "Copied History (Delivery Orders)", items: [
              "Shows the specific Delivery Orders generated for each item — DO Number, DO Date, Delivered Qty, and DR Returned Qty.",
              "Double-click any record to instantly open the target Delivery Order document.",
            ]},
          ].map(({ tier, title, color, items }) => (
            <div key={tier} style={{ background: "#fff", borderRadius: 14, padding: "1.25rem 1.4rem", marginBottom: "0.85rem", border: "1px solid rgba(47,49,90,0.09)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem" }}>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: color, color: "#fff", padding: "0.2rem 0.65rem", borderRadius: 50 }}>{tier}</span>
                <h3 style={{ ...S.h3, marginBottom: 0 }}>{title}</h3>
              </div>
              <BulletList items={items} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Plugin Settings ── */}
      <div id="settings" style={{ background: "#fff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Configuration</div>
          <h2 style={S.h2}>Sales2DO Plugin Settings</h2>
          <p style={{ ...S.body, marginBottom: "1.5rem" }}>To configure, go to <strong>Sales2DO → Plugin Settings</strong>.</p>
          <ImgSlot src={imgSettings} alt="Plugin Settings screen" caption="Sales2DO → Plugin Settings" />

          <div style={{ marginTop: "2rem", marginBottom: "1.75rem" }}>
            <h3 style={S.h3}>Insert Doc No. in Sales and Delivery Order</h3>
            <p style={{ ...S.body, marginBottom: "0.9rem" }}>Flexible settings to match your company's referencing preferences.</p>
            <BulletList items={[
              'Sales Prefix / Prefix Text — Define the text that precedes the document number (e.g., "Copy To " results in "Copy To DO-00001").',
              "Sales Master/Detail Target — Select the UDF or standard field in the Invoice/Cash Sale where the resulting DO number will be saved.",
              "DO Master/Detail Target — Select the UDF or standard field in the Delivery Order where the source Invoice/Cash Sale number will be saved.",
            ]} />
          </div>

          <div>
            <h3 style={S.h3}>Enable Smart Copy Control</h3>
            <p style={{ ...S.body, marginBottom: "0.9rem" }}>This core feature prevents accidental over-delivery.</p>
            <Step n={1}>Check <strong>"Enable Smart Copy Control"</strong> in the settings.</Step>
            <Step n={2}>When copying a partially copied document, the system calculates the remaining balance and <strong>only loads the outstanding quantity</strong> into the new Delivery Order.</Step>
            <Step n={3}>If a document has already been fully copied, the system will prompt a warning asking if you still intend to proceed.</Step>
          </div>
        </div>
      </div>

      {/* ── Activate Plugin License ── */}
      <div id="license" style={{ background: "#f5f5f8", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Activation</div>
          <h2 style={S.h2}>Activate Plugin License</h2>

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
              <h3 className="license-col-title" style={{ ...S.h3, fontSize: "1.1rem", color: "#2f315a", marginBottom: "0.85rem", display: "none" }}>Online Activation</h3>
              <ImgSlot src={imgLicenseOnline} alt="License Control — Get Online button" caption="Online Activation — License Control screen" />
              <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>Ensure your device is connected to the internet, then follow these steps:</p>
              <Step n={1}>KSL Business Solutions will inform you via WhatsApp or Email once your license is ready.</Step>
              <Step n={2}>Open AutoCount Accounting and navigate to the Sales2DO plugin from the navigation bar.</Step>
              <Step n={3}>Go to <strong>License Control</strong>, then click <strong>"Get Online"</strong>. Your license will be activated automatically.</Step>
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p style={{ fontSize: "0.83rem", color: "#6b6f91", lineHeight: 1.65 }}>
                  💡 Contact KSL via WhatsApp at{" "}
                  <a href="https://wa.me/60179052323" target="_blank" rel="noreferrer" style={{ color: "#2f315a", fontWeight: 600 }}>017-905 2323</a>{" "}
                  or email <a href="mailto:support@ksleow.com.my" style={{ color: "#2f315a", fontWeight: 600 }}>support@ksleow.com.my</a> once you are ready to activate.
                </p>
              </div>
            </div>

            {/* ── Offline block ── */}
            <div className="license-block-offline" style={{ maxWidth: 680, display: licenseTab === "offline" ? "block" : "none" }}>
              <h3 className="license-col-title" style={{ ...S.h3, fontSize: "1.1rem", color: "#2f315a", marginBottom: "0.85rem", display: "none" }}>Offline Activation</h3>
              <ImgSlot src={imgLicenseOffline} alt="License Control — Machine ID field" caption="Offline Activation — copy the Machine ID shown here" />
              <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>For PCs without internet access, use offline activation:</p>
              <Step n={1}>Open AutoCount Accounting and navigate to the Sales2DO plugin from the navigation bar.</Step>
              <Step n={2}>Go to <strong>License Control</strong>. A unique <strong>Machine ID</strong> will be displayed. Copy or note this down.</Step>
              <Step n={3}>Send the Machine ID to KSL Business Solutions via WhatsApp or Email.</Step>
              <Step n={4}>We will generate an offline activation key and send it back to you.</Step>
              <Step n={5}>Enter the key in the <strong>Sales2DO Activation Key</strong> field and click <strong>Activate</strong>.</Step>
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p style={{ fontSize: "0.83rem", color: "#6b6f91", lineHeight: 1.65 }}>
                  💡 WhatsApp:{" "}
                  <a href="https://wa.me/60179052323" target="_blank" rel="noreferrer" style={{ color: "#2f315a", fontWeight: 600 }}>017-905 2323</a>
                  {"  ·  "}Email:{" "}
                  <a href="mailto:support@ksleow.com.my" style={{ color: "#2f315a", fontWeight: 600 }}>support@ksleow.com.my</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: "#2f315a", padding: "4rem 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#fff", marginBottom: "0.75rem" }}>Interested in the Sales2DO plugin?</h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 1.75rem" }}>
            Contact KSL Business Solutions for pricing, installation, and support across Pahang.
          </p>
          <button onClick={onContact}
            style={{ background: "#c9a84c", color: "#1e2040", padding: "0.85rem 2.5rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >Enquire Now</button>
        </div>
      </div>

      <Footer />
      <AIChatbot app="Sales2DO" />
    </div>
  );
}
