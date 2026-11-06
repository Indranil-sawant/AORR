/**
 * ============================================================================
 * AORR GLOBAL ENTERPRISE — UNIVERSAL LEAD CRM & ANTI-SPAM BACKEND
 * (Cloudflare Turnstile + Honeypot + Multi-Division Routing + Google Sheets)
 * ============================================================================
 * 
 * Version: 2.1.0
 * Architecture:
 *  - Universal Parser: Handles standard forms, FormData, URLSearchParams, & JSON
 *  - Dual-Layer Anti-Spam: Hidden honeypot trap + Cloudflare Turnstile verification
 *  - Dual-Channel Logging: "Verified_Leads" (Master CRM) & "Blocked_Attempts" (Spam/Audit)
 *  - Multi-Division Auto-Routing:
 *      1. IRCTC Railway Desk (RAIL) — Bookings, Tatkal, Vande Bharat, quotas
 *      2. Datta Chhaya Tourism (TOUR) — Spiritual yatras, pilgrimages, tours
 *      3. Global Trade & Marine Sourcing (TRAD) — Import/export, marine supplies, RFQs
 *      4. Medical Tourism (MED) — NABH/JCI hospital coordination, medical travel
 *      5. General Strategic Enterprise (GEN) — Partnerships & corporate inquiries
 *  - Division-Specific Tabs: Automated sync into dedicated vertical desk sheets
 *  - Auto-Initializing Sheets: Creates tabs, corporate headers, widths, & dropdowns
 *  - Sequential Lead Tracking IDs: e.g., AORR-RAIL-0001, AORR-TOUR-0002...
 *  - Instant Admin Action Alerts: Direct Call, WhatsApp, Email, & Sheet action buttons
 *  - Division-Branded Confirmation Emails: Dedicated auto-responders for each vertical
 *  - Concurrency & Formula Protection: LockService & CSV/Formula injection escaping
 * 
 * Active Production Web App URL:
 * https://script.google.com/macros/s/AKfycbwe1cfoXB63IyE657oxAbH_qpNLCbEUaxiryrbqL_W-ytXucTxYkk2lzoQVr8bFcwKPZw/exec
 * ============================================================================
 */

/***************************** CONFIGURATION *****************************/

// 1. Google Spreadsheet ID
// Paste your Spreadsheet ID from: https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
// Leave as "" or placeholder to automatically create and bind a brand new Spreadsheet in your Google Drive!
var SPREADSHEET_ID = "1HSctMITmp17ckoRJf6FZPuP-5_aP9SPzCi6dNLmaPRg";

// 2. Primary Tab Names
var SHEET_NAME_VERIFIED = "Verified_Leads";   // Master CRM tab with all fields & filters
var SHEET_NAME_BLOCKED  = "Blocked_Attempts";  // Filtered spam & rejected verification logs

// 3. Multi-Division Desk Tabs Sync
// When true, verified leads are recorded in "Verified_Leads" AND simultaneously logged
// into their dedicated division tabs (IRCTC_Railway_Desk, Datta_Chhaya_Tourism, etc.)
var ENABLE_DIVISION_TABS = true;

// 4. Admin Alert Notification Email (Receives instant lead alerts)
var ADMIN_EMAIL = "aorr@aorr.in";

// 5. Company & Website Details
var COMPANY_NAME    = "AORR Global Enterprise";
var COMPANY_PHONE   = "+91 97300 04911";
var COMPANY_WEBSITE = "https://www.aorr.in";
var LEAD_ID_PREFIX  = "AORR-";
var TIMEZONE        = "Asia/Kolkata";

// 6. Cloudflare Turnstile Configuration
// Paste your Cloudflare Turnstile Secret Key below, or set it via:
// Google Apps Script Editor > Project Settings > Script Properties > Key: "TURNSTILE_SECRET_KEY"
var TURNSTILE_SECRET_KEY = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET_KEY") || "0x4AAAAAAF2D-DlopCpokc_sapCUwlQBa1g";

// Turnstile Enforcement Mode:
//  "AUTO"   - Smart mode: Verifies token if key and token are present. If key is still placeholder
//             or token is pending on frontend, allows submission via Honeypot check so no leads are lost.
//  "STRICT" - Enforces Cloudflare verification on every submission (requires key & token).
//  "OFF"    - Turnstile verification disabled (uses Honeypot & input validation only).
var TURNSTILE_MODE = "AUTO";

// 7. Customer Confirmation Email Dispatcher
// Sends division-tailored, branded confirmation emails to the customer upon submission (true/false)
var SEND_CUSTOMER_CONFIRMATION = true;

/*************************************************************************/

/**
 * Health Check & Status Inspector
 * Visit Web App URL in browser to verify deployment status and configuration.
 */
function doGet() {
  try {
    var ss = getSpreadsheet();
    var vSheet = getOrCreateVerifiedSheet(ss, false);
    var isKeyConfigured = Boolean(
      TURNSTILE_SECRET_KEY &&
      TURNSTILE_SECRET_KEY.trim() !== "" &&
      TURNSTILE_SECRET_KEY.indexOf("YOUR_") === -1
    );

    var output = {
      status: "online",
      brand: COMPANY_NAME,
      website: COMPANY_WEBSITE,
      supportPhone: COMPANY_PHONE,
      adminEmail: ADMIN_EMAIL,
      spreadsheetUrl: ss.getUrl(),
      verifiedLeadsCount: Math.max(0, vSheet.getLastRow() - 1),
      turnstileMode: TURNSTILE_MODE,
      turnstileConfigured: isKeyConfigured,
      divisionTabsEnabled: ENABLE_DIVISION_TABS,
      timestamp: Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss")
    };

    return ContentService
      .createTextOutput(JSON.stringify(output, null, 2))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput("AORR Lead Management Web App active. Notice: " + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Initializer & Permission Authorizer
 * Run this ONCE from the Apps Script editor toolbar to authorize Google permissions 
 * and generate all pre-styled tabs in your Google Sheet immediately.
 */
function setupNewSheet() {
  var ss = getSpreadsheet();
  var vSheet = getOrCreateVerifiedSheet(ss, true);
  var bSheet = getOrCreateBlockedSheet(ss, true);

  if (ENABLE_DIVISION_TABS) {
    getOrCreateDivisionSheet(ss, "IRCTC_Railway_Desk", "RAIL", true);
    getOrCreateDivisionSheet(ss, "Datta_Chhaya_Tourism", "TOUR", true);
    getOrCreateDivisionSheet(ss, "Global_Trade", "TRAD", true);
    getOrCreateDivisionSheet(ss, "Medical_Tourism", "MED", true);
    getOrCreateDivisionSheet(ss, "General_Inquiries", "GEN", true);
  }

  // Trigger UrlFetchApp scope check for Cloudflare
  try {
    UrlFetchApp.fetch("https://challenges.cloudflare.com");
  } catch (e) {}

  Logger.log("=================================================");
  Logger.log("✅ SUCCESS: AORR Lead CRM setup complete!");
  Logger.log("📄 Master Verified Tab: " + vSheet.getName());
  Logger.log("📄 Blocked Spam Tab: " + bSheet.getName());
  Logger.log("🔗 Open Spreadsheet: " + ss.getUrl());
  Logger.log("=================================================");
}

function authorizeScript() {
  UrlFetchApp.fetch("https://challenges.cloudflare.com");
  Logger.log("✅ All Google permissions granted!");
}

/**
 * Resolves the Google Spreadsheet
 */
function getSpreadsheet() {
  // 1. If explicit Spreadsheet ID is configured, use it
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "" && SPREADSHEET_ID.indexOf("YOUR_") === -1) {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }

  // 2. If script is container-bound to a spreadsheet (e.g., AORR_LEADS), use it directly
  try {
    var activeSs = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSs && activeSs.getId()) {
      return activeSs;
    }
  } catch (e) {}

  // 3. Use previously auto-created spreadsheet from Script Properties
  var autoId = PropertiesService.getScriptProperties().getProperty("AUTO_SPREADSHEET_ID");
  if (autoId) {
    try { return SpreadsheetApp.openById(autoId); } catch (e) {}
  }

  // 4. Create new spreadsheet if none exists
  var newSs = SpreadsheetApp.create(COMPANY_NAME + " - Leads Hub");
  PropertiesService.getScriptProperties().setProperty("AUTO_SPREADSHEET_ID", newSs.getId());
  return newSs;
}

/**
 * Resolves or creates the Master Verified Leads tab
 */
function getOrCreateVerifiedSheet(ss, forceFormat) {
  var sheet = ss.getSheetByName(SHEET_NAME_VERIFIED);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_VERIFIED);
    initializeVerifiedDesign(sheet);
  } else if (sheet.getLastRow() === 0 || forceFormat) {
    initializeVerifiedDesign(sheet);
  }
  return sheet;
}

/**
 * Styles Master Verified Leads tab
 */
function initializeVerifiedDesign(sheet) {
  var headers = [
    "Lead ID",
    "Timestamp",
    "Division",
    "Customer Name",
    "Email Address",
    "Phone / WhatsApp",
    "Location / Origin",
    "Destination / Port",
    "Travel Date",
    "Class / Quota / Tier",
    "Pax / Travellers",
    "Service / Product / RFQ",
    "Inquiry Details / Message",
    "Source Page",
    "Anti-Spam Verification",
    "Lead Status",
    "Sales Notes"
  ];

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setBackground("#0F3814") // AORR Deep Forest Green
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setFontFamily("Segoe UI")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 42);
  sheet.setFrozenRows(1);
  sheet.setTabColor("#1B5E20");

  sheet.setColumnWidth(1, 140);  // Lead ID
  sheet.setColumnWidth(2, 160);  // Timestamp
  sheet.setColumnWidth(3, 170);  // Division
  sheet.setColumnWidth(4, 180);  // Customer Name
  sheet.setColumnWidth(5, 230);  // Email Address
  sheet.setColumnWidth(6, 150);  // Phone Number
  sheet.setColumnWidth(7, 180);  // Location / Origin
  sheet.setColumnWidth(8, 160);  // Destination / Port
  sheet.setColumnWidth(9, 130);  // Travel Date
  sheet.setColumnWidth(10, 180); // Class / Quota / Tier
  sheet.setColumnWidth(11, 120); // Pax Count
  sheet.setColumnWidth(12, 230); // Service / Product / RFQ
  sheet.setColumnWidth(13, 340); // Inquiry Details / Message
  sheet.setColumnWidth(14, 150); // Source Page
  sheet.setColumnWidth(15, 190); // Verification Status
  sheet.setColumnWidth(16, 130); // Lead Status
  sheet.setColumnWidth(17, 240); // Sales Notes

  sheet.getRange("B2:B").setNumberFormat("yyyy-mm-dd hh:mm:ss");

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["New", "Contacted", "In Discussion", "Quote Sent", "Closed - Won", "Closed - Lost"], true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange("P2:P2000").setDataValidation(statusRule);
  sheet.setHiddenGridlines(false);
}

/**
 * Resolves or creates the Blocked Attempts tab
 */
function getOrCreateBlockedSheet(ss, forceFormat) {
  var sheet = ss.getSheetByName(SHEET_NAME_BLOCKED);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_BLOCKED);
    initializeBlockedDesign(sheet);
  } else if (sheet.getLastRow() === 0 || forceFormat) {
    initializeBlockedDesign(sheet);
  }
  return sheet;
}

/**
 * Styles Blocked Attempts tab
 */
function initializeBlockedDesign(sheet) {
  var headers = [
    "Timestamp",
    "Block Reason / Violation",
    "Division / Context",
    "Name Submitted",
    "Email Submitted",
    "Phone Submitted",
    "Subject / Message",
    "Source Page",
    "Turnstile Token Status"
  ];

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setBackground("#7F1D1D") // Crimson Red
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setFontFamily("Segoe UI")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);
  sheet.setTabColor("#B71C1C");

  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 280);
  sheet.setColumnWidth(3, 160);
  sheet.setColumnWidth(4, 170);
  sheet.setColumnWidth(5, 220);
  sheet.setColumnWidth(6, 140);
  sheet.setColumnWidth(7, 280);
  sheet.setColumnWidth(8, 150);
  sheet.setColumnWidth(9, 240);
  sheet.setHiddenGridlines(false);
}

/**
 * Resolves or creates Division-Specific tabs
 */
function getOrCreateDivisionSheet(ss, tabName, code, forceFormat) {
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    initializeDivisionDesign(sheet, code);
  } else if (sheet.getLastRow() === 0 || forceFormat) {
    initializeDivisionDesign(sheet, code);
  }
  return sheet;
}

/**
 * Styles Division-Specific tabs
 */
function initializeDivisionDesign(sheet, code) {
  var headers = [];
  var tabColor = "#1B5E20";

  if (code === "RAIL") {
    tabColor = "#1565C0"; // Railway Blue
    headers = ["Timestamp", "Lead ID", "Passenger Name", "Phone / WhatsApp", "Email Address", "From Station", "To Station", "Journey Date", "Travel Class", "Booking Quota", "Pax Count", "Passenger Details / Message", "Status", "Source Page"];
  } else if (code === "TOUR") {
    tabColor = "#E65100"; // Yatra Saffron / Amber
    headers = ["Timestamp", "Lead ID", "Pilgrim Name", "Phone / WhatsApp", "Email Address", "Yatra / Itinerary", "Package Tier", "Travel Date", "Travellers Count", "Requirements / Message", "Status", "Source Page"];
  } else if (code === "TRAD") {
    tabColor = "#1B5E20"; // Forest Green
    headers = ["Timestamp", "Lead ID", "Contact Name", "Phone / WhatsApp", "Email Address", "Product / RFQ", "Region / Delivery Port", "Inquiry Message", "Status", "Source Page"];
  } else if (code === "MED") {
    tabColor = "#00838F"; // Healthcare Cyan
    headers = ["Timestamp", "Lead ID", "Patient / Contact Name", "Phone / WhatsApp", "Email Address", "Specialty Needed", "Patient Location", "Case Summary", "Status", "Source Page"];
  } else {
    tabColor = "#37474F"; // Corporate Slate
    headers = ["Timestamp", "Lead ID", "Contact Name", "Phone / WhatsApp", "Email Address", "Service Division", "Region / Country", "Message / Requirements", "Status", "Source Page"];
  }

  sheet.setTabColor(tabColor);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange
    .setBackground(tabColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setFontFamily("Segoe UI")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);
  sheet.setHiddenGridlines(false);
}

/**
 * Business Division Classifier
 * Automatically categorizes inquiries based on incoming form attributes
 */
function classifyDivision(params) {
  var page = String(params.page || "").toLowerCase();
  var product = String(params.product || "").toLowerCase();
  var location = String(params.location || "").toLowerCase();
  var dest = String(params.destination || "").toLowerCase();
  var itinerary = String(params.itinerary || "").toLowerCase();
  var message = String(params.message || "").toLowerCase();

  // 1. IRCTC Railway Desk
  if (
    page.indexOf("irctc") !== -1 ||
    page.indexOf("railway") !== -1 ||
    product.indexOf("irctc") !== -1 ||
    product.indexOf("railway") !== -1 ||
    product.indexOf("train") !== -1 ||
    location.indexOf("station") !== -1 ||
    dest !== "" ||
    params.preferred_class ||
    params.quota ||
    params.passenger_count
  ) {
    return {
      code: "RAIL",
      name: "IRCTC Railway Desk",
      tabName: "IRCTC_Railway_Desk",
      color: "#1565C0"
    };
  }

  // 2. Datta Chhaya Tourism & Pilgrimages
  if (
    page.indexOf("tours-travel") !== -1 ||
    product.indexOf("datta chhaya") !== -1 ||
    product.indexOf("datta chaya") !== -1 ||
    product.indexOf("tourism") !== -1 ||
    product.indexOf("yatra") !== -1 ||
    product.indexOf("tour") !== -1 ||
    location.indexOf("datta chhaya") !== -1 ||
    location.indexOf("datta chaya") !== -1 ||
    location.indexOf("pilgrimage") !== -1 ||
    itinerary !== "" ||
    params.travellers_count ||
    params.package
  ) {
    return {
      code: "TOUR",
      name: "Datta Chhaya Tourism",
      tabName: "Datta_Chhaya_Tourism",
      color: "#E65100"
    };
  }

  // 3. Medical Tourism & Healthcare
  if (
    page.indexOf("medical") !== -1 ||
    product.indexOf("medical") !== -1 ||
    product.indexOf("healthcare") !== -1 ||
    product.indexOf("cardiology") !== -1 ||
    product.indexOf("oncology") !== -1 ||
    product.indexOf("transplant") !== -1 ||
    product.indexOf("hospital") !== -1 ||
    product.indexOf("surgery") !== -1 ||
    location.indexOf("medical") !== -1 ||
    message.indexOf("patient") !== -1 ||
    message.indexOf("treatment") !== -1
  ) {
    return {
      code: "MED",
      name: "Medical Tourism & Healthcare",
      tabName: "Medical_Tourism",
      color: "#00838F"
    };
  }

  // 4. Global Trade & Marine Sourcing
  if (
    page.indexOf("product") !== -1 ||
    product.indexOf("marine") !== -1 ||
    product.indexOf("industrial") !== -1 ||
    product.indexOf("agro") !== -1 ||
    product.indexOf("garment") !== -1 ||
    product.indexOf("trade") !== -1 ||
    product.indexOf("sourcing") !== -1 ||
    product.indexOf("export") !== -1 ||
    product.indexOf("import") !== -1 ||
    product.indexOf("rfq") !== -1 ||
    location.indexOf("marine") !== -1 ||
    location.indexOf("port") !== -1
  ) {
    return {
      code: "TRAD",
      name: "Global Trade & Marine Sourcing",
      tabName: "Global_Trade",
      color: "#1B5E20"
    };
  }

  // 5. Default General Strategic Enterprise
  return {
    code: "GEN",
    name: "General Strategic Enterprise",
    tabName: "General_Inquiries",
    color: "#37474F"
  };
}

/**
 * Validates Cloudflare Turnstile token via Cloudflare's siteverify API
 */
function verifyTurnstile(token) {
  if (TURNSTILE_MODE === "OFF") {
    return { success: true, statusText: "Turnstile Disabled (Mode OFF)" };
  }

  var isKeyConfigured = Boolean(
    TURNSTILE_SECRET_KEY &&
    TURNSTILE_SECRET_KEY.trim() !== "" &&
    TURNSTILE_SECRET_KEY.indexOf("YOUR_") === -1
  );

  // If secret key is not configured yet (e.g., user is setting up Cloudflare)
  if (!isKeyConfigured) {
    if (TURNSTILE_MODE === "STRICT") {
      return { success: false, reason: "Turnstile Secret Key not configured in script" };
    }
    return { success: true, statusText: "Honeypot Passed (Turnstile Key Pending)" };
  }

  // Secret key IS configured: check for token
  if (!token || token.trim() === "") {
    if (TURNSTILE_MODE === "STRICT") {
      return { success: false, reason: "Missing Cloudflare Turnstile Token in form data" };
    }
    return { success: true, statusText: "Honeypot Passed (Turnstile Token Omitted on Form)" };
  }

  // Verify token via Cloudflare Siteverify API
  try {
    var response = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY.trim(),
        response: token.trim()
      }),
      muteHttpExceptions: true
    });

    var data = JSON.parse(response.getContentText());
    Logger.log("Cloudflare Turnstile Response: " + JSON.stringify(data));

    if (data.success === true) {
      return { success: true, statusText: "✅ Verified Human (Cloudflare Turnstile)" };
    } else {
      var errCodes = data["error-codes"] ? data["error-codes"].join(", ") : "verification-failed";
      return { success: false, reason: "Cloudflare Rejected: " + errCodes };
    }
  } catch (err) {
    Logger.log("Turnstile API Exception: " + err.message);
    if (TURNSTILE_MODE === "STRICT") {
      return { success: false, reason: "Turnstile API Error: " + err.message };
    }
    return { success: true, statusText: "Turnstile Fail-Open (" + err.message + ")" };
  }
}

/**
 * Main Webhook Receiver
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire lock for concurrency protection (wait up to 15 seconds)
    lock.waitLock(15000);

    var ss = getSpreadsheet();

    // 1. Universal Parameter Parser (FormData, URLSearchParams, JSON, standard forms)
    var params = {};
    if (e && e.parameter && Object.keys(e.parameter).length > 0) {
      params = e.parameter;
    } else if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        var pairs = e.postData.contents.split("&");
        for (var i = 0; i < pairs.length; i++) {
          var kv = pairs[i].split("=");
          if (kv.length === 2) {
            params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1].replace(/\+/g, " "));
          }
        }
      }
    }

    var timestamp = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");

    // 2. Extract and Sanitize Core Fields
    var name            = sanitize(params.name || "Website Visitor");
    var email           = sanitize(params.email || "");
    var phone           = sanitize(params.phone || "Not provided");
    var location        = sanitize(params.location || "");
    var destination     = sanitize(params.destination || "");
    var travelDate      = sanitize(params.travel_date || "");
    var preferredClass  = sanitize(params.preferred_class || "");
    var quota           = sanitize(params.quota || "");
    var passengerCount  = sanitize(params.passenger_count || "");
    var travellersCount = sanitize(params.travellers_count || "");
    var itinerary       = sanitize(params.itinerary || "");
    var packageTier     = sanitize(params.package || "");
    var product         = sanitize(params.product || params.service || params.subject || "General Inquiry");
    var message         = sanitize(params.message || "No message provided");
    var sourcePage      = sanitize(params.page || "Website");

    // Classify Business Division
    var division = classifyDivision(params);

    // 3. Honeypot Anti-Spam Check
    if (params.company && String(params.company).trim() !== "") {
      var bSheet = getOrCreateBlockedSheet(ss, false);
      bSheet.appendRow([
        timestamp,
        "Honeypot Triggered (Bot populated hidden company field)",
        division.name,
        escapeFormula(name),
        escapeFormula(email),
        escapeFormula(phone),
        escapeFormula(product + " | " + message),
        escapeFormula(sourcePage),
        "Blocked"
      ]);
      return ContentService.createTextOutput("Spam blocked").setMimeType(ContentService.MimeType.TEXT);
    }

    // 4. Basic Contact Validation (Name & Email or Phone required)
    if (!name || (!email && !phone)) {
      var bSheetInvalid = getOrCreateBlockedSheet(ss, false);
      bSheetInvalid.appendRow([
        timestamp,
        "Validation Failed (Missing customer name, email, or contact)",
        division.name,
        escapeFormula(name),
        escapeFormula(email),
        escapeFormula(phone),
        escapeFormula(product),
        escapeFormula(sourcePage),
        "Incomplete"
      ]);
      return ContentService.createTextOutput("Error: Missing required contact fields").setMimeType(ContentService.MimeType.TEXT);
    }

    // 5. Cloudflare Turnstile Verification
    var turnstileToken = params["cf-turnstile-response"] || params.turnstileToken || params.token || "";
    var checkResult = verifyTurnstile(turnstileToken);

    // IF VERIFICATION FAILED -> Record in "Blocked_Attempts" tab
    if (!checkResult.success) {
      var bSheetReject = getOrCreateBlockedSheet(ss, false);
      var tokenPreview = turnstileToken ? turnstileToken.slice(0, 30) + "..." : "EMPTY";
      bSheetReject.appendRow([
        timestamp,
        checkResult.reason,
        division.name,
        escapeFormula(name),
        escapeFormula(email),
        escapeFormula(phone),
        escapeFormula(product + " | " + message),
        escapeFormula(sourcePage),
        tokenPreview
      ]);
      return ContentService.createTextOutput("Verification failed: " + checkResult.reason).setMimeType(ContentService.MimeType.TEXT);
    }

    // 6. IF VERIFICATION PASSED -> Generate Sequential Lead ID
    var vSheet = getOrCreateVerifiedSheet(ss, false);
    var nextRow = vSheet.getLastRow() + 1;
    var leadNumber = Math.max(1, nextRow - 1);
    var leadId = LEAD_ID_PREFIX + division.code + "-" + ("0000" + leadNumber).slice(-4);

    // Normalize Secondary Fields for Display
    var displayClass = preferredClass || packageTier || quota || "";
    var displayPax = passengerCount || travellersCount || "";
    var displayProduct = product || itinerary || "General Inquiry";

    // 7. Record in "Verified_Leads" Master CRM Tab
    vSheet.appendRow([
      escapeFormula(leadId),
      timestamp,
      escapeFormula(division.name),
      escapeFormula(name),
      escapeFormula(email),
      escapeFormula(phone),
      escapeFormula(location),
      escapeFormula(destination),
      escapeFormula(travelDate),
      escapeFormula(displayClass),
      escapeFormula(displayPax),
      escapeFormula(displayProduct),
      escapeFormula(message),
      escapeFormula(sourcePage),
      checkResult.statusText || "✅ Verified Human",
      "New",
      ""
    ]);

    // Apply Executive Row Styling
    vSheet.getRange(nextRow, 1).setHorizontalAlignment("center").setFontWeight("bold");
    vSheet.getRange(nextRow, 2).setHorizontalAlignment("center");
    vSheet.getRange(nextRow, 3).setHorizontalAlignment("center").setFontWeight("bold");
    vSheet.getRange(nextRow, 6).setHorizontalAlignment("center");
    vSheet.getRange(nextRow, 9).setHorizontalAlignment("center");
    vSheet.getRange(nextRow, 11).setHorizontalAlignment("center");
    vSheet.getRange(nextRow, 14).setHorizontalAlignment("center");
    vSheet.getRange(nextRow, 15).setHorizontalAlignment("center").setFontColor("#059669");
    vSheet.getRange(nextRow, 16).setHorizontalAlignment("center").setFontWeight("bold").setFontColor("#2563EB");
    vSheet.getRange(nextRow, 13).setWrap(true);

    // 8. Optionally Sync to Division-Specific Tab
    if (ENABLE_DIVISION_TABS) {
      syncToDivisionSheet(ss, division, {
        timestamp: timestamp,
        leadId: leadId,
        name: name,
        email: email,
        phone: phone,
        location: location,
        destination: destination,
        travelDate: travelDate,
        preferredClass: preferredClass,
        quota: quota,
        passengerCount: passengerCount,
        travellersCount: travellersCount,
        itinerary: itinerary,
        packageTier: packageTier,
        product: displayProduct,
        message: message,
        sourcePage: sourcePage
      });
    }

    // 9. Send Instant Admin Alert Notification Email
    var leadPayload = {
      leadId: leadId,
      timestamp: timestamp,
      division: division,
      name: name,
      email: email,
      phone: phone,
      location: location,
      destination: destination,
      travelDate: travelDate,
      displayClass: displayClass,
      displayPax: displayPax,
      product: displayProduct,
      message: message,
      sourcePage: sourcePage,
      statusText: checkResult.statusText || "Verified",
      sheetUrl: ss.getUrl()
    };

    sendAdminNotification(leadPayload);

    // 10. Send Division-Tailored Customer Confirmation Email
    if (SEND_CUSTOMER_CONFIRMATION && email && isValidEmail(email)) {
      sendCustomerConfirmation(leadPayload);
    }

    return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    Logger.log("doPost Critical Error: " + err.message);
    logErrorToSheet(err, e ? e.parameter : null);
    return ContentService.createTextOutput("error: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  } finally {
    try {
      lock.releaseLock();
    } catch (lErr) {}
  }
}

/**
 * Appends record into dedicated division desk tab
 */
function syncToDivisionSheet(ss, division, data) {
  try {
    var divSheet = getOrCreateDivisionSheet(ss, division.tabName, division.code, false);

    if (division.code === "RAIL") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.location),       // From Station
        escapeFormula(data.destination),    // To Station
        escapeFormula(data.travelDate),     // Journey Date
        escapeFormula(data.preferredClass), // Preferred Class
        escapeFormula(data.quota),          // Booking Quota
        escapeFormula(data.passengerCount), // Pax Count
        escapeFormula(data.message),        // Passenger Names & Berths
        "New Enquiry",
        escapeFormula(data.sourcePage)
      ]);
    } else if (division.code === "TOUR") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.itinerary || data.location || data.product), // Yatra / Package
        escapeFormula(data.packageTier || "Standard"),                  // Package Tier
        escapeFormula(data.travelDate || "Flexible"),                   // Date
        escapeFormula(data.travellersCount || "N/A"),                   // Travellers Count
        escapeFormula(data.message),
        "New Enquiry",
        escapeFormula(data.sourcePage)
      ]);
    } else if (division.code === "TRAD") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.product),        // Product Name / RFQ Category
        escapeFormula(data.location),       // Country / Delivery Port
        escapeFormula(data.message),
        "New RFQ",
        escapeFormula(data.sourcePage)
      ]);
    } else if (division.code === "MED") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.product),        // Medical Specialty
        escapeFormula(data.location),       // Patient Residence / Country
        escapeFormula(data.message),
        "Confidential Review",
        escapeFormula(data.sourcePage)
      ]);
    } else {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.product || "General Enterprise"),
        escapeFormula(data.location || "N/A"),
        escapeFormula(data.message),
        "New Inquiry",
        escapeFormula(data.sourcePage)
      ]);
    }
  } catch (err) {
    Logger.log("Notice: Division tab sync failed: " + err.message);
  }
}

// ============================================================================
// EMAIL DISPATCH ENGINE
// ============================================================================

/**
 * 1. Admin Alert Notification Email
 */
function sendAdminNotification(lead) {
  var cleanPhone = cleanPhoneForWhatsApp(lead.phone);
  var callLink = lead.phone && lead.phone !== "Not provided" 
    ? `<a href="tel:${lead.phone}" style="display:inline-block; padding:9px 16px; background:#0F3814; color:#FFFFFF; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-right:8px; margin-bottom:8px;">📞 Call ${lead.phone}</a>` 
    : "";

  var waLink = cleanPhone 
    ? `<a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20AORR%20Global%20Enterprise%20[Ref:%20${lead.leadId}]." target="_blank" style="display:inline-block; padding:9px 16px; background:#25D366; color:#FFFFFF; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-right:8px; margin-bottom:8px;">💬 WhatsApp</a>` 
    : "";

  var mailLink = lead.email && lead.email !== "Not provided" 
    ? `<a href="mailto:${lead.email}?subject=Regarding%20your%20inquiry%20with%20${encodeURIComponent(COMPANY_NAME)}%20[Ref:%20${lead.leadId}]" style="display:inline-block; padding:9px 16px; background:#1E40AF; color:#FFFFFF; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-right:8px; margin-bottom:8px;">✉️ Reply Email</a>` 
    : "";

  var sheetLink = `<a href="${lead.sheetUrl}" target="_blank" style="display:inline-block; padding:9px 16px; background:#F1F5F9; color:#1E293B; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-bottom:8px;">📊 Open Google Sheet</a>`;

  var subject = `🔔 [${lead.division.code}] New Lead: ${lead.name} — ${lead.leadId}`;

  var htmlBody = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:640px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
      <div style="background:#0F3814; padding:24px; color:#FFFFFF;">
        <div style="display:inline-block; background:${lead.division.color}; color:#FFFFFF; font-size:11px; font-weight:700; text-transform:uppercase; padding:4px 10px; border-radius:20px; margin-bottom:10px;">
          ${lead.division.name}
        </div>
        <h2 style="margin:0; font-size:20px; font-weight:700; color:#FFFFFF;">New Customer Inquiry Received</h2>
        <p style="margin:6px 0 0 0; color:#A5D6A7; font-size:13px;">Lead ID: <b>${lead.leadId}</b> &bull; Received on ${lead.timestamp}</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:8px 0; color:#64748B; width:140px; font-weight:600;">Customer Name</td><td style="padding:8px 0; font-weight:700; color:#0F172A;">${lead.name}</td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Email Address</td><td style="padding:8px 0; color:#2563EB;"><a href="mailto:${lead.email}" style="color:#2563EB; text-decoration:none;">${lead.email || "Not provided"}</a></td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Phone / WhatsApp</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.phone}</td></tr>
          ${lead.location ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Location / Origin</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.location}</td></tr>` : ''}
          ${lead.destination ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Destination / Port</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.destination}</td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Travel / Pref Date</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.travelDate}</td></tr>` : ''}
          ${lead.displayClass ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Class / Quota / Tier</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.displayClass}</td></tr>` : ''}
          ${lead.displayPax ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Pax / Travellers</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.displayPax}</td></tr>` : ''}
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Service / Product</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.product}</td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Source Page</td><td style="padding:8px 0; color:#64748B;">${lead.sourcePage}</td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Verification</td><td style="padding:8px 0; color:#059669; font-weight:600;">${lead.statusText}</td></tr>
          <tr><td colspan="2" style="padding:14px 0 6px 0; color:#64748B; font-weight:600;">Customer Message / Requirements:</td></tr>
          <tr><td colspan="2" style="padding:14px; background:#F8FAFC; border-radius:8px; color:#1E293B; line-height:1.6; border-left:4px solid #1B5E20; white-space:pre-wrap;">${lead.message}</td></tr>
        </table>

        <div style="margin-top:22px; padding-top:16px; border-top:1px solid #E2E8F0;">
          ${callLink}
          ${waLink}
          ${mailLink}
          ${sheetLink}
        </div>
      </div>
      <div style="background:#F8FAFC; padding:12px 24px; text-align:center; font-size:12px; color:#94A3B8; border-top:1px solid #E2E8F0;">
        ${COMPANY_NAME} &bull; Master Lead Management Hub
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      name: "AORR Lead Alert Engine"
    });
  } catch (err) {
    Logger.log("Notice: Admin alert email failed to send: " + err.message);
  }
}

/**
 * 2. Customer Confirmation Email Router
 */
function sendCustomerConfirmation(lead) {
  var subject = "";
  var htmlBody = "";
  var senderName = COMPANY_NAME;

  if (lead.division.code === "RAIL") {
    senderName = "AORR IRCTC Railway Desk";
    subject = `Railway Booking Enquiry Received [Ref: ${lead.leadId}] | AORR IRCTC Desk`;
    htmlBody = buildRailwayCustomerEmail(lead);
  } else if (lead.division.code === "TOUR") {
    senderName = "Datta Chhaya Tourism";
    subject = `We've Received Your Yatra Enquiry [Ref: ${lead.leadId}] | Datta Chhaya Tourism`;
    htmlBody = buildTourismCustomerEmail(lead);
  } else if (lead.division.code === "TRAD") {
    senderName = "AORR Global Trade";
    subject = `Commercial Sourcing Enquiry Received [Ref: ${lead.leadId}] | AORR Global Trade`;
    htmlBody = buildTradeCustomerEmail(lead);
  } else if (lead.division.code === "MED") {
    senderName = "AORR Medical Tourism";
    subject = `Confidential Healthcare Travel Enquiry [Ref: ${lead.leadId}] | AORR Health Desk`;
    htmlBody = buildMedicalCustomerEmail(lead);
  } else {
    senderName = COMPANY_NAME;
    subject = `Thank You for Contacting AORR Global Enterprise [Ref: ${lead.leadId}]`;
    htmlBody = buildGeneralCustomerEmail(lead);
  }

  try {
    MailApp.sendEmail({
      to: lead.email,
      subject: subject,
      htmlBody: htmlBody,
      name: senderName
    });
  } catch (err) {
    Logger.log("Notice: Customer confirmation email failed: " + err.message);
  }
}

// ============================================================================
// DIVISION-SPECIFIC CUSTOMER EMAIL TEMPLATES
// ============================================================================

function buildRailwayCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#0D47A1; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px; letter-spacing:0.5px;">AORR IRCTC RAILWAY DESK</h2>
      <p style="color:#BBDEFB; margin:6px 0 0 0; font-size:13px;">Authorised Railway Reservation & Ticketing Assistance</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for contacting the <strong>AORR IRCTC Railway Desk</strong>. We have received your railway travel reservation enquiry.
      </p>
      
      <div style="background:#F0F7FF; border-left:4px solid #1976D2; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#0D47A1; font-size:13px; text-transform:uppercase;">Enquiry Summary:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.location ? `<tr><td style="padding:4px 0; color:#64748B;">From Station:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
          ${lead.destination ? `<tr><td style="padding:4px 0; color:#64748B;">To Station:</td><td><strong>${lead.destination}</strong></td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding:4px 0; color:#64748B;">Journey Date:</td><td><strong>${lead.travelDate}</strong></td></tr>` : ''}
          ${lead.displayClass ? `<tr><td style="padding:4px 0; color:#64748B;">Travel Class:</td><td><strong>${lead.displayClass}</strong></td></tr>` : ''}
          ${lead.displayPax ? `<tr><td style="padding:4px 0; color:#64748B;">Passengers:</td><td><strong>${lead.displayPax}</strong></td></tr>` : ''}
        </table>
      </div>

      <div style="background:#FFFBEB; border:1px solid #FCD34D; padding:12px; border-radius:8px; font-size:12px; color:#92400E; margin:16px 0;">
        <strong>Important Notice:</strong> Submitting an enquiry does not guarantee confirmed ticket availability. Availability is subject to official Indian Railways PRS systems at the time of processing.
      </div>

      <p style="font-size:13px; color:#475569;">
        Our ticketing team will review your travel preferences and connect with you via phone/WhatsApp at <strong>${lead.phone}</strong>.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#EFF6FF; border-radius:8px; font-size:13px; color:#1E3A8A;">
        For urgent Tatkal coordination, contact our desk at <a href="tel:${COMPANY_PHONE}" style="color:#1D4ED8; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#1D4ED8; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Warm regards,<br>
        <strong>AORR IRCTC Railway Desk</strong> &bull; Pune, Maharashtra, India<br>
        <a href="${COMPANY_WEBSITE}" style="color:#0D47A1; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildTourismCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#1B5E20; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">DATTA CHHAYA TOURISM</h2>
      <p style="color:#A5D6A7; margin:6px 0 0 0; font-size:13px;">Spiritual Pilgrimages, Yatras & Dedicated Travel Services</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for reaching out to <strong>Datta Chhaya Tourism</strong>. We have received your pilgrimage / yatra inquiry and are honored to assist you with your sacred journey.
      </p>
      
      <div style="background:#F1F8E9; border-left:4px solid #66BB6A; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#1B5E20; font-size:13px; text-transform:uppercase;">Your Yatra Details:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding:4px 0; color:#64748B;">Tour / Yatra:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.displayClass ? `<tr><td style="padding:4px 0; color:#64748B;">Package Tier:</td><td><strong>${lead.displayClass}</strong></td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding:4px 0; color:#64748B;">Travel Date:</td><td><strong>${lead.travelDate}</strong></td></tr>` : ''}
          ${lead.displayPax ? `<tr><td style="padding:4px 0; color:#64748B;">Pilgrims Count:</td><td><strong>${lead.displayPax}</strong></td></tr>` : ''}
        </table>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our travel planning team is reviewing your schedule and group requirements. A travel coordinator will connect with you via phone or WhatsApp shortly to provide your customized itinerary and darshan schedule.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F0FDF4; border-radius:8px; font-size:13px; color:#166534;">
        Need instant assistance? Reach us at <a href="tel:${COMPANY_PHONE}" style="color:#15803D; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#15803D; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Warm regards,<br>
        <strong>Datta Chhaya Tourism Team</strong> &bull; AORR Global Ecosystem<br>
        <a href="${COMPANY_WEBSITE}" style="color:#1B5E20; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildTradeCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#0F3814; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">AORR GLOBAL TRADE & SOURCING</h2>
      <p style="color:#81C784; margin:6px 0 0 0; font-size:13px;">International Export House &bull; Marine Supplies &bull; Global Logistics</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for submitting your commercial RFQ to <strong>AORR Global Trade & Marine Sourcing</strong>.
      </p>
      
      <div style="background:#F1F8E9; border-left:4px solid #1B5E20; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#0F3814; font-size:13px; text-transform:uppercase;">Inquiry Summary:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding:4px 0; color:#64748B;">Product / RFQ:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.location ? `<tr><td style="padding:4px 0; color:#64748B;">Region / Port:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
        </table>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our sourcing desk is reviewing your technical specifications, volume, and destination logistics. A trade manager will provide you with a formal Quotation/Proforma within 1 business day.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F8FAFC; border-radius:8px; font-size:13px; color:#334155;">
        Direct trade inquiries can also be routed to <a href="mailto:${ADMIN_EMAIL}" style="color:#0F3814; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a> or <a href="tel:${COMPANY_PHONE}" style="color:#0F3814; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Best regards,<br>
        <strong>Global Trade & Export Division</strong> &bull; AORR Global Enterprise<br>
        <a href="${COMPANY_WEBSITE}" style="color:#1B5E20; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildMedicalCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#00695C; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">AORR MEDICAL TOURISM</h2>
      <p style="color:#80CBC4; margin:6px 0 0 0; font-size:13px;">Ethical Cross-Border Healthcare & Dedicated Patient Concierge</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for placing your trust in <strong>AORR Medical Tourism</strong>. Your medical travel enquiry has been received and logged under strict confidentiality.
      </p>
      
      <div style="background:#E0F2F1; border-left:4px solid #00897B; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#004D40; font-size:13px; text-transform:uppercase;">Confidential Case Reference:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding:4px 0; color:#64748B;">Specialty Needed:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.location ? `<tr><td style="padding:4px 0; color:#64748B;">Patient Location:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
        </table>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our senior healthcare concierge will review your preliminary medical requirements and coordinate with accredited super-specialty hospitals (NABH / JCI) in India to provide an initial clinical opinion, treatment cost estimate, and medical visa guidance.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F0FDFA; border-radius:8px; font-size:13px; color:#115E59;">
        For urgent patient assistance, contact our health desk directly at <a href="mailto:${ADMIN_EMAIL}" style="color:#0F766E; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a> or <a href="tel:${COMPANY_PHONE}" style="color:#0F766E; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Respectful regards,<br>
        <strong>AORR Medical Concierge Team</strong> &bull; AORR Global Enterprise<br>
        <a href="${COMPANY_WEBSITE}" style="color:#00695C; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildGeneralCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#1B5E20; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">${COMPANY_NAME}</h2>
      <p style="color:#A5D6A7; margin:6px 0 0 0; font-size:13px;">Global Trade &bull; Tours & Travel &bull; Healthcare Coordination</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for contacting <strong>${COMPANY_NAME}</strong>. We have received your inquiry (Reference: <strong>${lead.leadId}</strong>).
      </p>
      
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:16px; margin:16px 0;">
        <p style="margin:4px 0; font-size:13px; color:#1E293B;"><b>Subject / Service:</b> ${lead.product}</p>
        <p style="margin:4px 0; font-size:13px; color:#1E293B;"><b>Message:</b> ${lead.message}</p>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our team is reviewing your requirements and will connect with you via email or phone shortly.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F0FDF4; border-radius:8px; font-size:13px; color:#166534;">
        Need immediate assistance? Reach us at <a href="tel:${COMPANY_PHONE}" style="color:#15803D; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#15803D; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Best regards,<br>
        <strong>${COMPANY_NAME} Team</strong><br>
        <a href="${COMPANY_WEBSITE}" style="color:#1B5E20; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

// ============================================================================
// UTILITIES & SECURITY HELPERS
// ============================================================================

/**
 * Sanitize strings against script injection and trim whitespace
 */
function sanitize(val) {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/[<>]/g, "")
    .trim();
}

/**
 * Prevent CSV / Spreadsheet Formula Injection
 * Prepends a single quote if string starts with dangerous formula operators (=, +, -, @)
 */
function escapeFormula(val) {
  if (typeof val !== "string") return val;
  if (/^[=+\-@]/.test(val)) {
    return "'" + val;
  }
  return val;
}

/**
 * Basic RFC email validation
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Extracts and cleans phone digits for WhatsApp international link
 */
function cleanPhoneForWhatsApp(phone) {
  if (!phone) return "";
  var digits = String(phone).replace(/\D/g, "");
  // If 10 digits (standard Indian mobile), prepend 91 country code
  if (digits.length === 10) {
    digits = "91" + digits;
  }
  return digits;
}

/**
 * Log processing error to an internal 'Error_Logs' tab for debugging
 */
function logErrorToSheet(err, rawParams) {
  try {
    var ss = getSpreadsheet();
    var errSheet = ss.getSheetByName("Error_Logs");
    if (!errSheet) {
      errSheet = ss.insertSheet("Error_Logs");
      errSheet.appendRow(["Timestamp", "Error Message", "Stack Trace", "Raw Parameters"]);
      errSheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#C62828").setFontColor("#FFFFFF");
    }
    errSheet.appendRow([
      new Date(),
      err.message || err.toString(),
      err.stack || "N/A",
      JSON.stringify(rawParams || {})
    ]);
  } catch (e) {
    // Fail silently to prevent cascading failure
  }
}


/**
 * Appends record into dedicated division desk tab
 */
function syncToDivisionSheet(ss, division, data) {
  try {
    var divSheet = getOrCreateDivisionSheet(ss, division.tabName, division.code, false);

    if (division.code === "RAIL") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.location),       // From Station
        escapeFormula(data.destination),    // To Station
        escapeFormula(data.travelDate),     // Journey Date
        escapeFormula(data.preferredClass), // Preferred Class
        escapeFormula(data.quota),          // Booking Quota
        escapeFormula(data.passengerCount), // Pax Count
        escapeFormula(data.message),        // Passenger Names & Berths
        "New Enquiry",
        escapeFormula(data.sourcePage)
      ]);
    } else if (division.code === "TOUR") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.itinerary || data.location || data.product), // Yatra / Package
        escapeFormula(data.packageTier || "Standard"),                  // Package Tier
        escapeFormula(data.travelDate || "Flexible"),                   // Date
        escapeFormula(data.travellersCount || "N/A"),                   // Travellers Count
        escapeFormula(data.message),
        "New Enquiry",
        escapeFormula(data.sourcePage)
      ]);
    } else if (division.code === "TRAD") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.product),        // Product Name / RFQ Category
        escapeFormula(data.location),       // Country / Delivery Port
        escapeFormula(data.message),
        "New RFQ",
        escapeFormula(data.sourcePage)
      ]);
    } else if (division.code === "MED") {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.product),        // Medical Specialty
        escapeFormula(data.location),       // Patient Residence / Country
        escapeFormula(data.message),
        "Confidential Review",
        escapeFormula(data.sourcePage)
      ]);
    } else {
      divSheet.appendRow([
        data.timestamp,
        escapeFormula(data.leadId),
        escapeFormula(data.name),
        escapeFormula(data.phone),
        escapeFormula(data.email),
        escapeFormula(data.product || "General Enterprise"),
        escapeFormula(data.location || "N/A"),
        escapeFormula(data.message),
        "New Inquiry",
        escapeFormula(data.sourcePage)
      ]);
    }
  } catch (err) {
    Logger.log("Notice: Division tab sync failed: " + err.message);
  }
}

// ============================================================================
// EMAIL DISPATCH ENGINE
// ============================================================================

/**
 * 1. Admin Alert Notification Email
 */
function sendAdminNotification(lead) {
  var cleanPhone = cleanPhoneForWhatsApp(lead.phone);
  var callLink = lead.phone && lead.phone !== "Not provided" 
    ? `<a href="tel:${lead.phone}" style="display:inline-block; padding:9px 16px; background:#0F3814; color:#FFFFFF; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-right:8px; margin-bottom:8px;">📞 Call ${lead.phone}</a>` 
    : "";

  var waLink = cleanPhone 
    ? `<a href="https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20AORR%20Global%20Enterprise%20[Ref:%20${lead.leadId}]." target="_blank" style="display:inline-block; padding:9px 16px; background:#25D366; color:#FFFFFF; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-right:8px; margin-bottom:8px;">💬 WhatsApp</a>` 
    : "";

  var mailLink = lead.email && lead.email !== "Not provided" 
    ? `<a href="mailto:${lead.email}?subject=Regarding%20your%20inquiry%20with%20${encodeURIComponent(COMPANY_NAME)}%20[Ref:%20${lead.leadId}]" style="display:inline-block; padding:9px 16px; background:#1E40AF; color:#FFFFFF; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-right:8px; margin-bottom:8px;">✉️ Reply Email</a>` 
    : "";

  var sheetLink = `<a href="${lead.sheetUrl}" target="_blank" style="display:inline-block; padding:9px 16px; background:#F1F5F9; color:#1E293B; text-decoration:none; border-radius:6px; font-weight:600; font-size:13px; margin-bottom:8px;">📊 Open Google Sheet</a>`;

  var subject = `🔔 [${lead.division.code}] New Lead: ${lead.name} — ${lead.leadId}`;

  var htmlBody = `
    <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:640px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
      <div style="background:#0F3814; padding:24px; color:#FFFFFF;">
        <div style="display:inline-block; background:${lead.division.color}; color:#FFFFFF; font-size:11px; font-weight:700; text-transform:uppercase; padding:4px 10px; border-radius:20px; margin-bottom:10px;">
          ${lead.division.name}
        </div>
        <h2 style="margin:0; font-size:20px; font-weight:700; color:#FFFFFF;">New Customer Inquiry Received</h2>
        <p style="margin:6px 0 0 0; color:#A5D6A7; font-size:13px;">Lead ID: <b>${lead.leadId}</b> &bull; Received on ${lead.timestamp}</p>
      </div>
      <div style="padding:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:8px 0; color:#64748B; width:140px; font-weight:600;">Customer Name</td><td style="padding:8px 0; font-weight:700; color:#0F172A;">${lead.name}</td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Email Address</td><td style="padding:8px 0; color:#2563EB;"><a href="mailto:${lead.email}" style="color:#2563EB; text-decoration:none;">${lead.email || "Not provided"}</a></td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Phone / WhatsApp</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.phone}</td></tr>
          ${lead.location ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Location / Origin</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.location}</td></tr>` : ''}
          ${lead.destination ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Destination / Port</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.destination}</td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Travel / Pref Date</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.travelDate}</td></tr>` : ''}
          ${lead.displayClass ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Class / Quota / Tier</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.displayClass}</td></tr>` : ''}
          ${lead.displayPax ? `<tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Pax / Travellers</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.displayPax}</td></tr>` : ''}
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Service / Product</td><td style="padding:8px 0; font-weight:600; color:#0F172A;">${lead.product}</td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Source Page</td><td style="padding:8px 0; color:#64748B;">${lead.sourcePage}</td></tr>
          <tr><td style="padding:8px 0; color:#64748B; font-weight:600;">Verification</td><td style="padding:8px 0; color:#059669; font-weight:600;">${lead.statusText}</td></tr>
          <tr><td colspan="2" style="padding:14px 0 6px 0; color:#64748B; font-weight:600;">Customer Message / Requirements:</td></tr>
          <tr><td colspan="2" style="padding:14px; background:#F8FAFC; border-radius:8px; color:#1E293B; line-height:1.6; border-left:4px solid #1B5E20; white-space:pre-wrap;">${lead.message}</td></tr>
        </table>

        <div style="margin-top:22px; padding-top:16px; border-top:1px solid #E2E8F0;">
          ${callLink}
          ${waLink}
          ${mailLink}
          ${sheetLink}
        </div>
      </div>
      <div style="background:#F8FAFC; padding:12px 24px; text-align:center; font-size:12px; color:#94A3B8; border-top:1px solid #E2E8F0;">
        ${COMPANY_NAME} &bull; Master Lead Management Hub
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      name: "AORR Lead Alert Engine"
    });
  } catch (err) {
    Logger.log("Notice: Admin alert email failed to send: " + err.message);
  }
}

/**
 * 2. Customer Confirmation Email Router
 */
function sendCustomerConfirmation(lead) {
  var subject = "";
  var htmlBody = "";
  var senderName = COMPANY_NAME;

  if (lead.division.code === "RAIL") {
    senderName = "AORR IRCTC Railway Desk";
    subject = `Railway Booking Enquiry Received [Ref: ${lead.leadId}] | AORR IRCTC Desk`;
    htmlBody = buildRailwayCustomerEmail(lead);
  } else if (lead.division.code === "TOUR") {
    senderName = "Datta Chhaya Tourism";
    subject = `We've Received Your Yatra Enquiry [Ref: ${lead.leadId}] | Datta Chhaya Tourism`;
    htmlBody = buildTourismCustomerEmail(lead);
  } else if (lead.division.code === "TRAD") {
    senderName = "AORR Global Trade";
    subject = `Commercial Sourcing Enquiry Received [Ref: ${lead.leadId}] | AORR Global Trade`;
    htmlBody = buildTradeCustomerEmail(lead);
  } else if (lead.division.code === "MED") {
    senderName = "AORR Medical Tourism";
    subject = `Confidential Healthcare Travel Enquiry [Ref: ${lead.leadId}] | AORR Health Desk`;
    htmlBody = buildMedicalCustomerEmail(lead);
  } else {
    senderName = COMPANY_NAME;
    subject = `Thank You for Contacting AORR Global Enterprise [Ref: ${lead.leadId}]`;
    htmlBody = buildGeneralCustomerEmail(lead);
  }

  try {
    MailApp.sendEmail({
      to: lead.email,
      subject: subject,
      htmlBody: htmlBody,
      name: senderName
    });
  } catch (err) {
    Logger.log("Notice: Customer confirmation email failed: " + err.message);
  }
}

// ============================================================================
// DIVISION-SPECIFIC CUSTOMER EMAIL TEMPLATES
// ============================================================================

function buildRailwayCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#0D47A1; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px; letter-spacing:0.5px;">AORR IRCTC RAILWAY DESK</h2>
      <p style="color:#BBDEFB; margin:6px 0 0 0; font-size:13px;">Authorised Railway Reservation & Ticketing Assistance</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for contacting the <strong>AORR IRCTC Railway Desk</strong>. We have received your railway travel reservation enquiry.
      </p>
      
      <div style="background:#F0F7FF; border-left:4px solid #1976D2; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#0D47A1; font-size:13px; text-transform:uppercase;">Enquiry Summary:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.location ? `<tr><td style="padding:4px 0; color:#64748B;">From Station:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
          ${lead.destination ? `<tr><td style="padding:4px 0; color:#64748B;">To Station:</td><td><strong>${lead.destination}</strong></td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding:4px 0; color:#64748B;">Journey Date:</td><td><strong>${lead.travelDate}</strong></td></tr>` : ''}
          ${lead.displayClass ? `<tr><td style="padding:4px 0; color:#64748B;">Travel Class:</td><td><strong>${lead.displayClass}</strong></td></tr>` : ''}
          ${lead.displayPax ? `<tr><td style="padding:4px 0; color:#64748B;">Passengers:</td><td><strong>${lead.displayPax}</strong></td></tr>` : ''}
        </table>
      </div>

      <div style="background:#FFFBEB; border:1px solid #FCD34D; padding:12px; border-radius:8px; font-size:12px; color:#92400E; margin:16px 0;">
        <strong>Important Notice:</strong> Submitting an enquiry does not guarantee confirmed ticket availability. Availability is subject to official Indian Railways PRS systems at the time of processing.
      </div>

      <p style="font-size:13px; color:#475569;">
        Our ticketing team will review your travel preferences and connect with you via phone/WhatsApp at <strong>${lead.phone}</strong>.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#EFF6FF; border-radius:8px; font-size:13px; color:#1E3A8A;">
        For urgent Tatkal coordination, contact our desk at <a href="tel:${COMPANY_PHONE}" style="color:#1D4ED8; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#1D4ED8; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Warm regards,<br>
        <strong>AORR IRCTC Railway Desk</strong> &bull; Pune, Maharashtra, India<br>
        <a href="${COMPANY_WEBSITE}" style="color:#0D47A1; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildTourismCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#1B5E20; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">DATTA CHHAYA TOURISM</h2>
      <p style="color:#A5D6A7; margin:6px 0 0 0; font-size:13px;">Spiritual Pilgrimages, Yatras & Dedicated Travel Services</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for reaching out to <strong>Datta Chhaya Tourism</strong>. We have received your pilgrimage / yatra inquiry and are honored to assist you with your sacred journey.
      </p>
      
      <div style="background:#F1F8E9; border-left:4px solid #66BB6A; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#1B5E20; font-size:13px; text-transform:uppercase;">Your Yatra Details:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding:4px 0; color:#64748B;">Tour / Yatra:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.displayClass ? `<tr><td style="padding:4px 0; color:#64748B;">Package Tier:</td><td><strong>${lead.displayClass}</strong></td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding:4px 0; color:#64748B;">Travel Date:</td><td><strong>${lead.travelDate}</strong></td></tr>` : ''}
          ${lead.displayPax ? `<tr><td style="padding:4px 0; color:#64748B;">Pilgrims Count:</td><td><strong>${lead.displayPax}</strong></td></tr>` : ''}
        </table>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our travel planning team is reviewing your schedule and group requirements. A travel coordinator will connect with you via phone or WhatsApp shortly to provide your customized itinerary and darshan schedule.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F0FDF4; border-radius:8px; font-size:13px; color:#166534;">
        Need instant assistance? Reach us at <a href="tel:${COMPANY_PHONE}" style="color:#15803D; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#15803D; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Warm regards,<br>
        <strong>Datta Chhaya Tourism Team</strong> &bull; AORR Global Ecosystem<br>
        <a href="${COMPANY_WEBSITE}" style="color:#1B5E20; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildTradeCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#0F3814; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">AORR GLOBAL TRADE & SOURCING</h2>
      <p style="color:#81C784; margin:6px 0 0 0; font-size:13px;">International Export House &bull; Marine Supplies &bull; Global Logistics</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for submitting your commercial RFQ to <strong>AORR Global Trade & Marine Sourcing</strong>.
      </p>
      
      <div style="background:#F1F8E9; border-left:4px solid #1B5E20; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#0F3814; font-size:13px; text-transform:uppercase;">Inquiry Summary:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding:4px 0; color:#64748B;">Product / RFQ:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.location ? `<tr><td style="padding:4px 0; color:#64748B;">Region / Port:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
        </table>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our sourcing desk is reviewing your technical specifications, volume, and destination logistics. A trade manager will provide you with a formal Quotation/Proforma within 1 business day.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F8FAFC; border-radius:8px; font-size:13px; color:#334155;">
        Direct trade inquiries can also be routed to <a href="mailto:${ADMIN_EMAIL}" style="color:#0F3814; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a> or <a href="tel:${COMPANY_PHONE}" style="color:#0F3814; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Best regards,<br>
        <strong>Global Trade & Export Division</strong> &bull; AORR Global Enterprise<br>
        <a href="${COMPANY_WEBSITE}" style="color:#1B5E20; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildMedicalCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#00695C; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">AORR MEDICAL TOURISM</h2>
      <p style="color:#80CBC4; margin:6px 0 0 0; font-size:13px;">Ethical Cross-Border Healthcare & Dedicated Patient Concierge</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for placing your trust in <strong>AORR Medical Tourism</strong>. Your medical travel enquiry has been received and logged under strict confidentiality.
      </p>
      
      <div style="background:#E0F2F1; border-left:4px solid #00897B; padding:16px; margin:16px 0; border-radius:0 8px 8px 0;">
        <h4 style="margin:0 0 10px 0; color:#004D40; font-size:13px; text-transform:uppercase;">Confidential Case Reference:</h4>
        <table style="width:100%; font-size:13px; border-collapse:collapse; color:#1E293B;">
          <tr><td style="padding:4px 0; color:#64748B; width:130px;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding:4px 0; color:#64748B;">Specialty Needed:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.location ? `<tr><td style="padding:4px 0; color:#64748B;">Patient Location:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
        </table>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our senior healthcare concierge will review your preliminary medical requirements and coordinate with accredited super-specialty hospitals (NABH / JCI) in India to provide an initial clinical opinion, treatment cost estimate, and medical visa guidance.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F0FDFA; border-radius:8px; font-size:13px; color:#115E59;">
        For urgent patient assistance, contact our health desk directly at <a href="mailto:${ADMIN_EMAIL}" style="color:#0F766E; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a> or <a href="tel:${COMPANY_PHONE}" style="color:#0F766E; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Respectful regards,<br>
        <strong>AORR Medical Concierge Team</strong> &bull; AORR Global Enterprise<br>
        <a href="${COMPANY_WEBSITE}" style="color:#00695C; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

function buildGeneralCustomerEmail(lead) {
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; max-width:600px; margin:0 auto; border:1px solid #E2E8F0; border-radius:12px; overflow:hidden; background:#FFFFFF;">
    <div style="background:#1B5E20; padding:24px; text-align:center;">
      <h2 style="color:#FFFFFF; margin:0; font-size:20px;">${COMPANY_NAME}</h2>
      <p style="color:#A5D6A7; margin:6px 0 0 0; font-size:13px;">Global Trade &bull; Tours & Travel &bull; Healthcare Coordination</p>
    </div>
    <div style="padding:24px; color:#333333; line-height:1.6;">
      <p style="font-size:15px; margin:0 0 14px 0;">Dear <strong>${lead.name}</strong>,</p>
      <p style="font-size:14px; color:#475569; margin:0 0 16px 0;">
        Thank you for contacting <strong>${COMPANY_NAME}</strong>. We have received your inquiry (Reference: <strong>${lead.leadId}</strong>).
      </p>
      
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:16px; margin:16px 0;">
        <p style="margin:4px 0; font-size:13px; color:#1E293B;"><b>Subject / Service:</b> ${lead.product}</p>
        <p style="margin:4px 0; font-size:13px; color:#1E293B;"><b>Message:</b> ${lead.message}</p>
      </div>

      <p style="font-size:13px; color:#475569;">
        Our team is reviewing your requirements and will connect with you via email or phone shortly.
      </p>
      
      <div style="margin-top:20px; padding:14px; background:#F0FDF4; border-radius:8px; font-size:13px; color:#166534;">
        Need immediate assistance? Reach us at <a href="tel:${COMPANY_PHONE}" style="color:#15803D; font-weight:700; text-decoration:none;">${COMPANY_PHONE}</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#15803D; font-weight:700; text-decoration:none;">${ADMIN_EMAIL}</a>.
      </div>

      <hr style="border:none; border-top:1px solid #E2E8F0; margin:22px 0;" />
      <p style="font-size:12px; color:#94A3B8; margin:0;">
        Best regards,<br>
        <strong>${COMPANY_NAME} Team</strong><br>
        <a href="${COMPANY_WEBSITE}" style="color:#1B5E20; text-decoration:none;">${COMPANY_WEBSITE}</a>
      </p>
    </div>
  </div>`;
}

// ============================================================================
// UTILITIES & SECURITY HELPERS
// ============================================================================

/**
 * Sanitize strings against script injection and trim whitespace
 */
function sanitize(val) {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/[<>]/g, "")
    .trim();
}

/**
 * Prevent CSV / Spreadsheet Formula Injection
 * Prepends a single quote if string starts with dangerous formula operators (=, +, -, @)
 */
function escapeFormula(val) {
  if (typeof val !== "string") return val;
  if (/^[=+\-@]/.test(val)) {
    return "'" + val;
  }
  return val;
}

/**
 * Basic RFC email validation
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Extracts and cleans phone digits for WhatsApp international link
 */
function cleanPhoneForWhatsApp(phone) {
  if (!phone) return "";
  var digits = String(phone).replace(/\D/g, "");
  // If 10 digits (standard Indian mobile), prepend 91 country code
  if (digits.length === 10) {
    digits = "91" + digits;
  }
  return digits;
}

/**
 * Log processing error to an internal 'Error_Logs' tab for debugging
 */
function logErrorToSheet(err, rawParams) {
  try {
    var ss = getSpreadsheet();
    var errSheet = ss.getSheetByName("Error_Logs");
    if (!errSheet) {
      errSheet = ss.insertSheet("Error_Logs");
      errSheet.appendRow(["Timestamp", "Error Message", "Stack Trace", "Raw Parameters"]);
      errSheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#C62828").setFontColor("#FFFFFF");
    }
    errSheet.appendRow([
      new Date(),
      err.message || err.toString(),
      err.stack || "N/A",
      JSON.stringify(rawParams || {})
    ]);
  } catch (e) {
    // Fail silently to prevent cascading failure
  }
}