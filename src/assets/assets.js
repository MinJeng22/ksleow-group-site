/**
 * assets.js — Centralized asset registry
 * ----------------------------------------
 * All images and logos are imported here.
 * To replace an asset: swap the file in the correct folder, keep the filename.
 * To rename a file: update only the import path below.
 *
 * Folder layout:
 *   src/assets/logos/              → company logo
 *   src/assets/logos/partners/     → partner logos
 *   src/assets/images/             → case study photos
 *   src/assets/images/products/    → product logos/screenshots
 */

/* ── Company Logo ── */
import kslLogo from "./logos/ksl_logo.png";
export const LOGO = kslLogo;

/* ── Partner Logos ── */
import mdot        from "./logos/partners/mdot.png";
import alfex       from "./logos/partners/alfex.png";
import autocount   from "./logos/partners/autocount.png";
import sitegiant   from "./logos/partners/sitegiant.png";
import superprintz from "./logos/partners/superprintz.png";

export const PARTNER_LOGOS = { mdot, alfex, autocount, sitegiant, superprintz };

/* ── Case Study Images ── */
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

/* ── Product Logos / Screenshots ───────────────────────────────
 * Steps to add a real product image:
 *   1. Drop the file into src/assets/images/products/
 *      e.g.  autocount-accounting.png
 *   2. Uncomment (or add) the import line below
 *   3. Set the value here instead of null
 *   4. In Products.jsx, pass the imported variable to img: PRODUCT_IMAGES.autocountAccounting
 * ─────────────────────────────────────────────────────────────*/
// import autocountAccounting from "./images/products/autocount-accounting.png";
// import autocountPos        from "./images/products/autocount-pos.png";
// import autocountPayroll    from "./images/products/autocount-payroll.png";
// import feedmePOS           from "./images/products/feedme-pos.png";

export const PRODUCT_IMAGES = {
  autocountAccounting: null,   /* ← replace null with imported var */
  autocountPos:        null,
  autocountPayroll:    null,
  feedmePOS:           null,
};
