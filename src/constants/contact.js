/**
 * contact.js — Company contact information
 * =========================================
 * Edit this file to update contact details sitewide.
 *
 * SERVICE_CONTACTS — per-service contact details used in the
 * "Contact Us" modal on each service card.
 * Keys must match the service "key" field in Services.jsx.
 * If a service has no dedicated contact, it falls back to CONTACT.
 */

export const CONTACT = {
  address:  "No.8-9, Ground Floor, 1st Floor, 2nd Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang, Malaysia",
  email:    "support@ksleow.com.my",
  phone:    "017-905 2323",
  whatsapp: "60179052323",
  facebook: "https://www.facebook.com/ksleowbs",
  linkedin: "",
  hours:    "9:00 AM – 6:00 PM (Mon – Fri)",
  weekend:  "Closed on Weekends",
};

export const WA_MSG = encodeURIComponent(
  "Hi, I would like to learn more about KSL Business Solutions. Thank you."
);
export const WA_LINK = `https://wa.me/${CONTACT.whatsapp}?text=${WA_MSG}`;

/* ══════════════════════════════════════════════════════════════
 * PER-SERVICE CONTACT DETAILS
 * ──────────────────────────────────────────────────────────────
 * Each service card shows its own address / phone / email in the
 * "Contact Us" modal. Edit these entries independently.
 *
 * Fields (all optional — falls back to CONTACT if omitted):
 *   label    → header title shown in the modal
 *   address  → service-specific location/department
 *   phone    → direct line
 *   whatsapp → WhatsApp number (digits only, with country code)
 *   email    → direct email
 * ══════════════════════════════════════════════════════════════ */
export const SERVICE_CONTACTS = {
  accounting: {
    label:    "Accounting Department",
    address:  "No.8-9, Ground Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "accounting@ksleow.com.my",
  },
  secretarial: {
    label:    "Secretarial Department",
    address:  "No.8-9, 1st Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "secretarial@ksleow.com.my",
  },
  taxation: {
    label:    "Taxation Department",
    address:  "No.8-9, 1st Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "tax@ksleow.com.my",
  },
  management: {
    label:    "Management Consulting",
    address:  "No.8-9, 2nd Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "management@ksleow.com.my",
  },
  auditing: {
    label:    "Audit Department",
    address:  "No.8-9, 2nd Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "audit@ksleow.com.my",
  },
  hardware: {
    label:    "IT Hardware & Networking",
    address:  "No.8-9, Ground Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "it@ksleow.com.my",
  },
  training: {
    label:    "Professional Training",
    address:  "No.8-9, Ground Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "training@ksleow.com.my",
  },
  plugin: {
    label:    "Plugin Development",
    address:  "No.8-9, Ground Floor, Taman Zabidin, Kampung Catin, 28400 Mentakab, Pahang",
    phone:    "017-905 2323",
    whatsapp: "60179052323",
    email:    "dev@ksleow.com.my",
  },
};
