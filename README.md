# AORR Global Trading & Distribution — Official Website

Official static website repository for **AORR Global Trading & Distribution** (`https://www.aorr.in`), a premier government-recognized export house and international trade partner based in Pune, Maharashtra, India.

---

## 🌐 Project Overview

AORR connects Indian manufacturers with international markets across 50+ countries. The website presents AORR's specialized export services, interactive product catalog, performance benchmarks, and regulatory compliance standards across marine supplies, industrial equipment, garments, and agricultural commodities.

* **Live Domain:** [https://www.aorr.in](https://www.aorr.in)
* **Architecture:** Static Multi-Page Website (HTML5, CSS3, ES6+ JavaScript)
* **Optimization:** Core Web Vitals tuned, WebP image formats, inline critical CSS, deferred scripts, Schema.org JSON-LD structured data, Apache compression & caching rules.

---

## 📁 Repository Structure

```text
/
├── index.html                     # Homepage
├── about-us.html                  # About Us & Company Philosophy
├── services.html                  # Export & Distribution Services
├── products.html                  # Interactive Product Catalog
├── market-insights.html           # Market Intelligence & Trade Signals
├── contact.html                   # Contact Inquiries & Direct Info
├── client-questionnaire.html      # Client Requirement Form (PDF Export)
│
├── templatemo-prism-flux.css      # Core Theme Stylesheet
├── products-style.css             # Product Catalog Styles
├── global-search-style.css        # Navbar Search & Dropdown Styles
├── loader.css                     # Custom Orbit Preloader Styles
├── whatsapp-widget.css            # WhatsApp Floating Contact Button
│
├── templatemo-prism-scripts.js    # Core UI Interactions & Chart
├── products-data.js               # Structured Product Catalog Data
├── subcategory-data.js            # Subcategory Metadata
├── products-logic.js              # Product Catalog Renderer & Routing
├── global-search-logic.js         # Auto-Suggest Search Logic
├── loader.js                      # Preloader Lifecycle Manager
├── accessibility-enhancements.js  # Keyboard Navigation & ARIA
│
├── Code.gs                        # Google Apps Script Webhook Endpoint
├── .htaccess                      # Apache Server Performance & Caching
├── sitemap.xml                    # XML Sitemap
├── robots.txt                     # Crawler Guidelines
├── CNAME                          # Custom Domain Mapping (aorr.in)
├── images/                        # WebP, PNG, JPG Assets
└── docs/                          # Comprehensive Technical Documentation
    ├── PROJECT_MAP.md             # File map, routes, and edit guide
    ├── DESIGN_SYSTEM.md           # Visual design tokens & responsive rules
    ├── COMPONENTS.md              # Reusable UI component catalog
    ├── DEVELOPMENT.md             # Local setup, testing & deployment
    └── CONTENT.md                 # Content inventory & SEO schema
```

---

## 🤖 AI Agent Guidelines

If you are an AI coding assistant working on this codebase, **read [AGENTS.md](AGENTS.md) first** before making any modifications.

### Core Rules for AI Assistants:
1. **Zero Redesign Policy:** Never redesign existing pages or change styling unless explicitly requested.
2. **Minimal Diffs:** Make the smallest possible change to achieve the requested outcome.
3. **No Build Tooling:** This is a zero-build static site. Do not add bundlers (Webpack, Vite, Tailwind CLI) or npm runtime dependencies.
4. **Preserve WebP & Responsive Rules:** Ensure all images maintain `<picture>` tags with `.webp` sources and fallbacks.

---

## 📚 Documentation Index

| Document | Purpose |
| :--- | :--- |
| **[AGENTS.md](AGENTS.md)** | Primary instructions, rules, and workflows for AI agents |
| **[docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)** | Directory map, page routes, and change navigation guide |
| **[docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** | Colors, typography, spacing, buttons, cards, animations |
| **[docs/COMPONENTS.md](docs/COMPONENTS.md)** | Detailed documentation of all reusable UI components |
| **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** | Local preview servers, validation checklist, and deployment |
| **[docs/CONTENT.md](docs/CONTENT.md)** | Page titles, headings, CTAs, contact information, and structured data |

---

## 🚀 Quick Start for Local Development

Since this is a pure static website, you can view and test it instantly using any lightweight HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Or using npx
npx serve .
```

Open your browser at `http://localhost:8000`.

---

## 📄 License & Ownership

Copyright &copy; 2026 AORR Global Trading & Distribution. All rights reserved.
