# CONTENT.md — Content Hierarchy, Copy & SEO Reference

This document maps the content architecture, copywriting guidelines, page titles, heading structures, call-to-actions (CTAs), and structured schema data across the **AORR Global Trading & Distribution** website.

---

## 1. Content Preservation Rule

> [!IMPORTANT]
> **No Arbitrary Copy Modification:** AI agents must NOT alter corporate branding, product titles, marketing copy, contact details, or legal disclosures unless explicitly requested by the user.

---

## 2. Global Navigation Hierarchy

### Primary Navbar Links (`.nav-menu`)
1. **Home** $\rightarrow$ `index.html`
2. **About** $\rightarrow$ `about-us.html`
3. **Services** $\rightarrow$ `services.html`
4. **Import & Export** $\rightarrow$ `products.html`
5. **Tours & Travel** $\rightarrow$ `tours-travel.html`
6. **Insights** $\rightarrow$ `market-insights.html`
7. **Contact** $\rightarrow$ `contact.html`

### Footer Secondary Navigation (`.footer-bottom-nav`)
* `index.html` (Home)
* `about-us.html` (About)
* `services.html` (Services)
* `products.html` (Import & Export)
* `tours-travel.html` (Tours & Travel)
* `market-insights.html` (Insights)
* `contact.html` (Contact)
* Copyright: `© 2026 AORR Global Trading`

---

## 3. Page-by-Page Content & SEO Architecture

### 1. Homepage (`index.html`)
* **Page Title:** `AORR: Leading Export Company in India | Marine & Industrial Supplies`
* **Meta Description:** `AORR is a government-recognized export house in India specializing in marine supplies, industrial equipment, and global trade solutions. Serving 50+ countries with 100% compliance.`
* **Key Sections:**
  * **Hero Section:**
    * *H1:* `India's Premier Export Partner for Global Markets`
    * *Subtitle:* `Connecting Indian Quality with World Demand`
    * *CTAs:* `View Product Catalog` (`products.html`), `Consult With Us` (`contact.html`)
  * **Philosophy Section:**
    * *H2:* `Your Trusted Export Bridge`
    * *Industries Power List:* Marine Exports, Industrial Equipment Exports, Global Distribution, International Supply Networks, Sourcing from India, Marine Service Providers.
  * **Enterprise Trust & Compliance:**
    * *H2:* `Enterprise-grade global trade platform`
    * *Badges:* `On-Time Delivery (99.9%)`, `Global Support (24/7)`, `ISO 9001 Certified`, `Export Compliant (50+ Countries)`, `AEO Certified`, `Trade Certified`.
  * **Performance Showcase:**
    * *H2:* `SAY GOODBYE TO DELAYS. FOREVER.`
    * *Metric:* `Delivery Time Reduced By -45%`
  * **Bento Feature Section:**
    * *H2:* `Trade, managed from end-to-end`
    * *Features:* All-in-One Sourcing, Smart Compliance.
  * **Industries We Serve:**
    * *H2:* `Industries We Serve`
    * *Sectors:* Marine & Ship Industry, Industrial & Commercial, Domestic Supply Services, Marine Components, General Trading.
  * **Dark Tech Feature Section:**
    * *H2:* `Engineered for Impact`
    * *Metrics:* `500+ Partners`, `-15% Logistics Cost`, `+24% Delivery Speed`, `100% Compliance`, `1,000+ Data Points`.
  * **Process Section:**
    * *H2:* `Planning & Execution Excellence`
    * *Cards:* Requirement Analysis, Strategic Planning, Quality Execution, Delivery & Support.
  * **Contact Section:**
    * *H2:* `Let's Flourish Together`
    * *Form:* Name, Email, Phone, Location, Message.

---

### 2. About Us (`about-us.html`)
* **Page Title:** `About AORR | Trusted Export Trading Company in Pune, India`
* **Meta Description:** `Learn about AORR's journey as a trusted export partner. Based in Pune, India, we bridge local manufacturers with global buyers through integrity and excellence.`
* **Key Sections:**
  * **Hero:** `Trusted Partner for Indian Exports`
  * **Stats Bar:** `50+ Countries Served`, `$10M+ Trade Volume`, `15K+ Shipments Delivered`, `100% Compliance Record`
  * **Story & Heritage:** End-to-end export lifecycle from India
  * **Leadership & Values:** Quality assurance, regulatory adherence, and integrity

---

### 3. Export Services (`services.html`)
* **Page Title:** `Export Services India | Logistics, Sourcing & Distribution - AORR`
* **Meta Description:** `End-to-end export services from India. We handle sourcing, quality control, customs compliance, and global logistics for marine and industrial goods.`
* **Key Sections:**
  * **Hero:** `Comprehensive Export & Global Trade Services`
  * **Global Distribution:** Strategic logistics networks & port connections
  * **Quality Inspection & Testing:** Marine and industrial standards compliance
  * **Customs Clearance & Documentation:** Automated documentation & AEO compliance
  * **Multi-Modal Transport:** Air, sea, and overland freight coordination

---

### 4. Product Export Catalog (`products.html`)
* **Page Title:** `Product Catalog | Industrial & Marine Equipment Exports from India - AORR`
* **Meta Description:** `Explore our extensive catalog of export-quality industrial machinery, marine supplies, and garments. Bulk sourcing and global shipping available from India.`
* **Catalog Categories (Defined in `products-data.js`):**
  1. `machinery_mechanical`: Machinery & Mechanical Appliances (Valves, Regulators, Fittings)
  2. `artificial_jewellery`: Artificial / Imitation Jewellery (Gold/Silver fashion, Beads, Bangles)
  3. `artificial_products`: Artificial Products (Decorative flowers, Hair wigs, Plastics, Leather)
  4. `garments`: Readymade Garments Export (Knitted T-shirts/sweaters, Woven shirts/trousers)
  5. `agriculture`: Agricultural Export Products (Animal, Vegetable, Oils, Processed Foods)
  6. `fiberglass_boats`: Fiberglass & Composite Boats
  7. `ship_repairing`: Ship Repairing & Marine Maintenance
  8. `after_sales_frp`: After-Sales Support for FRP/Composite Products

---

### 5. Tours & Travel Division (`tours-travel.html`)
* **Page Title:** `AORR Tours & Travel | Corporate & Bespoke Travel Solutions`
* **Meta Description:** `Explore bespoke corporate travel management, luxury holidays, flight bookings, visa assistance, and MICE expeditions with AORR Tours & Travel.`
* **Key Sections:**
  * **Hero Section:** `Crafting Seamless Journeys Across the Globe`
  * **Travel Capabilities:** Corporate & Business Travel, Bespoke Leisure & Holidays, Global Flight & Hotel Booking, Visa Assistance & Insurance, Luxury Cruises & Charters, MICE & Group Expeditions.
  * **4-Step Planning Process:** Consultation & Requirement Gathering $\rightarrow$ Custom Itinerary Design $\rightarrow$ Seamless Booking & Coordination $\rightarrow$ 24/7 Dedicated Concierge Support.
  * **Interactive Travel Inquiry Form:** Asynchronous submission posting to Google Apps Script webhook with trip parameters (Travel Type, Passenger Count, Destination, Dates).

---

### 6. Market Insights (`market-insights.html`)
* **Page Title:** `Market Analysis for Indian Exports | Global Trade Insights - AORR`
* **Meta Description:** `Real-time market insights and data-driven analysis for Indian exports across global trade routes.`
* **Key Sections:**
  * Global trade alert indicators
  * Interactive trade pins (Dubai, Rotterdam, Shanghai, Mumbai, New York)
  * Sector growth signals and market volume projections

---

### 6. Contact Us (`contact.html`)
* **Page Title:** `Contact AORR | Export Inquiries & Global Trade Support`
* **Meta Description:** `Ready to source quality products from India? Contact AORR today for a consultation.`
* **Contact Information:**
  * **Company:** AORR Global Trading & Distribution
  * **Headquarters:** `49/1/1, 1st Floor, Shri Hari Krupa, Ganesh Colony, Kothrud, Pune, Maharashtra – 411038, India`
  * **Direct Phone:** `+91 9730004911` / `+91 8975218910`
  * **General Email:** `aorr@aorr.in`
  * **Alternative Email:** `aorr.company@gmail.com`
  * **Departmental Emails:** `sales@aorr.in`, `purchase@aorr.in`
  * **Business Hours:** `Mon - Sat, 9:00 AM - 6:00 PM IST`
  * **WhatsApp Floating Link:** `https://wa.me/919730004911`

---

## 4. Structured Data (Schema.org JSON-LD)

The homepage (`index.html`) embeds two validated Schema.org structured data schemas:

### 1. Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AORR Global Trading & Distribution",
  "alternateName": "AORR",
  "url": "https://www.aorr.in",
  "logo": "https://www.aorr.in/images/logo.webp",
  "description": "Leading international trade company specializing in marine supplies, industrial goods, and domestic logistics across 50+ countries",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "49/1/1, Shri Hari Krupa, Kothrud",
    "addressLocality": "Pune",
    "addressRegion": "MH",
    "postalCode": "411038",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-8975218910",
    "contactType": "Customer Service",
    "email": "aorr@aorr.in",
    "areaServed": "Worldwide",
    "availableLanguage": ["English", "Hindi"]
  }
}
```

### 2. WebSite & SearchAction Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AORR Global Trading",
  "url": "https://www.aorr.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.aorr.in/products.html?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```
