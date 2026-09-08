# COMPONENTS.md — Reusable UI Component Catalog

This document catalogues all reusable user interface components, patterns, layout sections, and interactive widgets implemented across the **AORR Global Trading & Distribution** codebase.

---

## Component Index

1. [Custom Preloader](#1-custom-preloader)
2. [Global Header & Navigation Bar](#2-global-header--navigation-bar)
3. [Navbar Auto-Suggest Search](#3-navbar-auto-suggest-search)
4. [Hero Section with 3D Carousel](#4-hero-section-with-3d-carousel)
5. [Philosophy & Split About Section](#5-philosophy--split-about-section)
6. [Enterprise Trust Badges Grid](#6-enterprise-trust-badges-grid)
7. [Performance Metrics Showcase (Chart.js)](#7-performance-metrics-showcase-chartjs)
8. [Bento Feature Grid](#8-bento-feature-grid)
9. [Industries We Serve Grid](#9-industries-we-serve-grid)
10. [Dark Tech Feature Grid](#10-dark-tech-feature-grid)
11. [Global Impact Stats Bar](#11-global-impact-stats-bar)
12. [Delivery Optimization & Tracking Showcase](#12-delivery-optimization--tracking-showcase)
13. [Process 3D Flip Cards](#13-process-3d-flip-cards)
14. [Contact Form & Google Map Layout](#14-contact-form--google-map-layout)
15. [Global Footer & Newsletter](#15-global-footer--newsletter)
16. [WhatsApp Floating Button](#16-whatsapp-floating-button)
17. [Dynamic Product Catalog & Sidebar](#17-dynamic-product-catalog--sidebar)
18. [Product Quote Enquiry Modal](#18-product-quote-enquiry-modal)
19. [Client Onboarding Questionnaire](#19-client-onboarding-questionnaire)

---

## 1. Custom Preloader

* **Purpose:** Provides a smooth branded loading screen while heavy image and font assets load, preventing flash-of-unstyled-content (FOUC).
* **Location:** Embedded at top of `<body>` in all HTML pages.
* **HTML Structure:**
  ```html
  <div id="aorr-loader">
      <div class="loader-content">
          <div class="loader-globe"></div>
          <div class="loader-ring-1"></div>
          <div class="loader-ring-2"></div>
          <div class="loader-text-container">
              <span class="loader-brand">AORR</span>
              <span class="loader-tagline">Global Trading</span>
              <div class="loader-progress-track">
                  <div class="loader-progress-bar"></div>
              </div>
          </div>
      </div>
  </div>
  ```
* **CSS Location:** `loader.css` (`#aorr-loader`, `.loader-content`, `.loader-globe`, `.loader-ring-1`, `.loader-ring-2`, `@keyframes spin`).
* **JavaScript Dependencies:** `loader.js` (listens to `window.load` with a safety timeout).
* **Responsive Behavior:** Sizing decreases on screens `<= 768px` (rings scale from 100px/140px to 80px/110px).
* **Reuse Guidance:** Copy the snippet from `loader-snippet.html` to any newly created page.

---

## 2. Global Header & Navigation Bar

* **Purpose:** Main fixed header with responsive navigation menu, brand logo, and hamburger toggle.
* **Location:** Header block of all HTML pages (`index.html`, `about-us.html`, `services.html`, etc.).
* **HTML Structure:**
  ```html
  <header class="header" id="header">
      <nav class="nav-container">
          <a href="index.html" class="logo">
              <picture>
                  <source srcset="images/logo.webp" type="image/webp">
                  <img src="images/logo.png" alt="AORR Logo" class="nav-logo-img" loading="eager" width="200" height="100">
              </picture>
              <span class="logo-text">AORR</span>
          </a>

          <ul class="nav-menu" id="navMenu">
              <li><a href="index.html" class="nav-link active">Home</a></li>
              <li><a href="about-us.html" class="nav-link">About</a></li>
              <li><a href="services.html" class="nav-link">Services</a></li>
              <li><a href="products.html" class="nav-link">Products</a></li>
              <li><a href="market-insights.html" class="nav-link">Insights</a></li>
              <li><a href="contact.html" class="nav-link">Contact</a></li>
          </ul>

          <div class="menu-toggle" id="menuToggle">
              <span></span><span></span><span></span>
          </div>
      </nav>
  </header>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.header`, `.nav-container`, `.logo`, `.nav-menu`, `.nav-link`, `.menu-toggle`).
* **JavaScript Dependencies:** `templatemo-prism-scripts.js` (mobile toggle & header elevation observer), `accessibility-enhancements.js` (keyboard navigation & escape to close).
* **Responsive Behavior:** On `<= 768px`, `.nav-menu` hides into a dropdown drawer toggled by `.menu-toggle.active`.

---

## 3. Navbar Auto-Suggest Search

* **Purpose:** Global instant-search input in the navbar that queries the catalog data dictionary and displays matching categories or products.
* **Location:** Injected automatically into `.nav-container` across all pages via `global-search-logic.js`.
* **HTML Structure (Dynamic):**
  ```html
  <div class="nav-search-container">
      <input type="text" placeholder="Search products..." class="nav-search-input">
      <span class="nav-search-icon">🔍</span>
      <div class="search-results-dropdown">
          <!-- Injected result items -->
      </div>
  </div>
  ```
* **CSS Location:** `global-search-style.css`.
* **JavaScript Dependencies:** `global-search-logic.js` (ES Module). Reads from `products-data.js`.
* **Responsive Behavior:** Width expands from `160px` to `240px` on focus; adapts on mobile viewports.

---

## 4. Hero Section with 3D Carousel

* **Purpose:** High-impact homepage hero with headline, CTA buttons, and a rotating 3D depth-stacked card carousel.
* **Location:** `index.html` (`<section class="hero" id="home">`).
* **HTML Structure:**
  ```html
  <section class="hero" id="home" style="background: linear-gradient(rgba(0, 33, 71, 0.7), rgba(0, 21, 46, 0.8)), url('images/background_image_index.webp'); background-size: cover; background-position: center;">
      <div class="hero-overlay-text">
          <h1 class="hero-title">India's Premier Export Partner for Global Markets</h1>
          <p class="hero-subtitle">Connecting Indian Quality with World Demand</p>
          <p class="hero-description">AORR bridges the gap between Indian manufacturers and global buyers...</p>
          <div class="hero-cta-group">
              <a href="products.html" class="hero-btn primary">View Product Catalog</a>
              <a href="contact.html" class="hero-btn secondary">Consult With Us</a>
          </div>
      </div>
      <div class="carousel-container">
          <div class="carousel" id="carousel"></div>
      </div>
  </section>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.hero`, `.hero-title`, `.hero-subtitle`, `.hero-btn`, `.carousel-container`, `.carousel-item`).
* **JavaScript Dependencies:** `templatemo-prism-scripts.js` (`initCarousel()`, `updateCarousel()`, `portfolioData`).
* **Responsive Behavior:** Desktop renders a 3D Z-index translate stack. Mobile (`<= 768px`) resets transforms to a horizontal touch-scroll card deck with `IntersectionObserver` active-card highlights.

---

## 5. Philosophy & Split About Section

* **Purpose:** Explains company philosophy and core industry pillars alongside a featured image.
* **Location:** `index.html` (`<section class="philosophy-section" id="about">`).
* **HTML Structure:**
  ```html
  <section class="philosophy-section" id="about">
      <div class="philosophy-particles" id="particles"></div>
      <div class="philosophy-container">
          <div class="split-layout-about">
              <div>
                  <h2 class="philosophy-headline">Your Trusted Export Bridge</h2>
                  <p class="philosophy-subheading">...</p>
                  <div class="industries-check-grid">
                      <!-- 6 check items with gold checkmarks -->
                  </div>
                  <a href="about-us.html" class="card-cta">Learn Our Philosophy</a>
              </div>
              <div>
                  <!-- Image with shadow -->
              </div>
          </div>
      </div>
  </section>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.philosophy-section`, `.split-layout-about`, `.industries-check-grid`).
* **JavaScript Dependencies:** `initParticles()` in `templatemo-prism-scripts.js`.

---

## 6. Enterprise Trust Badges Grid

* **Purpose:** Highlights certifications and key trust metrics (ISO 9001, AEO Certified, 99.9% On-Time, 50+ Countries).
* **Location:** `index.html` (`<section class="enterprise-trust-section">`).
* **HTML Structure:**
  ```html
  <div class="enterprise-badges-grid">
      <div class="enterprise-badge">
          <span class="badge-icon">⏱️</span>
          <div class="badge-label">On-Time<br>Delivery</div>
          <div class="badge-value">99.9%</div>
      </div>
      <!-- Additional badges -->
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.enterprise-trust-section`, `.enterprise-badges-grid`, `.enterprise-badge`).

---

## 7. Performance Metrics Showcase (Chart.js)

* **Purpose:** Interactive benchmark chart demonstrating delivery time reduction with a toggle switch.
* **Location:** `index.html` (`<section class="performance-showcase-section">`).
* **HTML Structure:**
  ```html
  <div class="chart-wrapper">
      <div class="performance-toggle-container">
          <span>AORR Smart Logistics</span>
          <label class="performance-toggle">
              <input type="checkbox" id="performanceToggle" checked>
              <span class="toggle-slider"></span>
          </label>
      </div>
      <canvas id="performanceChart"></canvas>
      <div class="metric-badge">
          <div>Delivery Time<br>Reduced By</div>
          <div>-45%</div>
      </div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.performance-showcase-section`, `.chart-wrapper`, `.performance-toggle`, `.reveal-card`).
* **JavaScript Dependencies:** CDN `Chart.js 4.4.0` (`chart.umd.min.js`) and `initPerformanceChart()` in `templatemo-prism-scripts.js`.

---

## 8. Bento Feature Grid

* **Purpose:** Modern bento-style layout showcasing shipment tracking preview alongside value propositions.
* **Location:** `index.html` (`<section class="bento-section">`).
* **HTML Structure:**
  ```html
  <section class="bento-section">
      <div class="bento-grid">
          <div class="bento-large-card">
              <picture>
                  <source srcset="images/AORR (2).webp" type="image/webp">
                  <img src="images/AORR (2).jpg" alt="AORR digital operations dashboard" loading="lazy">
              </picture>
              <div class="bento-floating-ui">Shipment #AORR-992 In Transit</div>
          </div>
          <div class="bento-right-stack">
              <div class="bento-small-card">
                  <div class="bento-icon">📦</div>
                  <h3>All-in-One Sourcing</h3>
                  <p>From searching for the right supplier...</p>
              </div>
              <div class="bento-small-card">
                  <div class="bento-icon">🛡️</div>
                  <h3>Smart Compliance</h3>
                  <p>We navigate complex tariff structures...</p>
              </div>
          </div>
      </div>
  </section>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.bento-section`, `.bento-grid`, `.bento-large-card`, `.bento-small-card`).

---

## 9. Industries We Serve Grid

* **Purpose:** Sector-specific cards (Marine, Industrial, Domestic Supplies, Marine Components, General Trading).
* **Location:** `index.html` (`<section class="industries-section">`).
* **HTML Structure:**
  ```html
  <div class="industries-grid">
      <div class="industry-card" data-industry="agro">
          <div class="industry-card-inner">
              <div class="industry-icon"><svg>...</svg></div>
              <h3>Marine & Ship Industry</h3>
              <p>Providing shipbuilding raw materials...</p>
              <div class="industry-badge">Marine Engineering</div>
          </div>
      </div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.industries-section`, `.industries-grid`, `.industry-card`, `.industry-badge`).

---

## 10. Dark Tech Feature Grid

* **Purpose:** Dark translucent cards highlighting AI models, market intelligence, and cost efficiencies.
* **Location:** `index.html` (`<section class="tech-section">`).
* **HTML Structure:**
  ```html
  <div class="tech-grid">
      <div class="tech-card">...</div>
      <div class="tech-card">...</div>
      <div class="tech-card tech-card-tall">...</div>
      <div class="tech-card tech-card-wide">...</div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.tech-section`, `.tech-grid`, `.tech-card`, `.tech-card-tall`, `.tech-card-wide`).

---

## 11. Global Impact Stats Bar

* **Purpose:** High-contrast quantitative proof points ($10M+ Trade Volume, 50+ Countries, 100% Compliance, 15K+ Shipments).
* **Location:** `index.html` (`<section class="global-impact-section">`), `about-us.html`.
* **HTML Structure:**
  ```html
  <div class="impact-stats-list">
      <div class="impact-stat-item">
          <strong>$10M+</strong>
          <span>Trade Volume Facilitated</span>
      </div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.global-impact-section`, `.impact-stats-list`, `.impact-stat-item`).

---

## 12. Delivery Optimization & Tracking Showcase

* **Purpose:** Split visual comparing regional delivery times (Asia, Europe, Africa, Americas) with simulated live tracking log.
* **Location:** `index.html` (`<section class="delivery-optimization-section">`).
* **HTML Structure:**
  ```html
  <div class="delivery-optimization-container">
      <div class="reduction-panel">
          <div class="radar-visualization">...</div>
      </div>
      <div class="tracking-panel">
          <div class="tracking-list">
              <div class="tracking-item">
                  <div class="region-badge badge-asia">AS</div>
                  <div class="tracking-details"><span class="tracking-value">$145K</span></div>
                  <span class="status-badge status-delivered">Delivered</span>
              </div>
          </div>
      </div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.delivery-optimization-section`, `.reduction-panel`, `.tracking-panel`, `.tracking-item`).

---

## 13. Process 3D Flip Cards

* **Purpose:** Interactive cards that rotate on hover to reveal process step details (Requirement Analysis, Strategic Planning, Quality Execution, Delivery & Support).
* **Location:** `index.html` (`<section class="process-cards-section">`).
* **HTML Structure:**
  ```html
  <div class="cards-grid">
      <div class="flip-card">
          <picture>
              <source srcset="images/requirement_analysis.webp" type="image/webp">
              <img src="images/requirement_analysis.png" alt="AORR requirement analysis process">
          </picture>
          <div class="flip-card__content">
              <p class="flip-card__title">Requirement Analysis</p>
              <p class="flip-card__description">We begin with comprehensive discussions...</p>
          </div>
      </div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.process-cards-section`, `.cards-grid`, `.flip-card`, `.flip-card__content`).

---

## 14. Contact Form & Google Map Layout

* **Purpose:** Inquiry submission form connected to Google Apps Script paired with responsive Google Maps iframe.
* **Location:** `index.html` and `contact.html`.
* **HTML Structure:**
  ```html
  <div class="contact-split-layout">
      <div class="card">
          <div class="card2">
              <form class="form" id="contactForm" method="POST" target="hidden_iframe" action="https://script.google.com/macros/s/AKfycbyk-ZFtQmf5JVsWPtF9frHqLfYRWXLadaWyXF_0xvnzGyMgLqRDHPN9-LYoKxDbNyv25A/exec">
                  <input type="text" name="name" placeholder="Full Name" required class="input-field">
                  <input type="email" name="email" placeholder="Email Address" required class="input-field">
                  <input type="tel" name="phone" placeholder="Phone Number" required class="input-field">
                  <select name="location" required class="input-field">...</select>
                  <textarea name="message" placeholder="Your Message" rows="4" required class="input-field"></textarea>
                  <input type="text" name="company" style="display:none"> <!-- Honeypot -->
                  <button class="button1" type="submit">Send Message</button>
                  <p id="formStatus"></p>
              </form>
              <iframe name="hidden_iframe" style="display:none;"></iframe>
          </div>
      </div>
      <div>
          <iframe src="https://www.google.com/maps/embed?..." width="100%" height="100%" style="border:0;" loading="lazy"></iframe>
      </div>
  </div>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.contact-split-layout`, `.card`, `.card2`, `.form`, `.input-field`, `.button1`).
* **JavaScript Dependencies:** `templatemo-prism-scripts.js` (listens to submit event and updates `#formStatus`).

---

## 15. Global Footer & Newsletter

* **Purpose:** Global footer containing brand tagline, address, mailto links, phone, newsletter form, and bottom navigation.
* **Location:** Bottom of all HTML pages.
* **HTML Structure:**
  ```html
  <footer class="footer">
      <div class="footer-large-logo">
          <picture>
              <source srcset="images/logo.webp" type="image/webp">
              <img src="images/logo.png" alt="AORR Logo" style="height: 220px;" loading="lazy">
          </picture>
      </div>
      <div class="footer-content-grid">
          <div class="footer-tagline">AI-driven insights and global logistics...</div>
          <div class="footer-contact">...</div>
          <div class="footer-newsletter">
              <form class="newsletter-form">
                  <input type="email" class="newsletter-input" placeholder="Enter your email" required>
                  <button type="submit" class="newsletter-btn">Submit</button>
              </form>
          </div>
      </div>
      <div class="footer-bottom-nav">...</div>
  </footer>
  ```
* **CSS Location:** `templatemo-prism-flux.css` (`.footer`, `.footer-large-logo`, `.footer-content-grid`, `.footer-newsletter`, `.footer-bottom-nav`).

---

## 16. WhatsApp Floating Button

* **Purpose:** Persistent floating chat link on bottom-right of viewport for direct customer engagement.
* **Location:** Included across all HTML pages.
* **HTML Structure:**
  ```html
  <a href="https://wa.me/919730004911?text=Hello%20AORR%20Team..." class="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with AORR on WhatsApp">
      <svg class="whatsapp-icon" viewBox="0 0 24 24"><path d="..."/></svg>
  </a>
  ```
* **CSS Location:** `whatsapp-widget.css`.
* **Responsive Behavior:** Desktop shows hover tooltip `"Chat with us"`. Mobile scales size down to `50px x 50px`.

---

## 17. Dynamic Product Catalog & Sidebar

* **Purpose:** Dynamic catalog interface on `products.html` supporting parent categories and subcategory landing pages via URL queries.
* **Location:** `products.html`.
* **HTML Structure:**
  ```html
  <main class="catalog-section">
      <div class="catalog-container map-layout">
          <aside class="catalog-sidebar">
              <div class="sidebar-widget">
                  <h3 class="widget-title">Search Catalog</h3>
                  <div class="search-box">
                      <input type="text" id="product-search" placeholder="Search products...">
                      <span class="search-icon">🔍</span>
                  </div>
              </div>
              <div class="sidebar-widget">
                  <h3 class="widget-title">Categories</h3>
                  <ul class="sidebar-nav" id="sidebar-nav-list"></ul>
              </div>
          </aside>
          <div class="catalog-content">
              <div id="products-root" class="catalog-grid"></div>
          </div>
      </div>
  </main>
  ```
* **CSS Location:** `products-style.css`.
* **JavaScript Dependencies:** `products-data.js`, `subcategory-data.js`, `products-logic.js` (ES Module).

---

## 18. Product Quote Enquiry Modal

* **Purpose:** Modal popup triggered when clicking "Enquire Now" on any product card in the catalog.
* **Location:** `products.html` (`#product-enquiry-modal`).
* **HTML Structure:**
  ```html
  <div id="product-enquiry-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content">
          <button class="modal-close-btn" id="modal-close">&times;</button>
          <div class="modal-header">
              <h3>Enquire About <span id="modal-product-name">Product</span></h3>
          </div>
          <form id="product-enquiry-form" method="POST" target="hidden_iframe_product" action="https://script.google.com/macros/s/AKfycbzVmOkldAnlqjdxa3Qiq4q6ETbGwPXnwIizHxyDKtJyGg0tWy0mFQUBNWa9Mgq3WLqS/exec">
              <input type="hidden" name="product" id="form-product-name">
              <input type="hidden" name="page" id="form-page-url">
              <input type="text" name="company" style="display:none">
              <input type="text" name="name" required placeholder="John Doe">
              <input type="email" name="email" required placeholder="john@example.com">
              <button type="submit" class="submit-btn">Send Enquiry</button>
              <p id="enquiry-status"></p>
          </form>
          <iframe name="hidden_iframe_product" style="display:none;"></iframe>
      </div>
  </div>
  ```
* **CSS Location:** `products-style.css` (`.modal-overlay`, `.modal-content`, `.modal-close-btn`).
* **JavaScript Dependencies:** `setupEnquiryModal()` in `products-logic.js`.

---

## 19. Client Onboarding Questionnaire

* **Purpose:** Structured requirements intake form allowing export clients to specify product volumes, port destinations, incoterms, and export to PDF.
* **Location:** `client-questionnaire.html`.
* **HTML Structure:**
  ```html
  <div class="questionnaire-container" id="questionnaire-content">
      <div class="q-header">...</div>
      <div class="section-header">1. General Company Information</div>
      <div class="form-grid">...</div>
  </div>
  ```
* **CSS Location:** Inline `<style>` block in `client-questionnaire.html` and `templatemo-prism-flux.css`.
* **JavaScript Dependencies:** CDN `html2pdf.js` (`html2pdf.bundle.min.js`).
