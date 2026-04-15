/**
 * Partners.jsx
 * ─────────────────────────────────────────────────────────────
 * TO REPLACE A PARTNER LOGO:
 *   1. Drop your PNG/SVG into  src/assets/logos/partners/
 *   2. Rename the file to match the slot name:
 *        partner1.png  partner2.png  ...  partner6.png
 *   That's it — the image appears automatically.
 *
 * TO UPDATE THE DISPLAY NAME shown in the placeholder:
 *   Edit the "name" field in the PARTNERS array below.
 * ─────────────────────────────────────────────────────────────
 */

import { PARTNER_LOGOS } from "../assets/assets.js";

/* Update "name" to whatever label you want shown while no logo is uploaded */
const PARTNERS = [
  { key: "partner1", name: "Partner 1" },
  { key: "partner2", name: "Partner 2" },
  { key: "partner3", name: "Partner 3" },
  { key: "partner4", name: "Partner 4" },
  { key: "partner5", name: "Partner 5" },
  { key: "partner6", name: "Partner 6" },
];

function PartnerSlot({ partner }) {
  const src = PARTNER_LOGOS[partner.key];
  const hasReal = src && src !== "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 148,
        height: 72,
        background: "#f0f0f5",
        borderRadius: 10,
        border: "1px dashed rgba(47,49,90,0.18)",
        padding: "0 1.1rem",
        transition: "border-color 0.2s, background 0.2s",
        flexShrink: 0,
      }}
      onMouseOver={e => {
        e.currentTarget.style.background = "#e8e8f0";
        e.currentTarget.style.borderColor = "rgba(47,49,90,0.35)";
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = "#f0f0f5";
        e.currentTarget.style.borderColor = "rgba(47,49,90,0.18)";
      }}
    >
      {hasReal ? (
        <img
          src={src}
          alt={partner.name}
          style={{ maxHeight: 44, maxWidth: 116, objectFit: "contain" }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <span style={{
          fontSize: "0.78rem", fontWeight: 600,
          color: "#6b6f91", letterSpacing: "0.04em",
          textAlign: "center", lineHeight: 1.4,
        }}>
          {partner.name}
          <span style={{
            display: "block", fontSize: "0.58rem",
            opacity: 0.5, marginTop: 3, fontWeight: 400,
          }}>
            [ logo ]
          </span>
        </span>
      )}
    </div>
  );
}

export default function Partners() {
  return (
    <div style={{ background: "#f5f5f8", padding: "3.5rem 0", textAlign: "center" }}>
      <div className="content-wrap">
        <p style={{
          fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.12em",
          color: "#6b6f91", textTransform: "uppercase", marginBottom: "2rem",
        }}>
          Our Partners
        </p>
        <div
          className="partners-grid"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1.1rem",
            flexWrap: "wrap",
          }}
        >
          {PARTNERS.map(p => <PartnerSlot key={p.key} partner={p} />)}
        </div>
      </div>
    </div>
  );
}
