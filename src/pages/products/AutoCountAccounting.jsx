import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import { WA_LINK } from "../../constants/contact.js";
import { PRODUCT_IMAGES } from "../../assets/assets.js";

/* ═══════════════════════════════════════════════════════════════
 * AUTOCOUNT ACCOUNTING — PRODUCT PAGE
 *
 * RELEASE NOTE DATA
 * ─────────────────
 * Each entry in RELEASES represents one AutoCount 2.2 revision.
 * Format:
 *   version:  "2.2.X.Y"   full version string
 *   rev:      "Rev N"      short revision label shown in timeline
 *   date:     release date (string)
 *   dbVer:    database version upgraded to
 *   server:   required AutoCount Server version
 *   features: string[] — new feature bullet points
 *   fixes:    string[] — bug fix bullet points
 *
 * TO ADD A NEW RELEASE: prepend a new object to the top of the array.
 * The timeline renders newest first automatically.
 * ═══════════════════════════════════════════════════════════════ */
const RELEASES = [
  {
    version: "2.2.25.36", rev: "Rev 36", date: "2026-01-08",
    dbVer: "2.2.91", server: "2.2.13.11",
    features: [
      "Enhance Audit Trail to record Bank Reconciliation activities",
      "Enhance Audit Trail to record edit YTD Balance Maintenance activities",
      "Support transactions exceeding RM10,000 to prompt warning if not submitted as regular e-Invoice",
      "Support auto email validated e-Invoice to Tax Entity Email and Branch Email",
      "Add View Flow function at Credit Note and Purchase Return",
      "Add Keep Email Message and Attachment file History function",
      "Enhance Self-Bill Copy From Document to add related Supplier Document Number",
      "Add warning message to indicate ARDN does not support e-Invoice",
      "New 1 Account Plus Edition",
      "New AutoCount Chatbot",
      "Allow Stock User Type to access Self-Billed e-Invoice function",
      "Enhance Cash Sale Request e-Invoice — allow user to request e-Invoice if not included in Consolidated e-Invoice",
      "Add Home Currency for HKD and GBP",
      "Rename Access Right Bank Book Manager to Bank Book Analysis",
      "Add foreign key constraints to e-Invoice and Withholding Tax tables",
      "Improve prompt message when saving a Tax Entity that already exists",
      "Support Local Email Sending for POS Frontend without depending on AutoCount Server",
    ],
    fixes: [
      "Fix User Maintenance — editing Direct Access Right not recorded in Audit Trail",
      "Fix Check BOM Material Inquiry shows incorrect result with Include Outstanding PO SO AO and Calculate All UOMs",
      "Fix Serial Number input form keeps loading Cost column and not following saved layout",
      "Fix incorrect GST term in warning message when editing SST-processed transaction",
      "Fix View Flow does not display transfer link for Purchase Invoice to Purchase Return",
      "Fix View Flow displays incorrect color for transfer line from Invoice to CN",
      "Fix AR CN preview in e-Invoice format shows QR code before e-Invoice submission",
      "Fix Open Server Mailing List attachment error due to invalid attachment file name",
      "Fix Debtor and Creditor Statement not showing Balance amount when row data is 0 or null",
      "Fix Filter by Current Location not working when View then Edit transaction",
      "Fix unable to open Further description in Find stock item",
      "Fix some reports not displaying past year historical price after year end",
      "Fix date field in Purge Data not auto-tabbing to month/year after entering day",
      "Fix Plugin Manager Menu Install AutoCount POS 5.1 Server not working correctly",
      "Fix Transaction Summary in Journal Transaction Detail with Summary report shows incorrect values",
      "Fix some System Report binding data not showing in 2.2.25.34",
      "Fix Stock Item Inquiry prompts error when right-clicking on Stock Level Grid",
      "Fix Print Bar Code preview always shows only 1 barcode regardless of quantity",
      "Fix Rebuild serial number prompts Timeout expired error",
      "Fix AR Monthly Sales Analysis Report shows incorrect Withholding Tax value",
      "Fix Purchase Agent Listing Report shows wrong caption Sales Agent instead of Purchase Agent",
      "Fix Print Bar Code incorrect icon for Delete Button",
      "Fix AutoCount Management Studio Fix Partial Transfer miscalculates transferred quantity",
      "Fix Self-Billed Currency Exchange Rate field editable for MYR after clear cache",
      "Fix Consolidated e-Invoice Final Total decimal format inconsistent with other columns",
      "Fix Upgrade Account Book from 1.9 to 2.2 hits error Column TaxCode does not belong to table GLDTL",
      "Fix Unable to Merge Tax Entity mismatching BEGIN and COMMIT statement count",
    ],
  },
  {
    version: "2.2.25.34", rev: "Rev 34", date: "2025-10-10",
    dbVer: "2.2.90", server: "2.2.13.9",
    features: [
      "Update System Report and User Report to save and open as XML",
      "Add new Export Service Tax Code (SVE) for SST02 column 18a",
      "[SG] Add purge data function for Singapore Retrieve Document",
      "Add purge data function for Import Supplier e-Invoice from MyInvois Portal",
      "Enhance to copy Debtor Maintenance Sales Tax Exemption No to Detail at transaction",
      "Enhance Financial Report to split AccNo and AccDesc into 2 columns when using Export Function",
      "Add Audit Trail Record in Philippines BIR Setting",
      "Support Posting Account Group Maintenance for POS only packages",
    ],
    fixes: [
      "Fix report system/user report not differentiated by blue color under Malay Language",
      "Fix Post to Adjustment from Stock Take error Value was either too large or too small for an Int32",
      "Fix e-Invoice sales transaction Listing save layout not working on some e-Invoice fields",
      "Fix Period Lock Manage Exception missing Consolidated and Self-Billed e-Invoice Document",
      "Fix Sales/Purchase Auto Price not working after Year End due to IPHIST and Past Year",
      "Fix Unable to Change Code for Debtor error related to column SGEInvoicePeppolFormat",
      "Fix After Reset IPHIST in Studio price history report has duplicate AQ and POS records",
    ],
  },
  {
    version: "2.2.24.33", rev: "Rev 33", date: "2025-09-25",
    dbVer: "2.2.89", server: "2.2.13.7",
    features: [
      "Add new checking for Inconsistent Debtor and Creditor company name with its Tax Entity name",
      "Enhance Audit Trail for both Single and Batch Get TIN",
      "Increase Form Size for Change Code Account Number and Item Code",
      "Hide Get TIN from AIP Server button when Cash Sale Debtor is enabled",
      "Add e-Invoice QR Request function in Cash Sales for Cash Sale Debtors",
      "New function Sync e-Invoice Reject Request from MyInvois Portal",
      "Optimize performance for Cash Flow Forecast with many Debtors/Creditors",
      "Move Withholding Tax Option page into Country and Tax as a tab",
      "Update SST-02 Form latest format and added new Tax Codes",
      "Add Delete Price History table (IPHIST) function under Rebuild IPHIST function",
      "Add checking Serial Number Items with abnormal in/out movement in Year End Closing",
      "Enhance Import Supplier e-Invoice from MyInvois Portal to add IsReject column",
      "Enhance e-Invoice Submission function to add POS Document Type",
      "Enhance Debtor and Creditor Maintenance to add Import QR function for Tax Entity",
      "[SG] InvoiceNow add PEPPOL Format at Debtor",
    ],
    fixes: [
      "Fix Recurrence generated transaction auto generates as approved regardless of access right",
      "Fix Print Bar Code if import from transaction with Qty 0 or null but have FOC Qty will not add to grid",
      "Fix Project and Department Maintenance New Top Level shortcut not working",
      "Fix price category under row chooser shows empty for no AccNo",
      "Fix Generate Recurrence error Year Month and Day parameters describe an un-representable DateTime",
      "Fix Incorrect Consignment Quantity after change Item UOM Rate",
      "Fix AR/AP Credit Notes should not allow selecting General journal type unless Is Credit Journal is enabled",
      "Fix Sales Order did not apply Basic Multi-UOM logic resulting in incorrect S/O quantity in Available Stock Status",
      "Fix Debit Note in Item Profit Margin not displaying smallest UOM even when filter option is enabled",
      "Fix Purchase Request when highlight multiple lines and delete will miss delete certain lines",
      "Fix Attempt to copy a Delivery Order transferred to Invoice (Draft) and save will prompt transfer error",
      "Fix Consignment Movement shows incorrect CSGN Quantity if Invoice is saved as Draft",
      "Fix Non Cash Sale Debtor if select Tax Entity will update address in Invoice",
      "Fix Item Profit Margin report option Detail Sort By not working when preview and print",
      "Fix Period Lock Incorrectly Uses Issue Date Instead of Document Date",
      "Fix Serial numbers not shown in Consignment Return Serial Number Transfer screen if partially transferred",
      "Fix error You are not allowed to delete e-Invoice document detail record when edit Invoice knocked off in ARPayment with discount",
      "Fix Unable to access Consolidated e-Invoice after disable Allow to do Consolidated e-Invoice",
      "Fix Create new Consolidated e-Invoice prompts Value was either too large or too small for an Int64",
      "Fix Reconcile Supplier e-Invoice function rearranges grid column automatically after Inquiry",
      "Fix Self-Bill e-Invoice if choose Government Tax Entity applies wrong TIN for submission",
      "Fix Submit for Approval error Document date cannot submit future date time when user lacks Approve Access Right",
      "Fix Open KIV Document Automatically Submits e-Invoice Upon Save when user lacks Approve Invoice Access Right",
      "Fix Project and Department able to set as Parent even if already have transactions",
      "Fix Resend Validate E-Invoice Email Does Not Refresh When using Search and Attachment Remains Unchanged",
      "Fix Purchase Request transfer to existing Purchase Order refreshes existing item Unit Price",
      "Fix Unable to import data file into account book using ImportXml.exe",
      "Fix ARCN able to edit Debtor Code without enabling Allow Edit or Delete AR AP Documents Posted From Other Source",
      "Fix Purchase Request prompts Deleted row information cannot be accessed through the row when deleting detail item",
      "Fix Unique UDF unable to set Required and prompts Unknown SQL Exception Error",
      "Fix Year End Closing includes negative quantities from D/O as stock-out causing incorrect Serial Number quantities",
      "Fix Year End Closing does not run rebuild serial number if closing year has no serial number transactions",
      "Fix Negative Serial Number Quantity Inquiry includes negative quantities from D/O causing incorrect Qty",
      "Fix Self-Billed and Consolidated e-Invoice Filter by Created User and Last Modified User not working",
      "Fix Self Bill when copy from Purchase Document with discount copies discount value incorrectly",
      "Fix Using API to post transactions will not auto add New Current Year if using YearMonth numbering format",
      "Fix Preview report special designed for Malay Language prompts error",
      "Fix SST Processor unapplied payment does not consider forfeited deposit",
      "Fix Object Reference error when double click supplier e-Invoice from another software missing tax record",
      "Fix Converting Supplier e-Invoice to AP Invoice does not use Subtotal as Amount",
      "Fix Unable to upgrade account book due to IPHIST",
      "Fix e-Invoice Document submitted with exempted tax has missing amount in Amount Exempted from Tax",
      "Fix PEPPOL Tab Appears on First Open of Debtor/Creditor Form",
      "Fix Tax Journal Voucher Listing report did not update tax wording to TAX",
    ],
  },
  {
    version: "2.2.23.32", rev: "Rev 32", date: "2025-08-08",
    dbVer: "2.2.88", server: "2.2.13.6",
    features: [],
    fixes: [
      "Fix Import Supplier e-Invoice when convert to Purchase Invoice prompts Column SGEInvoicePeppolInstanceID does not belong to table Master",
      "Fix Invalid Value error when change Purchase Invoice document date",
    ],
  },
  {
    version: "2.2.23.31", rev: "Rev 31", date: "2025-08-06",
    dbVer: "2.2.88", server: "2.2.13.6",
    features: [
      "[SG] SG InvoiceNow - Submit Order",
      "Optimize the performance of Stock Aging Report when filter by multiple item groups",
      "Enhance Import Stock Item to Support Unit Code for Singapore InvoiceNow use",
      "Enhance Rebuild price history to handle Sales Order and Purchase Order with BatchNo that does not exist in database",
    ],
    fixes: [
      "Fix Member generated from Debtor Maintenance miss copy certain fields",
      "Fix The local total cost in the invoice should not be editable for transferred documents",
      "Fix Ledger report still shows Tax Code after removal from transaction",
      "Fix Cash Book Tax Code did not update to GLDTL table if edit tax code to null",
      "Fix Reconcile Supplier e-Invoice AC Net Total captures Net Total instead of Final Total for Purchase Invoice, Cash Purchase or Purchase Return",
      "Fix AutoCount Server Schedule Backup setting unable to load interface if setting contains invalid values",
      "Fix Incorrect Balance Quantity checking when editing an existing Draft Document which deducts stock",
      "Fix Unable to void AR Payment that is linked to Cash Sale even if enabled Allow to Edit or Delete AR and AP Documents Posted from Other Source",
    ],
  },
  {
    version: "2.2.22.30", rev: "Rev 30", date: "2025-07-29",
    dbVer: "2.2.87", server: "2.2.13.6",
    features: [
      "Import Supplier e-Invoice from MyInvois Portal",
      "Reconcile Supplier e-Invoice",
      "Support Clear MRU",
      "Enhance Auto Email e-Invoice Customize Content function to standardize 2 decimal format for Final Total parameter",
      "Support Customize Layout features at Self-Bill Copy From Document form",
      "New auto update version mechanism",
      "[SG] Add InvoiceNow Info to Invoice, Credit Note, Purchase Invoice and Purchase Return",
      "Support Document Status Filter at Print Purchase Request Listing and Detail Listing",
      "Add option to Enable Edit Validated e-Invoice within 72 hours mechanism",
      "[PH] Philippine VAT - Disable sales ATC checking",
      "Add Check All Button for Auto Calculate Price in Stock Item Maintenance",
      "Enhance when generate System Type Consolidated e-Invoice to use server date time",
      "Support drill down to Self-Billed document when click on Self-Bill DocNo at related command form",
      "Add Merge Tax Entity access right",
      "Support Export to Excel XLSX format in Multi-dimensional Sales, Purchase, Ledger Analysis",
      "Optimize Account Maintenance loading speed when have high numbers of GL Account",
    ],
    fixes: [
      "Fix Option allow to edit or delete AR AP documents posted from other source not functioning when delete or void document",
      "Fix unable to display license name correctly at main page bottom when consist of ampersand character",
      "Fix Item Level By Location filter location does not work on existing maintained records",
      "Fix error Delete value does not belong to table when save Item Level by Location Entry",
      "Fix e-Invoice submission uses Footer Caption as line description instead of Footer Name",
      "Fix Repost prompts You are not allowed to edit expired or void document if have voided document and tick reupdate or recalculate option",
      "Fix Price history in Show Instant Info will empty when using Filter by Agent",
      "Fix Print Consignment related Detail Listing report Include Item Package Detail and Exclude Item Package Master Document option not working",
      "Fix Auto Email validated e-Invoice will email e-Invoice before validated if it goes through editing action",
      "Fix Unable to edit and knock off additional invoice if AR Payment had knock off invoice with discount amount which already generated ARCN and submitted e-Invoice",
      "Fix Default Classification Code not applied in transfer documents for detail lines without item code",
      "Fix Invoice, Credit Note, Debit Note and Cash Sale Annexure missing View Shipping Recipient function",
      "Fix Stock Write Off save MRU not functioning",
      "Fix Stock Disassembly save MRU not functioning and incorrect position for Remark 2 and Remark 3 under MRU menu",
      "Fix DPI issue on Withholding Tax Entry form from Invoice causing unable to see Save and Cancel button",
      "Fix Add Group Discount by Value or Percent resets to Default Supply Purchase and Tax Code for CN, DN and PR Document",
      "Fix Goods Return MRU incorrectly shared with Goods Receive Note MRU",
      "Fix Journal prompts truncate error if Ref2 is more than 20 characters",
      "Disable Consolidated e-Invoice manual input issue date time",
      "Fix Failed to Update PBalance due to special character",
      "Fix Merge Tax Entity will not show if only enable e-Invoice",
      "Fix some UI glitch at Import Data Options causing special Note unable to show full message",
      "Fix Auto Email validated e-Invoice function sends email with empty attachment",
      "Fix Footer amount not added to Net Total should not be included for e-Invoice submission",
      "Fix Change Code for BatchNo did not consider for Sales order",
    ],
  },
  {
    version: "2.2.21.29", rev: "Rev 29", date: "2025-06-18",
    dbVer: "2.2.86", server: "2.2.13.4",
    features: [
      "Enhance Self-billed view source document to support customized layout",
      "Remove characters checking control for Annexure fields",
      "Enhance Invoice to support cash sale debtor to select Tax Entity",
      "Enhance Consolidated e-Invoice to support manual create",
      "Add Colour differentiation at Invoice to differentiate e-Invoice transactions validated within 72 hours",
      "Add e-invoice status change log function",
      "New editing mechanism for e-Invoice document within 72 hours",
      "Update the valid end date of the interim relaxation period",
      "Enhance Consolidated e-Invoice summary preview form to add Rounding Adjustment and Final Total columns",
    ],
    fixes: [
      "[PH] Fix Philippines WHT Withholding Tax Maintenance blocked to create WHT Control Account if filter by account module was enabled",
      "Fix incorrect behavior submitting e-Invoice even though Invoice was already submitted in Consolidated e-Invoice",
      "Fix Void button missing from invoice after included in Consolidated e-Invoice but cancelled later",
      "Fix Stock Card captures incorrect source for CSGN Bal Qty when To Date filter is earlier than last Consignment transaction",
      "Fix Self-billed system report unable to show Measurement",
      "Fix incorrect period lock validation when Purchase Document uses Original Document Date",
      "Fix AR Payment unable to save 2nd time to apply unapplied amount if 1st time already knocked off with discount and generated ARCN with e-Invoice",
      "Fix error Column WithholdingTaxVersion does not belong to table Master",
      "Fix Upgrade account book error on Repost GL and Withholding Tax Trans Column WithholdingTaxRoundingMethod does not belong to table ARPayment",
      "Fix Copy paste whole document from Package Detail Table with AccountingBasis column will error when paste to Table without AccountingBasis column",
      "Fix Cannot set column InvAddr1 value violates MaxLength limit",
      "Fix error Specified cast is not valid when save document",
      "Fix Create new account book with copy master data will prompt error WithholdingTaxCode in table creditor does not exist in master file",
      "Fix system did not revalidate source document e-Invoice status when saving Consolidated e-Invoice",
      "Fix Consolidated e-Invoice Total in English wording should represent amount after rounding adjustments",
      "Fix Stock Recalculation Export to Excel stops due to Unable to Create Directory Using Company Name with Trailing Spaces",
      "Fix Stock recalculation stops unexpectedly due to leading or trailing spaces in StockDTL records",
      "Fix Unable to import GL, ARAP, Sales Purchase from third party XML",
      "Fix Upgrade database hits bsp_ChangeTaxCode error",
    ],
  },
  {
    version: "2.2.19.27", rev: "Rev 27", date: "2025-05-08",
    dbVer: "2.2.84", server: "2.2.13.4",
    features: [
      "Add e-Invoice License Control",
      "Add Rounding Method option for withholding tax calculation for Malaysia account books",
      "Accounting For Academic (Backup and Restore for LocalDB only)",
      "Implement Past Year Price History into Report inquiry, Management Studio and Year End",
      "Enhance Self Billed document to show Tax column even when Tax Setting is not enabled",
      "Enhance Self Billed able to copy from APCN, APDN and Purchase Return",
      "Support Date filtering when using Copy Function in Self Billed",
      "Add new setting for default classification code",
      "Support future Document Date transactions to use today date as submission date when Document Date is not valid for e-Invoice",
      "Enhance Use today date as submission date dialog to prompt only when user has Allow to change Issue Date Time Access Right",
      "Increase OurInvoiceNumber field length to 100 characters",
      "Support Credit Note and AR Credit Note to submit e-Invoice type as Refund Note",
      "Enhance Cash Sale when using Cash Sale Debtor and select Tax Entity to auto copy Tax Entity Details",
      "Add Annexure Field in Purchase Invoice and AP Invoice with Copy Functionality to Self Bill",
      "Change Default auto expired setting for Approval Flow to 30 days",
      "Enhance login and loading performance when account book has plugin",
      "Enhance Show Top X Items per document type in Tools Options to allow -1 value to not filter",
    ],
    fixes: [
      "Fix Inconsistent copy behavior for currency rate when Copy AP Payment and Cash Book PV",
      "Fix Create New Account Book default access right for Can Cancel Uncancel at AP transactions did not include ADMINS group",
      "Fix when enable Can Edit Documents Items that were Transferred should not allow Adding New Items via Item Search for Full Transfer Document",
      "Fix system hangs during batch invoice approval when have backorder or below minimum price prompts",
      "Fix duplicate submission of e-Invoice document at AIP Server",
      "Fix when delete item from item maintenance need consider IPHIST table",
      "Fix Debtor/Creditor Type and Account Type columns appear blank in Price History report",
      "Fix newly created schedule backup task does not show up on screen after being added",
      "Fix Fail to connect to AutoCount Server error throws FormatException in Simplified Chinese",
      "Fix login page labels and input fields not aligned correctly in Traditional Chinese, Indonesian and Malay UI",
      "Fix Invoice right-click option Enable Batch Re-Submit does not refresh the All tab after being used in Approved tab",
      "Fix when Self Billed copy from PI the APInvoice Self Billed DocNo column is not updated",
      "Fix Upgrade account book hits Error on Repost GL and Withholding Tax Trans Column WithholdingTaxVersion does not belong to table ARPayment",
      "Fix Annexure key in longer custom form no 1 and 9 prompts error should only have maximum of 19 characters per reference number",
    ],
  },
  {
    version: "2.2.18.26", rev: "Rev 26", date: "2025-04-17",
    dbVer: "2.2.83", server: "2.2.13.3",
    features: [],
    fixes: [
      "Fix upgrade from Accounting version 1.9 to 2.0 will hang when ARAP Deposit contains forfeited records",
      "Fix Transfer document hits Value was either too large or too small for an Int32 error due to Smallest Quantity having too many decimals",
      "Fix Unhandled SQL Connectivity Exceptions in E-Invoice Queue Background Timer",
    ],
  },
  {
    version: "2.2.18.25", rev: "Rev 25", date: "2025-04-10",
    dbVer: "2.2.83", server: "2.2.13.3",
    features: [
      "Enhance Debtor Statement Batch Mail PDF attachment default file name to follow Report Name",
      "Enhance Consolidated Self-Bill to display Pay To/Company Name field in detail description field",
      "Enhance Self-Bill when copy from transaction and select multiple different Tax Entity to prompt user to select copy action",
      "Enhance Self-Bill Copy From transaction to auto fill in Classification Code based on latest Self-Bill document by specific Tax Entity",
      "Enhance Import Cash Book with excel to support import TIN and Identity Number column",
      "Enhance to store Email SMTP setting in database instead of Local PC",
      "Add Auto email function for validated e-Invoice to Debtor Email",
      "Add new System Report on e-Invoice for ARCN",
      "Enhance Consolidated e-Invoice to add Rounding Adjustment and Final Total column into Command Form Grid",
      "Enhance Show Instant Info setting Show Top X Items per document type to support until 99,999",
      "Support additional countries when create new Account Book",
      "Restored IPHIST table structure and added Rebuild Price History function at Management Studio",
      "[PH] Enhance BIR 2307 Report Withholding Tax Descriptions Display and SLSP Report purchase Filter",
      "[PH] Updated Year Format in Philippines Cash Book Cheque Report from 2 to 4-Digit Display",
      "Add Search TIN function at Tax Entity",
      "Increased Annexure Field Length for E-Invoice to compatible with LHDN latest field length requirements",
      "Optimized Item Location Price Maintenance and Entry overall performance",
      "Redefine Posting Withholding Tax logic for GL Trans, Bank Trans and Withholding Tax Trans",
      "Add Merge Tax Entity function",
      "Add new option to Auto assign approve date as e-Invoice Issue Date",
    ],
    fixes: [
      "Fix when creating a new Batch No using lookup edit system does not automatically select the newly added batch no",
      "Fix Preview Financial Report Fails to Display User ID",
      "Fix Self-Bill when copy from other transactions and modify document date the document rate does not reflect immediately",
      "Fix missing some e-Invoice related fields in Item Maintenance Advanced Layout",
      "Fix error Unknown SQL Exception Invalid column name Sales Agent when running Monthly Sales Analysis Report",
      "Fix Purchase Invoice right click option Copy to new Self-Billed did not hide and accessible by Stock Type Users",
      "Fix Unknown SQL Exception There is already an object named StockSum in the database when performing Change Item UOM Rate",
      "Fix CI DocNo missing when document is used to perform Consolidated e-Invoice but failed the first submission",
      "Fix Consolidated e-Invoice system report misses out Rounding Adjustment and Final Total fields",
      "Fix Network User Monitor shows blank due to concurrent static list access to AutoCount Server",
      "Fix when enabling e-Invoice system does not include AR Credit Note between start date and relaxation date for Consolidated e-Invoice",
      "Fix ARAP Deposit when performing multiple refunds with bank charge tax code prompts Column SourceKey is constrained to be unique",
      "Fix Price History function in Item Inquiry and Show Instant Info retrieves Master Location incorrectly instead of Detail Location",
      "Fix when using Simplified Chinese Language the Merge function is missing from Change Item Code interface",
      "Fix Show Instant Info Price History displays Local Unit Price and Local Subtotal values incorrectly",
      "Fix Ledger Report still displays Ref2 with value even after data is deleted from source transaction",
      "Fix Unknown SQL Exception error Invalid Column Name DoNotSubmitEInvoice when upgrade from 1.9 or lower to 2.2 Rev 24",
      "Fix machines running in Chinese language hit error Bad gRPC response HTTP status code 400 during login",
      "Fix transfer form Balance Quantity field did not follow decimal setting and displays incorrect decimal places",
      "Fix Year End Processing error Failed to update PBalance AccNo when database has GST processor related Journals",
      "Fix Consolidated e-Invoice submission fails when have detail lines with tax code not linked with Govt Tax Code",
      "Fix Multi-Dimensional Sales Analysis prompts You must choose at least one data area option when only Show Unit Price is checked",
      "Fix Quotation and Purchase Request generated before enabling Approval flow will not auto expire according to setting",
      "Fix typo error Rebuilt for the successful message of Rebuild Consignment Balance Quantity Table",
    ],
  },
  {
    version: "2.2.17.24", rev: "Rev 24", date: "2025-02-05",
    dbVer: "2.2.82", server: "2.2.13.1",
    features: [
      "Support to show Draft Document record in CN and DN Listing and Detail Listing report",
      "Support option in Debtor to not submit e-Invoice",
      "Enhance to treat empty space as NOT APPLICABLE for Business Activity Description in Tax Entity during e-Invoice submission",
      "Add Consolidated e-Invoice detail line limit option",
    ],
    fixes: [
      "Fix Unable to edit submitted e-Invoice document from Find Transaction function",
      "Fix Unable to Upgrade Account Book due to large record in GST Processor",
      "Fix Restore old version account book did not auto clear the AIP Company ID",
      "[PH] Fix error Unable to cast object of type System.DBNull to type System.Byte[] in BIR 2307 Report",
      "Fix Failed to update PBalance caused by trailing space",
      "Fix Create Consolidated e-invoice prompts Cannot cast DBNull.Value to type System.Decimal error if no use Tax",
    ],
  },
  {
    version: "2.2.16.23", rev: "Rev 23", date: "2025-01-22",
    dbVer: "2.2.81", server: "2.2.13.1",
    features: [
      "Enhance ARAP Listing to add Ref No 2",
      "Remove Pocket AutoCount access right",
      "Enhance Price History structure",
      "Standardize the Measurement value at Item Maintenance command form and entry form",
      "[PH] BIR Settings allow add image for signature and new withholding tax codes",
      "Improve Tax Entity Import QR default to auto browser Image/Picture file type",
      "Increase data length for Annexure related fields for Malaysia e-Invoice",
      "Enhance Company Profile to show company e-Invoice status if connected",
      "Add Refresh button to update latest Debtor/Creditor TIN into transaction",
      "Optimize Change Item UOM Rate to generate smaller changelog if there is imbalance of StockDTL and ItemBatchBalQty",
    ],
    fixes: [
      "Fix Change User-Defined Data Type Size change AccNo, ProjNo or DeptNo will fail and hit error",
      "Fix Default account did not capture from Item Group if Debtor has Posting Group but posting account is blank",
      "Fix Save button missing in Edit Mode if access from another account",
      "Fix Export and Import Cash Purchase prompts object reference error",
      "Fix Self-Billed copy from Purchase Invoice did not copy the same subtotal from PI",
      "Fix Create new ARAP document will not prompt for Tax severity alert if did not enable approval workflow",
      "Fix Outstanding Service Tax Listing incorrect taxable amount and tax amount",
      "Fix Stock Card shows incorrect CSGN Qty CSGN Cost OnHandQty and OnHandCost if enable include no transaction item",
      "Fix some Deadlock issue for Post to stock transactions",
      "Fix Failed to update Acc. No when save document",
      "Fix Self Bill did not reflect possible next number correctly if apply by Monthly running number",
      "Fix Audit Trail did not record when editing Submit e-Invoice and Consolidated e-Invoice checkbox at transaction",
      "Fix Restore account book did not auto clear AIP Company ID",
      "Fix Unable to untick Allow to create Consolidate e-Invoice option",
      "Fix Using Merge in Change Account Number hits cannot insert duplicate key error",
      "Fix Unable to Fix Bank Transaction if there is void document",
      "Fix Sales Agent Expenses unable to capture Chinese character sales agent",
      "Fix AR Payment knock off with Discount and generate CN prompts maximum character limit error if knock off too many invoices",
      "Fix Transaction does not display correct Tax Entity if Debtor Tax Entity and transferred document Tax Entity are different",
      "Fix Run Consolidated e-Invoice prompts cannot set Column Location property Max Length to 2",
      "Fix Serial Number Trans did not consider deleted consignment",
    ],
  },
  {
    version: "2.2.14.20", rev: "Rev 20", date: "2024-12-18",
    dbVer: "2.2.79", server: "2.2.13.1",
    features: [
      "Enhance Back Order Control to consider Disable POS module if uninstall POS",
      "Support Print Self-Billed Detail Listing",
      "Enhance Self-Billed copy from to add Tax Entity column",
      "Enhance Self-Billed document unit price to follow Purchase Unit Price decimal setting",
      "Enhance show Draft Document record in Invoice Listing and Detail Listing report",
      "Support e-Invoice in ARCN document",
      "Support Consolidated e-Invoice for ARCN document",
      "Optimize saving transactions related to GL to reduce deadlock frequency",
      "Optimize Consolidated Financial Report performance",
      "Enhance Self-Billed to support copy from AP Invoice",
      "Optimize saving transactions that update settings to reduce deadlock frequency",
      "Add UI for AutoCount Server Configuration on Accounting",
      "Enhance Self-Billed to support copy from Cash Purchase",
      "Add BI Dashboard Sales Overview under Sales Menu (Basic Edition and above)",
      "Enhance Consolidated e-Invoice support rounding adjustment",
      "Optimize Auto Generate Item Code performance",
      "Remove Stock Item Inquiry Stock Level tab right click Show Zero Qty Stock Level",
      "Add Always check if the database exists in the Scheduled Backup option",
      "Remove Imported Goods Document function for other countries other than Malaysia",
      "Support new Country/Currency Rwanda",
      "Enhance e-Invoice related document Detail Listing to add Classification Code",
      "Optimize Year End with many Project and Department Closing Account Balance slow performance",
      "Enhance Intelligent Costing slow to update the stock document cost",
      "Add new Import QR Code for Tax Entity record",
    ],
    fixes: [
      "Fix Chinese username prompts error Unable to connect to server after login",
      "Fix Debtor Description 2 did not show on screen when create new debtor and click into description 2 column",
      "Fix BOM Listing shows incorrect Qty in S/O and Qty in P/O after transfer when transaction not in Base UOM",
      "Fix unable to close Serial Number form with error serial number count exceeds transferred detail quantity",
      "Fix ARAP document able to call out Find Panel in New/Edit mode when open form first time",
      "Fix Column Tick does not belong to table Master if have save layout",
      "Fix Export stock if select cash sales only after import the payment date in cash sales will be updated to posting date",
      "Fix incorrect remaining quantity and transferred quantity if edit existing draft document and save as approve after removing transferred item",
      "Fix upgrade database to 2.2.73 will timeout if have ARAP Deposit with refund or forfeited records",
      "Fix duplicated sample Chart of Accounts for Singapore Seamless Filling when create new account book",
      "Fix ARAP DN/CN use Icon button to save does not update if make changes on detail description or amount",
      "Fix unable to approve Draft P/O transferred from S/O error over transferred quantity in partial transfer",
      "Fix Change serial number prompts invalid suffix to Serial number must be alphanumeric and cannot consist of only alphabets",
      "Fix Multi-Dimensional Sales Analysis right click and sort at Profit Margin column prompts error Failed to compare two elements in the array",
      "Fix Stock Item Maintenance right click Preview and Print function missing",
      "Fix Invoice prompts backorder even if item has Auto UOM Conversion and still have stock",
      "Fix Incorrect Purchase Request No spelling if enable Use Tabbed Layout in Document",
      "Fix Stock Card shows incorrect datetime format for Item batch manufactured date and batch expiry date",
      "Fix Consignment return prompts error when transfer from multiple Consignment with Merge Detail Items if SN consigned out for second time",
      "Fix preview stock card no cost with SerialNo info prompts Deleted row information cannot be accessed through the row",
      "Fix DPI issue Stock item Inquiry cannot show stock level quantity correctly",
      "Fix Date in warning message for using future date for e-Invoice submission is inconsistent with document date format",
      "Fix Error on SST on Payment You are not allowed to edit expired or void document",
      "Fix Stock Card always timeouts if have certain volume of consignment transactions",
      "Fix Year End dialog option caption did not show full sentence",
      "Fix Year End Calculate Account Balance section shows negative total record when total record is too large",
      "Fix rare issue on cannot delete read-only Stock Item when switching UOM",
      "Fix AR AP Invoice listing by Payment Type Report Sort By not working",
      "Fix Transfer from Purchase Request should not prompt update item unit price message",
      "Fix Rounding Adjustment should not be allowed to edit in IV, CS, DN, CN document",
      "Fix Unknown Sql Exception error when use Find Bonus Point Adjustment with Advanced Search and filter member number or point",
      "Fix Unable to Repost GL/AR/AP Transactions if there is void document",
      "Fix Consolidated Financial Report shows Incorrect value if use Project comparison or Filter by Project when project does not exist in another book",
      "Fix Debtor Maintenance grid shows empty for new update tax entity/TIN",
      "Fix Stock Card hangs and has performance issue when have many consignment records",
      "Fix Monthly Sales/Purchase Analysis when Group Level 2 choose Item Class or Item Category will cause unable to filter",
    ],
  },
  {
    version: "2.2.12.18", rev: "Rev 18", date: "2024-10-24",
    dbVer: "2.2.77", server: "2.2.11.2",
    features: [],
    fixes: [
      "Fix saving Sales and Purchase document prompts error Deleted row information cannot be accessed through the row after edit and delete detail line but click undo again",
      "Fix saving ARAP document prompts error after edit document and delete detail line but click undo again",
      "Fix Can Edit Document access right not functioning when create invoice for the first time after login",
      "Fix some deadlock issue while updating records to IPHIST table (Price History)",
      "Fix AR Receive Payment shows incorrect currency caption if involved multiple currency",
      "Fix Stock Card prompts Deleted row information cannot be accessed through the row after inquiry",
      "Fix Stock Card shows Item Costing Method incorrectly",
      "Fix Stock Card prompts object reference error after inquiry",
      "Fix Overdue Letter untick Include Post-Dated Cheque and inquiry prompts Unknown SQL Exception error",
      "Fix Import Stock Item prompts object reference error",
      "Fix Debtor Maintenance did not remove Is Tax Registered column after implementing Tax Entity",
    ],
  },
  {
    version: "2.2.12.17", rev: "Rev 17", date: "2024-10-17",
    dbVer: "2.2.77", server: "2.2.11.2",
    features: [
      "Enhance Consolidated Self-Billed",
      "Enhance Sales Document Detail Listing to show Detail Sales Exemption Number",
      "Enhance Stock Assembly Order and Stock Assembly Detail Listing to show FG Item Batch No",
      "Enhance Range set for Sales transaction to have Sales Tax Exemption No",
      "Add View Tax Entity button at Debtor and Creditor Maintenance Tax Entity field",
      "Enhance Self bill copy from document dialog to multiple highlight records to check or uncheck selection",
      "Add Submission ID in AutoCount E-Invoice info",
      "Enhance Consolidated e-Invoice summary to add Location column",
      "Disable drill down for Consolidate transactional drill down as it will always show empty",
      "Enhance Batch Get TIN to have email column and editable",
      "Enhance Stock Card performance to handle large volume of transactions",
      "Enhance to allow e-Invoice Issue Date to be in a different later month to DocDate",
      "Enhance Debtor/Creditor Maintenance generate new Tax Entity through Tax Entity Lookup Add New button to auto copy related info",
    ],
    fixes: [
      "Fix Inquiry Debtor statement when filter parent group company (multi level) shows object reference not set to an instance of an object",
      "Fix View Flow incorrect if change Debtor on Delivery Order transferred from Sales Order",
      "Fix Copy as spreadsheet when paste at excel has many extra lines if further description has image",
      "Fix when Import XML will have error for Cash Book, ARAP Payment, ARAP Refund",
      "Fix Consolidated e-Invoice when get Payment Mode performance issue",
      "Fix Timeout expired error when inquiry Advanced Quotation Detail Listing",
      "Fix Self bill when select another document number format will not reflect on next possible number at header",
      "Fix Advanced Quotation Void button remains visible even after the transaction is voided",
      "Fix Bonus point redemption Tax Entity link null error",
      "Fix Duplicate barcode prompts LocalizableStringAttribute was not defined if not using English language",
      "Fix some UI issue at login screen when use Malay language",
      "Fix Stock Aging Inactive Item option missing",
      "Fix when Preview bank Reconciled Transaction Report the Date and Time show incorrectly",
      "Fix Import .acx file which contains ARAP prompts The value of column TaxEntityID in table does not exist in its master file",
      "Fix when Delete UOM for Item with alternative item code prompts error",
    ],
  },
  {
    version: "2.2.11.16", rev: "Rev 16", date: "2024-10-02",
    dbVer: "2.2.76", server: "2.2.11.2",
    features: [
      "Enhance to support Foreign Charges, Local Charges, Duty columns for Copy as spreadsheet and Paste Item Detail for GRN and PI",
      "[SG] Seamless Filing - remove Unneeded Code for Previous Implementation",
      "Add select all and unselect all button for Filter by Sales/Purchase Agent at User Editor",
      "Enhance Report Designer Company Profile table to add in Tax Entity related fields",
      "Add progress bar for Consolidated e-Invoice",
      "Add Sales Location column at Command Form and Listing grid for Consolidated e-Invoice",
    ],
    fixes: [
      "Fix Year End Closing issue system did not consider AR Deposit and AR Payment linking causing incorrect Outstanding AR Deposit report after year end",
      "Fix when click on debtor code prompts You are not allowed to change the debtor code because this document has transferred item",
      "Fix Cash Book copy from other Cash Book function data grid sorting will run after search",
      "Fix Invoice subtotal amount resets to zero when change doc date",
      "Fix copy Debtor unable paste debtor in another account book if the copied debtor has Tax Entity",
      "Fix Group discount subtotal missing after transfer and change document date",
      "Fix create new account book first time login will always prompt perform rebuild Tax Transaction Cancelled",
      "Fix shortcut key not working when select item with serial num(insert) at Sales transactions",
      "Fix Outstanding Service Tax Listing shows different Collected Local Tax compared to Tax Payment Collection",
      "Fix Duty will not auto update if transfer from PO",
      "Fix Stock Item Maintenance copy to new Item will duplicate Item Price Book record",
      "Fix Profit and Loss by Document will always show Project and Department column at detail even removed and save layout",
      "Fix Auto Convert Sales Price or Purchase Price based on Currency Rate not functioning when enable Use Multi Pricing",
      "Fix performance issue during generate Consolidated e-Invoice",
      "Fix Consolidated e-Invoice that incorrectly handles 250 detail line record on each Consolidated e-Invoice",
      "Fix Self Billed command form right click grid header layout shows duplicate button",
      "Fix Consolidated e-Invoice Print Listing performance issue",
      "Fix Journal Entry Copy from other Journal Entry form right click grid header layout shows duplicate button",
      "Fix Stock Item Inquiry (New) missing Stock Card in Customize Layout",
      "Fix Annexure info for freight allowance charge amount and reason did not submit to LHDN if no shipping recipient tax entity assigned",
      "Fix SST Processor and SST Instant Info calculate wrong tax amount if transaction has payment basis tax code and withholding tax",
      "Fix timeout error when login account book with huge logo at Company Profile",
      "Fix Global Price Change reminder did not prompt when scheduled date time was reached",
      "Fix untransfer items from Cash Sale or Cash Purchase will not make detail lines back to normal or untransfer status",
      "Fix Stock document listing with detail report shows incorrect date format",
      "Fix Credit Note Our Invoice No. did not check on Cash Sale transaction for UUID and will assume no Invoice reference and submit as NA",
    ],
  },
  {
    version: "2.2.11.15", rev: "Rev 15", date: "2024-09-12",
    dbVer: "2.2.76", server: "2.2.11.2",
    features: [
      "Remove Tax Code ESV-6 and ESV-8 from require sales tax exemption number",
      "Enhance allow third party developer to call approved and save approved document API",
    ],
    fixes: [
      "Fix inconsistent behaviour when using Find Item search where mouse focus is lost after search",
      "Fix voided Cash Sale from 3rd party XML imports displayed as Approved in AR Invoice",
      "Fix when upgrade database version to 2.2.76 will hang at validate database stage",
      "Fix create Purchase Order/Request Quotation and click transfer from Purchase Request prompts Invalid column name CreditorCode error",
      "Fix create Purchase Invoice and click transfer from Purchase Consignment prompts Invalid column name Transferable error",
    ],
  },
  {
    version: "2.2.11.14", rev: "Rev 14", date: "2024-09-05",
    dbVer: "2.2.76", server: "2.2.11.2",
    features: [
      "Enhance edit Stock Take detail Remarks column to record into event message for Audit Trail",
      "Add Lost column for Consignment Return and Purchase Consignment Return Detail Listing report",
      "Remove inactive user under Layout Manager assign layout to users",
      "Add Preview and Print for Consolidated e-Invoice",
      "Add Batch Approve function for Debit Note",
      "Enhance Consolidated e-Invoice to support POS Transaction Payment Means (Payment Mode)",
      "Enhance Tax Entity for Sales and Purchase Documents",
      "Enhance Credit Note to support Cash Sale Debtor to select Tax Entity",
      "Enhance DocNo to support up till 30 characters",
      "Add access right Can Edit Document No in Self-Billed Invoice",
      "Enhance Consolidated e-Invoice for handle submit e-Invoice 300kb file size limit",
      "Add access right Can Change Document No Format in Self-Billed Invoice and Consolidated e-Invoice",
      "Enhance slow performance issue when transfer documents involving large databases",
    ],
    fixes: [
      "Fix Audit Trail missing record for editing of some field for AR AP document",
      "Fix Tax transaction audit trail listing missing Return Chq transaction for PV/OR with tax code",
      "Fix wrong calculation for Back Order when Stock Assembly Order transfer to Stock Assembly",
      "Fix Inconsistent design for Validation Link",
      "Fix view Invalid Consolidate e-Invoice unable to show the Consolidate Invoice No.",
      "Fix Bonus Point Adjustment when paste detail from excel Point does not follow decimal provided and auto rounds",
      "Fix inquiry Stock balance prompts Value was either too large or too small for Type Decimal error",
      "Fix import .acx file for e-Invoice missing out certain fields",
      "Fix incorrectly categorizes some non-exemption tax code into exemption tax code category",
      "Fix incorrect calculation on outstanding amount of credit limit when approve Draft document transferred from other document",
      "Fix unable to auto refresh e-Invoice status after import third party xml data",
      "Fix inquiry Debtor Aging by agent report with filter sales agent prompts Unknown Sql Exception error",
      "Fix Import 3rd Party XML if transaction is Void and not in account book causes status to show incorrectly",
      "Fix change currency code prompts FK_EInvoiceSelfBilled_CurrencyCode error if currency used in self-billed",
      "Fix Import UBS Stock/POS Stock prompts Column AutoCalcPrice does not allow nulls error",
      "Fix Cash Sales Void button remains visible after the transaction is voided",
    ],
  },
  {
    version: "2.2.9.12", rev: "Rev 12", date: "2024-08-23",
    dbVer: "2.2.74", server: "2.2.11.2",
    features: [
      "Enhance Self-Billed copy from PI/AR CN form to show Debtor/Creditor name and account number",
    ],
    fixes: [
      "Fix Self-Billed grid shows empty for few Annexure information fields",
    ],
  },
  {
    version: "2.2.9.11", rev: "Rev 11", date: "2024-08-20",
    dbVer: "2.2.74", server: "2.2.11.2",
    features: [
      "Enhance to show confirmation message when have more than 100K records after click Refresh in GL, ARAP and Invoicing command form",
      "Enhance transaction to capture default tax entity from Debtor when copy to new transaction instead of copying source transaction tax entity",
      "Enhance to show confirmation message if change tax entity in transaction",
      "Add function to batch resubmit e-Invoice for Invoice and Credit Note document",
      "Add e-Invoice error message to show at e-Invoice status section at transaction entry",
      "Add e-Invoice Detail button at e-Invoice status section at transaction entry",
    ],
    fixes: [
      "Fix Create New Account book and copy master data error Cannot set column EmailAddress value violates MaxLength limit",
      "Fix Proceed New Cash Transaction will untick after relogin",
      "Fix Self Bill Description unable to save Chinese characters",
      "Fix Export and Import ACX file will cause e-Invoice to resubmit",
      "Fix Consolidate e-Invoice did not handle user tax code linked to Govt Tax Code properly causing e-Invoice validation to fail",
      "Fix Tax Entity Identity Type should not have null value selection",
      "Fix Self bill able to change currency rate if currency is Home Currency",
      "Fix Missing Desc2 Field for Stock Document CurrentDetailRecord application scripting",
      "Fix when creating Consolidated e-invoice prompts Cannot cast DBNull.Value to type System.Decimal error",
    ],
  },
  {
    version: "2.2.8.10", rev: "Rev 10", date: "2024-08-15",
    dbVer: "2.2.73", server: "2.2.11.2",
    features: [
      "Enhance ARAP document load grid view data performance in command form",
      "Add Annexure info field at sales invoice report design",
      "Add progress bar for batch approval function",
    ],
    fixes: [
      "Fix Cash Purchase using Multi Payment posts wrong Payment Currency and rate to AP Payment if Multi Payment select different Payment Currency",
      "Fix system did not block delete ARInvoice that has draft payment causing error when approve or delete the ARPayment",
      "Fix Change user-defined data type size prompts error Unable to shrink the size because data is longer than this size",
      "Fix Change Currency code Perform Merge prompts Violation of UNIQUE KEY",
      "Fix Debtor with Branch causes transaction to not have TIN",
      "Fix Repost Delivery Order with tick re-update account no. from item group and default account not functioning",
      "Fix Consolidated e-invoice prompts Cannot cast DBNull.Value to type System.Decimal error",
      "Fix Self-Billed range set did not filter out unrelated classification code as detail line",
      "Fix No need enforce AR Refund Approval Flow option when tick e-Invoice option",
      "Fix Missing showing Original Document Date at Purchase Invoice",
      "Fix Upgrade account book which got tax exemption prompts error",
      "Fix Tax Entity Gov will not have BRN when submit e-Invoice if not provided",
      "Fix Unable to Rebuild Serial Num table if include Assembly Order document",
      "Fix refresh document e-Invoice status prompts DBConcurrency exception error",
      "Fix POS transaction with negative and positive amount submits incorrect consolidated e-Invoice",
      "Fix MustGenerateEInvoice does not allow nulls error on Import UBS Stock Item",
      "Fix fail to copy area code from other account book",
      "Fix change invoice command form document status tab page prompts ArgumentNullException error",
      "Fix multi select date filter form prompts FormatException error",
      "Fix Consolidated e-Invoice need consider POS sales order transaction",
      "Fix preview outstanding sales order report prompts DeletedRowInaccessibleException error",
      "Fix Invoice, Credit Note and Debit Note details range set miss out Classification field",
      "Fix when import item measurement using Import All Data function prompts FormatException error",
      "Fix when perform Batch Approve captures incorrect Tax Entity information if transaction has branch code selected",
    ],
  },
  {
    version: "2.2.7.9", rev: "Rev 9", date: "2024-08-08",
    dbVer: "2.2.72", server: "2.2.11.2",
    features: [
      "[PH] Enhance BIR 2307 Report",
      "Move Load and Save Last Description and Journal Type logic from Logic level to Form level",
      "Enhance GL, Sales and Purchase document load grid view data performance in command form",
    ],
    fixes: [
      "Fix Unable to run Database Maintenance function if database name contains hyphen character",
      "Fix Stock Take Detail Listing missing function Convert Further Description and Note to Plain Text",
      "Fix Purchase detail listing report save layout does not function",
      "Fix Preview Invoice Detail Listing error if tick include Item Package Detail and exclude item package master document",
      "Fix No validation for Tax exemption reason during submit e-Invoice",
      "Fix Credit Note/Debit Note block submit e-Invoice when referring to invoice that does not submit e-Invoice",
    ],
  },
  {
    version: "2.2.6.8", rev: "Rev 8", date: "2024-08-06",
    dbVer: "2.2.71", server: "2.2.11.2",
    features: [
      "Allow Inconsistent Qty of Serial Num do Year End Closing",
      "Consolidated E-Invoice - Support Audit Trail",
      "Enhance company profile reset company ID",
      "Credit Note transfer from Invoice e-Invoice status is empty no need check e-invoice reference invoice field",
    ],
    fixes: [
      "Fix Import Journal from Excel function (old version) prompts error if paste 2nd time A DataTable named ATC already belongs to this DataSet",
      "Fix Prompt Timeout expired error when inquiry Inventory Physical Worksheet by Consignment",
      "Fix Prompt Invalid Data Definition Language statement Execution Timeout Expired when upgrade",
      "Fix Unable to repost document You are not allowed to edit expired or void document plus eInvoice Document not allow Edit",
      "Fix Create Draft document and click close or cancel button and press Yes to save changes will Approve the document",
      "Fix Unrealized Gain Loss delete prompts You are not allowed to delete document because post from source document",
      "Fix Import from Excel menu did not show if add access right for Import Tax Entity Only",
      "Fix System did not use GovtTaxCode to submit e-invoice",
      "Fix Primary key error when approve Invoice which transfer from DO with serial number",
      "Fix Foreign currency revaluation delete prompts You are not allowed to delete document because post from source document",
      "Fix Edit Delivery Order prompts Deleted row information cannot be accessed through the row in certain scenario",
    ],
  },
  {
    version: "2.2.6.7", rev: "Rev 7", date: "2024-08-01",
    dbVer: "2.2.71", server: "2.2.11.2",
    features: [
      "Remove submit e-Invoice for AR Refund",
    ],
    fixes: [
      "Fix Item Opening Balance Maintenance prompts object reference after tick or untick Use Search Lookup Edit",
      "Fix Stock Card error Column CSGNBalQty does not belong to table Master",
      "Fix ESC key does not function when use to exit New Cash Book and New Journal",
      "Fix Unable to save debtor after reselecting another TIN number Tax Entity in use cannot change and delete",
      "Fix Create new Consolidated e-Invoice prompts Value was either too large or too small for an Int32",
    ],
  },
  {
    version: "2.2.5.6", rev: "Rev 6", date: "2024-07-31",
    dbVer: "2.2.70", server: "2.2.11.2",
    features: [
      "Add Consolidated e-Invoice checkbox in e-Invoice Document",
      "Request to add Classification and Origin Country at report design for sales module",
      "Add Annexure tab in e-Invoice document for tabbed layout",
      "Set AR Refund default submit e-Invoice untick",
      "Debtor/Creditor for Malaysia allow change taxentityID even if have transaction",
    ],
    fixes: [
      "Fix Create new GST processor prompts Unknown SQL exception Invalid column name DocStatus",
      "Fix Upgrade account book which has Withholding tax prompts error Column DocStatus does not belong to table Master",
    ],
  },
  {
    version: "2.2.4.5", rev: "Rev 5", date: "2024-07-30",
    dbVer: "2.2.69", server: "2.2.11.2",
    features: [
      "Add e-Invoice Issue Date Time function",
      "Add MyInvois Portal Client ID in Company Profile",
      "Support Approval Flow in Import Export Data",
      "Support Approval Flow in Import Xml Third party",
    ],
    fixes: [
      "Fix Unable to open KIV document saved in version before 2.2 Values accept A, P, D, E, R, V",
    ],
  },
  {
    version: "2.2.3.4", rev: "Rev 4", date: "2024-07-26",
    dbVer: "2.2.68", server: "2.2.11.2",
    features: [
      "Add Approve and Preview, Approve and Print and Reject button image",
    ],
    fixes: [
      "Fix Create new account book copy master data from other account book prompts Unknown Sql Exception SQL error number 515",
      "Fix Check transferred to status error if document is partial transfer SQL error number 4145",
      "Fix Unable to approve violet Credit Limit please enable approval in documents",
      "Fix Prompt company or api key invalid issue when submit e-Invoice from 2.2 beta version Account Book",
      "Fix Unable to save P/O (transfer from S/O) Over transferred quantity when user edits on P/O",
    ],
  },
  {
    version: "2.2.2.3", rev: "Rev 3", date: "2024-07-23",
    dbVer: "2.2.67", server: "2.2.11.2",
    features: [
      "e-Invoice Self-Billed support",
      "E-Invoice Consolidated Invoice",
      "Batch Request TIN",
      "E-Invoice Report",
      "Add Approval Flow in ARAP and GL document",
      "Add Approval Flow in Sales and Purchase document",
      "Add Batch Approve for Invoice and CN document",
      "Add Classification field for Invoice, Cash Sales, DN and CN",
      "Add e-Invoice related fields for Invoice, cash sales, dn and cn",
      "Add Annexure in Sales Invoice",
      "Add function to key in Tax Entity for Cash Sales transaction",
      "Add e-Invoice related fields for Refund Note",
      "Add Self Bill Invoice function",
      "Add Consolidate Invoice function",
      "Watermark mechanism for Approval Flow function",
      "Enhance Approval Flow for Stock, Sales and Purchase report",
      "Enhance Approval Flow for ARAP and GL report",
      "Add e-Invoice Submission Status function",
      "Allow create new Draft document from Import From Excel",
    ],
    fixes: [
      "Fix Easy Item value goes missing after set Supply Tax Code at grid",
      "Fix Tax Menu did not show at Top Menu even after adding all access right for Tax Entity Maintenance",
      "Fix Tax entity maintenance empty MSIC code at grid",
    ],
  },
];

/* ── Feature pill colours by type ── */
const TAG = {
  feature: { bg: "rgba(47,49,90,0.08)", color: "#2f315a", label: "New" },
  fix: { bg: "rgba(201,168,76,0.12)", color: "#8a6a10", label: "Fix" },
};

/* ── Copy release notes to clipboard (WhatsApp format) ── */
function copyToClipboard(r, type) {
  const lines = type === "features" ? r.features : r.fixes;
  const header = type === "features"
    ? `*AutoCount ${r.version} — New Features*`
    : `*AutoCount ${r.version} — Bug Fixes*`;
  const text = header + "\n" + lines.map(l => `• ${l}`).join("\n");
  navigator.clipboard.writeText(text).catch(() => { });
}

/* ── Copy compare-mode results (array of {ver, rev, text}) ── */
function copyCompare(items, fromVer, toVer, type) {
  const header = type === "features"
    ? `*AutoCount New Features (${fromVer} → ${toVer})*`
    : `*AutoCount Bug Fixes (${fromVer} → ${toVer})*`;
  const text = header + "\n" + items.map(f => `[${f.rev}] • ${f.text}`).join("\n");
  navigator.clipboard.writeText(text).catch(() => { });
}

function ReleaseBadge({ type }) {
  const t = TAG[type];
  return (
    <span style={{
      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "0.18rem 0.55rem",
      borderRadius: 50, background: t.bg, color: t.color,
      flexShrink: 0,
    }}>
      {t.label}
    </span>
  );
}

/* ── Copy button ── */
function CopyBtn({ onClick, gold }) {
  const [copied, setCopied] = React.useState(false);
  function handle() {
    onClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handle}
      title="Copy for WhatsApp"
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.3rem",
        background: copied ? (gold ? "rgba(201,168,76,0.2)" : "rgba(47,49,90,0.12)") : "transparent",
        border: `1px solid ${gold ? "rgba(201,168,76,0.35)" : "rgba(47,49,90,0.18)"}`,
        borderRadius: 50, padding: "0.2rem 0.6rem",
        fontSize: "0.62rem", fontWeight: 600,
        color: copied ? (gold ? "#8a6a10" : "#2f315a") : "#a8abcc",
        cursor: "pointer", fontFamily: "inherit",
        transition: "all 0.2s",
      }}
    >
      {copied ? "✓ Copied" : (
        <>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function ReleaseCard({ r, expanded, onToggle }) {
  const isLatest = r === RELEASES[0];
  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${expanded ? "rgba(47,49,90,0.22)" : "rgba(47,49,90,0.1)"}`,
      background: "#ffffff",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Header row */}
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: "1rem", padding: "1.1rem 1.4rem",
          background: expanded ? "#f8f8fb" : "transparent",
          border: "none", cursor: "pointer", fontFamily: "inherit",
          textAlign: "left", transition: "background 0.2s",
        }}
      >
        {/* Version + date */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2f315a" }}>{r.version}</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#a8abcc", letterSpacing: "0.04em" }}>{r.rev}</span>
            {isLatest && (
              <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", background: "#2f315a", color: "#c9a84c", padding: "0.18rem 0.6rem", borderRadius: 50 }}>
                Latest
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.78rem", color: "#a8abcc", marginTop: 2 }}>
            Released {r.date} · DB {r.dbVer} · Server {r.server}
          </div>
        </div>
        {/* counts */}
        <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "0.72rem", color: "#2f315a", fontWeight: 600 }}>✦ {r.features.length} New</span>
          <span style={{ fontSize: "0.72rem", color: "#8a6a10", fontWeight: 600 }}>⬡ {r.fixes.length} Fix</span>
        </div>
        {/* chevron */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2"
          style={{ flexShrink: 0, transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div style={{ padding: "0 1.4rem 1.4rem", borderTop: "0.5px solid rgba(47,49,90,0.08)" }}>
          <div className="release-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "1.1rem" }}>
            {/* New Features */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2f315a" }}>
                  New Features
                </div>
                <CopyBtn onClick={() => copyToClipboard(r, "features")} />
              </div>
              {r.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseBadge type="feature" />
                  <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
            {/* Bug Fixes */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a6a10" }}>
                  Bug Fixes
                </div>
                <CopyBtn onClick={() => copyToClipboard(r, "fixes")} gold />
              </div>
              {r.fixes.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <ReleaseBadge type="fix" />
                  <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AutoCountAccountingPage({ onContact }) {
  const navigate = useNavigate();

  /* Fix 5: always start at top of page when navigating here */
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const [expanded, setExpanded] = useState(0);   /* first card open by default */
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(RELEASES[RELEASES.length - 1].version); /* oldest */
  const [compareB, setCompareB] = useState(RELEASES[0].version);                   /* newest */

  const filtered = RELEASES.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.version.includes(q) || r.rev.toLowerCase().includes(q) ||
      r.features.some(f => f.toLowerCase().includes(q)) ||
      r.fixes.some(f => f.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ background: "#f5f5f8", minHeight: "100vh" }}>

      {/* ── Hero banner ── */}
      <div style={{ background: "#2f315a", paddingTop: "7rem", paddingBottom: "4rem" }}>
        <div className="content-wrap">
          <button
            onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.75)", padding: "0.4rem 1rem", borderRadius: 50, fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", transition: "background 0.2s" }}
            onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            ← Back
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
            {/* Left: icon + copy + buttons */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flex: 1, minWidth: 280 }}>
              {/* icon — replace via src/assets/images/products/autocount-accounting-icon.png */}
              <div style={{ width: 80, height: 80, borderRadius: 18, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", flexShrink: 0, overflow: "hidden" }}>
                {PRODUCT_IMAGES.autocountAccountingIcon
                  ? <img src={PRODUCT_IMAGES.autocountAccountingIcon} alt="AutoCount Accounting" style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }} />
                  : <span>🧾</span>
                }
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                  Software We Specialize In
                </div>
                <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, marginBottom: "1rem" }}>
                  AutoCount Accounting 2.2
                </h1>
                <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.78, maxWidth: 600, marginBottom: "1.5rem" }}>
                  Malaysia's leading SME accounting software — cloud-connected, SST & e-Invoice compliant,
                  and deeply integrated with AutoCount POS and Payroll. As an authorized dealer,
                  KSL Business Solutions provides full installation, configuration, training, and ongoing support.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button
                    onClick={onContact}
                    style={{ background: "#c9a84c", color: "#1e2040", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                  >
                    Get a Quote
                  </button>
                  <a
                    href={WA_LINK} target="_blank" rel="noreferrer"
                    style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 2rem", borderRadius: 50, fontSize: "0.9rem", fontWeight: 500, textDecoration: "none", transition: "background 0.2s" }}
                    onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>

            {/* Right: product showcase image — desktop only (hidden via .product-hero-image media query) */}
            {PRODUCT_IMAGES.autocountInterface && (
              <div className="product-hero-image" style={{
                flex: "0 1 420px", maxWidth: 460,
                borderRadius: 14, overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 18px 48px rgba(0,0,0,0.35)",
              }}>
                <img src={PRODUCT_IMAGES.autocountInterface} alt="AutoCount Accounting interface"
                  style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Feature highlights ── */}
      <div style={{ background: "#ffffff", padding: "3rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" }}>
        <div className="content-wrap">
          <div className="ac-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {[
              { icon: "✅", title: "SST & e-Invoice", desc: "Fully compliant with LHDN MyInvois and Malaysia SST requirements" },
              { icon: "🔗", title: "Integrated", desc: "Seamlessly linked with AutoCount POS, Cloud Payroll modules, and your custom ERP systems." },
              { icon: "🎯", title: "Prompt Technical Support", desc: "Fast response times and expert troubleshooting from the KSL team during business days to keep your operations running smoothly." },
              { icon: "⚙️", title: "Highly Extensible", desc: "Fully supports C# & .NET plugins, custom fields, and scripting to adapt to your unique business workflows." },
            ].map((f, i) => (
              <div key={i} style={{ padding: "1.25rem", borderRadius: 12, background: "#f8f8fb", border: "1px solid rgba(47,49,90,0.07)" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "0.6rem" }}>{f.icon}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#2f315a", marginBottom: "0.35rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b6f91", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════
       * LEARN AUTOCOUNT IN 60 MINUTES — Vertical stacked layout
       * ══════════════════════════════════════════════════════════ */}
      <div style={{ background: "#ffffff", padding: "4.5rem 0", borderBottom: "0.5px solid rgba(47,49,90,0.08)" }}>
        <div className="content-wrap">
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.6rem",
            }}>
              Free Training
            </div>
            <h2 style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", fontWeight: 700,
              color: "#2f315a", lineHeight: 1.2, marginBottom: "0.9rem",
            }}>
              Learn AutoCount Accounting in Just 60 Minutes
            </h2>
            <p style={{
              fontSize: "0.95rem", color: "#6b6f91", lineHeight: 1.8,
              maxWidth: 560, margin: "0 auto 1.5rem",
            }}>
              Skip the long manuals. AutoCount's 60-minute guide covers
              everything you need to know to navigate AutoCount Accounting
              with confidence — from basic setup to daily transactions.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="https://youtu.be/ztmg4hvro6U?si=hojFUhwFF0gOmzA8"
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  background: "#2f315a", color: "#ffffff",
                  padding: "0.75rem 1.75rem", borderRadius: 50,
                  fontSize: "0.88rem", fontWeight: 600,
                  textDecoration: "none", transition: "background 0.2s",
                }}
                onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
                onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                Watch on YouTube
              </a>
              <span style={{
                display: "inline-flex", alignItems: "center",
                fontSize: "0.82rem", color: "#a8abcc", fontWeight: 500,
                padding: "0.75rem 1rem",
              }}>
                Free · 60 min · By AutoCount
              </span>
            </div>
          </div>

          {/* Full-width embed */}
          <div style={{
            borderRadius: 18, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(47,49,90,0.16)",
            border: "1px solid rgba(47,49,90,0.08)",
          }}>
            <div style={{ paddingBottom: "56.25%", position: "relative", background: "#0f1128" }}>
              <iframe
                src="https://www.youtube.com/embed/ztmg4hvro6U"
                title="Learn AutoCount Accounting in 60 Minutes"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Release Notes ── */}
      <div style={{ padding: "4rem 0" }}>
        <div className="content-wrap">

          {/* ── Title + tab switcher ── */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "0.5rem" }}>
                Changelog
              </div>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#2f315a" }}>
                Release Notes — Ver 2.2
              </h2>
              <p style={{ fontSize: "0.85rem", color: "#6b6f91", marginTop: "0.35rem" }}>
                {RELEASES.length} revisions · Rev 3 → Rev 36 · Newest first
              </p>
            </div>
            {/* Mode toggle */}
            <div style={{ display: "flex", background: "#f0f0f5", borderRadius: 50, padding: 4, gap: 2 }}>
              {[["browse", "Browse All"], ["compare", "Compare Versions"]].map(([mode, label]) => (
                <button key={mode}
                  onClick={() => setCompareMode(mode === "compare")}
                  style={{
                    fontSize: "0.78rem", fontWeight: 600,
                    padding: "0.4rem 1.1rem", borderRadius: 50, border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                    background: (compareMode ? "compare" : "browse") === mode ? "#2f315a" : "transparent",
                    color: (compareMode ? "compare" : "browse") === mode ? "#ffffff" : "#6b6f91",
                    transition: "background 0.2s, color 0.2s",
                  }}
                >{label}</button>
              ))}
            </div>
          </div>

          {/* ── COMPARE MODE ── */}
          {compareMode && (() => {
            const rA = RELEASES.find(r => r.version === compareA);
            const rB = RELEASES.find(r => r.version === compareB);
            const idxA = RELEASES.indexOf(rA);
            const idxB = RELEASES.indexOf(rB);
            const older = idxA > idxB ? rA : rB;
            const newer = idxA > idxB ? rB : rA;
            /* collect all items from older→newer (exclusive) */
            const olderIdx = RELEASES.indexOf(older);
            const newerIdx = RELEASES.indexOf(newer);
            const between = RELEASES.slice(newerIdx, olderIdx + 1);
            const allFeatures = between.flatMap(r => r.features.map(f => ({ ver: r.version, rev: r.rev, text: f })));
            const allFixes = between.flatMap(r => r.fixes.map(f => ({ ver: r.version, rev: r.rev, text: f })));
            return (
              <div>
                {/* Selectors */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>From version</label>
                    <select value={compareA} onChange={e => setCompareA(e.target.value)}
                      style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                      {RELEASES.slice().reverse().map(r => <option key={r.version} value={r.version}>{r.version} ({r.rev})</option>)}
                    </select>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "1.3rem", color: "#c9a84c", marginTop: "1.2rem" }}>→</div>
                  <div>
                    <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: "0.4rem" }}>To version</label>
                    <select value={compareB} onChange={e => setCompareB(e.target.value)}
                      style={{ width: "100%", height: 40, borderRadius: 10, border: "1px solid rgba(47,49,90,0.2)", padding: "0 0.85rem", fontSize: "0.88rem", fontFamily: "inherit", color: "#2f315a", background: "#ffffff", cursor: "pointer" }}>
                      {RELEASES.map(r => <option key={r.version} value={r.version}>{r.version} ({r.rev})</option>)}
                    </select>
                  </div>
                </div>

                {/* Summary bar */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                  {[
                    { label: "Revisions covered", val: between.length, bg: "rgba(47,49,90,0.06)", col: "#2f315a" },
                    { label: "New features", val: allFeatures.length, bg: "rgba(47,49,90,0.06)", col: "#2f315a" },
                    { label: "Bug fixes", val: allFixes.length, bg: "rgba(201,168,76,0.1)", col: "#8a6a10" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, minWidth: 120, background: s.bg, borderRadius: 12, padding: "1rem 1.25rem" }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#6b6f91", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Changelog between the two versions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2f315a" }}>New Features ({allFeatures.length})</div>
                      {allFeatures.length > 0 && <CopyBtn onClick={() => copyCompare(allFeatures, compareA, compareB, "features")} />}
                    </div>
                    {allFeatures.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No new features in this range.</div>}
                    {allFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(47,49,90,0.08)", color: "#2f315a", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#ffffff", borderRadius: 14, padding: "1.4rem", border: "1px solid rgba(47,49,90,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8a6a10" }}>Bug Fixes ({allFixes.length})</div>
                      {allFixes.length > 0 && <CopyBtn onClick={() => copyCompare(allFixes, compareA, compareB, "fixes")} gold />}
                    </div>
                    {allFixes.length === 0 && <div style={{ fontSize: "0.82rem", color: "#a8abcc" }}>No bug fixes in this range.</div>}
                    {allFixes.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", padding: "0.2rem 0.5rem", borderRadius: 50, background: "rgba(201,168,76,0.12)", color: "#8a6a10", flexShrink: 0, marginTop: 2 }}>{f.rev}</span>
                        <span style={{ fontSize: "0.83rem", color: "#444", lineHeight: 1.6 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── BROWSE MODE ── */}
          {!compareMode && <>
            {/* Search + collapse */}
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 280 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8abcc" strokeWidth="2"
                  style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Search version or keyword…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ width: "100%", paddingLeft: 30, paddingRight: 12, height: 36, borderRadius: 50, border: "1px solid rgba(47,49,90,0.18)", fontSize: "0.82rem", fontFamily: "inherit", color: "#2f315a", outline: "none" }}
                />
              </div>
              <button onClick={() => setExpanded(null)}
                style={{ fontSize: "0.78rem", color: "#6b6f91", background: "transparent", border: "1px solid rgba(47,49,90,0.15)", borderRadius: 50, padding: "0.35rem 0.9rem", cursor: "pointer", fontFamily: "inherit" }}>
                Collapse all
              </button>
            </div>

            {/* Release cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "#a8abcc", fontSize: "0.9rem" }}>
                  No releases match "{search}"
                </div>
              )}
              {filtered.map((r, i) => (
                <ReleaseCard
                  key={r.version}
                  r={r}
                  expanded={expanded === i}
                  onToggle={() => setExpanded(expanded === i ? null : i)}
                />
              ))}
            </div>

          </>}

          {/* Official link */}
          <div style={{ marginTop: "2.5rem", padding: "1.25rem 1.5rem", borderRadius: 12, background: "rgba(47,49,90,0.04)", border: "1px solid rgba(47,49,90,0.08)", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#2f315a" }}>Full release notes on AutoCount Wiki</div>
              <div style={{ fontSize: "0.78rem", color: "#6b6f91", marginTop: 2 }}>Detailed technical documentation including database upgrade notes and server requirements.</div>
            </div>
            <a
              href="https://wiki.autocountsoft.com/wiki/Category:AutoCount_Accounting_2.2:Release_Note"
              target="_blank" rel="noreferrer"
              style={{ background: "#2f315a", color: "#ffffff", padding: "0.6rem 1.4rem", borderRadius: 50, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", transition: "background 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = "#3d4075"}
              onMouseOut={e => e.currentTarget.style.background = "#2f315a"}
            >
              Official Wiki →
            </a>
          </div>
        </div>
      </div>

      {/* CTA band */}
      <div style={{ background: "#2f315a", padding: "4rem 0" }}>
        <div className="content-wrap" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem" }}>
            Ready to get started with AutoCount?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto 1.75rem" }}>
            KSL Business Solutions provides full AutoCount implementation,
            training, and support across Pahang.
          </p>
          <button
            onClick={onContact}
            style={{ background: "#c9a84c", color: "#1e2040", padding: "0.85rem 2.5rem", borderRadius: 50, fontSize: "0.95rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.2s" }}
            onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}
          >
            Contact Us Today
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
