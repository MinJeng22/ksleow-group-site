/**
 * assets.js — Centralized asset registry
 * =========================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  HOW TO SWAP A LOGO                                         │
 * │                                                             │
 * │  Each logo slot uses its own independent file.              │
 * │  To replace one, simply drop your new PNG/SVG into:         │
 * │    src/assets/logos/                                        │
 * │  and rename it to match the filename in the import below.   │
 * │                                                             │
 * │  ● Hero logo  (animated background)  → logo-hero.png        │
 * │  ● Nav logo   (top navigation bar)   → logo-nav.png         │
 * │  ● Footer logo (page footer)         → logo-footer.png      │
 * │                                                             │
 * │  All three currently point to the same KSL logo image.      │
 * │  Replace any one independently without affecting the others. │
 * └─────────────────────────────────────────────────────────────┘
 */

/* ── HERO LOGO  (src/assets/logos/logo-hero.png) ── */
import logoHero   from "./logos/logo-hero.png";
export const LOGO_HERO = logoHero;

/* ── NAV LOGO   (src/assets/logos/logo-nav.png) ── */
import logoNav    from "./logos/logo-nav.png";
export const LOGO_NAV  = logoNav;

/* ── FOOTER LOGO (src/assets/logos/logo-footer.png) ── */
import logoFooter from "./logos/logo-footer.png";
export const LOGO_FOOTER = logoFooter;

/* ── PARTNER LOGOS  (src/assets/logos/partners/partner1-6.png) ──
 * To replace: drop file → rename to partner1.png … partner6.png  */
import partner1 from "./logos/partners/partner1.png";
import partner2 from "./logos/partners/partner2.png";
import partner3 from "./logos/partners/partner3.png";
import partner4 from "./logos/partners/partner4.png";
import partner5 from "./logos/partners/partner5.png";
import partner6 from "./logos/partners/partner6.png";

export const PARTNER_LOGOS = { partner1, partner2, partner3, partner4, partner5, partner6 };

/* ── CASE STUDY IMAGES  (src/assets/images/) ── */
import caseNetworking from "./images/case-networking.jpg";
import casePlugin     from "./images/case-plugin.jpg";
import caseErp        from "./images/case-erp.jpg";
import caseWarehouse  from "./images/case-warehouse.jpg";

export const CASE_IMAGES = {
  networking: caseNetworking,
  plugin:     casePlugin,
  erp:        caseErp,
  warehouse:  caseWarehouse,
};

/* ══════════════════════════════════════════════════════════════
 * PRODUCT LOGOS / ICONS  (src/assets/images/products/)
 * ──────────────────────────────────────────────────────────────
 * Steps to add a real product image:
 *   1. Drop your PNG/SVG into  src/assets/images/products/
 *   2. Name it to match the filename in the import below
 *   3. Uncomment the import line
 *   4. Replace  null  with the imported variable
 *
 * AutoCount Accounting 2.2 icon slot:
 *   → Recommended file:  autocount-accounting-icon.png
 *   → Used in:  src/pages/products/AutoCountAccounting.jsx  (hero icon)
 *               src/components/Products.jsx  (product card)
 * ══════════════════════════════════════════════════════════════ */

// import autocountAccountingIcon from "./images/products/autocount-accounting-icon.png";
// import autocountAccounting     from "./images/products/autocount-accounting.png";
// import autocountPos            from "./images/products/autocount-pos.png";
// import autocountPayroll        from "./images/products/autocount-payroll.png";
// import feedmePOS               from "./images/products/feedme-pos.png";

export const PRODUCT_IMAGES = {
  autocountAccountingIcon: null,   /* ← AutoCount Accounting 2.2 icon (hero page) */
  autocountAccounting:     null,   /* ← product card image */
  autocountPos:            null,
  autocountPayroll:        null,
  feedmePOS:               null,
};
