import { useEffect } from "react";
import { CONTACT } from "../constants/contact.js";
import officesContent from "../content/offices.json";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l1-1a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const normalisePhoneForHref = (phone) => phone.replace(/\([^)]*\)/g, "").replace(/[^\d+]/g, "");

const officeContacts = (officesContent.items || []).map((office) => {
  const phones = office.phones?.map((p) => p.number).filter(Boolean) || [];
  const emails = office.emails?.map((e) => e.email).filter(Boolean) || [];
  return {
    name: office.name,
    tagline: office.tagline,
    phones: phones.length ? phones : [CONTACT.phone],
    emails: emails.length ? emails : [CONTACT.email],
  };
});

const CONTACT_DIRECTORY = [
  {
    name: "KSL BUSINESS SOLUTIONS SDN. BHD.",
    tagline: "Software, Hardware & IT Solutions",
    phones: [CONTACT.phone],
    emails: [CONTACT.email],
  },
  ...officeContacts.filter((office) => office.name !== "KSL BUSINESS SOLUTIONS SDN. BHD."),
];

function ContactGroup({ icon, items, getHref }) {
  if (!items?.length) return null;

  return (
    <div className="contact-directory-group">
      <span className="contact-directory-icon">{icon}</span>
      <div className="contact-directory-values">
        {items.map((item) => (
          <a className="contact-directory-value" href={getHref(item)} key={item}>
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ContactModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add("partner-modal-open", "has-active-modal");
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("partner-modal-open", "has-active-modal");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="partner-modal-backdrop contact-directory-backdrop" onClick={onClose} role="presentation">
      <section
        className="partner-modal-shell contact-directory-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-directory-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="partner-modal-close" onClick={onClose} aria-label="Close contact modal">
          <CloseIcon />
        </button>

        <div className="partner-modal-body contact-directory-body">
          <h2 id="contact-directory-title" className="partner-modal-title">Contact Us</h2>

          <div className="contact-directory-grid">
            {CONTACT_DIRECTORY.map((company) => (
              <article className="contact-directory-card" key={company.name}>
                <div>
                  <h3>{company.name}</h3>
                  {company.tagline && <p>{company.tagline}</p>}
                </div>

                <div className="contact-directory-list">
                  <ContactGroup
                    icon={<PhoneIcon />}
                    items={company.phones}
                    getHref={(phone) => `tel:${normalisePhoneForHref(phone)}`}
                  />
                  <ContactGroup
                    icon={<MailIcon />}
                    items={company.emails}
                    getHref={(email) => `mailto:${email}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
