import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { WA_LINK } from "../../constants/contact.js";
import AIChatbot from "../../components/AIChatbot.jsx";

/* ══════════════════════════════════════════════════════════════
 * SALES2DO PLUGIN — PAGE
 *
 * IMAGE SLOTS — HOW TO ADD SCREENSHOTS
 * ──────────────────────────────────────
 * Recommended screenshot sizes:
 *   Full-width screenshots (AutoCount window): 1280 × 720 px  (16:9)
 *   Dialog / popup windows:                    800  × 500 px
 *   Navigation bar strip:                      1280 × 160 px  (wide, short)
 *
 * Steps:
 *   1. Take screenshot → crop to content → export as PNG or JPG
 *   2. Drop file into  src/assets/images/cases/sales2do/
 *   3. Add import at top of this file:
 *        import imgStep2 from "../../assets/images/cases/sales2do/step2.png";
 *   4. Replace  null  with the imported variable, e.g.:
 *        step2: imgStep2,
 *
 * SLOT NAMES & WHAT TO CAPTURE:
 *   workflowDiagram — The workflow diagram image from the doc (DO→Sales standard vs Sales→DO with plugin)
 *   step2           — Tools menu → Plug-in Manager selected
 *   step3           — Plug-in Manager window with Install button
 *   step4           — Plug-in info popup window
 *   step6           — Navigation bar showing Sales2DO listed
 *   copy1           — Right-click menu on Invoice row showing "Copy to a new Delivery Order"
 *   copy2           — Invoice View ribbon with "Copy To" button highlighted
 *   copy3           — DO Entry ribbon with "Copy From Invoice / Cash Sale" buttons
 *   outstanding     — Outstanding Delivery Order listing screen
 *   settings        — Plugin Settings screen
 *   licenseOnline   — License Control screen showing Get Online button
 *   licenseOffline  — License Control screen showing Machine ID field
 * ══════════════════════════════════════════════════════════════ */

/* ── Import your screenshots here once files are ready ── */
// import imgWorkflow      from "../../assets/images/cases/sales2do/workflow.png";
import imgStep2 from "../../assets/images/cases/sales2do/step2.png";
// import imgStep3         from "../../assets/images/cases/sales2do/step3.png";
// import imgStep4         from "../../assets/images/cases/sales2do/step4.png";
// import imgStep6         from "../../assets/images/cases/sales2do/step6.png";
// import imgCopy1         from "../../assets/images/cases/sales2do/copy1.png";
// import imgCopy2         from "../../assets/images/cases/sales2do/copy2.png";
// import imgCopy3         from "../../assets/images/cases/sales2do/copy3.png";
// import imgOutstanding   from "../../assets/images/cases/sales2do/outstanding.png";
// import imgSettings      from "../../assets/images/cases/sales2do/settings.png";
import imgLicenseOnline from "../../assets/images/cases/sales2do/license-online.png";
import imgLicenseOffline from "../../assets/images/cases/sales2do/license-offline.png";

const IMAGE_SLOTS = {
  workflowDiagram: null,   // imgWorkflow
  step2: imgStep2,
  step3: null,   // imgStep3
  step4: null,   // imgStep4
  step6: null,   // imgStep6
  copy1: null,   // imgCopy1
  copy2: null,   // imgCopy2
  copy3: null,   // imgCopy3
  outstanding: null,   // imgOutstanding
  settings: null,   // imgSettings
  licenseOnline: imgLicenseOnline,
  licenseOffline: imgLicenseOffline,
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

/* ── Screenshot slot component ── */
function ImgSlot({ src, alt, caption, maxWidth = 860 }) {
  return (
    <div style={{ margin: "1.25rem 0 0.5rem" }}>
      <div style={{
        /* Cap width so screenshots don't stretch too wide */
        maxWidth: maxWidth,
        margin: "0 auto",
        borderRadius: 10,
        border: "1px solid rgba(47,49,90,0.1)",
        overflow: "hidden",
        background: src ? "transparent" : "#f0f0f5",
        minHeight: src ? "auto" : 140,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {src
          ? <img src={src} alt={alt || ""} style={{ width: "100%", display: "block" }} />
          : <div style={{ padding: "1.75rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", opacity: 0.25, marginBottom: "0.4rem" }}>🖼️</div>
            <div style={{ fontSize: "0.72rem", color: "#a8abcc", fontWeight: 500 }}>
              {alt || "Screenshot placeholder"}
            </div>
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

/* ── Numbered step badge ── */
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

/* ── Step row with number badge ── */
function Step({ n, children, gold }) {
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.9rem" }}>
      <StepNum n={n} color={gold ? "#c9a84c" : "#2f315a"} />
      <div style={{ ...S.body, paddingTop: 3, flex: 1 }}>{children}</div>
    </div>
  );
}

/* ── Bullet point list ── */
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

      {/* ══════════════════════════════════════════════════════════
       * HERO
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "4rem" }}>
        <div className="content-wrap">
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50,
              fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
              marginBottom: "2rem", transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            ← Back
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{
              width: 76, height: 76, borderRadius: 18,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", flexShrink: 0,
            }}>🔌</div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                AutoCount Plugin Development
              </div>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "0.9rem" }}>
                Sales2DO Plugin
              </h1>
              <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 580, marginBottom: "1.5rem" }}>
                A custom AutoCount Accounting plugin that enables businesses operating on a
                Sales-to-DO workflow to generate Delivery Orders directly from Invoices or Cash Sales.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {/* ── Download button
                     File location: /public/Sales2DO.app
                     To update: replace the file in /public/ with the same filename ── */}
                <a
                  href="/Sales2DO.app"
                  download="Sales2DO.app"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#c9a84c", color: "#1e2040", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseOut={e => e.currentTarget.style.opacity = "1"}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Now
                </a>
                <a href={WA_LINK} target="_blank" rel="noreferrer"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.72rem 1.9rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
       * DEMO VIDEO
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Watch the Demo</div>
          <h2 style={S.h2}>Watch the Demo Video</h2>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 16px 48px rgba(47,49,90,0.12)", border: "1px solid rgba(47,49,90,0.08)" }}>
            <div style={{ paddingBottom: "56.25%", position: "relative", background: "#0f1128" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.35)", gap: "0.75rem" }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)"><polygon points="5,3 19,12 5,21" /></svg>
                <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>Demo video coming soon</div>
              </div>
              {/* Uncomment and replace YOUR_VIDEO_ID when ready:
              <iframe
                src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                title="Sales2DO Plugin Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              /> */}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
       * PLUGIN PURPOSE
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Overview</div>
          <h2 style={S.h2}>Plugin Purpose</h2>

          <ImgSlot
            src={IMAGE_SLOTS.workflowDiagram}
            alt="Sales2DO workflow diagram"
            caption="Standard DO → Sales workflow vs Sales → DO workflow enabled by Sales2DO"
          />

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

      {/* ══════════════════════════════════════════════════════════
       * INSTALL THE PLUGIN
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Setup</div>
          <h2 style={S.h2}>Install the Plugin</h2>

          {/* Step 1 */}
          <Step n={1}>
            Install the <strong>Sales2DO.app</strong> plugin file.
          </Step>

          {/* Step 2 */}
          <Step n={2}>
            Open AutoCount Accounting and log in to the account book. Navigate to the{" "}
            <strong>Tools</strong> menu in the top navigation bar, then select{" "}
            <strong>Plug-in Manager</strong>.
          </Step>
          <ImgSlot src={IMAGE_SLOTS.step2} alt="Tools menu → Plug-in Manager" caption="Step 2 — Tools → Plug-in Manager" />

          {/* Step 3 */}
          <Step n={3}>
            In the Plug-in Manager window, click the <strong>Install</strong> button on the
            right-hand side. A file browser will appear. Locate and click the{" "}
            <strong>Sales2DO.app</strong> plugin file, then open the file.
          </Step>
          <ImgSlot src={IMAGE_SLOTS.step3} alt="Plug-in Manager — Install button" caption="Step 3 — Click Install and select the .app file" />

          {/* Step 4 */}
          <Step n={4}>
            A <strong>Plug-in info</strong> window will pop up. Review the plugin details and
            click <strong>Install</strong>. If a success message appears, click <strong>OK</strong>.
          </Step>
          <ImgSlot src={IMAGE_SLOTS.step4} alt="Plug-in info popup" caption="Step 4 — Review and confirm installation" />

          {/* Step 5 */}
          <Step n={5}>
            <strong>Log out</strong> of AutoCount Accounting completely, then log back in to the
            account book.
          </Step>

          {/* Step 6 */}
          <Step n={6}>
            You will see the new plugin listed in the navigation bar.
          </Step>
          <ImgSlot src={IMAGE_SLOTS.step6} alt="Navigation bar with Sales2DO plugin listed" caption="Step 6 — Sales2DO now appears in the navigation bar" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
       * COPY SALES INTO DELIVERY ORDER
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
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
            <ImgSlot src={IMAGE_SLOTS.copy1} alt="Right-click menu with Copy to DO option" caption='Method 1 — Right-click → "Copy to a new Delivery Order"' />
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

      {/* ══════════════════════════════════════════════════════════
       * OUTSTANDING DELIVERY ORDER
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Monitoring</div>
          <h2 style={S.h2}>Outstanding Delivery Order</h2>

          <ImgSlot
            src={IMAGE_SLOTS.outstanding}
            alt="Outstanding Delivery Order listing screen"
            caption="Outstanding Delivery Order — filter and track transfer status"
          />

          <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>
            To monitor which Invoices or Cash Sales have been transferred to a Delivery Order and
            which are still outstanding, utilize the Outstanding Delivery Order feature.
          </p>

          <Step n={1}>Navigate to <strong>Sales2DO &gt; Outstanding Delivery Order</strong> from the top navigation bar.</Step>
          <Step n={2}>Use the <strong>Date Range</strong> and <strong>Keyword</strong> filters to find specific documents.</Step>
          <Step n={3}>You can toggle the checkboxes to view only Invoices or Cash Sales.</Step>
          <Step n={4}>Uncheck <strong>"Enable Copied Documents"</strong> to filter out fully transferred sales, allowing you to focus purely on outstanding items.</Step>
          <Step n={5}>
            The grid displays a clear breakdown upon expanding the details:
            <BulletList items={[
              "Original Qty — The quantity billed in the sales document.",
              "Copied Qty — The quantity that has already been transferred to a DO.",
              "Outstanding Qty — The remaining quantity pending delivery.",
              'Copy Status — Indicates if the document has "No Copy", is a "Partial Copy", or a "Full Copy".',
            ]} />
          </Step>
          <Step n={6}>
            <strong>Drill-Down Function:</strong> Double-click any row in the Master grid to instantly
            open the source Invoice or Cash Sale. Expanding the <strong>+</strong> icon allows you to
            view item breakdowns. You can even double-click the transfer records in the deepest layer
            to instantly view the target Delivery Order.
          </Step>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
       * PLUGIN SETTINGS
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#f5f5f8", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Configuration</div>
          <h2 style={S.h2}>Sales2DO Plugin Settings</h2>
          <p style={{ ...S.body, marginBottom: "1.5rem" }}>
            The plugin offers flexible settings to match your company's referencing preferences.
            To configure these, go to <strong>Sales2DO &gt; Plugin Settings</strong>.
          </p>

          <ImgSlot src={IMAGE_SLOTS.settings} alt="Plugin Settings screen" caption="Sales2DO → Plugin Settings" />

          {/* Setting 1 */}
          <div style={{ marginTop: "2rem", marginBottom: "1.75rem" }}>
            <h3 style={S.h3}>Insert Doc No. in Sales and Delivery Order</h3>
            <p style={{ ...S.body, marginBottom: "0.9rem" }}>
              This setting determines where the cross-reference document numbers are stored when a
              copy action is performed.
            </p>
            <BulletList items={[
              'Sales Prefix / Prefix Text — Define the text that precedes the document number (e.g., setting Prefix to "Copy To " will result in "Copy To DO-00001").',
              "Sales Master/Detail Target — Select the UDF or standard field in the Invoice/Cash Sale where the resulting DO number will be saved.",
              "DO Master/Detail Target — Select the UDF or standard field in the Delivery Order where the source Invoice/Cash Sale number will be saved.",
            ]} />
          </div>

          {/* Setting 2 */}
          <div>
            <h3 style={S.h3}>Enable Smart Copy Quantity Control</h3>
            <p style={{ ...S.body, marginBottom: "0.9rem" }}>
              This core feature prevents accidental over-delivery.
            </p>
            <Step n={1}>Check <strong>"Enable Smart Qty Deduction"</strong> in the settings.</Step>
            <Step n={2}>
              When copying a document that has already been partially copied, the system will
              calculate the remaining balance and <strong>only load the outstanding quantity</strong>{" "}
              into the new Delivery Order.
            </Step>
            <Step n={3}>
              If a document has already been fully copied, the system will prompt a warning asking
              if you still intend to proceed with the copy.
            </Step>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
       * ACTIVATE PLUGIN LICENSE
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#ffffff", ...S.section }}>
        <div className="content-wrap">
          <div style={S.label}>Activation</div>
          <h2 style={S.h2}>Activate Plugin License</h2>

          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#e8e8f0", borderRadius: 50, padding: 4, gap: 2, marginBottom: "2rem", width: "fit-content" }}>
            {[["online", "Online Activation"], ["offline", "Offline Activation"]].map(([key, label]) => (
              <button key={key}
                onClick={() => setLicenseTab(key)}
                style={{
                  fontSize: "0.82rem", fontWeight: 600,
                  padding: "0.45rem 1.3rem", borderRadius: 50, border: "none",
                  cursor: "pointer", fontFamily: "inherit",
                  background: licenseTab === key ? "#2f315a" : "transparent",
                  color: licenseTab === key ? "#ffffff" : "#6b6f91",
                  transition: "background 0.2s, color 0.2s",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Online */}
          {licenseTab === "online" && (
            <div style={{ maxWidth: 680 }}>
              <ImgSlot src={IMAGE_SLOTS.licenseOnline} alt="License Control — Get Online button" caption="Online Activation — License Control screen" />
              <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>
                Ensure your device is connected to the internet, then follow these steps:
              </p>
              <Step n={1}>KSL Business Solutions (via WhatsApp or Email) will inform you once your license is ready.</Step>
              <Step n={2}>Open AutoCount Accounting and navigate to the Sales2DO plugin from the navigation bar.</Step>
              <Step n={3}>Go to <strong>License Control</strong>, then click the <strong>"Get Online"</strong> button. Your license will be activated automatically.</Step>
              <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 10, background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
                <p style={{ fontSize: "0.83rem", color: "#6b6f91", lineHeight: 1.65 }}>
                  💡 Contact KSL Business Solutions via WhatsApp at{" "}
                  <a href="https://wa.me/60179052323" target="_blank" rel="noreferrer" style={{ color: "#2f315a", fontWeight: 600 }}>017-905 2323</a>{" "}
                  or email <a href="mailto:support@ksleow.com.my" style={{ color: "#2f315a", fontWeight: 600 }}>support@ksleow.com.my</a> once you are ready to activate.
                </p>
              </div>
            </div>
          )}

          {/* Offline */}
          {licenseTab === "offline" && (
            <div style={{ maxWidth: 680 }}>
              <ImgSlot src={IMAGE_SLOTS.licenseOffline} alt="License Control — Machine ID field" caption="Offline Activation — copy the Machine ID shown here" />
              <p style={{ ...S.body, margin: "1.25rem 0 1rem" }}>
                For PCs without internet access, use offline activation:
              </p>
              <Step n={1}>Open AutoCount Accounting and navigate to the Sales2DO plugin from the navigation bar.</Step>
              <Step n={2}>Go to <strong>License Control</strong>. A unique <strong>Machine ID</strong> will be displayed. Copy or note this down.</Step>
              <Step n={3}>Send the Machine ID to KSL Business Solutions via WhatsApp or Email.</Step>
              <Step n={4}>We will generate an offline activation key and send it back to you.</Step>
              <Step n={5}>Enter the activation key in the <strong>Sales2DO Activation Key</strong> field and click the <strong>Activate</strong> button.</Step>
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

      {/* ══════════════════════════════════════════════════════════
       * CTA
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#2f315a", padding: "4rem 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
            Interested in the Sales2DO plugin?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 1.75rem" }}>
            Contact KSL Business Solutions for pricing, installation, and support across Pahang.
          </p>
          <button
            onClick={onContact}
            style={{ background: "#c9a84c", color: "#1e2040", padding: "0.85rem 2.5rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Enquire Now
          </button>
        </div>
      </div>

      <Footer />
      <AIChatbot />
    </div>
  );
}
