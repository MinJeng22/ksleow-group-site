import { LOGO } from "../assets/assets.js";
import { CONTACT, WA_LINK } from "../constants/contact.js";

export default function Footer({ onContact }) {
  const linkStyle = {
    display: "block", fontSize: "0.82rem", color: "#6b6f91",
    lineHeight: 2.1, textDecoration: "none", transition: "color 0.2s",
  };
  const hov = e => e.currentTarget.style.color = "#2f315a";
  const hout = e => e.currentTarget.style.color = "#6b6f91";

  return (
    <>
      <footer style={{
        background: "#ffffff",
        borderTop: "0.5px solid rgba(47,49,90,0.1)",
        padding: "4rem var(--px) 3rem",
      }}>
        <div className="footer-grid">

          {/* Brand — spans full width on tablet/mobile */}
          <div className="footer-brand-col">
            <img
              src={LOGO}
              alt="KSL Business Solutions"
              style={{ height: 46, objectFit: "contain", marginBottom: "1rem", display: "block" }}
            />
            <p style={{ fontSize: "0.83rem", color: "#6b6f91", lineHeight: 1.8, maxWidth: 340 }}>
              KSL Business Solutions Sdn. Bhd.<br />
              Pahang's leading AutoCount Authorized Dealer — delivering software,
              training, IT networking, and plugin development.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, color: "#2f315a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              Contact
            </h4>
            <p style={{ fontSize: "0.82rem", color: "#6b6f91", lineHeight: 1.9, marginBottom: "0.6rem" }}>
              {CONTACT.address}
            </p>
            <a href={`tel:${CONTACT.phone}`} style={linkStyle} onMouseOver={hov} onMouseOut={hout}>
              {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} style={linkStyle} onMouseOver={hov} onMouseOut={hout}>
              {CONTACT.email}
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, color: "#2f315a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
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
              <span key={s} style={{ display: "block", fontSize: "0.82rem", color: "#6b6f91", lineHeight: 2.1 }}>
                {s}
              </span>
            ))}
          </div>

          {/* Social */}
          <div>
            <h4 style={{ fontSize: "0.7rem", fontWeight: 600, color: "#2f315a", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              Follow Us
            </h4>
            <a href={CONTACT.facebook} target="_blank" rel="noreferrer" style={linkStyle} onMouseOver={hov} onMouseOut={hout}>
              Facebook
            </a>
            <a href={WA_LINK} target="_blank" rel="noreferrer" style={linkStyle} onMouseOver={hov} onMouseOut={hout}>
              WhatsApp
            </a>
          </div>

        </div>
      </footer>

      {/* Bottom bar */}
      <div style={{
        background: "#ffffff",
        borderTop: "0.5px solid rgba(47,49,90,0.08)",
        padding: "1rem var(--px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem",
        fontSize: "0.75rem",
        color: "#6b6f91",
      }}>
        <span>© {new Date().getFullYear()} KSL Business Solutions Sdn. Bhd. All rights reserved.</span>
        <span style={{ opacity: 0.6 }}>Mentakab, Pahang, Malaysia</span>
      </div>
    </>
  );
}
