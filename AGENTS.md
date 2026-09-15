# AGENTS.md — AI Agent Guidelines for AORR Static Website

Welcome, AI Agent. This document defines the operating rules, technical architecture, constraints, and standard workflows for maintaining and enhancing the **AORR Global Trading & Distribution** website.

---

## 1. Project Overview

* **Website Name:** AORR Global Enterprise (Trade · Travel · Healthcare)
* **Website Domain:** `https://www.aorr.in` (custom domain with `CNAME` configured)
* **Business Domain:** Multi-service global enterprise based in Pune, Maharashtra, India operating three primary verticals:
  1. **Global Trade (Import & Export):** Government-recognized export house and international trade partner specializing in marine supplies (shipbuilding raw materials, resins, fiberglass, timber), industrial equipment & components (valves, fittings, machinery), garments, agricultural exports, and global logistics spanning 50+ countries.
  2. **Tours & Travel Services:** Premier travel management division delivering bespoke corporate travel itineraries, international flight & luxury hotel bookings, MICE group expeditions, visa assistance, and customized holiday packages.
  3. **Medical Tourism & Global Healthcare:** Ethical cross-border healthcare travel coordination connecting international patients with NABH/JCI-accredited hospitals, super-specialists, medical visas, and end-to-end dedicated on-ground concierge support in India.
* **Architecture:** Static Multi-Page Application (MPA) built with standard HTML5, modern vanilla CSS3 (CSS Variables, Flexbox, Grid), and Vanilla JavaScript (ES6+ modules and vanilla scripts).

---

## 2. Technology Stack

Only the following technologies are present and active in this project:

| Technology Layer | Actual Implementation | Details / Notes |
| :--- | :--- | :--- |
| **Markup** | HTML5 | Semantic structure, Open Graph, Twitter Cards, Schema.org JSON-LD |
| **Styling** | Vanilla CSS3 | Custom Properties (`:root`), Flexbox, CSS Grid, Fluid Typography, Keyframe Animations |
| **Scripts** | Vanilla JS (ES6+) | Vanilla DOM manipulation, ES Modules (`type="module"`), IntersectionObserver APIs |
| **Data Visualization** | Chart.js 4.4.0 (CDN) | Loaded via jsDelivr CDN (`chart.umd.min.js`) for performance analytics chart on homepage |
| **Typography** | Google Fonts (CDN) | `Inter`, `Poppins`, `Orbitron`, `Rajdhani` |
| **Analytics & SEO** | Google Tag Manager / GA4 | Tag ID `G-MF3X4BWLJ0` embedded across all primary HTML pages |
| **PDF Generation** | html2pdf.js (CDN) | Used exclusively on `client-questionnaire.html` |
| **Backend Integration** | Google Apps Script (Webhook) | Web App endpoints for processing contact, travel inquiry, and product enquiry form submissions to Google Sheets with automated email dispatch (`Code.gs`) |
| **Web Server Config** | Apache `.htaccess` | HTTPS redirect, GZIP/Brotli compression, 1-year browser caching for media assets, security headers |
| **Internal Tools** | Node.js (`pdf2json`), Python 3, Bash | Local developer scripts for data parsing, image optimization, and footer automation |

> [!NOTE]
> **No Frameworks or Bundlers in Production:** This repository does NOT use React, Vue, Angular, Astro, Vite, Webpack, or Tailwind CLI in its runtime build. Do not introduce build tools, package bundlers, or CSS preprocessors without explicit instruction.

---

## 3. Project Structure

The project follows a flat static multi-page structure with an `images/` asset directory:

```text
c:\Users\indranil sawant\Desktop\Projects\AORR\
├── AGENTS.md                          # Primary AI agent instructions (This file)
├── README.md                          # Project overview & documentation index
├── CNAME                              # Custom domain configuration (aorr.in)
├── robots.txt                         # Search engine crawling rules & sitemap pointer
├── sitemap.xml                        # XML sitemap for SEO discovery
├── .htaccess                          # Apache server config (compression, caching, SSL)
├── package.json / package-lock.json   # Minimal Node manifest for pdf2json utility
├── Code.gs                            # Google Apps Script reference code (forms & email)
│
├── [HTML Pages]
│   ├── index.html                     # Homepage (Hero, 3 Pillars Showcase, Trade Corridors, 5-Step Process, Stats, Contact)
│   ├── products.html                  # Interactive Product Catalog (Global Trade Division with category filtering & enquiry modal)
│   ├── tours-travel.html              # Dedicated Tours & Travel Division (Corporate travel, leisure, flights, inquiry form)
│   ├── medical-tourism.html           # Dedicated Medical Tourism Division (8 Core Services, 7-Step Journey, Ethics, Inquiry)
│   ├── about-us.html                  # About Us page (Company story, 3-pillar ecosystem, leadership, values, metrics)
│   ├── market-insights.html           # Global Network & Market Intelligence (Trade signals, interactive city pins)
│   ├── contact.html                   # Contact page (Direct info, 3-vertical inquiry form, Google Maps)
│   ├── services.html                  # Services overview (Cross-vertical overview: Trade, Travel, Healthcare)
│   └── client-questionnaire.html      # Client onboarding & requirement questionnaire with PDF export
│
├── [HTML Component & Test Snippets]
│   ├── card-component.html            # Isolated 3D flip card component prototype
│   ├── deploy-section.html            # Feature bento section prototype (Tailwind CDN demo)
│   ├── loader-snippet.html            # Snippet guide for embedding the custom preloader
│   └── product-grid.html              # Standalone product grid prototype (Tailwind CDN demo)
│
├── [CSS Stylesheets]
│   ├── templatemo-prism-flux.css      # Core global stylesheet (theme variables, header, hero, footer, responsive)
│   ├── products-style.css             # Product catalog styles (sticky sidebar, product cards, modal)
│   ├── global-search-style.css        # Navbar auto-suggest search box and dropdown styles
│   ├── loader.css                     # Preloader overlay, orbiting rings animation, and progress track
│   └── whatsapp-widget.css            # Floating WhatsApp button and tooltip styles
│
├── [JavaScript Files]
│   ├── templatemo-prism-scripts.js    # Core UI logic (carousel, counter, chart, contact form handler)
│   ├── products-data.js               # Structured product catalog data dictionary
│   ├── subcategory-data.js            # Subcategory metadata and descriptions
│   ├── products-logic.js              # ES Module: Dynamic catalog renderer, URL routing, modal handlers
│   ├── global-search-logic.js         # ES Module: Navbar search auto-suggestions and indexing
│   ├── loader.js                      # Preloader dismissal logic with minimum timer and transition handler
│   └── accessibility-enhancements.js  # ARIA roles, keyboard navigation, and focus management
│
├── [Utility Scripts & Data]
│   ├── optimize-images.sh             # Bash script for batch image optimization (ImageMagick / WebP)
│   ├── image-optimization-guide.sh    # Interactive shell guide for image compression
│   ├── extract_pdf.js / extract_pdf_2.js # Node scripts using pdf2json to parse specification PDFs
│   ├── remove_logo_text.py            # Python maintenance script for logo markup
│   ├── update_footers.py              # Python maintenance script for updating footer blocks
│   ├── update_logo_class.py           # Python maintenance script for updating logo classes
│   ├── data.txt / data1.txt           # Raw trade and product data reference dumps
│   ├── IMAGE_FILENAMES.txt            # Inventory of image filenames
│   └── AORR Website Data .pdf         # Source product specification document
│
├── images/                            # WebP, JPG, PNG image assets
└── docs/                              # Detailed project documentation
    ├── PROJECT_MAP.md                 # Complete file map & navigation guide
    ├── DESIGN_SYSTEM.md               # Colors, typography, spacing, UI tokens, breakpoints
    ├── COMPONENTS.md                  # Comprehensive component catalog & markup patterns
    ├── DEVELOPMENT.md                 # Local testing, deployment, and validation workflows
    └── CONTENT.md                     # Content hierarchy, copy inventory, and SEO structure
```

---

## 4. Fundamental Rules for AI Agents

### 🚨 Rule 0: Absolute Design & Functionality Preservation
* **NEVER redesign existing pages** unless explicitly instructed by the user.
* Preserve existing typography, spacing, color tokens, animations, hover effects, and responsive breakpoints.
* Make the **minimal required change** to fulfill the request. Never perform arbitrary reformatting or global refactoring.

### Rule 1: Code Pattern Consistency
* Inspect existing files before introducing new markup or styles.
* Reuse existing CSS classes (e.g., `.nav-link`, `.hero-btn`, `.card`, `.section-title`, `.section-tag-about`, `.enterprise-badge`).
* Follow existing naming conventions in JavaScript (camelCase for variables/functions, UPPER_SNAKE_CASE for constants).

### Rule 2: HTML Conventions
* Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
* All `<img>` tags must include:
  1. `<picture>` wrapper with `<source srcset="images/...webp" type="image/webp">` and fallback `<img>`.
  2. Meaningful `alt` attributes (for SEO and screen readers).
  3. `loading="lazy"` and `decoding="async"` for below-the-fold images.
  4. `loading="eager"` and explicit `width` and `height` on above-the-fold logos/heros to prevent Cumulative Layout Shift (CLS).
* Maintain standard `<head>` tags (Canonical, Open Graph, Twitter Card, GTM script, Google Fonts, and Favicon).

### Rule 3: CSS Conventions
* Always utilize CSS custom properties defined in `:root` inside `templatemo-prism-flux.css`:
  * `--primary-navy: #1B5E20;` (Primary Forest Green - Main dark brand tone)
  * `--primary-forest: #1B5E20;`
  * `--primary-dark: #0F3814;` (Deep Forest Green)
  * `--accent-green: #66BB6A;` (Vibrant Leaf Green - Buttons, interactive highlights)
  * `--accent-gold: #66BB6A;` (Aliased to leaf green for unified theme)
  * `--accent-gold-light: #A5D6A7;` (Soft Sage Green - Subtitle highlights, borders)
  * `--text-white: #ffffff;`
  * `--text-dark: #123315;`
  * `--text-gray: #e8f5e9;`
  * `--bg-light: #E8F5E9;` (Light Mint - Crisp content backgrounds)
* Do NOT hardcode arbitrary colors when an existing variable exists.
* For responsive design, preserve existing breakpoints:
  * `max-width: 768px` (Mobile view: hamburger menu, vertical card stacks)
  * `max-width: 1024px` / `max-width: 1200px` (Tablet/laptop layout adjustments)
  * `min-width: 1400px` (Max container sizing)

### Rule 4: JavaScript Conventions & Safety
* **No Unnecessary JS:** If a layout or effect can be cleanly achieved with CSS (e.g., flex/grid layout, hover transitions), do not write JavaScript.
* Maintain separation of concerns:
  * `products-data.js`: Holds raw data catalogs.
  * `products-logic.js`: Handles dynamic rendering, search params (`?category=...&sub=...`), and enquiry modals.
  * `global-search-logic.js`: Handles navbar search bar injection and instant search dropdown.
  * `loader.js`: Handles preloader timing and fade-out.
  * `accessibility-enhancements.js`: Handles keyboard traps and ARIA updates.
* When binding events, ensure target elements exist before adding listeners (e.g., `if (el) { ... }`).
* Forms submit asynchronously into hidden `<iframe>` elements to avoid page navigation while submitting to Google Apps Script (`target="hidden_iframe"`).

### Rule 5: Asset & Image Rules
* Images reside in `/images/`.
* High-priority images have been converted to `.webp` with JPG/PNG fallbacks.
* If adding new images:
  * Provide compressed `.webp` format and a fallback `.jpg` or `.png`.
  * Maintain aspect ratios to avoid layout shifts.
  * Do not upload uncompressed multi-megabyte files.

### Rule 6: Form Handling & External Services
* Contact and product inquiry forms post to Google Apps Script endpoints configured in `action="..."`.
* Form inputs must maintain their exact `name` attributes (`name`, `email`, `phone`, `location`, `message`, `product`, `page`).
* Honeypot field `<input type="text" name="company" style="display:none">` must be preserved to prevent spam submissions.

---

## 5. Standard AI Workflow

Follow this step-by-step workflow for all tasks:

```text
1. Understand Requirement
   └── Read AGENTS.md and relevant docs in /docs
2. Inspect Existing Code
   └── Review the exact HTML, CSS, and JS files involved
3. Identify Reusable Patterns
   └── Check docs/COMPONENTS.md and docs/DESIGN_SYSTEM.md
4. Make Minimal, Precise Changes
   └── Edit only necessary lines; do not rewrite entire files
5. Validate Responsiveness & Integrity
   └── Check desktop (1400px+), laptop (1024px), tablet, and mobile (375px–768px)
6. Check Console & Errors
   └── Ensure no broken links, JS errors, or missing assets
```

---

## 6. Documentation Quick Reference

For deep-dive technical details, refer to the documentation in `/docs`:

* **[docs/PROJECT_MAP.md](file:///docs/PROJECT_MAP.md)** — Detailed file listing, route mapping, and directory responsibilities.
* **[docs/DESIGN_SYSTEM.md](file:///docs/DESIGN_SYSTEM.md)** — Complete color palette, typography scale, spacing tokens, shadow definitions, and animations.
* **[docs/COMPONENTS.md](file:///docs/COMPONENTS.md)** — HTML structure, CSS rules, and JS interactions for all 18+ UI components.
* **[docs/DEVELOPMENT.md](file:///docs/DEVELOPMENT.md)** — Local development server, preview commands, testing checklist, and deployment procedures.
* **[docs/CONTENT.md](file:///docs/CONTENT.md)** — Copy hierarchy, page titles, meta descriptions, navigation labels, and structured schema data.
