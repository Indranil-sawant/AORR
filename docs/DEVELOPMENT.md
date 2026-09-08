# DEVELOPMENT.md — Local Development, Testing & Deployment Guide

This guide describes how to run, test, validate, and deploy changes to the **AORR Global Trading & Distribution** static website.

---

## 1. Local Development Setup

Because this is a zero-build static website, no complex compiler toolchain (Vite, Webpack, Babel, PostCSS) is required.

### Starting a Local Development Server

You must serve the directory via an HTTP server rather than opening `.html` files directly via `file://` (this is required because ES Modules in `products-logic.js` and `global-search-logic.js` enforce CORS security policies).

Run any of the following verified methods:

#### Option A: Python 3 HTTP Server (Recommended)
```bash
# In project root directory:
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

#### Option B: Node.js `npx serve`
```bash
# In project root directory:
npx serve . -p 8000
```

#### Option C: VS Code / IDE Live Server
* If using VS Code / Cursor, right-click `index.html` and select **"Open with Live Server"**.

---

## 2. Build Process

> [!NOTE]
> **No Automated Build Step:** This project does not use a build pipeline. All `.html`, `.css`, and `.js` files are authored and served directly in their production-ready state.
>
> `package.json` in the root exists solely to provide `pdf2json` for the offline utility scripts `extract_pdf.js` and `extract_pdf_2.js`. It is not part of the website runtime or build process.

---

## 3. Code Formatting & Quality Standards

When editing code, adhere to these standards:

### HTML Formatting
* 4-space indentation.
* Lowercase tag and attribute names.
* Always wrap text inside semantic tags.
* Ensure all image tags include `<picture>` with `.webp` source, fallback `<img>`, `alt`, and `loading="lazy"` (except above-the-fold logos/heros which use `loading="eager"`).

### CSS Formatting
* Group rules logically (Layout $\rightarrow$ Typography $\rightarrow$ Visuals $\rightarrow$ Transitions).
* Use established `:root` variables for colors instead of hardcoded hex values.
* Ensure all new media queries are placed after base styles.

### JavaScript Formatting
* Vanilla ES6+ syntax.
* Defensive null checks before manipulating DOM elements (`const el = document.getElementById('id'); if (el) { ... }`).
* Use ES Module import/export syntax for shared data modules.

---

## 4. Testing & Verification Checklist

Before deploying or submitting any change, run through this verification checklist:

### 1. Browser Console Check
* Open Chrome/Edge DevTools (F12) $\rightarrow$ **Console**.
* Verify zero JavaScript errors, unhandled exceptions, or 404 resource warnings.

### 2. Responsive Layout Testing
Test the site across all major responsive viewports using Browser DevTools Device Mode:
* **Mobile (375px & 414px):** Verify hamburger menu expands properly, cards stack vertically, 3D carousel scrolls horizontally without layout clipping.
* **Tablet (768px – 1024px):** Verify grid column adjustments and header visibility.
* **Desktop (1200px – 1920px):** Verify max-width constraints (`1400px`) and centered alignment.

### 3. Image & Asset Verification
* Verify WebP image files exist in `/images/`.
* Verify image fallbacks load properly if WebP is disabled.
* Ensure no images cause layout shifts (CLS) on page load.

### 4. Form Submission Testing
* Verify contact form on `contact.html` and `index.html`.
* Check that honeypot field (`input[name="company"]`) remains empty.
* Submit a test inquiry and ensure `#formStatus` updates to `"Sending..."` then `"Thank you!..."`.
* Verify product quote modal form on `products.html`.

### 5. Lighthouse Performance Target
* Run a Lighthouse audit in Chrome DevTools (Incognito mode):
  * **Performance Target:** 85+
  * **Accessibility Target:** 90+
  * **Best Practices Target:** 90+
  * **SEO Target:** 95+

---

## 5. Deployment Workflow

The website is hosted on an Apache-compatible web server configured with custom domain DNS for `aorr.in`.

### Deployment Steps:

1. **Verify Root Files:**
   * `index.html`, `about-us.html`, `services.html`, `products.html`, `market-insights.html`, `contact.html`, `client-questionnaire.html`
   * `sitemap.xml`, `robots.txt`, `.htaccess`, `CNAME`
   * `templatemo-prism-flux.css`, `products-style.css`, `global-search-style.css`, `loader.css`, `whatsapp-widget.css`
   * `templatemo-prism-scripts.js`, `products-data.js`, `subcategory-data.js`, `products-logic.js`, `global-search-logic.js`, `loader.js`, `accessibility-enhancements.js`
   * `images/` directory with all `.webp`, `.png`, and `.jpg` assets.

2. **Upload to Production Host:**
   * Upload all modified files to the web server document root via SFTP / Git deploy.
   * Ensure `.htaccess` is present at the server root to activate GZIP/Brotli compression, SSL enforcement, and 1-year browser cache headers.

3. **Post-Deployment Smoke Test:**
   * Open `https://www.aorr.in` in an incognito window.
   * Verify SSL padlock is active.
   * Check Network tab to confirm responses serve with `content-encoding: gzip` or `br` and WebP image types.
