import { useEffect } from "react";
import Footer from "../../components/Footer";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import SectionDivider, { IconLayers, IconLink, IconHandshake, IconStar } from "../../components/SectionDivider.jsx";

/* FeedMe POS page — product-aware WhatsApp link to Sales Agent Elise */
const WA_LINK = `https://wa.me/60169902279?text=${encodeURIComponent(
  "Hi Elise, I would like to learn more about FeedMe POS. Thank you."
)}`;

/* Hero photo + brand logo — already in /public/images/products/ */
const HERO_PHOTO = "/images/products/feedme-pos-showcase.png";
const FEEDME_LOGO = "/images/logos/feedme-logo.png";

/* Sidebar anchors */
const SIDEBAR_ITEMS = [
  { id: "features",     label: "Features",        icon: IconStar },
  { id: "modules",      label: "Modules",         icon: IconLayers },
  { id: "integration",  label: "AutoCount Sync",  icon: IconLink },
  { id: "why-ksl",      label: "Why KSL",         icon: IconHandshake },
];

/* ── Shared style tokens (lifted from AutoCount page for visual parity) ── */
const S = {
  label:   { fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" },
  h2:      { fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 700, color: "#2f315a", lineHeight: 1.2, marginBottom: "1rem" },
  h3:      { fontSize: "1.05rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.55rem" },
  body:    { fontSize: "var(--text-body)", color: "#555", lineHeight: 1.82 },
  section: { padding: "4rem 0" },
};

/* ── Inline SVG icon set ── */
const Icon = {
  Tables: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Kitchen: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      <path d="M6 8h12M6 12h8" />
    </svg>
  ),
  Online: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Inventory: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Reports: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  Outlets: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

/* ── Reusable: feature card (icon chip + title + body) ── */
function FeatureCard({ icon, title, children }) {
  return (
    <div style={{
      background: "#ffffff", borderRadius: 14, padding: "1.4rem 1.5rem",
      border: "1px solid rgba(47,49,90,0.09)", transition: "transform 0.2s, border-color 0.2s",
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseOut ={e => { e.currentTarget.style.borderColor = "rgba(47,49,90,0.09)";   e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: "0.85rem",
      }}>
        {icon}
      </div>
      <h3 style={S.h3}>{title}</h3>
      <p style={{ ...S.body, margin: 0 }}>{children}</p>
    </div>
  );
}

/* ── Reusable: alternating image / text spotlight row ── */
function Spotlight({ eyebrow, title, body, bullets, imageSide = "right" }) {
  return (
    <>
      <style>{`
        .spot-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; padding: 3rem 0; }
        @media (max-width: 760px) { .spot-row { grid-template-columns: 1fr; gap: 1.5rem; padding: 2rem 0; } }
      `}</style>
      <div className="spot-row" style={{ borderBottom: "0.5px solid rgba(47,49,90,0.07)" }}>
        <div style={{ order: imageSide === "left" ? 0 : 1 }}>
          {/* Placeholder gradient panel — admins can swap in real screenshots later */}
          <div style={{
            width: "100%", aspectRatio: "4 / 3",
            borderRadius: 16,
            background: "linear-gradient(135deg, rgb(255, 238, 222) 0%, rgb(254, 207, 175) 100%)",
            border: "1px solid rgba(47,49,90,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(47,49,90,0.45)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            {title} screenshot
          </div>
        </div>
        <div style={{ order: imageSide === "left" ? 1 : 0 }}>
          <div style={S.label}>{eyebrow}</div>
          <h2 style={S.h2}>{title}</h2>
          <p style={{ ...S.body, marginBottom: "1.1rem" }}>{body}</p>
          {bullets && (
            <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{ ...S.body, marginBottom: "0.45rem" }}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
 * Page
 * ══════════════════════════════════════════════════════════════ */
export default function FeedMePOSPage() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>

      <SectionSidebar items={SIDEBAR_ITEMS} />

      {/* ── Hero ── */}
      <div className="pinned-hero-stage">
        <div className="product-hero" style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "5rem" }}>
          <div className="content-wrap">
          <div className="product-hero-row" style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            <div className="product-hero-textgroup" style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flex: 1, minWidth: 280 }}>
              <div className="product-hero-mobile-topline">
                <div className="product-hero-icon product-hero-icon-mobile" style={{ width: "var(--icon-lg)", height: "var(--icon-lg)", borderRadius: "var(--media-radius)", background: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", display: "none", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                  <img src={FEEDME_LOGO} alt="FeedMe POS" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
                </div>
              </div>
              {/* Logo chip */}
              <div className="product-hero-icon product-hero-icon-desktop" style={{ width: "var(--icon-lg)", height: "var(--icon-lg)", borderRadius: "var(--media-radius)", background: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                <img src={FEEDME_LOGO} alt="FeedMe POS" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }} />
              </div>

              <div style={{ flex: 1, minWidth: 240 }}>
                <div className="product-hero-eyebrow" style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                  Software We Specialize In
                </div>
                <h1 className="product-hero-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "1rem" }}>
                  FeedMe POS
                </h1>
                <p className="product-hero-body" style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 600, marginBottom: "1.5rem" }}>
                  Cloud-based F&amp;B point-of-sale built for cafés, restaurants, and food courts.
                  Table management, kitchen display, online ordering, and member loyalty —
                  all in one tablet-friendly system that syncs straight to AutoCount Accounting.
                </p>
                <div className="product-hero-btns" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {/* Demo Now — inert for now (will be wired to a Calendly / form later) */}
                  <button
                    type="button"
                    aria-disabled="true"
                    style={{ background: "#c9a84c", color: "#1e2040", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, border: "none", cursor: "default", fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Request Demo
                  </button>
                  <a
                    href={WA_LINK} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseOut ={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >WhatsApp Us</a>
                </div>
              </div>
            </div>

            {/* Right: lifestyle showcase photo */}
            <div className="product-hero-image" style={{ flex: "0 1 460px", maxWidth: 500, borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 72px rgba(0,0,0,0.35)" }}>
              <img src={HERO_PHOTO} alt="FeedMe POS in use at a restaurant" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
          </div>
        </div>
      </div>

      <main className="pinned-page-content product-app-content">
      {/* ── Key Features ── */}
      <div id="features" className="product-app-section product-app-section-paper product-app-section-clean" style={{ ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>What's Inside</div>
          <h2 style={{ ...S.h2, marginBottom: "0.75rem" }}>Everything an F&amp;B Outlet Needs</h2>
          <p style={{ ...S.body, marginBottom: "2.25rem", maxWidth: 720 }}>
            Six core modules that run on iPad, Android tablet, or Windows touchscreen — and stay
            in sync across every device, every outlet, in real time.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.1rem" }}>
            <FeatureCard icon={Icon.Tables}    title="Table & Floor Plan">
              Drag-and-drop floor layout, table-status colours, transferring orders between tables
              and merging bills — all from the waiter's tablet.
            </FeatureCard>
            <FeatureCard icon={Icon.Kitchen}   title="Kitchen Display System">
              Orders fire straight to the KDS the moment they're punched in. Mark items ready,
              colour-code by station, and route by category.
            </FeatureCard>
            <FeatureCard icon={Icon.Online}    title="Online Ordering & QR">
              Customer-facing menu, QR table ordering, take-away pickup, and delivery integration —
              all flowing into the same backend.
            </FeatureCard>
            <FeatureCard icon={Icon.Inventory} title="Recipe & Inventory">
              Track stock at the ingredient level. Recipes auto-deduct on every sale; low-stock
              alerts surface before you run out.
            </FeatureCard>
            <FeatureCard icon={Icon.Reports}   title="Real-Time Reports">
              Daily sales, hourly heatmaps, top sellers, and shift cash-up — all from a phone.
              Schedule report emails to owners and accountants automatically.
            </FeatureCard>
            <FeatureCard icon={Icon.Outlets}   title="Multi-Outlet & Member">
              Run one or many branches from a single dashboard. Built-in member, points, and
              voucher engine to bring guests back.
            </FeatureCard>
          </div>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-mist)" }}>
        <SectionDivider icon={IconLayers} targetId="modules" />
      </div>

      {/* ── Module spotlight ── */}
      <div id="modules" className="product-app-section product-app-section-mist product-app-section-from-paper product-app-section-to-ice" style={{ ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>How It Flows</div>
          <h2 style={{ ...S.h2, marginBottom: "0.75rem" }}>One Order, End-to-End</h2>
          <p style={{ ...S.body, marginBottom: "0.5rem", maxWidth: 720 }}>
            From the moment a guest sits down to the moment numbers land in your accountant's inbox,
            FeedMe POS handles every step on the same platform.
          </p>

          <Spotlight
            eyebrow="Front of House"
            title="Faster Table Service"
            body="Waiters take orders on a tablet, swap tables in two taps, and split bills any way the guest wants. No paper chits, no double-entry."
            bullets={[
              "Visual floor plan with live table status (free / seated / pay / cleaning)",
              "Bill splitting by item, by guest, or by amount",
              "Built-in modifiers & set meals — combo deals fire as a single line",
              "Offline mode keeps orders flowing if Wi-Fi drops",
            ]}
            imageSide="right"
          />

          <Spotlight
            eyebrow="Back of House"
            title="Kitchen Display, Recipe Deduction"
            body="Every order routes to the right station automatically. Recipes deduct ingredient stock the moment the cashier takes payment, so closing stock reconciles to the cent."
            bullets={[
              "Multi-station KDS — hot kitchen, cold kitchen, bar, dessert",
              "Order timing badges so you can spot bottlenecks",
              "Recipe / Bill-of-Material costing per menu item",
              "Inventory countdown for limited-quantity specials",
            ]}
            imageSide="left"
          />

          <Spotlight
            eyebrow="Digital Channels"
            title="Online Ordering, QR Table, Delivery"
            body="Open a second revenue stream without buying a second system. Your dine-in menu doubles as the QR-table menu, the take-away menu, and the delivery menu — managed once, deployed everywhere."
            bullets={[
              "QR table ordering — guests order from their phone, payment optional",
              "Self-pickup and take-away with prep-time queue",
              "Direct integrations with food-delivery platforms",
              "Branded online storefront — your menu, your colours",
            ]}
            imageSide="right"
          />

          <Spotlight
            eyebrow="Owner Dashboard"
            title="Reports You'll Actually Read"
            body="A clean phone-friendly dashboard for owners and area managers. Drill from group total down to a single voided receipt in three taps."
            bullets={[
              "Real-time daily / weekly / monthly sales by outlet",
              "Hourly sales heatmap — staff your peaks, cut your dips",
              "Top sellers, slow movers, profit margin per item",
              "Cash-up reconciliation, void / discount audit trail",
            ]}
            imageSide="left"
          />
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-mist)", "--section-to": "var(--ks-page-ice)" }}>
        <SectionDivider icon={IconLink} targetId="integration" />
      </div>

      {/* ── AutoCount integration ── */}
      <div id="integration" className="product-app-section product-app-section-ice product-app-section-to-warm" style={{ ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
          <div>
            <div style={S.label}>Built to Work Together</div>
            <h2 style={S.h2}>Syncs Straight to AutoCount Accounting</h2>
            <p style={{ ...S.body, marginBottom: "1rem" }}>
              Daily sales, payment breakdown, GST/SST, and even cost-of-goods post automatically
              into AutoCount Accounting. No CSV imports, no end-of-month panic.
            </p>
            <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
              {[
                "Daily sales summary posted as one consolidated invoice or per-receipt detail",
                "Payment-method split mapped to your AutoCount bank / cash accounts",
                "Item-level COGS push for accurate margin reporting",
                "SST / e-Invoice compliant — KLN-ready out of the box",
              ].map((b, i) => <li key={i} style={{ ...S.body, marginBottom: "0.45rem" }}>{b}</li>)}
            </ul>
          </div>
          <div style={{
            width: "100%", aspectRatio: "4 / 3",
            borderRadius: 16,
            background: "linear-gradient(135deg, rgb(255, 238, 222) 0%, rgb(254, 207, 175) 100%)",
            border: "1px solid rgba(47,49,90,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "rgba(47,49,90,0.45)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Integration diagram
          </div>
        </div>
      </div>

      <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-warm)" }}>
        <SectionDivider icon={IconHandshake} targetId="why-ksl" />
      </div>

      {/* ── Why partner with KSL ── */}
      <div id="why-ksl" className="product-app-section product-app-section-warm" style={{ ...S.section, scrollMarginTop: 24 }}>
        <div className="content-wrap">
          <div style={S.label}>Why Partner With KSL</div>
          <h2 style={{ ...S.h2, marginBottom: "0.75rem" }}>Local Installation, Local Support</h2>
          <p style={{ ...S.body, marginBottom: "2rem", maxWidth: 720 }}>
            FeedMe is the software. KSL Business Solutions is the hands that install it,
            train your team, and pick up the phone when something stops working at 9pm on a Saturday.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {[
              { title: "On-Site Setup",        body: "Hardware, network, printers, KDS screens — we wire it up and stress-test before opening day." },
              { title: "Menu & Recipe Build",  body: "We sit with your chef to load every dish, modifier, set meal, and recipe so day-one is plug-and-play." },
              { title: "Staff Training",       body: "Hands-on training for cashiers, waiters, and managers — no jargon, in Mandarin / English / Malay." },
              { title: "Long-Term Support",    body: "Backed by 40+ years of accounting experience in Pahang — you don't get a hotline overseas." },
            ].map((c, i) => (
              <div key={i} style={{ background: "#ffffff", border: "1px solid rgba(47,49,90,0.09)", borderRadius: 14, padding: "1.3rem 1.4rem" }}>
                <h3 style={{ ...S.h3, fontSize: "1rem" }}>{c.title}</h3>
                <p style={{ ...S.body, fontSize: "0.88rem", margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ── Final CTA ── */}
      <div style={{ background: "#2f315a", padding: "4rem 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
            Ready to Run Your Restaurant on FeedMe?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto 1.75rem" }}>
            Talk to KSL Business Solutions for pricing, hardware bundles, on-site setup,
            and training across Pahang.
          </p>
          <a href={WA_LINK} target="_blank" rel="noreferrer"
            style={{ display: "inline-block", background: "#2f315a", color: "#ffffff", padding: "0.85rem 2.5rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 700, textDecoration: "none", fontFamily: "inherit", transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut ={e => e.currentTarget.style.opacity = "1"}
          >
            Enquire Now
          </a>
        </div>
      </div>

      <Footer />
      </main>
    </div>
  );
}
