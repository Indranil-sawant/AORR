# PROJECT_MAP.md — Website Structure & Navigation Map

This document provides a fast architectural and functional map of the **AORR Global Trading & Distribution** repository. Use this reference to quickly locate relevant files when inspecting, maintaining, or extending any part of the website.

---

## 1. Complete File & Directory Inventory

| File / Folder | Type | Primary Purpose | Key Dependencies |
| :--- | :--- | :--- | :--- |
| `index.html` | HTML Page | Parent Portal: Master 3-pillar presentation (Trade, Travel, Healthcare), signature trade corridors, universal 5-step process, stats, and unified inquiry form. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `templatemo-prism-scripts.js`, `global-search-logic.js`, `loader.js` |
| `products.html` | HTML Page | Global Trade Division: Dynamic category navigation, subcategory landing pages, search filtering, and product quote enquiry modal. | `templatemo-prism-flux.css`, `products-style.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `products-data.js`, `subcategory-data.js`, `products-logic.js`, `global-search-logic.js`, `loader.js` |
| `tours-travel.html` | HTML Page | Tours & Travel Division: Dedicated leisure holiday itineraries, corporate business travel management, flight/hotel booking, MICE packages, and tailored travel inquiry form. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `templatemo-prism-scripts.js`, `global-search-logic.js`, `loader.js` |
| `medical-tourism.html` | HTML Page | Medical Tourism Division: Ethical cross-border healthcare travel coordination, 8 core services, 7-step patient journey timeline, ethics disclaimer, and confidential inquiry form. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `global-search-logic.js`, `loader.js` |
| `about-us.html` | HTML Page | About Us: Company story, 3-pillar ecosystem narrative, mission, core values, operational capabilities, leadership philosophy, and verified credentials. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `templatemo-prism-scripts.js`, `global-search-logic.js`, `loader.js` |
| `market-insights.html` | HTML Page | Global Network & Market Insights: Global trade analytics, market intelligence signals, interactive trade route city map pins, and trade stats. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `templatemo-prism-scripts.js`, `global-search-logic.js`, `loader.js` |
| `contact.html` | HTML Page | Contact Us: Corporate headquarters address, direct phone/email, 3-vertical inquiry form (Google Apps Script), and interactive Google Maps embed. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `templatemo-prism-scripts.js`, `global-search-logic.js`, `loader.js` |
| `services.html` | HTML Page | Services Overview: Cross-vertical summary of Global Trade, Tours & Travel, and Medical Tourism capabilities. | `templatemo-prism-flux.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`, `templatemo-prism-scripts.js`, `global-search-logic.js`, `loader.js` |
| `client-questionnaire.html` | HTML Page | Client Onboarding Questionnaire: Comprehensive export requirements intake form with client-side PDF export functionality. | `templatemo-prism-flux.css`, `html2pdf.js`, `global-search-style.css`, `whatsapp-widget.css` |
| `card-component.html` | Snippet / Test | Standalone test prototype for 3D flip card component with hover transformations. | Inline CSS, `global-search-style.css`, `global-search-logic.js` |
| `deploy-section.html` | Snippet / Test | Standalone test prototype for bento feature section using Tailwind CDN. | Tailwind CDN, `global-search-style.css` |
| `loader-snippet.html` | Snippet / Test | HTML snippet template demonstrating how to embed the `#aorr-loader` in new pages. | `loader.css`, `loader.js` |
| `product-grid.html` | Snippet / Test | Standalone prototype testing an alternate ecommerce grid using Tailwind CDN. | Tailwind CDN, `global-search-style.css` |
| `templatemo-prism-flux.css` | Stylesheet | Main corporate stylesheet containing theme variables (`:root`), base resets, header/navbar, 3-pillar cards, medical grid, patient journey timeline, universal process, forms, and footer. | None (Root Stylesheet) |
| `products-style.css` | Stylesheet | Specialized styles for `products.html`: sticky sidebar, search input, category tree, product cards, specs tables, and inquiry modal. | `templatemo-prism-flux.css` (inherits CSS variables) |
| `global-search-style.css` | Stylesheet | Styles for the navbar pill search input, search icon, and floating auto-complete suggestions dropdown. | `templatemo-prism-flux.css` |
| `loader.css` | Stylesheet | Styles for the full-screen preloader overlay, central globe, orbiting rings keyframes, brand text, and progress bar animation. | `templatemo-prism-flux.css` |
| `whatsapp-widget.css` | Stylesheet | Styles for the fixed bottom-right floating WhatsApp button, pulse/hover effect, and desktop tooltip. | None |
| `templatemo-prism-scripts.js` | Script | Global UI script: Animated stats counter, contact form handling, and mobile menu toggle. | None |
| `products-data.js` | Script (ES Module) | Comprehensive data dictionary containing all catalog categories, titles, subcategories, product items, and specifications. | None |
| `subcategory-data.js` | Script (ES Module) | Metadata dictionary containing descriptions, hero headers, and feature highlights for catalog subcategories. | None |
| `products-logic.js` | Script (ES Module) | Dynamic catalog renderer: Parses URL parameters (`?category=...&sub=...`), renders product cards/landing pages, and controls enquiry modal state. | `products-data.js`, `subcategory-data.js` |
| `global-search-logic.js` | Script (ES Module) | Injects search bar into navbar across all pages, builds flat search index covering all 3 verticals (Trade, Travel, Medical), and displays live auto-suggestions. | `products-data.js` |
| `loader.js` | Script | Manages the dismissal timing of `#aorr-loader` on window `load` with safety timeout and smooth fade transition. | `loader.css` |
| `accessibility-enhancements.js` | Script | Enhances keyboard navigation (Enter/Space on buttons, Escape to close mobile menu), ARIA attribute synchronization, and skip links. | None |
| `Code.gs` | Backend Script | Reference Google Apps Script code for handling POST submissions from contact and product forms, saving to Google Sheets, and sending emails. | Google Apps Script Engine |
| `.htaccess` | Server Config | Apache web server configuration: HTTPS enforcement, GZIP/Brotli compression rules, 1-year expires headers for static images, and security headers. | Apache HTTP Server |
| `sitemap.xml` | SEO Data | Standard XML sitemap listing all 8 live production URLs, priorities, and change frequencies for search engines. | Google Search Console |
| `robots.txt` | SEO Data | Crawler instructions allowing public indexing of HTML/images while disallowing utility scripts and repository files. | Web Crawlers |
| `CNAME` | DNS Config | Domain binding mapping GitHub Pages / static host to `aorr.in`. | DNS Provider |
| `images/` | Directory | Directory containing all visual assets: logos, port photos, product category images, hero backgrounds, in both `.webp` and original JPG/PNG formats. | All HTML / CSS files |

---

## 2. Where to Look When Making Changes

### 🎯 Changing a Specific Page's Content
* **Homepage (Portal):** Edit `index.html`.
* **Global Trade (Products & Sourcing):** Edit `products-data.js`, `subcategory-data.js`, or `products.html`.
* **Tours & Travel:** Edit `tours-travel.html`.
* **Medical Tourism & Global Healthcare:** Edit `medical-tourism.html`.
* **Company Background & Mission:** Edit `about-us.html`.
* **Services Overview:** Edit `services.html`.
* **Market Insights & Analytics:** Edit `market-insights.html`.
* **Contact Information / Addresses:** Edit `contact.html` and update the footer blocks across all HTML pages.
* **Client Questionnaire:** Edit `client-questionnaire.html`.

### 🎨 Changing Visual Styling & Theme
* **Theme Colors, Global Typography, Header, Footer, 3-Pillar Grid, Medical Cards, Timeline:** Edit `templatemo-prism-flux.css`.
* **Product Catalog Layout, Cards, Modal:** Edit `products-style.css`.
* **Navbar Search Bar & Auto-Suggest Dropdown:** Edit `global-search-style.css`.
* **Preloader Animations:** Edit `loader.css`.
* **Floating WhatsApp Button:** Edit `whatsapp-widget.css`.

### 🧭 Changing Navigation & Header
* **Navigation Links:** Update `<ul class="nav-menu" id="navMenu">` in all 8 HTML files (`index.html`, `products.html`, `tours-travel.html`, `medical-tourism.html`, `about-us.html`, `market-insights.html`, `contact.html`, `client-questionnaire.html`).
* **Logo:** Update `<a href="index.html" class="logo">` in all HTML files.
* **Mobile Menu Behavior:** Inspect `templatemo-prism-scripts.js` (lines 238–246) and `accessibility-enhancements.js`.

### ⚡ Changing Animations & Interactions
* **3D Hero Carousel (Homepage):** Inspect `initCarousel()` and `updateCarousel()` in `templatemo-prism-scripts.js` (lines 58–193).
* **Performance Chart (Homepage):** Inspect `initPerformanceChart()` in `templatemo-prism-scripts.js` (lines 352–485).
* **Preloader Animation:** Inspect `@keyframes` in `loader.css` and timeout logic in `loader.js`.
* **Floating Particles:** Inspect `initParticles()` in `templatemo-prism-scripts.js` (lines 40–56).

### 🖼️ Adding or Updating Images
1. Save the new image in `/images/`.
2. Provide a `.webp` version (preferred) and a fallback `.jpg` or `.png`.
3. In HTML, use standard `<picture>` markup:
   ```html
   <picture>
       <source srcset="images/your-image.webp" type="image/webp">
       <img src="images/your-image.jpg" alt="Descriptive SEO keyword alt text" loading="lazy" decoding="async" width="800" height="600">
   </picture>
   ```
4. If the image is used in the homepage carousel, update `portfolioData` in `templatemo-prism-scripts.js`.

### 📱 Adjusting Responsive Behavior
* **Global Layout & Mobile Menu Breakpoints:** Inspect media queries in `templatemo-prism-flux.css` (primary breakpoint is `@media (max-width: 768px)`).
* **Product Catalog Responsive Grid:** Inspect media queries in `products-style.css`.
* **Preloader Responsive Sizing:** Inspect media queries in `loader.css`.

### ⚙️ Modifying Forms & Backend Integrations
* **Contact Form Action:** Inspect `<form id="contactForm">` in `contact.html` and `index.html`.
* **Product Enquiry Form Action:** Inspect `<form id="product-enquiry-form">` in `products.html`.
* **Google Apps Script Handler:** Review `Code.gs` to understand sheet columns, validation, spam honeypots, and email formatting.
