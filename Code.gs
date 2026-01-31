function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const params = e.parameter;

    // 1. HONEYPOT SPAM PROTECTION
    // If hidden 'company' field has value, it's a bot. Return success but do nothing.
    if (params.company) {
      return ContentService.createTextOutput("Success");
    }

    // 2. VALIDATION
    if (!params.name || !params.email) {
      return ContentService.createTextOutput("Missing fields");
    }

    const clean = (str) => String(str).replace(/[<>]/g, "");

    // 3. CAPTURE DATA
    const timestamp = new Date();
    const name = clean(params.name);
    const email = clean(params.email);
    const phone = clean(params.phone || "");
    const product = clean(params.product || "General Inquiry"); // New Field
    const location = clean(params.location || "");
    const message = clean(params.message || "");
    const pageUrl = clean(params.page || "");
    const userAgent = e.parameter.userAgent || "";

    // 4. APPEND TO SHEET
    // Ensure you have these headers in your sheet:
    // Timestamp | Name | Email | Phone | Location | Product | Message | Page URL | User Agent
    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      location,
      product,
      message,
      pageUrl,
      userAgent,
    ]);

    // 5. SEND EMAIL NOTIFICATIONS (Admin + Customer)
    sendEmails(params);

    return ContentService.createTextOutput("Success");
  } catch (err) {
    // Log error manually if needed, or just return safe error
    return ContentService.createTextOutput("Error");
  }
}

/**
 * Handle Email Sending
 */
function sendEmails(data) {
  const ADMIN_EMAIL = "aorr@aorr.in"; // Replace with your admin email
  const COMPANY_NAME = "AORR Global Trading";

  // 1. ADMIN NOTIFICATION
  const adminSubject = `New Inquiry: ${data.product || "General"} - ${data.name}`;
  const adminBody = `
    New Lead Received:
    ------------------
    Product: ${data.product || "N/A"}
    Name:    ${data.name}
    Email:   ${data.email}
    Phone:   ${data.phone || "N/A"}
    Location: ${data.location || "N/A"}
    
    Message:
    ${data.message || "No message provided"}

    Source Page: ${data.page || "Unknown"}
    Time: ${new Date().toLocaleString()}
  `;

  // Apply basic quotas protection (Apps Script has daily limits)
  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: adminSubject,
      body: adminBody,
    });
  } catch (e) {
    // Fail silently for email to ensure row is still saved
    console.log("Admin email failed: " + e.toString());
  }

  // 2. CUSTOMER CONFIRMATION (Branded HTML)
  const customerSubject = `We received your inquiry for ${data.product || "AORR Services"}`;
  const customerHtmlBody = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
      <div style="background-color: #002147; padding: 20px; text-align: center;">
        <h2 style="color: #C5A065; margin: 0;">AORR GLOBAL TRADING</h2>
      </div>
      <div style="padding: 20px;">
        <h3>Hello ${data.name},</h3>
        <p>Thank you for reaching out to us regarding <strong>${data.product || "your inquiry"}</strong>.</p>
        <p>We have successfully received your request. Our team will review your requirements and get back to you with a detailed quote or response within 24 hours.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #C5A065;">
          <strong>Your Inquiry Details:</strong><br>
          Product: ${data.product || "General Inquiry"}<br>
          Reference ID: ${Date.now().toString().slice(-6)}
        </div>

        <p>If you have urgent questions, please contact us directly at <a href="mailto:aorr@aorr.in">aorr@aorr.in</a>.</p>
        
        <br>
        <p>Best Regards,<br><strong>AORR Team</strong><br>Import | Export | Global Logistics</p>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: data.email,
      subject: customerSubject,
      htmlBody: customerHtmlBody,
      name: COMPANY_NAME,
    });
  } catch (e) {
    console.log("Customer email failed: " + e.toString());
  }
}
