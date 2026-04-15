import { useState } from "react";
import { LOGO_NAV } from "../assets/assets.js";
import { CONTACT } from "../constants/contact.js";

/* ══════════════════════════════════════════════════════════════
 * ServiceContactModal
 * ──────────────────────────────────────────────────────────────
 * A lightweight contact modal that shows per-service contact
 * details. Accepts a `service` object with label/address/phone/
 * whatsapp/email fields. Falls back to global CONTACT values.
 * ══════════════════════════════════════════════════════════════ */

const IC = {
  mapPin: "M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  phone:  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z",
  mail:   "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
};

const Icon = ({ d }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, marginTop: 2 }}>
    <path d={d} />
  </svg>
);

export default function ServiceContactModal({ service, onClose }) {
  if (!service) return null;

  const sc     = service.contact || {};
  const addr   = sc.address  || CONTACT.address;
  const phone  = sc.phone    || CONTACT.phone;
  const wa     = sc.whatsapp || CONTACT.whatsapp;
  const email  = sc.email    || CONTACT.email;
  const label  = sc.label    || service.title;
  const waMsg  = encodeURIComponent(`Hi, I would like to enquire about ${service.title}. Thank you.`);
  const waLink = `https://wa.me/${wa}?text=${waMsg}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,11,20,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#ffffff", borderRadius: 20,
          padding: "2.2rem", maxWidth: 420, width: "100%",
          boxShadow: "0 40px 90px rgba(0,0,0,0.28)",
          animation: "modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Logo + service name header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.5rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: "#2f315a",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#ffffff", flexShrink: 0,
          }}>
            {service.icon}
          </div>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "#c9a84c", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact Us</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2f315a", lineHeight: 1.2 }}>{label}</div>
          </div>
        </div>

        {/* Contact info rows */}
        <div style={{
          background: "#f5f5f8", borderRadius: 12,
          padding: "1rem 1.1rem", marginBottom: "1.25rem",
          display: "flex", flexDirection: "column", gap: "0.55rem",
        }}>
          {[
            { d: IC.mapPin, text: addr },
            { d: IC.phone,  text: phone },
            { d: IC.mail,   text: email },
          ].map(({ d, text }, i) => (
            <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", fontSize: "0.82rem", color: "#555" }}>
              <span style={{ color: "#2f315a", marginTop: 1 }}><Icon d={d} /></span>
              <span style={{ lineHeight: 1.55 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <a
            href={waLink} target="_blank" rel="noreferrer"
            style={{
              background: "#25D366", color: "#ffffff",
              padding: "0.8rem 1.5rem", borderRadius: 50,
              fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none", textAlign: "center", fontFamily: "inherit",
              transition: "opacity 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.88"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            WhatsApp — {phone}
          </a>

          <a
            href={`mailto:${email}?subject=Enquiry: ${service.title}`}
            style={{
              background: "#2f315a", color: "#ffffff",
              padding: "0.8rem 1.5rem", borderRadius: 50,
              fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none", textAlign: "center", fontFamily: "inherit",
              transition: "background 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
            onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
          >
            Email Us
          </a>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem", width: "100%",
            background: "transparent", border: "none",
            color: "#a8abcc", fontSize: "0.82rem",
            cursor: "pointer", fontFamily: "inherit", padding: "0.4rem",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
