/**
 * assets.js — Centralized asset registry
 * =========================================
 * HOW TO SWAP A LOGO
 * ------------------
 * 1. Drop your new PNG/SVG file into the correct folder (see paths below).
 * 2. RENAME the file to match the filename already written in the import
 *    statement — e.g. rename your file to "ksl_logo.png".
 *    OR update the filename in the import line to match your file.
 * 3. Save. The change reflects everywhere automatically.
 *
 * Folder layout:
 *   src/assets/logos/              ← MAIN LOGO (hero, nav, footer)
 *   src/assets/logos/partners/     ← PARTNER LOGOS (6 slots)
 *   src/assets/images/             ← Case study photos
 *   src/assets/images/products/    ← Product card logos
 */

/* ══════════════════════════════════════════════════════════════
 * MAIN LOGO
 * Used in: Hero (animated BG), Nav (header), Footer
 * To replace: swap the file at  src/assets/logos/ksl_logo.png
 * ══════════════════════════════════════════════════════════════ */
import kslLogo from "./logos/ksl_logo.png";
export const LOGO = kslLogo;

/* ══════════════════════════════════════════════════════════════
 * PARTNER LOGOS  (6 slots)
 * To replace a partner logo:
 *   Drop your image into  src/assets/logos/partners/
 *   and rename it to match the filename below (e.g. partner1.png).
 * ══════════════════════════════════════════════════════════════ */
import partner1 from "./logos/partners/partner1.png";
import partner2 from "./logos/partners/partner2.png";
import partner3 from "./logos/partners/partner3.png";
import partner4 from "./logos/partners/partner4.png";
import partner5 from "./logos/partners/partner5.png";
import partner6 from "./logos/partners/partner6.png";

export const PARTNER_LOGOS = {
  partner1,
  partner2,
  partner3,
  partner4,
  partner5,
  partner6,
};

/* ══════════════════════════════════════════════════════════════
 * CASE STUDY IMAGES
 * To replace: drop file into  src/assets/images/  and rename
 * ══════════════════════════════════════════════════════════════ */
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
 * PRODUCT LOGOS / SCREENSHOTS  (4 slots)
 * Steps to add a real product image:
 *   1. Drop file into  src/assets/images/products/
 *   2. Uncomment the import line below
 *   3. Replace  null  with the imported variable
 * ══════════════════════════════════════════════════════════════ */
// import autocountAccounting from "./images/products/autocount-accounting.png";
// import autocountPos        from "./images/products/autocount-pos.png";
// import autocountPayroll    from "./images/products/autocount-payroll.png";
// import feedmePOS           from "./images/products/feedme-pos.png";

export const PRODUCT_IMAGES = {
  autocountAccounting: null,   /* ← replace null with imported variable */
  autocountPos:        null,
  autocountPayroll:    null,
  feedmePOS:           null,
};
