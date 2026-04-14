import { LOGO } from "../assets/assets.js";
import { CONTACT, WA_LINK } from "../constants/contact.js";

/* ── Inline SVG icon set (no external dependency needed) ── */
const Icon = ({ d, viewBox = "0 0 24 24", size = 15 }) => (
  <svg
    width={size} height={size} viewBox={viewBox}
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 1 }}
  >
    <path d={d} />
  </svg>
);

const Icons = {
  mapPin:   "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  whatsapp: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z",
};

function ContactRow({ iconPath, href, label, external }) {
  const [hov, setHov] = useState(false);
  const tag = href ? "a" : "span";
  const props = href
    ? { href, ...(external ? { target: "_blank", rel: "noreferrer" } : {}) }
    : {};
  return (
    <a
      {...props}
      style={{
        display: "flex", alignItems: "flex-start", gap: 9,
        fontSize: "0.83rem",
        color: hov ? "#2f315a" : "#a8abcc",
        lineHeight: 1.7, textDecoration: "none",
        transition: "color 0.2s", marginBottom: "0.55rem",
        cursor: href ? "pointer" : "default",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Icon d={iconPath} size={14} />
      <span>{label}</span>
    </a>
  );
}

import { useState } from "react";

export default function Footer() {
  return (
    <>
      <footer style={{
        background: "#1a1c35",       /* dark brand bg — clear visual split */
        padding: "4.5rem var(--px) 3rem",
      }}>
        <div className="footer-grid">

          {/* ── Brand col ── */}
          <div className="footer-brand-col">
            {/* FOOTER LOGO
               * To swap: replace  src/assets/logos/ksl_logo.png
               * Filter inverts colours so logo reads white on the dark footer bg */}
            <img
              src={LOGO}
              alt="KSL Business Solutions"
              style={{
                height: 46, objectFit: "contain",
                display: "block", marginBottom: "1.1rem",
                filter: "brightness(0) invert(1)",
              }}
            />
            <p style={{
              fontSize: "0.83rem", color: "#7b7fa8",
              lineHeight: 1.82, maxWidth: 320,
            }}>
              Pahang's leading AutoCount Authorized Dealer — delivering
              accounting software, IT networking, plugin development,
              and professional training.
            </p>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 style={{
              fontSize: "0.7rem", fontWeight: 600, color: "#ffffff",
              textTransform: "uppercase", letterSpacing: "0.11em",
              marginBottom: "1.1rem",
            }}>
              Contact Us
            </h4>
            <ContactRow
              iconPath={Icons.mapPin}
              label={CONTACT.address}
            />
            <ContactRow
              iconPath={Icons.phone}
              href={`tel:${CONTACT.phone}`}
              label={CONTACT.phone}
            />
            <ContactRow
              iconPath={Icons.mail}
              href={`mailto:${CONTACT.email}`}
              label={CONTACT.email}
            />
          </div>

          {/* ── Services ── */}
          <div>
            <h4 style={{
              fontSize: "0.7rem", fontWeight: 600, color: "#ffffff",
              textTransform: "uppercase", letterSpacing: "0.11em",
              marginBottom: "1.1rem",
            }}>
              Services
            </h4>
            {[
              "AutoCount Software",
              "Technical Services",
              "Professional Training",
              "IT Hardware & Networking",
              "Plugin Development",
              "FeedMe POS Support",
            ].map(s => (
              <span key={s} style={{
                display: "block", fontSize: "0.82rem",
                color: "#7b7fa8", lineHeight: 2.05,
              }}>
                {s}
              </span>
            ))}
          </div>

          {/* ── Follow Us ── */}
          <div>
            <h4 style={{
              fontSize: "0.7rem", fontWeight: 600, color: "#ffffff",
              textTransform: "uppercase", letterSpacing: "0.11em",
              marginBottom: "1.1rem",
            }}>
              Follow Us
            </h4>
            <ContactRow
              iconPath={Icons.facebook}
              href={CONTACT.facebook}
              label="Facebook"
              external
            />
            <ContactRow
              iconPath={Icons.whatsapp}
              href={WA_LINK}
              label="WhatsApp"
              external
            />
          </div>

        </div>

        {/* divider */}
        <div style={{
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          marginTop: "3rem",
        }} />
      </footer>

      {/* bottom bar */}
      <div style={{
        background: "#13142a",
        padding: "1rem var(--px)",
        textAlign: "center",
        fontSize: "0.75rem", color: "#55587a",
        lineHeight: 1.9,
      }}>
        <div>© {new Date().getFullYear()} KSL Business Solutions Sdn. Bhd. All rights reserved.</div>
        <div>Mentakab, Pahang, Malaysia</div>
      </div>
    </>
  );
}
