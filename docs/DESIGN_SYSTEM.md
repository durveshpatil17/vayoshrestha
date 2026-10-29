# VAYOSHRESHTHA DESIGN SYSTEM: SAP FIORI HORIZON SHELL + AWS CLOUDSCAPE DATA PATTERNS

**Theme:** Pure White Enterprise Theme  
**Target Viewport:** Desktop-first 1440×900 (minimum 1280px); Mobile-first Field View 390×844 and 360×640.  
**Inspiration & Patterns:** SAP Fiori Horizon (Shell, Navigation, Dynamic Page Headers, Object Pages, Message Strips) and AWS Cloudscape (Data Tables, Key-Value Lists, Form Fields, Split Panels, Flashbars, Wizards, Container Hierarchy).

---

## 1. DESIGN TOKENS (`src/styles/tokens.css`)

All colors and visual properties in the application are derived strictly from CSS variables. No hex, rgb, or arbitrary Tailwind values are permitted in markup.

```css
:root {
  /* Neutrals */
  --page: #F5F6F7;
  --surface: #FFFFFF;
  --border: #D5DADD;
  --text: #1D2D3E;
  --text-secondary: #556B82;
  --text-disabled: #8396A9;

  /* Single Accent: Horizon Blue */
  --accent: #0070F2;
  --accent-hover: #0064D9;
  --accent-active: #0055B8;
  --accent-tint: #EBF5FE;            /* selected nav, selected row hover */
  --focus-ring: var(--accent);

  /* Semantic (each with 10% tint for message strips & callouts) */
  --negative: #D20A0A;
  --negative-tint: #FDECEC;
  --critical: #E76500;
  --critical-tint: #FFF1E3;
  --positive: #256F3A;
  --positive-tint: #EAF5EC;
  --informative: #0070F2;
  --informative-tint: #EBF5FE;

  /* Chart Series: Blue Ramp + Neutrals (always paired with patterns/markers/direct labels) */
  --chart-1: #0070F2;
  --chart-2: #1D2D3E;
  --chart-3: #556B82;
  --chart-4: #5BA3FF;
  --chart-5: #A9B4C0;

  /* Shape, Space, and Sizing */
  --radius-control: 8px;
  --radius-container: 12px;
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-6: 24px;
  --sp-8: 32px;
  --page-pad: 32px;
  --shell-h: 52px;
  --nav-w: 256px;
  --row-h: 48px;
  --input-h: 40px;
  --target-min: 32px;
  --shadow-overlay: 0 4px 16px rgba(29, 45, 62, 0.16);   /* popovers, drawers, dialogs ONLY */

  /* Typography */
  --font: 'Open Sans', 'Noto Sans Devanagari', 'Noto Sans Kannada', 'Noto Sans Tamil', sans-serif;
  --fs-12: 12px;
  --fs-14: 14px;
  --fs-16: 16px;
  --fs-20: 20px;
  --fs-28: 28px;
  --fw-regular: 400;
  --fw-semibold: 600;
}

/* Senior / Family Portal & Field View Accessibility Density Scope */
.density-large {
  --fs-14: 18px;
  --fs-16: 20px;
  --fs-20: 24px;
  --fs-28: 28px;
  --target-min: 48px;
  --row-h: 56px;
  --input-h: 48px;
}

.density-large.larger-text {
  --fs-14: 22px;
  --fs-16: 24px;
  --fs-20: 28px;
}
```

---

## 2. TYPOGRAPHY SPECIFICATION

1. **One Type Family:** Open Sans (self-hosted via `@fontsource/open-sans`), backed by Noto Sans Devanagari, Kannada, and Tamil at matching weights.
2. **Weights:** Strictly 400 (`--fw-regular`) and 600 (`--fw-semibold`). No 300, 500, 700, or 800.
3. **Tabular Numerals:** Every number, ID, telephone, timestamp, and monetary figure must declare `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`).
4. **Sentence Case Everywhere:** Every button, tab, page header, table column header, navigation item, and badge is in sentence case. Banned: `uppercase`, `tracking-*`, `letter-spacing`.
5. **No Monospace or Serif:** Member codes (`VV-HBL-26-00123`), vouchers (`K7QF 2M9X 4C`), and cryptographic hashes are displayed in Open Sans tabular numerals, with spaces between clusters and copy actions for hashes.
6. **Line Heights:**
   - 12px $\rightarrow$ line-height 16px
   - 14px $\rightarrow$ line-height 20px
   - 16px $\rightarrow$ line-height 24px
   - 20px $\rightarrow$ line-height 28px
   - 28px $\rightarrow$ line-height 36px

---

## 3. ICONS SPECIFICATION

- **Single Package:** Lucide React (`lucide-react`).
- **Stroke & Dimensions:** Stroke width strictly 1.5 (`stroke-[1.5]`), standard size 20px (`w-5 h-5`). Secondary indicators may use 16px (`w-4 h-4`).
- **Pairing:** Icons must always be paired with an adjacent text label. Icon-only action buttons require `aria-label` and an accessible tooltip.
- **Banned:** Colored circular backgrounds or badges wrapping icons. Status is conveyed by icon + text directly.

---

## 4. SHELL ARCHITECTURE (SAP Fiori Horizon)

1. **Shell Bar (52px):**
   - White surface (`--surface`), 1px bottom border (`--border`).
   - Left: Wordmark "Vayoshreshtha" + subtitle "Vayoh Vikas", Chapter/Scope switcher dropdown.
   - Center: Global search bar with `Ctrl K` shortcut hint.
   - Right:
     - **SOS Status Chip:** Neutral outline with "No open emergencies" when 0; solid `--negative` fill with white text and count when $\ge 1$.
     - Chime toggle (muted/unmuted audio feedback for incidents).
     - Notifications button with alert badge.
     - Help dropdown (SOPs, documentation, keyboard shortcuts).
     - User Account dropdown with role persona switcher and sign-out.
2. **Side Navigation (256px):**
   - White surface (`--surface`), 1px right border (`--border`).
   - Muted sentence-case group headers (`--text-secondary`, 12px/600).
   - Navigation links: 40px height, 20px icon, 14px label.
   - **Active State:** Solid `--accent-tint` (`#EBF5FE`) background with `--accent` (`#0070F2`) text and icon. No outline box, no accent bar.
   - Role-scoped and collapsible.
3. **Prototype Ribbon:**
   - Inline message strip pinned directly underneath the shell bar: "Prototype · synthetic data only".
   - Informative tint (`--informative-tint`), dismissible per session.
4. **Dynamic Page Header:**
   - Breadcrumb navigation on top (all back actions live here).
   - Title in 28px/600, single-line subtitle in `--text-secondary`.
   - Action cluster on right (one primary `--accent` button, secondary neutral buttons).
   - Collapses to a compact 56px sticky header under the shell bar on scroll.

---

## 5. DATA PATTERNS (AWS Cloudscape)

1. **Data Table (`DataTable`):**
   - Header container: title + item count, live search filter, action buttons, table preferences.
   - Table headers: 12px/600, sentence case, subtle bottom border.
   - Table rows: 48px height, 1px row dividers, hover tint (`--accent-tint`), zero zebra striping.
   - Tabular numerals right-aligned for numeric data.
   - Four states supported: loading skeleton, empty illustrated state, error state, populated state.
2. **Filter Bar (`FilterBar`):**
   - Filter variant dropdown, filter fields, search input, "Go" button.
3. **Key-Value List (`KeyValueList`):**
   - 1 to 3 columns inside a white container (`--radius-container: 12px`, 1px border).
   - Label: 12px `--text-secondary`; Value: 14px `--text` with tabular numerals.
4. **Metric Tiles (`MetricTile`):**
   - Maximum 3 to 4 headline tiles per persona home dashboard.
   - Structure: Label (14px secondary) $\rightarrow$ Value (28px/600 tabular) with Unit $\rightarrow$ Status line (icon + text).
   - "Needs attention" sections use actionable row lists, never cards or tiles.
5. **Split Panel (`SplitPanel`):**
   - Used for triage views (`/sos`, `/referrals`, `/health/flags`). Left side: master queue; right side: detail view with sticky action controls.
6. **Cloudscape Wizard (`Wizard`):**
   - Used for multi-step workflows (`/onboarding/new`, `/vouchers/campaigns/new`, etc.).
   - Left-hand step list with status indicators (current, completed, pending).
   - Center step content container.
   - Sticky action footer with "Cancel", "Previous", and "Next / Submit" buttons.
7. **Form Controls:**
   - Inputs, selects, date pickers at 40px height (`--input-h`).
   - Labels positioned above inputs (14px/600); helper/error text directly beneath (12px).
   - Focus ring: 2px solid `--focus-ring` (`#0070F2`).
8. **Field Network Card:**
   - Single Cloudscape container on RA/NM/PM dashboards and `/field-network`.
   - Header: 2 inline metrics (Active Field Gigs, Last-Mile Synchronizations).
   - Body: Key-value operational stats, 9-row chapter table with inline pattern-filled bars, 24-hour sync sparkline, and real-time live activity ticker.

---

## 6. ACCESSIBILITY & DENSITY SCOPES

1. **Staff Enterprise View:**
   - Standard 14px body, 32px minimum click targets, 48px table rows.
2. **Senior & Family Portal (`.density-large`):**
   - 18px base body font, 48px minimum touch targets, 56px table rows.
   - Includes "Larger text" accessibility toggle expanding base font to 22px.
3. **Field View Mobile (`/field/*`):**
   - Mobile-first 390×844 and 360×640 layout (centered within 480px on desktop screens).
   - 48px minimum touch targets, simplified single-column cards, bottom navigation bar.

---

## 7. BANNED PATTERNS & STYLES

- **Banned:** Monospace and serif fonts anywhere in the application.
- **Banned:** Uppercase letters or letter-spacing in labels, headings, or buttons.
- **Banned:** Gradients, glassmorphism, blur effects, or glow borders.
- **Banned:** Shadows on cards or page containers (shadows permitted only on popovers, drawers, and dialogs).
- **Banned:** Colored circular backgrounds behind icons.
- **Banned:** Emoji in app chrome or buttons (allowed strictly inside simulated WhatsApp messages).
- **Banned:** Second accent color (Horizon Blue `#0070F2` is the sole brand accent).
- **Banned:** Strobing, pulsing, or flashing animations.
- **Banned:** Arbitrary Tailwind utility brackets (`bg-[#...]`, `w-[...]`).
