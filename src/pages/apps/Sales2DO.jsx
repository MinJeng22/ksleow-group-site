import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { WA_LINK } from "../../constants/contact.js";
import AIChatbot from "../../components/AIChatbot.jsx";

/* ══════════════════════════════════════════════════════════════
 * SALES2DO PLUGIN — PAGE
 *
 * IMAGE SLOTS — drop files into src/assets/images/apps/sales2do/
 * then uncomment the import and replace null with the variable.
 *
 *   workflowDiagram — Plugin Purpose workflow diagram
 *   copy1           — Right-click menu on Invoice row
 *   copy2           — Invoice View ribbon Copy To button
 *   copy3           — DO Entry ribbon Copy From buttons
 *   outstanding     — Outstanding Delivery Order dashboard
 *   settings        — Plugin Settings screen
 *   licenseOnline   — License Control Get Online button
 *   licenseOffline  — License Control Machine ID field
 *   aiAssistant     — AI Assistant & Feedback navigation
 * ══════════════════════════════════════════════════════════════ */

// import imgWorkflow    from "../../assets/images/apps/sales2do/workflow.png";
// import imgCopy1       from "../../assets/images/apps/sales2do/copy1.png";
// import imgCopy2       from "../../assets/images/apps/sales2do/copy2.png";
// import imgCopy3       from "../../assets/images/apps/sales2do/copy3.png";
// import imgOutstanding from "../../assets/images/apps/sales2do/outstanding.png";
// import imgSettings    from "../../assets/images/apps/sales2do/settings.png";
// import imgLicenseOnline  from "../../assets/images/apps/sales2do/license-online.png";
// import imgLicenseOffline from "../../assets/images/apps/sales2do/license-offline.png";

const IMAGE_SLOTS = {
  workflowDiagram: null,
  copy1: null,
  copy2: null,
  copy3: null,
  outstanding: null,
  settings: null,
  licenseOnline: null,
  licenseOffline: null,
};

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
            <div style={{ fontSize: "0.72rem", color: "#a8abcc", fontWeight: 500 }}>{alt || "Screenshot placeholder"}</div>
          </div>
        }
      </div>
      {caption && <p style={{ fontSize: "0.75rem", color: "#a8abcc", textAlign: "center", fontStyle: "italic", marginTop: "0.35rem" }}>{caption}</p>}
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
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  const [licenseTab, setLicenseTab] = useState("online");

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "4rem" }}>
        <div className="content-wrap">
          <button onClick={() => navigate(-1)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50,
            fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
            marginBottom: "2rem", transition: "background 0.2s",
          }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >← Back</button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{
              width: 76, height: 76, borderRadius: 18,
              overflow: "hidden", flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem",
            }}>🔌</div>

            <div style={{ flex: 1, minWidth: 260 }}>
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
        </div>
      </div>

      {/* ── Plugin Purpose ── */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Overview</div>
          <h2 style={S.h2}>Plugin Purpose</h2>
          <ImgSlot src={IMAGE_SLOTS.workflowDiagram} alt="Sales2DO workflow diagram" caption="Standard DO → Sales workflow vs Sales → DO workflow enabled by Sales2DO" />
          <p style={{ ...S.body, maxWidth: 780, marginTop: "1.5rem" }}>
            In AutoCount Accounting's standard business workflow, the process typically flows from{" "}
            <strong>Delivery Orders (DO)</strong> to <strong>Sales</strong> (Invoices or Cash Sales).
            However, for companies that operate with a <strong>Sales-to-DO workflow</strong>, the
            Sales2DO plugin bridges this gap. It enables users to generate a DO directly from existing
            Invoices or Cash Sales via integrated <em>"Copy to DO"</em> and{" "}
            <em>"Copy from Invoice/Cash Sale"</em> functions.
          </p>
        </div>
      </div>

      {/* ── Copy Sales into DO ── */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Usage</div>
          <h2 style={S.h2}>Copy Sales into Delivery Order</h2>
          <p style={{ ...S.body, marginBottom: "2rem" }}>
            There are <strong>3 ways</strong> to copy a Sales document into a new Delivery Order:
          </p>

          {/* Method 1 */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
              <StepNum n={1} color="#c9a84c" />
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Via Right-Click Menu</h3>
            </div>
            <ImgSlot src={IMAGE_SLOTS.copy1} alt="Right-click menu" caption='Method 1 — Right-click → "Copy to a new Delivery Order"' />
            <BulletList items={[
              "Go to Sales > Invoice or Sales > Cash Sale to open the listing screen.",
              "Locate the document you wish to copy.",
              'Right-click on the specific row in the grid and select "Copy to a new Delivery Order".',
              "A new Delivery Order entry screen will open with all details copied over.",
            ]} />
          </div>

          {/* Method 2 */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
              <StepNum n={2} color="#c9a84c" />
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Via the "Copy To" Icon in Invoices or Cash Sales View Screen</h3>
            </div>
            <ImgSlot src={IMAGE_SLOTS.copy2} alt="Copy To icon in Invoice view ribbon" caption='Method 2 — Home tab → Copy group → "Copy to a new Delivery Order"' />
            <BulletList items={[
              "Open any existing Invoice or Cash Sale document in View Mode.",
              "On the top ribbon menu under the Home tab, look for the Copy group.",
              'Click the "Copy to a new Delivery Order" button.',
              "A new Delivery Order will be generated based on the viewed document.",
            ]} />
          </div>

          {/* Method 3 */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
              <StepNum n={3} color="#c9a84c" />
              <h3 style={{ ...S.h3, marginBottom: 0 }}>Via the "Copy From" Icon in the DO Entry Screen</h3>
            </div>
            <ImgSlot src={IMAGE_SLOTS.copy3} alt="Copy From icon in DO Entry screen ribbon" caption='Method 3 — DO Entry ribbon → "Copy from Invoice" or "Copy from Cash Sale"' />
            <BulletList items={[
              "Go to Sales > Delivery Order and click Create a New Delivery Order.",
              'On the top ribbon menu, click either "Copy from Invoice" or "Copy from Cash Sale".',
              "A search window will appear. Select the desired source document(s) and click OK.",
              "The items will be populated into your current Delivery Order.",
            ]} />
          </div>
        </div>
      </div>

      {/* ── Outstanding Delivery Order ── */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Monitoring</div>
          <h2 style={S.h2}>Outstanding Delivery Order</h2>
          <ImgSlot src={IMAGE_SLOTS.outstanding} alt="Outstanding Delivery Order dashboard" caption="Outstanding Delivery Order — 3-tier drill-down dashboard" />
          <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>
            To monitor which Invoices or Cash Sales have been transferred to Delivery Orders, and to
            track exact outstanding balances (dynamically adjusted by Credit Notes and Delivery Returns),
            utilize the <strong>Outstanding Delivery Order</strong> dashboard.
          </p>

          <h3 style={{ ...S.h3, marginTop: "1.5rem" }}>How to Use the Dashboard</h3>
          <Step n={1}>Navigate to <strong>Sales2DO &gt; Outstanding Delivery Order</strong> from the top navigation bar.</Step>
          <Step n={2}>Use the <strong>Date Range</strong> and <strong>Keyword</strong> filters to locate specific documents quickly.</Step>
          <Step n={3}>Toggle the checkboxes at the top to filter between viewing Invoices or Cash Sales.</Step>
          <Step n={4}>Uncheck <strong>"Show Completed Delivery Order"</strong> to hide fully delivered sales and focus on items that still require fulfillment.</Step>

          <h3 style={{ ...S.h3, marginTop: "1.75rem" }}>The 3-Tier Drill-Down Grid</h3>
          <p style={{ ...S.body, marginBottom: "1rem" }}>
            The dashboard features a powerful 3-tier structure to give you complete visibility into your fulfillment process.
            Expand the <strong>+</strong> icon on any row to dive deeper.
          </p>

          {/* Tier cards */}
          {[
            {
              tier: "Tier 1",
              title: "Master Document (Overview)",
              color: "#2f315a",
              items: [
                "Displays the source Invoice or Cash Sale and its overall Delivery Status (Pending, Partial Delivery, or Full Delivery).",
                "Drill-Down: Double-click any row here to instantly open the source Invoice or Cash Sale document.",
              ],
            },
            {
              tier: "Tier 2",
              title: "Item Codes (Quantity Breakdown)",
              color: "#4a5090",
              items: [
                "Original Qty — The initial quantity billed in the sales document.",
                "CN Returned Qty — The quantity credited or cancelled via Credit Notes.",
                "Net Original Qty — The actual required delivery quantity (Original Qty − CN Returned Qty).",
                "Delivered Qty — The quantity already transferred to Delivery Orders.",
                "DR Returned Qty — The quantity returned by the customer via Delivery Returns (added back to pending balance).",
                "Outstanding Qty — The final remaining balance pending delivery.",
              ],
            },
            {
              tier: "Tier 3",
              title: "Copied History (Delivery Orders)",
              color: "#6b6f91",
              items: [
                "Reveals the specific Delivery Orders generated for each item — DO Number, DO Date, Delivered Qty, and DR Returned Qty.",
                "Drill-Down: Double-click any transfer record to instantly open the target Delivery Order document.",
              ],
            },
          ].map(({ tier, title, color, items }) => (
            <div key={tier} style={{ background: "#ffffff", borderRadius: 14, padding: "1.25rem 1.4rem", marginBottom: "0.85rem", border: "1px solid rgba(47,49,90,0.09)" }}>
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
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Configuration</div>
          <h2 style={S.h2}>Sales2DO Plugin Settings</h2>
          <p style={{ ...S.body, marginBottom: "1.5rem" }}>
            To configure, go to <strong>Sales2DO &gt; Plugin Settings</strong>.
          </p>
          <ImgSlot src={IMAGE_SLOTS.settings} alt="Plugin Settings screen" caption="Sales2DO → Plugin Settings" />

          <div style={{ marginTop: "2rem", marginBottom: "1.75rem" }}>
            <h3 style={S.h3}>Insert Doc No. in Sales and Delivery Order</h3>
            <p style={{ ...S.body, marginBottom: "0.9rem" }}>
              The plugin offers flexible settings to match your company's referencing preferences.
            </p>
            <BulletList items={[
              'Sales Prefix / Prefix Text — Define the text that precedes the document number (e.g., "Copy To " will result in "Copy To DO-00001").',
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
      <div style={{ background: "#f5f5f8", ...S.section }}>
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
              <ImgSlot src={IMAGE_SLOTS.licenseOnline} alt="License Control — Get Online button" caption="Online Activation — License Control screen" />
              <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>Ensure your device is connected to the internet, then follow these steps:</p>
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
              <ImgSlot src={IMAGE_SLOTS.licenseOffline} alt="License Control — Machine ID field" caption="Offline Activation — copy the Machine ID shown here" />
              <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>For PCs without internet access, use offline activation:</p>
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