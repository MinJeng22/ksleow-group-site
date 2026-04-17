import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { WA_LINK } from "../../constants/contact.js";
import AIChatbot from "../../components/AIChatbot.jsx";
import acPluginIcon from "../../assets/images/apps/ac-plugin-icon.png";

/* ── Screenshots Import ── */
import imgStep2 from "../../assets/images/cases/sales2do/step2.png";
import imgLicenseOnline from "../../assets/images/cases/sales2do/license-online.png";
import imgLicenseOffline from "../../assets/images/cases/sales2do/license-offline.png";
// import imgWorkflow from "../../assets/images/cases/sales2do/workflow.png"; 

const IMAGE_SLOTS = {
  workflowDiagram: null, // 待添加
  step2: imgStep2,
  step3: null,
  step4: null,
  step6: null,
  copy1: null,
  copy2: null,
  copy3: null,
  outstanding: null,
  settings: null,
  licenseOnline: imgLicenseOnline,
  licenseOffline: imgLicenseOffline,
};

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

function ImgSlot({ src, alt, caption, maxWidth = 860 }) {
  return (
    <div style={{ margin: "1.25rem 0 0.5rem" }}>
      <div style={{
        maxWidth: maxWidth, margin: "0 auto", borderRadius: 10,
        border: "1px solid rgba(47,49,90,0.1)", overflow: "hidden",
        background: src ? "transparent" : "#f0f0f5", minHeight: src ? "auto" : 140,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {src ? <img src={src} alt={alt || ""} style={{ width: "100%", display: "block" }} />
          : <div style={{ padding: "1.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", opacity: 0.25, marginBottom: "0.4rem" }}>🖼️</div>
            <div style={{ fontSize: "0.72rem", color: "#a8abcc", fontWeight: 500 }}>{alt || "Placeholder"}</div>
          </div>
        }
      </div>
      {caption && (
        <p style={{ fontSize: "0.75rem", color: "#a8abcc", textAlign: "center", fontStyle: "italic", marginTop: "0.35rem" }}>
          {caption}
        </p>
      )}
    </div>
  );
}

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

export default function Sales2DOPage({ onContact }) {
  const navigate = useNavigate();
  const [licenseTab, setLicenseTab] = useState("online");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      {/* HERO SECTION */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "4rem" }}>
        <div className="content-wrap">
          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50,
            fontSize: "0.8rem", cursor: "pointer", marginBottom: "2rem"
          }}> ← Back </button>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ width: 76, height: 76, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
              <img src={acPluginIcon} alt="Icon" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={S.label}>AutoCount Plugin Development</div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.9rem" }}>Sales2DO Plugin</h1>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", maxWidth: 580, marginBottom: "1.5rem" }}>
                Generate Delivery Orders directly from Invoices or Cash Sales for streamlined workflows.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <a href="/Sales2DO.app" download style={{ background: "#c9a84c", color: "#1e2040", padding: "0.72rem 1.9rem", borderRadius: 50, fontWeight: 700, textDecoration: "none" }}>Download Now</a>
                <a href={WA_LINK} target="_blank" rel="noreferrer" style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", padding: "0.72rem 1.9rem", borderRadius: 50, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>WhatsApp Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEMO VIDEO */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Watch the Demo</div>
          <h2 style={S.h2}>Watch the Demo Video</h2>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#0f1128", paddingBottom: "56.25%", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.35)" }}>
              <div style={{ fontSize: "0.82rem" }}>Demo video coming soon</div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Overview</div>
          <h2 style={S.h2}>Plugin Purpose</h2>
          <ImgSlot src={IMAGE_SLOTS.workflowDiagram} alt="Workflow" caption="Standard workflow vs Sales2DO workflow" />
          <p style={{ ...S.body, marginTop: "1.5rem" }}>
            Bridges the gap for companies using a <strong>Sales-to-DO workflow</strong>, allowing instant creation of DOs from Invoices.
          </p>
        </div>
      </div>

      {/* INSTALLATION */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Setup</div>
          <h2 style={S.h2}>Install the Plugin</h2>
          <Step n={1}>Install the <strong>Sales2DO.app</strong> file.</Step>
          <Step n={2}>Navigate to <strong>Tools &gt; Plug-in Manager</strong>.</Step>
          <ImgSlot src={IMAGE_SLOTS.step2} caption="Step 2 — Plug-in Manager" />
          <Step n={3}>Click <strong>Install</strong> and select the file.</Step>
          <Step n={4}>Confirm installation and restart AutoCount.</Step>
        </div>
      </div>

      {/* USAGE METHODS */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Usage</div>
          <h2 style={S.h2}>3 Ways to Copy Sales to DO</h2>
          <Step n={1}><strong>Right-Click:</strong> From Invoice listing screen.</Step>
          <Step n={2}><strong>Ribbon Button:</strong> "Copy To" in Invoice view mode.</Step>
          <Step n={3}><strong>DO Entry:</strong> "Copy From Invoice" in new DO screen.</Step>
        </div>
      </div>

      {/* OUTSTANDING */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Monitoring</div>
          <h2 style={S.h2}>Outstanding Delivery Order</h2>
          <ImgSlot src={IMAGE_SLOTS.outstanding} caption="Track transfer status and pending quantities" />
          <BulletList items={["Track Original vs Copied Qty", "Filter by Date or Keyword", "Drill-down to source documents"]} />
        </div>
      </div>

      {/* LICENSE */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Activation</div>
          <h2 style={S.h2}>Activate Plugin License</h2>
          <div style={{ display: "flex", gap: 10, marginBottom: "2rem" }}>
            <button onClick={() => setLicenseTab("online")} style={{ padding: "0.5rem 1.5rem", borderRadius: 20, border: "none", cursor: "pointer", background: licenseTab === "online" ? "#2f315a" : "#ddd", color: licenseTab === "online" ? "#fff" : "#333" }}>Online</button>
            <button onClick={() => setLicenseTab("offline")} style={{ padding: "0.5rem 1.5rem", borderRadius: 20, border: "none", cursor: "pointer", background: licenseTab === "offline" ? "#2f315a" : "#ddd", color: licenseTab === "offline" ? "#fff" : "#333" }}>Offline</button>
          </div>
          {licenseTab === "online" ? (
            <ImgSlot src={IMAGE_SLOTS.licenseOnline} caption="Click 'Get Online' to activate" />
          ) : (
            <ImgSlot src={IMAGE_SLOTS.licenseOffline} caption="Send Machine ID to KSL Support" />
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#2f315a", padding: "4rem 0", textAlign: "center" }}>
        <div className="content-wrap">
          <h2 style={{ color: "#fff", marginBottom: "1.5rem" }}>Interested in the Sales2DO plugin?</h2>
          <button onClick={onContact} style={{ background: "#c9a84c", color: "#1e2040", padding: "0.85rem 2.5rem", borderRadius: 50, border: "none", fontWeight: 700, cursor: "pointer" }}>Enquire Now</button>
        </div>
      </div>

      <Footer />
      <AIChatbot />
    </div>
  );
}