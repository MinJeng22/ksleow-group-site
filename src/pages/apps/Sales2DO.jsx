import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { WA_LINK } from "../../constants/contact.js";
import AIChatbot from "../../components/AIChatbot.jsx";
import acPluginIcon from "../../assets/images/apps/ac-plugin-icon.png";
import imgOutstanding from "../../assets/images/apps/sales2do/outstanding.png";

/* Sales2DO sidebar anchor items */
const S2D_SIDEBAR_ITEMS = [
  { id: "video-guide", label: "Video Guide"    },
  { id: "overview",    label: "Overview"       },
  { id: "outstanding", label: "Outstanding DO" },
  { id: "settings",    label: "Settings"       },
  { id: "license",     label: "License"        },
];

/* ── Video segment data ── */
const VIDEO_SEGMENTS = [
  {
    src: "/videos/sales2do/copy-to-do-method1.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: "Method 1 — Via Right-Click Menu",
    desc: "The quickest method when working in the listing screen. Right-click directly on any row.",
    steps: [
      <span key="1a">Go to <strong>Sales → Invoice</strong> or <strong>Sales → Cash Sale</strong> to open the listing screen.</span>,
      <span key="1b">Locate the document you wish to copy.</span>,
      <span key="1c">Right-click on the row and select <strong>"Copy to a new Delivery Order"</strong>.</span>,
      <span key="1d">A new Delivery Order entry screen opens with all details pre-filled.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method2.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 2 — Via the "Copy To" Icon',
    desc: "Works when you already have a document open in View Mode and want to convert it.",
    steps: [
      <span key="2a">Open any Invoice or Cash Sale document in <strong>View Mode</strong>.</span>,
      <span key="2b">On the top ribbon under the <strong>Home</strong> tab, locate the <strong>Copy</strong> group.</span>,
      <span key="2c">Click <strong>"Copy to a new Delivery Order"</strong>.</span>,
      <span key="2d">A Delivery Order is generated and pre-filled from the viewed document.</span>,
    ],
  },
  {
    src: "/videos/sales2do/copy-to-do-method3.mp4",
    group: "3 Ways to Copy a Sales Document",
    title: 'Method 3 — Via the "Copy From" Icon in DO Entry',
    desc: "Start a new Delivery Order first, then pull in items from one or multiple sales documents.",
    steps: [
      <span key="3a">Go to <strong>Sales → Delivery Order</strong> and create a new entry.</span>,
      <span key="3b">On the top ribbon, click <strong>"Copy from Invoice"</strong> or <strong>"Copy from Cash Sale"</strong>.</span>,
      <span key="3c">A search window appears — select the source document(s) and click <strong>OK</strong>.</span>,
      <span key="3d">Items are automatically populated into the Delivery Order.</span>,
    ],
  },
  {
    src: "/videos/sales2do/ks-omni.mp4",
    group: "AI Assistant and Feedback",
    title: "KS-Omni — Built-in AI Support Portal",
    desc: "If you're facing an issue or have a suggestion, Sales2DO comes with a built-in AI and feedback portal.",
    steps: [
      <span key="4a">Navigate to <strong>Sales2DO → AI Assistant and Feedback</strong> from the top navigation bar.</span>,
      <span key="4b">The KS-Omni portal opens in your browser.</span>,
      <span key="4c">Ask the AI assistant any question — error messages, configuration steps, or usage tips.</span>,
      <span key="4d">Use the <strong>Feedback</strong> tab to send suggestions or bug reports directly to the KSL team.</span>,
    ],
  },
];

/* ── Shared styles ── */
const S = {
  label: {
    fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem",
  },
  h2: {
    fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 700,
    color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem",
  },
  h3: { fontSize: "1rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.6rem" },
  body: { fontSize: "0.92rem", color: "#555", lineHeight: 1.82 },
  section: { padding: "4rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" },
};

function StepNum({ n, color = "#2f315a" }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: color, color: color === "#2f315a" ? "#ffffff" : "#1e2040",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.78rem", fontWeight: 700, flexShrink: 0,
    }}>{n}</div>
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
      {items.map((item, i) => (
        <li key={i} style={{ ...S.body, marginBottom: "0.4rem" }}>{item}</li>
      ))}
    </ul>
  );
}

/* ── Video Guide component ── */
function VideoGuide() {
  const [idx, setIdx]           = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const videoRef = useRef(null);
  const seg = VIDEO_SEGMENTS[idx];

  /* Reload + autoplay whenever the active segment changes */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.load();
    v.play().catch(() => { /* Autoplay blocked by browser policy — OK */ });
    /* Fade text in on segment change */
    setTextVisible(false);
    const t = setTimeout(() => setTextVisible(true), 80);
    return () => clearTimeout(t);
  }, [idx]);

  const next = () => setIdx(i => (i + 1) % VIDEO_SEGMENTS.length);

  /* Which group tab is active? */
  const isCopyGroup = idx <= 2;

  return (
    <>
      <style>{`
        .vg-layout {
          display: grid;
          grid-template-columns: 58% 1fr;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width: 760px) {
          .vg-layout { grid-template-columns: 1fr; gap: 1.5rem; }
        }
        .vg-text-panel {
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .vg-text-visible   { opacity: 1;   transform: translateY(0); }
        .vg-text-invisible { opacity: 0;   transform: translateY(6px); }
      `}</style>

      {/* Group tabs */}
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
        {[
          { label: "3 Ways to Copy a Sales Document", start: 0 },
          { label: "AI Assistant and Feedback",       start: 3 },
        ].map(({ label, start }) => {
          const active = (start === 0 ? isCopyGroup : !isCopyGroup);
          return (
            <button key={label} onClick={() => setIdx(start)} style={{
              padding: "0.45rem 1.2rem", borderRadius: 50, border: "none",
              background: active ? "#2f315a" : "rgba(47,49,90,0.08)",
              color: active ? "#ffffff" : "#6b6f91",
              fontSize: "0.82rem", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.2s, color 0.2s",
            }}>{label}</button>
          );
        })}
      </div>

      <div className="vg-layout">
        {/* ── Left: video player ── */}
        <div>
          <div style={{
            borderRadius: 14, overflow: "hidden",
            background: "#000",
            boxShadow: "0 12px 36px rgba(47,49,90,0.16)",
            lineHeight: 0,
          }}>
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              onEnded={next}
              style={{ width: "100%", display: "block", maxHeight: 480, objectFit: "contain" }}
            >
              <source src={seg.src} type="video/mp4" />
            </video>
          </div>

          {/* Segment dot indicators — click to jump */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "1rem", alignItems: "center" }}>
            {VIDEO_SEGMENTS.map((s, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                title={s.title}
                style={{
                  width: i === idx ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: "none",
                  background: i === idx ? "#c9a84c" : "rgba(47,49,90,0.2)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Right: text description ── */}
        <div
          className={`vg-text-panel ${textVisible ? "vg-text-visible" : "vg-text-invisible"}`}
          style={{ paddingTop: "0.5rem" }}
        >
          <div style={{ ...S.label, marginBottom: "0.4rem" }}>{seg.group}</div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#2f315a", lineHeight: 1.3, marginBottom: "0.65rem" }}>
            {seg.title}
          </h3>
          <p style={{ ...S.body, color: "#6b6f91", marginBottom: "1.25rem", fontStyle: "italic" }}>
            {seg.desc}
          </p>
          <div>
            {seg.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                <StepNum n={i + 1} color="#c9a84c" />
                <div style={{ ...S.body, paddingTop: 4, flex: 1 }}>{step}</div>
              </div>
            ))}
          </div>

          {/* Progress label */}
          <div style={{ marginTop: "1.5rem", fontSize: "0.72rem", color: "#a8abcc", fontWeight: 500 }}>
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

export default function Sales2DOPage({ onContact }) {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [licenseTab, setLicenseTab] = useState("online");

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      {/* Floating section sidebar — desktop only (≥1280px) */}
      <SectionSidebar items={S2D_SIDEBAR_ITEMS} />

      {/* ── Hero ── */}
      <div style={{ background: "#2f315a", paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="content-wrap">
          <button onClick={() => navigate("/")} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50,
            fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            marginBottom: "2rem", transition: "background 0.2s",
          }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >← Back</button>

          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flex: 1, minWidth: 280 }}>
              <div style={{
                width: 76, height: 76, borderRadius: 18,
                overflow: "hidden", flexShrink: 0,
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <img src={acPluginIcon} alt="Sales2DO Plugin"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                  AutoCount Plugin
                </div>
                <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "0.9rem" }}>
                  Sales2DO Plugin
                </h1>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 580, marginBottom: "1.5rem" }}>
                  Bridges the gap for companies operating with a Sales-to-DO workflow. Generate
                  Delivery Orders directly from existing Invoices or Cash Sales.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/Sales2DO.app" download="Sales2DO.app"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#c9a84c", color: "#1e2040", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Now
                  </a>
                  <a href={WA_LINK} target="_blank" rel="noreferrer"
                    style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >WhatsApp Us</a>
                </div>
              </div>
            </div>

            <div className="product-hero-image" style={{ flex: "0 1 460px", maxWidth: 500 }}>
              <img src={imgOutstanding} alt="Sales2DO Outstanding Delivery Order dashboard"
                style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Video Guide ── */}
      <div id="video-guide" style={{ background: "#ffffff", padding: "4rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)", scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Video Guide</div>
          <h2 style={{ ...S.h2, marginBottom: "0.5rem" }}>See It In Action</h2>
          <p style={{ ...S.body, color: "#6b6f91", maxWidth: 600, marginBottom: "2rem" }}>
            Watch each feature explained step by step. Videos play automatically and advance to the next segment.
          </p>
          <VideoGuide />
        </div>
      </div>

      {/* ── Plugin Purpose (Overview) ── */}
      <div id="overview" style={{ background: "#f5f5f8", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Overview</div>
          <h2 style={S.h2}>Plugin Purpose</h2>
          <p style={{ ...S.body, maxWidth: 780, marginTop: "0.5rem" }}>
            In AutoCount Accounting's standard business workflow, the process typically flows from{" "}
            <strong>Delivery Orders (DO)</strong> to <strong>Sales</strong> (Invoices or Cash Sales).
            However, for companies that operate with a <strong>Sales-to-DO workflow</strong>, the
            Sales2DO plugin bridges this gap. It enables users to generate a DO directly from existing
            Invoices or Cash Sales via integrated <em>"Copy to DO"</em> and{" "}
            <em>"Copy from Invoice/Cash Sale"</em> functions.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
       * TEXT GUIDE — Outstanding DO / Settings / License
       * ══════════════════════════════════════════════════════════════ */}

      {/* ── Outstanding Delivery Order ── */}
      <div id="outstanding" style={{ background: "#ffffff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Monitoring</div>
          <h2 style={S.h2}>Outstanding Delivery Order</h2>
          <p style={{ ...S.body, marginBottom: "1.5rem" }}>
            To monitor which Invoices or Cash Sales have been transferred to Delivery Orders, and to
            track exact outstanding balances (dynamically adjusted by Credit Notes and Delivery Returns),
            utilize the <strong>Outstanding Delivery Order</strong> dashboard.
          </p>

          <h3 style={{ ...S.h3, marginBottom: "0.75rem" }}>How to Use the Dashboard</h3>
          <Step n={1}>Navigate to <strong>Sales2DO → Outstanding Delivery Order</strong> from the top navigation bar.</Step>
          <Step n={2}>Use the <strong>Date Range</strong> and <strong>Keyword</strong> filters to locate specific documents quickly.</Step>
          <Step n={3}>Toggle the checkboxes at the top to filter between viewing Invoices or Cash Sales.</Step>
          <Step n={4}>Uncheck <strong>"Show Completed Delivery Order"</strong> to hide fully delivered sales and focus on items that still require fulfillment.</Step>

          <h3 style={{ ...S.h3, marginTop: "2rem" }}>The 3-Tier Drill-Down Grid</h3>
          <p style={{ ...S.body, marginBottom: "1.25rem" }}>
            The dashboard features a 3-tier structure to give you complete visibility into your
            fulfillment process. Expand the <strong>+</strong> icon on any row to dive deeper.
          </p>

          {[
            {
              tier: "Tier 1", color: "#2f315a",
              title: "Master Document (Overview)",
              items: [
                "Displays the source Invoice or Cash Sale and its overall Delivery Status (Pending, Partial Delivery, or Full Delivery).",
                "Double-click any row to instantly open the source Invoice or Cash Sale document.",
              ],
            },
            {
              tier: "Tier 2", color: "#4a5090",
              title: "Item Codes (Quantity Breakdown)",
              items: [
                "Original Qty — The initial quantity billed in the sales document.",
                "CN Returned Qty — The quantity credited or cancelled via Credit Notes.",
                "Net Original Qty — Actual required delivery quantity (Original Qty − CN Returned Qty).",
                "Delivered Qty — The quantity already transferred to Delivery Orders.",
                "DR Returned Qty — Quantity returned by the customer via Delivery Returns.",
                "Outstanding Qty — The final remaining balance pending delivery.",
              ],
            },
            {
              tier: "Tier 3", color: "#6b6f91",
              title: "Copied History (Delivery Orders)",
              items: [
                "Shows the specific Delivery Orders generated for each item — DO Number, DO Date, Delivered Qty, and DR Returned Qty.",
                "Double-click any record to instantly open the target Delivery Order document.",
              ],
            },
          ].map(({ tier, title, color, items }) => (
            <div key={tier} style={{ background: "#f5f5f8", borderRadius: 14, padding: "1.25rem 1.4rem", marginBottom: "0.85rem", border: "1px solid rgba(47,49,90,0.08)" }}>
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
      <div id="settings" style={{ background: "#f5f5f8", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Configuration</div>
          <h2 style={S.h2}>Sales2DO Plugin Settings</h2>
          <p style={{ ...S.body, marginBottom: "1.75rem" }}>
            To configure, go to <strong>Sales2DO → Plugin Settings</strong>.
          </p>

          <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.5rem 1.6rem", marginBottom: "1.5rem", border: "1px solid rgba(47,49,90,0.08)" }}>
            <h3 style={S.h3}>Insert Doc No. in Sales and Delivery Order</h3>
            <p style={{ ...S.body, marginBottom: "0.9rem" }}>
              The plugin offers flexible settings to match your company's referencing preferences.
            </p>
            <BulletList items={[
              'Sales Prefix / Prefix Text — Define the text that precedes the document number (e.g., "Copy To " results in "Copy To DO-00001").',
              "Sales Master/Detail Target — Select the UDF or standard field in the Invoice/Cash Sale where the resulting DO number will be saved.",
              "DO Master/Detail Target — Select the UDF or standard field in the Delivery Order where the source Invoice/Cash Sale number will be saved.",
            ]} />
          </div>

          <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.5rem 1.6rem", border: "1px solid rgba(47,49,90,0.08)" }}>
            <h3 style={S.h3}>Enable Smart Copy Control</h3>
            <p style={{ ...S.body, marginBottom: "1rem" }}>This core feature prevents accidental over-delivery.</p>
            <Step n={1}>Check <strong>"Enable Smart Copy Control"</strong> in the settings.</Step>
            <Step n={2}>When copying a partially copied document, the system calculates the remaining balance and <strong>only loads the outstanding quantity</strong> into the new Delivery Order.</Step>
            <Step n={3}>If a document has already been fully copied, the system will prompt a warning asking if you still intend to proceed.</Step>
          </div>
        </div>
      </div>

      {/* ── Activate Plugin License ── */}
      <div id="license" style={{ background: "#ffffff", ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Activation</div>
          <h2 style={S.h2}>Activate Plugin License</h2>

          <div style={{ display: "flex", background: "#e8e8f0", borderRadius: 50, padding: 4, gap: 2, marginBottom: "2rem", width: "fit-content" }}>
            {[["online", "Online Activation"], ["offline", "Offline Activation"]].map(([key, label]) => (
              <button key={key} onClick={() => setLicenseTab(key)} style={{
                fontSize: "0.82rem", fontWeight: 600,
                padding: "0.45rem 1.3rem", borderRadius: 50, border: "none",
                cursor: "pointer", fontFamily: "inherit",
                background: licenseTab === key ? "#2f315a" : "transparent",
                color: licenseTab === key ? "#ffffff" : "#6b6f91",
                transition: "background 0.2s, color 0.2s",
              }}>{label}</button>
            ))}
          </div>

          {licenseTab === "online" && (
            <div style={{ maxWidth: 680 }}>
              <p style={{ ...S.body, marginBottom: "1rem" }}>Ensure your device is connected to the internet, then follow these steps:</p>
              <Step n={1}>KSL Business Solutions (via WhatsApp or Email) will inform you once your license is ready.</Step>
              <Step n={2}>Open AutoCount Accounting and navigate to the Sales2DO plugin from the navigation bar.</Step>
              <Step n={3}>Go to <strong>License Control</strong>, then click the <strong>"Get Online"</strong> button. Your license will be activated automatically.</Step>
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
              <p style={{ ...S.body, marginBottom: "1rem" }}>For PCs without internet access, use offline activation:</p>
              <Step n={1}>Open AutoCount Accounting and navigate to the Sales2DO plugin from the navigation bar.</Step>
              <Step n={2}>Go to <strong>License Control</strong>. A unique <strong>Machine ID</strong> will be displayed. Copy or note this down.</Step>
              <Step n={3}>Send the Machine ID to KSL Business Solutions via WhatsApp or Email.</Step>
              <Step n={4}>We will generate an offline activation key and send it back to you.</Step>
              <Step n={5}>Enter the activation key in the <strong>Sales2DO Activation Key</strong> field and click <strong>Activate</strong>.</Step>
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
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
            Interested in the Sales2DO plugin?
          </h2>
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
