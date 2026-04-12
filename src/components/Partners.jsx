/**
 * Partners.jsx
 * ------------
 * To replace a partner logo:
 *   1. Drop the real image into src/assets/logos/partners/
 *   2. Update the path in src/assets/assets.js (PARTNER_LOGOS object)
 *   3. The <img> tag below will automatically pick up the new file.
 *
 * Current state: placeholders rendered with the company name.
 */

import { PARTNER_LOGOS } from "../assets/assets.js";

const PARTNERS = [
  { key: "mdot",        name: "Mdot" },
  { key: "alfex",       name: "Alfex" },
  { key: "autocount",   name: "AutoCount" },
  { key: "sitegiant",   name: "SiteGiant" },
  { key: "superprintz", name: "Superprintz" },
];

function PartnerLogo({ partner }) {
  const src = PARTNER_LOGOS[partner.key];

  /* If the file exists, show it; otherwise show a styled placeholder */
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 130,
        height: 68,
        background: "#f0f0f5",
        borderRadius: 10,
        border: "1px dashed rgba(47,49,90,0.18)",
        padding: "0 1.25rem",
        transition: "border-color 0.2s, background 0.2s",
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
      {src ? (
        <img
          src={src}
          alt={partner.name}
          style={{ maxHeight: 44, maxWidth: 110, objectFit: "contain" }}
          onError={e => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        /* placeholder text — replace logo file to remove this */
        <span style={{
          fontSize: "0.78rem", fontWeight: 600, color: "#6b6f91",
          letterSpacing: "0.04em", textAlign: "center",
        }}>
          {partner.name}
          <span style={{ display: "block", fontSize: "0.6rem", opacity: 0.55, marginTop: 2 }}>
            [ logo ]
          </span>
        </span>
      )}
    </div>
  );
}

export default function Partners() {
  return (
    <div style={{ background: "#f5f5f8", padding: "3.5rem var(--px)", textAlign: "center" }}>
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
          gap: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        {PARTNERS.map(p => <PartnerLogo key={p.key} partner={p} />)}
      </div>
    </div>
  );
}
