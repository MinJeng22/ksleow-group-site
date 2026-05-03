import { useState } from "react";
import { LOGO_FOOTER } from "../assets/assets.js";
import { CONTACT, WA_LINK } from "../constants/contact.js";
import footer from "../content/footer.json";
import branding from "../content/branding.json";

const Icon = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 2 }}>
    <path d={d} />
  </svg>
);

const IC = {
  mapPin:   "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  clock:    "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  whatsapp: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z",
};

/* Unified subitem row — same colour, font-size, and line-height whether the
 * row is clickable (renders as <a> with gold hover) or not (renders as <div>
 * with no hover). Icon is optional — pass `icon={null}` for a bullet-free row. */
function ContactRow({ icon, href, label, external }) {
  const [hov, setHov] = useState(false);
  const Tag = href ? "a" : "div";
  const lp = href ? { href, ...(external ? { target: "_blank", rel: "noreferrer" } : {}) } : {};
  return (
    <Tag {...lp}
      style={{
        display: "flex", alignItems: "flex-start", gap: 9,
        fontSize: "0.83rem",
        color: href && hov ? "#c9a84c" : "#a8abcc",
        lineHeight: 1.7, textDecoration: "none",
        transition: "color 0.2s", marginBottom: "0.6rem",
        cursor: href ? "pointer" : "default",
      }}
      onMouseEnter={() => href && setHov(true)} onMouseLeave={() => href && setHov(false)}
    >
      {icon && <Icon d={icon} />}
      <span>{label}</span>
    </Tag>
  );
}

const H4 = { fontSize: "0.7rem", fontWeight: 600, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.11em", marginBottom: "1.1rem" };

export default function Footer() {
  return (
    <>
      <footer style={{ background: "#1a1c35", paddingTop: "4.5rem", paddingBottom: "3rem" }}>
        <div className="content-wrap">
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand-col">
              <img src={branding.footerLogo || LOGO_FOOTER} alt="KSL Business Solutions"
                style={{ height: 46, objectFit: "contain", display: "block", marginBottom: "1.1rem", filter: branding.footerLogo ? "none" : "brightness(0) invert(1)" }} />
              <p style={{ fontSize: "0.83rem", color: "#7b7fa8", lineHeight: 1.82, maxWidth: 300 }}>
                {footer.tagline}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 style={H4}>{footer.contactHeading}</h4>
              <ContactRow icon={IC.mapPin} label={CONTACT.address} />
              <ContactRow icon={IC.phone}  href={`tel:${CONTACT.phone}`}    label={CONTACT.phone} />
              <ContactRow icon={IC.mail}   href={`mailto:${CONTACT.email}`} label={CONTACT.email} />
              <ContactRow icon={IC.clock}  label={CONTACT.hours} />
              <ContactRow icon={IC.clock}  label={CONTACT.weekend} />
            </div>

            {/* Office / Services */}
            <div>
              <h4 style={H4}>{footer.servicesHeading}</h4>
              {(footer.services || []).map(s => (
                <ContactRow key={s} icon={null} label={s} />
              ))}
            </div>

            {/* Follow */}
            <div>
              <h4 style={H4}>{footer.followHeading}</h4>
              <ContactRow icon={IC.facebook} href={CONTACT.facebook} label="Facebook" external />
              <ContactRow icon={IC.whatsapp} href={WA_LINK}          label="WhatsApp"  external />
            </div>

          </div>
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", marginTop: "3rem" }} />
        </div>
      </footer>

      <div style={{ background: "#13142a", padding: "1.1rem 0", textAlign: "center", fontSize: "0.75rem", color: "#55587a", lineHeight: 1.9 }}>
        <div>© {new Date().getFullYear()} {footer.copyrightLine}</div>
        <div>{footer.locationLine}</div>
      </div>
    </>
  );
}
