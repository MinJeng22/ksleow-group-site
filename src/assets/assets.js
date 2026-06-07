/**
 * assets.js — Centralized asset registry
 * =========================================
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  HOW TO SWAP A LOGO                                         │
 * │                                                             │
 * │  Each logo slot uses its own independent file.              │
 * │  To replace one, simply drop your new WebP/SVG into:         │
 * │    src/assets/logos/                                        │
 * │  and rename it to match the filename in the import below.   │
 * │                                                             │
 * │  ● Hero logo  (animated background)  → logo-hero.webp        │
 * │  ● Nav logo   (top navigation bar)   → logo-nav.webp         │
 * │  ● Footer logo (page footer)         → logo-footer.webp      │
 * │                                                             │
 * │  All three currently point to the same KSL logo image.      │
 * │  Replace any one independently without affecting the others. │
 * └─────────────────────────────────────────────────────────────┘
 */

/* ── LOGO FALLBACKS ──
 * Brand logos now live in /public/images/branding/ (managed via Decap
 * CMS → Brand Logos). The constants below are the *fallback* values
 * Nav / Hero / Footer use when branding.json is empty for a given slot.
 * They're plain URL strings, not Vite imports, so swapping a file in
 * public/images/branding/ instantly takes effect without a rebuild. */
export const LOGO_HERO   = "/images/branding/ksleow-white.webp";
export const LOGO_NAV    = "/images/branding/ksleow-original.webp";
export const LOGO_FOOTER = "/images/branding/ksleow-gold.webp";

/* ── PARTNER LOGOS ──
 * Partner images now come from CMS-uploaded files referenced in
 * partners.json. Keep the slot keys here as null placeholders for
 * Partners.jsx's structural fallback. */
export const PARTNER_LOGOS = {
  partner1: null, partner2: null, partner3: null,
  partner4: null, partner5: null, partner6: null,
};

/* ── CASE STUDY IMAGES  (src/assets/images/case-studies/) ── */
export const CASE_IMAGES = {
  networking: null,
  plugin: null,
  erp: null,
  warehouse: null,
};

/* ══════════════════════════════════════════════════════════════
 * PRODUCT LOGOS / ICONS  (src/assets/images/products/)
 * ──────────────────────────────────────────────────────────────
 * Steps to add a real product image:
 *   1. Drop your WebP/SVG into  src/assets/images/products/
 *   2. Name it to match the filename in the import below
 *   3. Uncomment the import line
 *   4. Replace  null  with the imported variable
 *
 * AutoCount Accounting 2.2 icon slot:
 *   → Recommended file:  autocount-accounting-icon.webp
 *   → Used in:  src/pages/products/AutoCountAccounting.jsx  (hero icon)
 *               src/components/Products.jsx  (product card)
 * ══════════════════════════════════════════════════════════════ */

import autocountAccountingIcon from "./images/products/autocount-accounting-icon.webp";
import autocountInterface       from "./images/products/autocount-interface.webp";
// import autocountAccounting     from "./images/products/autocount-accounting.webp";
// import autocountPos            from "./images/products/autocount-pos.webp";
// import autocountPayroll        from "./images/products/autocount-payroll.webp";
// import feedmePOS               from "./images/products/feedme-pos.webp";

export const PRODUCT_IMAGES = {
  autocountAccountingIcon: autocountAccountingIcon,   /* ← AutoCount Accounting 2.2 icon (hero page) */
  autocountInterface:       autocountInterface,       /* ← AutoCount UI screenshot (hero right side, desktop only) */
  autocountAccounting: null,   /* ← product card image */
  autocountPos: null,
  autocountPayroll: null,
  feedmePOS: null,
};

