/**
 * ============================================================================
 * AORR GLOBAL ECOSYSTEM — MASTER GOOGLE APPS SCRIPT LEAD MANAGEMENT SYSTEM
 * ============================================================================
 * 
 * Version: 2.0.0
 * Architecture: Multi-Division, Multi-Tab Google Sheets Routing & Automated Email Engine
 * 
 * Divsions Supported:
 *   1. IRCTC RAILWAY DESK (Authorised Agent) — Railway reservation & Tatkal enquiries
 *   2. DATTA CHHAYA TOURISM — Spiritual pilgrimages, yatras & tour packages
 *   3. GLOBAL TRADE & MARINE SOURCING — Import/export, marine supplies, product RFQs
 *   4. MEDICAL TOURISM — Cross-border healthcare coordination & medical travel
 *   5. GENERAL ENTERPRISE — Strategic partnerships & multi-vertical inquiries
 * 
 * Web App URL:
 * https://script.google.com/macros/s/AKfycbyCVzpROw93c6fOI9UfF4Hab11M6YkalT-xan8GTrDNtEYpI6W3bojXMXmx9q3a_7ZcIQ/exec
 * ============================================================================
 */

// Global Configuration
const CONFIG = {
  ADMIN_EMAIL: "aorr@aorr.in",
  BRAND_NAME: "AORR Global Enterprise",
  SUPPORT_PHONE: "+91 97300 04911",
  WEBSITE_URL: "https://www.aorr.in",
  TABS: {
    MASTER_INDEX: "All_Leads_Index",
    RAILWAY: "IRCTC_Railway_Desk",
    TOURISM: "Datta_Chhaya_Tourism",
    TRADE: "Global_Trade",
    MEDICAL: "Medical_Tourism",
    GENERAL: "General_Inquiries"
  }
};

/**
 * Main Web App POST Handler
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // Acquire lock for concurrency protection (wait up to 15 seconds)
    lock.waitLock(15000);

    const params = e && e.parameter ? e.parameter : {};

    // 1. HONEYPOT ANTI-SPAM PROTECTION
    // Hidden 'company' field must be completely empty. If populated, silently drop.
    if (params.company && String(params.company).trim() !== "") {
      return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    }

    // 2. VALIDATION (Name & Email are mandatory)
    const name = sanitize(params.name || "");
    const email = sanitize(params.email || "");
    if (!name || !email || !isValidEmail(email)) {
      return ContentService.createTextOutput("Error: Missing or invalid required fields")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 3. CLASSIFY BUSINESS DIVISION
    const divisionInfo = classifyDivision(params);
    const leadId = generateLeadId(divisionInfo.code);
    const timestamp = new Date();

    // 4. EXTRACT & SANITIZE ALL RELEVANT FIELDS
    const leadData = {
      leadId: leadId,
      timestamp: timestamp,
      timestampStr: Utilities.formatDate(timestamp, "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss"),
      divisionCode: divisionInfo.code,
      divisionName: divisionInfo.name,
      tabName: divisionInfo.tabName,
      sourcePage: sanitize(params.page || "Website"),
      name: name,
      email: email,
      phone: sanitize(params.phone || "N/A"),
      location: sanitize(params.location || ""),
      destination: sanitize(params.destination || ""),
      travelDate: sanitize(params.travel_date || ""),
      preferredClass: sanitize(params.preferred_class || ""),
      quota: sanitize(params.quota || ""),
      passengerCount: sanitize(params.passenger_count || ""),
      travellersCount: sanitize(params.travellers_count || ""),
      itinerary: sanitize(params.itinerary || ""),
      packageTier: sanitize(params.package || ""),
      product: sanitize(params.product || ""),
      message: sanitize(params.message || ""),
      userAgent: sanitize(params.userAgent || "")
    };

    // 5. RECORD LEAD IN GOOGLE SHEETS (Division-Specific Tab & Master Tab)
    saveLeadToSpreadsheet(leadData);

    // 6. SEND AUTOMATED DIVISION-SPECIFIC CUSTOMER CONFIRMATION EMAIL
    sendCustomerConfirmation(leadData);

    // 7. SEND AUTOMATED ADMIN NOTIFICATION EMAIL
    sendAdminNotification(leadData);

    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    console.error("Critical doPost Error: " + error.toString());
    logErrorToSheet(error, e ? e.parameter : null);
    return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
  } finally {
    try {
      lock.releaseLock();
    } catch (lErr) {
      // Lock already released or expired
    }
  }
}

/**
 * Handle GET Requests (Health Check)
 */
function doGet(e) {
  return ContentService.createTextOutput("AORR Lead Management Web App is Active and Operational.")
    .setMimeType(ContentService.MimeType.TEXT);
}

// ============================================================================
// DIVISION CLASSIFICATION
// ============================================================================

function classifyDivision(params) {
  const page = String(params.page || "").toLowerCase();
  const product = String(params.product || "").toLowerCase();
  const location = String(params.location || "").toLowerCase();
  const dest = String(params.destination || "").toLowerCase();

  // 1. IRCTC Railway Desk
  if (
    page.includes("irctc") ||
    page.includes("railway") ||
    product.includes("irctc") ||
    product.includes("railway") ||
    location.includes("irctc") ||
    location.includes("railway") ||
    dest !== "" ||
    params.preferred_class ||
    params.quota
  ) {
    return {
      code: "RAIL",
      name: "IRCTC Railway Desk (Authorised Agent)",
      tabName: CONFIG.TABS.RAILWAY
    };
  }

  // 2. Datta Chhaya Tourism & Pilgrimages
  if (
    page.includes("tours-travel") ||
    product.includes("datta chhaya") ||
    product.includes("tourism") ||
    product.includes("yatra") ||
    product.includes("tour") ||
    location.includes("datta chhaya") ||
    location.includes("yatra") ||
    location.includes("pilgrimage") ||
    params.itinerary ||
    params.travellers_count
  ) {
    return {
      code: "TOUR",
      name: "Datta Chhaya Tourism",
      tabName: CONFIG.TABS.TOURISM
    };
  }

  // 3. Medical Tourism
  if (
    page.includes("medical") ||
    product.includes("medical") ||
    product.includes("healthcare") ||
    location.includes("medical") ||
    location.includes("cardiology") ||
    location.includes("oncology")
  ) {
    return {
      code: "MED",
      name: "Medical Tourism & Healthcare",
      tabName: CONFIG.TABS.MEDICAL
    };
  }

  // 4. Global Trade & Marine Sourcing
  if (
    page.includes("product") ||
    page.includes("trade") ||
    product.includes("trade") ||
    product.includes("marine") ||
    product.includes("agro") ||
    product.includes("garment") ||
    product.includes("sourcing") ||
    location.includes("marine") ||
    location.includes("industrial supplies")
  ) {
    return {
      code: "TRAD",
      name: "Global Trade & Marine Sourcing",
      tabName: CONFIG.TABS.TRADE
    };
  }

  // 5. Default General Enterprise Inquiries
  return {
    code: "GEN",
    name: "General Strategic Enterprise",
    tabName: CONFIG.TABS.GENERAL
  };
}

// ============================================================================
// GOOGLE SHEETS STORAGE ENGINE
// ============================================================================

function saveLeadToSpreadsheet(lead) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Save to Division-Specific Tab
  const divSheet = getOrCreateSheet(ss, lead.tabName, lead.divisionCode);
  
  if (lead.divisionCode === "RAIL") {
    divSheet.appendRow([
      lead.timestampStr,
      escapeFormula(lead.leadId),
      escapeFormula(lead.name),
      escapeFormula(lead.phone),
      escapeFormula(lead.email),
      escapeFormula(lead.location),       // From Station
      escapeFormula(lead.destination),    // To Station
      escapeFormula(lead.travelDate),     // Journey Date
      escapeFormula(lead.preferredClass), // Preferred Class
      escapeFormula(lead.quota),          // Booking Quota
      escapeFormula(lead.passengerCount), // Passengers
      escapeFormula(lead.message),        // Passenger Names & Berths
      "New Enquiry",
      escapeFormula(lead.sourcePage)
    ]);
  } else if (lead.divisionCode === "TOUR") {
    divSheet.appendRow([
      lead.timestampStr,
      escapeFormula(lead.leadId),
      escapeFormula(lead.name),
      escapeFormula(lead.phone),
      escapeFormula(lead.email),
      escapeFormula(lead.itinerary || lead.location || lead.product), // Yatra Package
      escapeFormula(lead.packageTier || "Standard"),                  // Package Tier
      escapeFormula(lead.travelDate || "Flexible"),                   // Date
      escapeFormula(lead.travellersCount || "N/A"),                   // Travellers Count
      escapeFormula(lead.message),
      "New Enquiry",
      escapeFormula(lead.sourcePage)
    ]);
  } else if (lead.divisionCode === "TRAD") {
    divSheet.appendRow([
      lead.timestampStr,
      escapeFormula(lead.leadId),
      escapeFormula(lead.name),
      escapeFormula(lead.phone),
      escapeFormula(lead.email),
      escapeFormula(lead.product),        // Product Name / RFQ Category
      escapeFormula(lead.location),       // Country / Destination Port
      escapeFormula(lead.message),
      "New RFQ",
      escapeFormula(lead.sourcePage)
    ]);
  } else if (lead.divisionCode === "MED") {
    divSheet.appendRow([
      lead.timestampStr,
      escapeFormula(lead.leadId),
      escapeFormula(lead.name),
      escapeFormula(lead.phone),
      escapeFormula(lead.email),
      escapeFormula(lead.product),        // Medical Specialty
      escapeFormula(lead.location),       // Patient Country / City
      escapeFormula(lead.message),
      "Confidential Review",
      escapeFormula(lead.sourcePage)
    ]);
  } else {
    divSheet.appendRow([
      lead.timestampStr,
      escapeFormula(lead.leadId),
      escapeFormula(lead.name),
      escapeFormula(lead.phone),
      escapeFormula(lead.email),
      escapeFormula(lead.product || "General Inquiry"),
      escapeFormula(lead.location || "N/A"),
      escapeFormula(lead.message),
      "New Inquiry",
      escapeFormula(lead.sourcePage)
    ]);
  }

  // 2. Save Summary Record to Master Index Tab
  const masterSheet = getOrCreateSheet(ss, CONFIG.TABS.MASTER_INDEX, "MASTER");
  masterSheet.appendRow([
    lead.timestampStr,
    escapeFormula(lead.leadId),
    escapeFormula(lead.divisionName),
    escapeFormula(lead.name),
    escapeFormula(lead.phone),
    escapeFormula(lead.email),
    escapeFormula(lead.product || lead.itinerary || lead.location || "General"),
    escapeFormula(lead.message),
    "Pending",
    escapeFormula(lead.sourcePage)
  ]);
}

/**
 * Retrieve or initialize a structured tab with professional headers
 */
function getOrCreateSheet(ss, tabName, type) {
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.setTabColor(getTabColor(type));

    let headers = [];
    if (type === "RAIL") {
      headers = ["Timestamp", "Lead ID", "Passenger Name", "Phone / WhatsApp", "Email Address", "From Station", "To Station", "Journey Date", "Travel Class", "Booking Quota", "Pax Count", "Passenger Details / Message", "Status", "Source Page"];
    } else if (type === "TOUR") {
      headers = ["Timestamp", "Lead ID", "Pilgrim Name", "Phone / WhatsApp", "Email Address", "Yatra / Itinerary", "Package Tier", "Travel Date", "Travellers Count", "Requirements / Message", "Status", "Source Page"];
    } else if (type === "TRAD") {
      headers = ["Timestamp", "Lead ID", "Contact Name", "Phone / WhatsApp", "Email Address", "Product / RFQ", "Region / Delivery Port", "Inquiry Message", "Status", "Source Page"];
    } else if (type === "MED") {
      headers = ["Timestamp", "Lead ID", "Patient / Contact Name", "Phone / WhatsApp", "Email Address", "Specialty Needed", "Patient Location", "Case Summary", "Status", "Source Page"];
    } else if (type === "MASTER") {
      headers = ["Timestamp", "Lead ID", "Business Division", "Customer Name", "Phone", "Email", "Subject / Service", "Customer Message", "Status", "Source Page"];
    } else {
      headers = ["Timestamp", "Lead ID", "Name", "Phone", "Email", "Service Division", "Location", "Message", "Status", "Source Page"];
    }

    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1B5E20");
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getTabColor(type) {
  switch (type) {
    case "RAIL": return "#1565C0";  // Railway Blue
    case "TOUR": return "#E65100";  // Yatra Saffron / Amber
    case "TRAD": return "#1B5E20";  // Forest Green
    case "MED":  return "#00838F";  // Healthcare Cyan
    default:     return "#37474F";  // Slate
  }
}

// ============================================================================
// EMAIL AUTOMATION ENGINE
// ============================================================================

/**
 * 1. Customer Confirmation Email Dispatcher
 */
function sendCustomerConfirmation(lead) {
  if (!lead.email || lead.email === "N/A") return;

  let subject = "";
  let htmlBody = "";
  let senderName = CONFIG.BRAND_NAME;

  if (lead.divisionCode === "RAIL") {
    senderName = "AORR IRCTC Railway Desk";
    subject = `Railway Booking Enquiry Received [Ref: ${lead.leadId}] | AORR Railway Desk`;
    htmlBody = buildRailwayCustomerEmail(lead);
  } else if (lead.divisionCode === "TOUR") {
    senderName = "Datta Chhaya Tourism";
    subject = `We've Received Your Travel Enquiry [Ref: ${lead.leadId}] | Datta Chhaya Tourism`;
    htmlBody = buildTourismCustomerEmail(lead);
  } else if (lead.divisionCode === "TRAD") {
    senderName = "AORR Global Trade";
    subject = `Business Enquiry Received [Ref: ${lead.leadId}] | AORR Global Trade`;
    htmlBody = buildTradeCustomerEmail(lead);
  } else if (lead.divisionCode === "MED") {
    senderName = "AORR Medical Tourism";
    subject = `Confidential Healthcare Travel Enquiry [Ref: ${lead.leadId}] | AORR Health Desk`;
    htmlBody = buildMedicalCustomerEmail(lead);
  } else {
    senderName = CONFIG.BRAND_NAME;
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
    console.error(`Customer email failed to ${lead.email}: ` + err.toString());
  }
}

/**
 * 2. Admin / Owner Lead Notification Dispatcher
 */
function sendAdminNotification(lead) {
  const subject = `[${lead.divisionCode}] New Lead: ${lead.name} — ${lead.leadId}`;
  const htmlBody = buildAdminNotificationEmail(lead);

  try {
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      name: "AORR Lead Alert Engine"
    });
  } catch (err) {
    console.error("Admin notification failed: " + err.toString());
  }
}

// ============================================================================
// DIVISION-SPECIFIC EMAIL TEMPLATES
// ============================================================================

function buildRailwayCustomerEmail(lead) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: #ffffff;">
    <div style="background-color: #0d47a1; padding: 22px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 0.5px;">AORR IRCTC RAILWAY DESK</h2>
      <p style="color: #bbdefb; margin: 5px 0 0 0; font-size: 13px;">Authorised Railway Reservation & Ticketing Assistance</p>
    </div>
    <div style="padding: 24px; color: #333333; line-height: 1.6;">
      <p style="font-size: 16px;">Dear <strong>${lead.name}</strong>,</p>
      <p>Thank you for contacting the <strong>AORR IRCTC Railway Desk</strong>. We have received your railway travel reservation enquiry.</p>
      
      <div style="background-color: #f0f7ff; border-left: 4px solid #1976d2; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0d47a1; font-size: 14px; text-transform: uppercase;">Your Enquiry Summary:</h4>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #555;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.location ? `<tr><td style="padding: 4px 0; color: #555;">From Station:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
          ${lead.destination ? `<tr><td style="padding: 4px 0; color: #555;">To Station:</td><td><strong>${lead.destination}</strong></td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding: 4px 0; color: #555;">Journey Date:</td><td><strong>${lead.travelDate}</strong></td></tr>` : ''}
          ${lead.preferredClass ? `<tr><td style="padding: 4px 0; color: #555;">Preferred Class:</td><td><strong>${lead.preferredClass}</strong></td></tr>` : ''}
          ${lead.quota ? `<tr><td style="padding: 4px 0; color: #555;">Booking Quota:</td><td><strong>${lead.quota}</strong></td></tr>` : ''}
          ${lead.passengerCount ? `<tr><td style="padding: 4px 0; color: #555;">Passengers:</td><td><strong>${lead.passengerCount}</strong></td></tr>` : ''}
        </table>
      </div>

      <div style="background-color: #fff8e1; border: 1px solid #ffe082; padding: 12px; border-radius: 6px; font-size: 13px; color: #6d4c41; margin-bottom: 20px;">
        <strong>Important Notice:</strong> Submitting an enquiry does not guarantee ticket availability, confirmed reservation, or a Tatkal booking. Availability is subject to official Indian Railways PRS systems at the time of processing.
      </div>

      <p>Our ticketing team will review your travel preferences, verify train schedules, and contact you via phone/WhatsApp at <strong>${lead.phone}</strong>.</p>
      
      <p style="margin-top: 24px;">For urgent Tatkal coordination, feel free to call our desk directly at <a href="tel:${CONFIG.SUPPORT_PHONE}" style="color: #0d47a1; font-weight: bold;">${CONFIG.SUPPORT_PHONE}</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0;">
        Warm regards,<br>
        <strong>AORR IRCTC Railway Desk</strong><br>
        Pune, Maharashtra, India | <a href="${CONFIG.WEBSITE_URL}" style="color: #0d47a1;">${CONFIG.WEBSITE_URL}</a>
      </p>
    </div>
  </div>`;
}

function buildTourismCustomerEmail(lead) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: #ffffff;">
    <div style="background-color: #1b5e20; padding: 22px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 20px;">DATTA CHHAYA TOURISM</h2>
      <p style="color: #a5d6a7; margin: 5px 0 0 0; font-size: 13px;">Spiritual Pilgrimages, Yatras & Dedicated Travel Services</p>
    </div>
    <div style="padding: 24px; color: #333333; line-height: 1.6;">
      <p style="font-size: 16px;">Dear <strong>${lead.name}</strong>,</p>
      <p>Thank you for reaching out to <strong>Datta Chhaya Tourism</strong>. We have received your pilgrimage / yatra inquiry and are honored to assist you with your sacred journey.</p>
      
      <div style="background-color: #f1f8e9; border-left: 4px solid #66bb6a; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
        <h4 style="margin: 0 0 10px 0; color: #1b5e20; font-size: 14px; text-transform: uppercase;">Your Yatra Enquiry Details:</h4>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #555;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.itinerary || lead.location ? `<tr><td style="padding: 4px 0; color: #555;">Yatra / Tour:</td><td><strong>${lead.itinerary || lead.location}</strong></td></tr>` : ''}
          ${lead.packageTier ? `<tr><td style="padding: 4px 0; color: #555;">Package Tier:</td><td><strong>${lead.packageTier}</strong></td></tr>` : ''}
          ${lead.travelDate ? `<tr><td style="padding: 4px 0; color: #555;">Travel Date:</td><td><strong>${lead.travelDate}</strong></td></tr>` : ''}
          ${lead.travellersCount ? `<tr><td style="padding: 4px 0; color: #555;">Pilgrims / Travellers:</td><td><strong>${lead.travellersCount}</strong></td></tr>` : ''}
        </table>
      </div>

      <p>Our travel planning team is reviewing your schedule and group requirements. A travel coordinator will connect with you via phone or WhatsApp shortly to provide your customized itinerary and darshan details.</p>
      
      <p style="margin-top: 24px;">Need instant assistance? Reach us at <a href="tel:${CONFIG.SUPPORT_PHONE}" style="color: #1b5e20; font-weight: bold;">${CONFIG.SUPPORT_PHONE}</a> or email <a href="mailto:${CONFIG.ADMIN_EMAIL}" style="color: #1b5e20;">${CONFIG.ADMIN_EMAIL}</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0;">
        Warm regards,<br>
        <strong>Datta Chhaya Tourism Team</strong><br>
        AORR Global Ecosystem | <a href="${CONFIG.WEBSITE_URL}" style="color: #1b5e20;">${CONFIG.WEBSITE_URL}</a>
      </p>
    </div>
  </div>`;
}

function buildTradeCustomerEmail(lead) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: #ffffff;">
    <div style="background-color: #0f3814; padding: 22px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 20px;">AORR GLOBAL TRADE & SOURCING</h2>
      <p style="color: #81c784; margin: 5px 0 0 0; font-size: 13px;">International Export House · Marine Supplies · Global Logistics</p>
    </div>
    <div style="padding: 24px; color: #333333; line-height: 1.6;">
      <p style="font-size: 16px;">Dear <strong>${lead.name}</strong>,</p>
      <p>Thank you for submitting your commercial inquiry to <strong>AORR Global Trade & Marine Sourcing</strong>.</p>
      
      <div style="background-color: #f1f8e9; border-left: 4px solid #1b5e20; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
        <h4 style="margin: 0 0 10px 0; color: #0f3814; font-size: 14px; text-transform: uppercase;">Inquiry Summary:</h4>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #555;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding: 4px 0; color: #555;">Product / Commodity:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.location ? `<tr><td style="padding: 4px 0; color: #555;">Region / Port:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
        </table>
      </div>

      <p>Our trade sourcing division is reviewing your specifications, commercial volumes, and destination logistics. A trade manager will provide you with a formal Quotation/Proforma within 1 business day.</p>
      
      <p>Direct export inquiries can also be routed to <a href="mailto:${CONFIG.ADMIN_EMAIL}" style="color: #1b5e20; font-weight: bold;">${CONFIG.ADMIN_EMAIL}</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0;">
        Best regards,<br>
        <strong>Global Trade & Export Division</strong><br>
        AORR Global Enterprise | <a href="${CONFIG.WEBSITE_URL}" style="color: #1b5e20;">${CONFIG.WEBSITE_URL}</a>
      </p>
    </div>
  </div>`;
}

function buildMedicalCustomerEmail(lead) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: #ffffff;">
    <div style="background-color: #00695c; padding: 22px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 20px;">AORR MEDICAL TOURISM</h2>
      <p style="color: #80cbc4; margin: 5px 0 0 0; font-size: 13px;">Ethical Cross-Border Healthcare & Dedicated Patient Concierge</p>
    </div>
    <div style="padding: 24px; color: #333333; line-height: 1.6;">
      <p style="font-size: 16px;">Dear <strong>${lead.name}</strong>,</p>
      <p>Thank you for placing your trust in <strong>AORR Medical Tourism</strong>. Your medical travel enquiry has been received and logged under strict confidentiality.</p>
      
      <div style="background-color: #e0f2f1; border-left: 4px solid #00897b; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
        <h4 style="margin: 0 0 10px 0; color: #004d40; font-size: 14px; text-transform: uppercase;">Confidential Case Reference:</h4>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #555;">Reference ID:</td><td><strong>${lead.leadId}</strong></td></tr>
          ${lead.product ? `<tr><td style="padding: 4px 0; color: #555;">Specialty of Interest:</td><td><strong>${lead.product}</strong></td></tr>` : ''}
          ${lead.location ? `<tr><td style="padding: 4px 0; color: #555;">Patient Location:</td><td><strong>${lead.location}</strong></td></tr>` : ''}
        </table>
      </div>

      <p>Our senior healthcare concierge will review your preliminary requirements and coordinate with accredited super-specialty hospitals (NABH / JCI) to provide an initial clinical opinion, treatment estimate, and medical visa guidance.</p>
      
      <p>For urgent medical assistance, please contact our medical desk directly at <a href="mailto:${CONFIG.ADMIN_EMAIL}" style="color: #00695c; font-weight: bold;">${CONFIG.ADMIN_EMAIL}</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0;">
        Respectful regards,<br>
        <strong>AORR Medical Concierge Team</strong><br>
        AORR Global Enterprise | <a href="${CONFIG.WEBSITE_URL}" style="color: #00695c;">${CONFIG.WEBSITE_URL}</a>
      </p>
    </div>
  </div>`;
}

function buildGeneralCustomerEmail(lead) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background: #ffffff;">
    <div style="background-color: #1b5e20; padding: 22px; text-align: center;">
      <h2 style="color: #ffffff; margin: 0; font-size: 20px;">AORR GLOBAL ENTERPRISE</h2>
      <p style="color: #a5d6a7; margin: 5px 0 0 0; font-size: 13px;">Global Trade · Tours & Travel · Healthcare Coordination</p>
    </div>
    <div style="padding: 24px; color: #333333; line-height: 1.6;">
      <p style="font-size: 16px;">Dear <strong>${lead.name}</strong>,</p>
      <p>Thank you for contacting <strong>AORR Global Enterprise</strong>. We have received your inquiry [Ref: <strong>${lead.leadId}</strong>].</p>
      <p>Our management team is reviewing your message and will connect with you via email or phone shortly.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0;">
        Best regards,<br>
        <strong>AORR Global Team</strong><br>
        <a href="${CONFIG.WEBSITE_URL}" style="color: #1b5e20;">${CONFIG.WEBSITE_URL}</a>
      </p>
    </div>
  </div>`;
}

function buildAdminNotificationEmail(lead) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #1b5e20; color: #ffffff; padding: 18px 24px;">
      <h3 style="margin: 0; font-size: 18px;">⚡ NEW LEAD RECEIVED — ${lead.divisionName.toUpperCase()}</h3>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Lead ID: <strong>${lead.leadId}</strong> | ${lead.timestampStr}</p>
    </div>
    <div style="padding: 24px; background: #ffffff; color: #333333;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: #f9f9f9;"><td style="padding: 8px; width: 35%; font-weight: bold; border: 1px solid #eee;">Division:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.divisionName}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Customer Name:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.name}</td></tr>
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Email:</td><td style="padding: 8px; border: 1px solid #eee;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Phone:</td><td style="padding: 8px; border: 1px solid #eee;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
        ${lead.location ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Location / From:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.location}</td></tr>` : ''}
        ${lead.destination ? `<tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Destination / To:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.destination}</td></tr>` : ''}
        ${lead.travelDate ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Travel Date:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.travelDate}</td></tr>` : ''}
        ${lead.preferredClass ? `<tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Class:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.preferredClass}</td></tr>` : ''}
        ${lead.quota ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Quota:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.quota}</td></tr>` : ''}
        ${lead.passengerCount ? `<tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Passenger Count:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.passengerCount}</td></tr>` : ''}
        ${lead.itinerary ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Itinerary:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.itinerary}</td></tr>` : ''}
        ${lead.packageTier ? `<tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Package Tier:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.packageTier}</td></tr>` : ''}
        ${lead.travellersCount ? `<tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Travellers Count:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.travellersCount}</td></tr>` : ''}
        ${lead.product ? `<tr><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Product / Service:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.product}</td></tr>` : ''}
        <tr style="background: #f9f9f9;"><td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Source Page:</td><td style="padding: 8px; border: 1px solid #eee;">${lead.sourcePage}</td></tr>
      </table>

      <div style="margin-top: 18px; padding: 14px; background: #fafafa; border: 1px solid #eee; border-radius: 6px;">
        <strong style="color: #555;">Customer Message / Specifics:</strong>
        <p style="margin: 8px 0 0 0; white-space: pre-wrap; font-size: 14px;">${lead.message || "No additional message provided."}</p>
      </div>

      <div style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">
        Recorded in Google Sheets tab: <strong>${lead.tabName}</strong>
      </div>
    </div>
  </div>`;
}

// ============================================================================
// UTILITIES & SECURITY HELPERS
// ============================================================================

/**
 * Generate a unique, traceable lead ID
 */
function generateLeadId(prefix) {
  const dateStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyyMMdd");
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `AORR-${prefix}-${dateStr}-${randomStr}`;
}

/**
 * Sanitize strings against HTML tags & control characters
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
 * Log processing error to an internal 'Error_Logs' tab for debugging
 */
function logErrorToSheet(err, rawParams) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let errSheet = ss.getSheetByName("Error_Logs");
    if (!errSheet) {
      errSheet = ss.insertSheet("Error_Logs");
      errSheet.appendRow(["Timestamp", "Error Message", "Stack Trace", "Raw Parameters"]);
      errSheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#c62828").setFontColor("#FFFFFF");
    }
    errSheet.appendRow([
      new Date(),
      err.message || err.toString(),
      err.stack || "N/A",
      JSON.stringify(rawParams || {})
    ]);
  } catch (e) {
    // Fail silently to avoid cascade
  }
}
