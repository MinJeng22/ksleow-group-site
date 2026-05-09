import { useCallback, useEffect, useRef, useState } from "react";
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
 * VideoGuide — dual-buffer crossfade player
 *
 * Uses two <video> elements layered on top of each other.
 * While segment N is playing, segment N+1 is silently preloaded
 * in the background. On transition, we crossfade opacity so the
 * viewer never sees a black frame between segments.
 * ══════════════════════════════════════════════════════════════ */
function VideoGuide() {
  const [idx,     setIdx]     = useState(0);
  const [swap,    setSwap]    = useState(false);   // false → A on top, true → B on top
  const [textIn,  setTextIn]  = useState(true);

  const aRef = useRef(null);
  const bRef = useRef(null);
  /* Mutable refs — kept in sync with state — for use inside callbacks
   * without stale-closure issues. */
  const idxRef  = useRef(0);
  const swapRef = useRef(false);
  idxRef.current  = idx;
  swapRef.current = swap;

  const topRef    = () => swapRef.current ? bRef : aRef;   // currently visible
  const bottomRef = () => swapRef.current ? aRef : bRef;   // preloading / hidden

  /* Load a segment index into a video element (without playing). */
  const preloadInto = useCallback((videoEl, segIdx) => {
    if (!videoEl) return;
    if (videoEl._loadedSeg === segIdx) return;      // already loaded
    videoEl.src    = VIDEO_SEGMENTS[segIdx].src;
    videoEl.preload = "auto";
    videoEl.load();
    videoEl._loadedSeg = segIdx;
  }, []);

  /* Initial mount: A plays seg 0; after 800 ms preload seg 1 into B. */
  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a) return;
    a.src    = VIDEO_SEGMENTS[0].src;
    a.preload = "auto";
    a.load();
    a._loadedSeg = 0;
    a.play().catch(() => {});
    const t = setTimeout(() => preloadInto(b, 1), 800);
    return () => clearTimeout(t);
  }, [preloadInto]);

  /* Transition to segment toIdx with a crossfade. */
  const goTo = useCallback((toIdx) => {
    const nextVid = bottomRef().current;
    if (!nextVid) return;

    /* Ensure the target segment is loaded. */
    if (nextVid._loadedSeg !== toIdx) preloadInto(nextVid, toIdx);

    let fired = false;
    const doSwap = () => {
      if (fired) return;
      fired = true;
      clearTimeout(fallback);
      /* Reset to start and play. */
      nextVid.currentTime = 0;
      nextVid.play().catch(() => {});
      /* Crossfade. */
      setSwap(s => !s);
      setIdx(toIdx);
      /* Text fade-in. */
      setTextIn(false);
      setTimeout(() => setTextIn(true), 90);
      /* 600 ms after swap, preload the next-next segment on the now-idle slot.
       * By then swapRef.current has been updated by the re-render. */
      setTimeout(() => {
        const nextNextIdx = (toIdx + 1) % VIDEO_SEGMENTS.length;
        const idle = swapRef.current ? aRef.current : bRef.current;
        preloadInto(idle, nextNextIdx);
      }, 600);
    };

    /* If first frame is ready — swap immediately. Otherwise wait for it. */
    if (nextVid.readyState >= 2 /* HAVE_CURRENT_DATA */) {
      doSwap();
    } else {
      nextVid.addEventListener("canplay", doSwap, { once: true });
    }
    const fallback = setTimeout(doSwap, 1200);  // safety net
  }, [preloadInto]); // eslint-disable-line

  /* onEnded — only react if the event comes from the active slot. */
  const onEnded = useCallback((fromA) => {
    const activeIsA = !swapRef.current;
    if (fromA !== activeIsA) return;
    goTo((idxRef.current + 1) % VIDEO_SEGMENTS.length);
  }, [goTo]);

  const seg = VIDEO_SEGMENTS[idx];

  return (
    <>
      <style>{`
        .vg-grid { display: grid; grid-template-columns: 58% 1fr; gap: 2.5rem; align-items: start; }
        @media (max-width: 760px) { .vg-grid { grid-template-columns: 1fr; gap: 1.25rem; } }
        .vg-text { transition: opacity 0.28s ease, transform 0.28s ease; }
        .vg-in   { opacity: 1; transform: translateY(0); }
        .vg-out  { opacity: 0; transform: translateY(5px); }
      `}</style>

      {/* Group tabs */}
      <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {[
          { label: "3 Ways to Copy a Sales Document", start: 0 },
          { label: "AI Assistant and Feedback",       start: 3 },
        ].map(({ label, start }) => {
          const active = start === 0 ? idx <= 2 : idx === 3;
          return (
            <button key={label} onClick={() => goTo(start)} style={{
              padding: "0.45rem 1.2rem", borderRadius: 50, border: "none",
              background: active ? "#2f315a" : "rgba(47,49,90,0.08)",
              color: active ? "#fff" : "#6b6f91",
              fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s, color 0.2s",
            }}>{label}</button>
          );
        })}
      </div>

      <div className="vg-grid">
        {/* ── Left: dual-buffer video ── */}
        <div>
          {/* 16 : 9 container */}
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", height: 0, background: "#000", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 36px rgba(47,49,90,0.18)" }}>
            {/* Slot A */}
            <video
              ref={aRef} muted playsInline
              onEnded={() => onEnded(true)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: swap ? 0 : 1, transition: "opacity 0.4s ease" }}
            />
            {/* Slot B */}
            <video
              ref={bRef} muted playsInline
              onEnded={() => onEnded(false)}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: swap ? 1 : 0, transition: "opacity 0.4s ease" }}
            />
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

        {/* ── Right: text description ── */}
        <div className={`vg-text ${textIn ? "vg-in" : "vg-out"}`} style={{ paddingTop: "0.25rem" }}>
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
      <div style={{ background: "#2f315a", paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="content-wrap">
          <button onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >← Back</button>

          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flex: 1, minWidth: 280 }}>
              <div style={{ width: 76, height: 76, borderRadius: 18, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }}>
                <img src={acPluginIcon} alt="Sales2DO Plugin" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>AutoCount Plugin</div>
                <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "0.9rem" }}>Sales2DO Plugin</h1>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 580, marginBottom: "1.5rem" }}>
                  Bridges the gap for companies operating with a Sales-to-DO workflow. Generate Delivery Orders directly from existing Invoices or Cash Sales.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/Sales2DO.app" download="Sales2DO.app"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#c9a84c", color: "#1e2040", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Now
                  </a>
                  <a href={WA_LINK} target="_blank" rel="noreferrer"
                    style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
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

      {/* ── Overview + Video Guide (merged) ── */}
      <div id="overview" style={{ background: "#fff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Overview</div>
          <h2 style={S.h2}>Plugin Purpose</h2>
          <p style={{ ...S.body, maxWidth: 780, marginBottom: "3rem" }}>
            In AutoCount Accounting's standard business workflow, the process typically flows from{" "}
            <strong>Delivery Orders (DO)</strong> to <strong>Sales</strong> (Invoices or Cash Sales).
            However, for companies that operate with a <strong>Sales-to-DO workflow</strong>, the
            Sales2DO plugin bridges this gap. It enables users to generate a DO directly from existing
            Invoices or Cash Sales via integrated <em>"Copy to DO"</em> and{" "}
            <em>"Copy from Invoice / Cash Sale"</em> functions.
          </p>

          <div style={{ ...S.label, marginBottom: "0.5rem" }}>Video Tutorial</div>
          <h3 style={{ ...S.h3, fontSize: "1.2rem", marginBottom: "0.5rem" }}>See It In Action</h3>
          <p style={{ ...S.body, color: "#6b6f91", maxWidth: 600, marginBottom: "1.75rem" }}>
            Videos play automatically and advance to the next segment — no controls needed.
          </p>
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

          <div style={{ display: "flex", background: "#e8e8f0", borderRadius: 50, padding: 4, gap: 2, marginBottom: "2rem", width: "fit-content" }}>
            {[["online", "Online Activation"], ["offline", "Offline Activation"]].map(([key, label]) => (
              <button key={key} onClick={() => setLicenseTab(key)} style={{
                fontSize: "0.82rem", fontWeight: 600, padding: "0.45rem 1.3rem", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: licenseTab === key ? "#2f315a" : "transparent",
                color: licenseTab === key ? "#fff" : "#6b6f91",
                transition: "background 0.2s, color 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {licenseTab === "online" && (
            <div style={{ maxWidth: 680 }}>
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
          )}

          {licenseTab === "offline" && (
            <div style={{ maxWidth: 680 }}>
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
          )}
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
      <AIChatbot />
    </div>
  );
}
