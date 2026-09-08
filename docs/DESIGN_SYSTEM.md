# DESIGN_SYSTEM.md — AORR Visual Design System

This document specifies the exact visual language, CSS variables, typography hierarchies, layout primitives, and component styling rules implemented across the **AORR Global Trading & Distribution** website.

---

## 1. Color System

All colors are declared as CSS custom properties in `:root` inside `templatemo-prism-flux.css` and specialized stylesheets.

### Brand Palette (Green Theme)

| Variable Name | Hex Code | Purpose / Usage |
| :--- | :--- | :--- |
| `--primary-navy` / `--primary-forest` | `#1B5E20` | Deep forest green. Primary corporate shade used for headers, navbar backgrounds, card headings, primary branding, and modal accents. |
| `--primary-dark` | `#0F3814` | Deep forest dark tone. Used as the main body background color on dark sections and preloader base. |
| `--accent-gold` / `--accent-green` | `#66BB6A` | Vibrant leaf green. Primary interactive accent used for buttons, active states, CTA hover states, borders, icons, and highlights. |
| `--accent-gold-light` | `#A5D6A7` | Soft sage green. Secondary accent for subtitle badges, card borders, and subtle glows. |
| `--bg-light` | `#E8F5E9` | Light mint / soft green off-white. Background used for light sections, divisions container, questionnaire, and catalog area. |
| `--text-white` | `#ffffff` | Pure white. Primary text on dark backgrounds and button text. |
| `--text-dark` | `#123315` | Dark green-charcoal. Primary text on light content containers and questionnaire. |
| `--text-gray` | `#e8f5e9` | Light mint text for secondary captions and subtitles on dark themes. |

### Supporting & Functional Colors

| Color | Hex / RGBA | Usage |
| :--- | :--- | :--- |
| `Status Green` | `#4ade80` / `#2E8B57` | Metric percentage improvements (`+24%`, `100% Compliance`), cleared status tags. |
| `WhatsApp Green` | `#25D366` / `#20BA5A` | Floating WhatsApp widget button background and hover state. |
| `Card Background (Light)` | `rgba(255, 255, 255, 0.95)` | Default card background on light/translucent sections. |
| `Card Shadow` | `0 10px 30px rgba(0, 0, 0, 0.15)` | Standard card elevation shadow. |
| `Metric Blue` | `#4169E1` | Royal blue used in the performance chart dataset and radar visualization center. |
| `Alert Red` | `rgba(220, 53, 69, 0.8)` | Chart baseline dataset ("Before AORR"). |

---

## 2. Typography

The website imports Google Fonts for modern corporate and technical legibility.

### Font Families

```css
--font-main: 'Poppins', sans-serif;   /* Primary Headings, Titles, Brand Logo */
--font-body: 'Inter', sans-serif;     /* Body text, Descriptions, Navigation links */
/* Supporting Technical Fonts (loaded via Google Fonts): */
font-family: 'Rajdhani', sans-serif;  /* Sidebar widget titles, Technical metric labels */
font-family: 'Orbitron', sans-serif;  /* Specialized display elements */
```

### Font Scale & Hierarchy

| HTML Tag / Class | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.hero-title` | `Poppins` | `clamp(2.8rem, 6vw, 5rem)` | 800 | 1.1 | -1px |
| `h1.about-hero-title` | `Poppins` | `clamp(2.2rem, 4vw, 3.5rem)` | 700 | 1.2 | normal |
| `h2.section-title` | `Poppins` | `clamp(2rem, 3.5vw, 3rem)` | 700 | 1.2 | normal |
| `h3` (Card / Section) | `Poppins` | `1.25rem – 1.75rem` | 600 | 1.3 | normal |
| `.hero-subtitle` | `Inter` | `clamp(0.9rem, 2vw, 1.1rem)` | 600 | 1.4 | 3px (Uppercase) |
| `.section-tag-about` | `Inter` | `0.85rem` | 700 | 1.0 | 2px (Uppercase) |
| `.nav-link` | `Inter` | `clamp(0.85rem, 1.1vw, 1rem)` | 500 | 1.0 | 1px (Uppercase) |
| `body` (Standard Text) | `Inter` | `1rem` (16px base) | 400 | 1.6 | normal |
| `small` / Meta info | `Inter` | `0.75rem – 0.85rem` | 400 | 1.4 | normal |

### Fluid Typography Engine
The root typography scales smoothly across viewport widths:
```css
@media (min-width: 320px) {
    html {
        font-size: calc(14px + 2 * ((100vw - 320px) / 1080));
    }
}
@media (min-width: 1400px) {
    html {
        font-size: 16px;
    }
}
```

---

## 3. Spacing & Layout System

### Layout Containers
* **Max Navbar Width:** `1400px` (`.nav-container`)
* **Max Catalog Layout:** `1300px` (`.catalog-container`)
* **Max Content Section Width:** `1200px` (`.philosophy-container`, `.hero-overlay-text`)
* **Max Form / Questionnaire Container:** `850px` (`.questionnaire-container`)

### Spacing Patterns
* **Section Padding (Desktop):** `padding: 100px 20px;` or `padding: 180px 20px 80px;` for hero sections.
* **Section Padding (Mobile):** `padding: 60px 15px;` or `padding: 140px 15px 60px;` for hero sections.
* **Grid Gaps:**
  * Bento Grid: `gap: 25px;`
  * Industry Grid: `gap: 20px;`
  * Tech Grid: `gap: 25px;`
  * Catalog Grid: `gap: 25px;`
  * Process Grid: `gap: 30px;`

---

## 4. Button Styles & Variants

### 1. Hero Primary Button (`.hero-btn.primary`)
* **Background:** `var(--accent-gold)` (`#C5A065`)
* **Color:** `var(--primary-navy)` (`#002147`)
* **Border:** `2px solid var(--accent-gold)`
* **Border Radius:** `50px` (Pill shape)
* **Padding:** `12px 30px`
* **Hover:** Background becomes transparent, color turns `#ffffff`.

### 2. Hero Secondary Button (`.hero-btn.secondary`)
* **Background:** Transparent
* **Color:** `#ffffff`
* **Border:** `2px solid #ffffff`
* **Border Radius:** `50px`
* **Padding:** `12px 30px`
* **Hover:** Background becomes `#ffffff`, color turns `var(--primary-navy)`.

### 3. Card Action Button (`.card-cta`)
* **Background:** `linear-gradient(135deg, var(--accent-gold) 0%, #a88448 100%)`
* **Color:** `#ffffff`
* **Border Radius:** `8px`
* **Padding:** `10px 20px`
* **Font Weight:** `600`
* **Hover:** `transform: translateY(-2px); box-shadow: 0 5px 15px rgba(197, 160, 101, 0.4);`

### 4. Form Submit Button (`.button1` / `.submit-btn`)
* **Background:** `var(--primary-navy)` with gold hover or gold primary background.
* **Border Radius:** `8px`
* **Padding:** `12px 24px`
* **Width:** `100%` on mobile and card forms.

### 5. Quick Enquiry Button (`.quick-enquiry-btn`)
* **Background:** Gradient with gold borders.
* **Padding:** `14px 28px`
* **Icon:** Inline SVG mail icon.
* **Hover:** Slight lift (`translateY(-3px)`) and glow.

---

## 5. Card Components & Elevation

### 1. Bento Large & Small Cards (`.bento-large-card`, `.bento-small-card`)
* **Background:** `#ffffff`
* **Border Radius:** `16px`
* **Border:** `1px solid rgba(0, 33, 71, 0.08)`
* **Box Shadow:** `0 10px 30px rgba(0, 0, 0, 0.05)`
* **Hover:** `transform: translateY(-4px); box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);`

### 2. Industry Cards (`.industry-card`)
* **Background:** `rgba(255, 255, 255, 0.95)`
* **Border Radius:** `12px`
* **Padding:** `25px`
* **Icon Container:** `48px x 48px` SVG icons with gold stroke/fill accents.

### 3. Tech Dark Cards (`.tech-card`)
* **Background:** `rgba(255, 255, 255, 0.03)`
* **Border:** `1px solid rgba(255, 255, 255, 0.1)`
* **Border Radius:** `16px`
* **Backdrop Filter:** `blur(10px)`
* **Hover:** Border color turns `var(--accent-gold)`.

### 4. 3D Process Flip Cards (`.flip-card`)
* **Perspective:** `1000px`
* **Card Inner:** `transform-style: preserve-3d; transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);`
* **Card Face Content:** Background `#ffffff`, border radius `12px`, padding `20px`.

---

## 6. Responsive Breakpoints

| Breakpoint | Target Devices | Key Layout Behaviors |
| :--- | :--- | :--- |
| `< 768px` | Mobile (Smartphones) | Hamburger menu activates; desktop nav hides; 3D carousel switches to touch-scroll flex deck; 2-column bento & grids stack into 1 column; padding reduces to 15px–20px; font sizes scale down via clamp. |
| `768px – 1024px` | Tablet (Portrait & Landscape) | Grids switch from 4 columns to 2 columns; sidebar remains static above catalog. |
| `1024px – 1399px` | Laptop & Small Desktop | Full desktop navigation with sticky search; 280px sticky catalog sidebar with multi-column product grid. |
| `>= 1400px` | Large Desktop Monitors | Max container constraints (`1400px`) centered with automatic horizontal margins. |

---

## 7. Animations & Transitions

| Animation Name | Purpose | Duration & Easing | Implementation Location |
| :--- | :--- | :--- | :--- |
| `spin` | Orbiting preloader outer ring | `2s linear infinite` | `loader.css` |
| `spin-reverse` | Orbiting preloader inner ring | `3s linear infinite` | `loader.css` |
| `progress-slide` | Preloader progress bar | `1.5s ease-in-out infinite` | `loader.css` |
| `fadeUp` | Preloader text entrance | `0.8s ease-out forwards` | `loader.css` |
| `Navbar Hover Underline` | Gold indicator expanding from center | `0.3s ease` | `templatemo-prism-flux.css` (`.nav-link::after`) |
| `3D Carousel Transition` | Card scaling and Z-index depth shifting | `0.6s ease-out` | `templatemo-prism-scripts.js` |
| `Stats Counter` | Numerical count-up from 0 to target | `2000ms` step interval | `templatemo-prism-scripts.js` (`animateCounter`) |
