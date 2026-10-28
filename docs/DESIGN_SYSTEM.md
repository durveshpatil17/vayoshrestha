# VAYOSHRESHTHA Enterprise Design System Specification

## 1. Overview & Architectural Philosophy

Vayoshrestha is an enterprise-grade digital senior-care ecosystem for **Vayoh Vikas**. The UI/UX is built to project calm precision, clinical trust, and high data density without cognitive clutter. It incorporates proven enterprise interaction patterns borrowed from four benchmark enterprise design systems:

1. **SAP Fiori (Horizon)**: Floorplans (List Report, Object Page, Overview Page), Message Strips, and Object Statuses.
2. **AWS Cloudscape**: Data-console tables, status indicators, key-value pairs, property filtering, and split-panel alert boards.
3. **Microsoft Fluent 2**: Restrained command bar structure, high-precision drawer layers, data grid command patterns, and Fluent System regular outline iconography.
4. **Salesforce Lightning Design System (SLDS)**: Path lifecycles, highlights panels, compact related lists, and contextual feedback toasts.

The result is a clean, quiet, light-grey canvas with crisp white surfaces, hairline 1px borders, subtle elevation, a single enterprise blue accent, and plain humanist sans-serif typography (`Source Sans 3` with Indic script fallbacks).

---

## 2. Borrowed Pattern Registry

As required by Section 3, every pattern borrowed from enterprise design benchmarks is cataloged below. Vayoshrestha never copies logos, brand marks, or external styling; it adapts standard architectural interaction models:

| Source Enterprise System | Pattern Borrowed | Vayoshrestha Implementation & Location |
|---|---|---|
| **SAP Fiori (Horizon)** | **Dynamic Page Header & Floorplans** | Collapsing sticky page header (from 24px title down to 48px compact bar) with breadcrumbs, action buttons, and pinned filter bar. Used in List Reports across Seniors, Health Logs, and Audit Logs. |
| **SAP Fiori (Horizon)** | **Message Strip** | Inline semantic banner with 1px tinted border, tint background, 16px icon, bold title, message, and action link. Used for ABHA Phase 2 notice, clinician review disclaimers, and SMS alerts. |
| **SAP Fiori (Horizon)** | **Numeric KPI Tile** | Clean card displaying 32px tabular KPI value, 12px secondary label, target ratio, delta trend chip, and metric definition tooltip. |
| **AWS Cloudscape** | **Table & Property Filter** | Compact data table with sticky header, checkbox selection, column visibility/ordering popover, tabular numeric alignment, and multi-property filter bar. |
| **AWS Cloudscape** | **Critical Alert Flashbar** | Persistent top banner directly beneath shell bar for unacknowledged critical SOS emergencies (`--negative-tint`, `--negative` border, elapsed timer, acknowledge/view actions). No strobing. |
| **AWS Cloudscape** | **Split Panel Board** | Live SOS Board (`/sos`): full-width master table with a 440px resizable right panel showing case telemetry, timeline, and actions without context switching. |
| **AWS Cloudscape** | **Key-Value Pairs** | Clean 2-column or grid data display with 12px uppercase/medium secondary label over 14px regular value. Used in Object Page Highlights. |
| **Microsoft Fluent 2** | **Command Bar** | Restrained horizontal action strip (Create, Export, Bulk Actions, Refresh, Column Settings) with 16px icon + 14px label ghost buttons. |
| **Microsoft Fluent 2** | **Quick-View Drawer** | 480px slide-in right drawer triggered on table row click for instant record inspection and quick triage before opening full pages. |
| **Microsoft Fluent 2** | **Fluent System Icons** | Regular outline 16px and 20px icons (`@fluentui/react-icons`) paired with text labels, tinted `--text-secondary` at rest and `--accent` when active. |
| **Salesforce Lightning** | **Status Path** | Chevron-less linear progress path for SOS case states, onboarding funnel steps, and medical flag lifecycles (Completed = check, Current = tinted, Next = grey). |
| **Salesforce Lightning** | **Highlights Panel** | Object Page top card featuring senior avatar/initials, primary facts, status indicator, and prominent actions. |
| **Salesforce Lightning** | **Transient Toasts** | Bottom-center notification with 5s auto-dismiss, hover pause, status icon, and reversible "Undo" triggers. |

---

## 3. Strict Anti-Patterns ("AI-Generated" Tells to Avoid)

To ensure an authentic, mature enterprise interface, the following elements are strictly forbidden and enforced by `scripts/design-lint.mjs`:
- **No serif fonts anywhere** (no display, editorial, or serif fonts).
- **No warm neutrals** (no cream, beige, ivory, sand, or warm off-whites; all backgrounds are cool blue-grey `#F5F7FA` or crisp `#FFFFFF`).
- **No dark borders or thick outlines** (all borders are 1px `#DDE2E8` or subtle `#EDF0F3`; no 2px outlines except keyboard focus rings and active tab underlines).
- **No earthy palettes** (no terracotta, ochre, rust, forest green, or sand).
- **No purple, violet, indigo, or gradients** (zero linear or radial gradients; no gradient buttons or headers).
- **No glassmorphism, blur, neon glow, or decorative illustration blobs**.
- **No emojis in the UI** (only the WhatsApp simulator fixture contains `🚨` as incoming payload text).
- **No giant hero headings, no pill buttons, no zebra-striped tables, no vertical table lines, and no font-weight 700+**.
- **No marketing fluff** ("Welcome back!", "Supercharge your care!"). Tone is respectful, institutional, and precise.

---

## 4. Design Tokens Specification

All styles derive strictly from `src/styles/tokens.css` and are mirrored in Tailwind CSS:

```css
:root {
  /* Surfaces: cool, never warm */
  --canvas:            #F5F7FA;   /* page background behind cards */
  --surface:           #FFFFFF;   /* cards, tables, forms, shell */
  --surface-subtle:    #F8FAFC;   /* table header, read-only fields, hover on white */
  --surface-hover:     #F2F6FC;   /* row hover (very light accent tint) */
  --surface-selected:  #E8F1FC;   /* selected row / nav item */

  /* Lines: always light */
  --border-subtle:     #EDF0F3;   /* row dividers, card inner dividers */
  --border:            #DDE2E8;   /* card edges, inputs at rest */
  --border-strong:     #C3CBD4;   /* input hover, focused-adjacent */

  /* Text: blue-grey, never pure black */
  --text:              #1D2D3E;
  --text-secondary:    #556B82;
  --text-tertiary:     #758CA5;   /* icons and non-essential hints only */
  --text-disabled:     #A9B4BE;
  --text-on-accent:    #FFFFFF;

  /* Accent: one enterprise blue, solid colours only */
  --accent:            #0064D9;
  --accent-hover:      #0057BF;
  --accent-active:     #004BA6;
  --accent-tint:       #EBF3FD;
  --focus-ring:        #0064D9;

  /* Semantic (icon + text first, tint for backgrounds) */
  --positive:          #107E3E;  --positive-tint: #EFF9F3;
  --critical:          #B25A00;  --critical-tint: #FFF6EB;   /* warning */
  --negative:          #C4161C;  --negative-tint: #FEF0F0;   /* error / SOS */
  --neutral:           #556B82;  --neutral-tint:  #F1F4F7;
  --information:       #0064D9;  --information-tint: #EBF3FD;

  /* Chart categorical set (no purple; always direct-labelled or patterned) */
  --chart-1: #0064D9; --chart-2: #0E8E8E; --chart-3: #E9730C;
  --chart-4: #6C7A89; --chart-5: #5B9E2D; --chart-6: #C99A00;
  --chart-grid: #EDF0F3;

  /* Radius */
  --radius-control: 6px;  --radius-card: 8px;  --radius-chip: 4px;

  /* Elevation: cards use a hairline + xs; only floating layers get real shadow */
  --shadow-xs:   0 1px 2px rgba(16, 24, 40, 0.04);
  --shadow-menu: 0 4px 12px rgba(16, 24, 40, 0.10);
  --shadow-dialog: 0 12px 32px rgba(16, 24, 40, 0.16);
  --overlay:     rgba(29, 45, 62, 0.40);

  /* Spacing: 4px base */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;

  /* Motion */
  --ease: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 100ms; --dur: 150ms; --dur-slow: 220ms;
}
```

---

## 5. Typography Scale & Multilingual Stack

- **Primary Font Family:** `Source Sans 3` (weights 400, 500, 600 self-hosted).
- **Indic Script Fallbacks:** `Noto Sans Devanagari` (Hindi, Marathi), `Noto Sans Kannada` (Kannada), `Noto Sans Tamil` (Tamil).
- **System Stack Fallback:** `system-ui, "Segoe UI", Roboto, Arial, sans-serif`.
- **Numbers:** Tabular figures (`font-variant-numeric: tabular-nums`) applied to every counter, timer, timestamp, and table cell.

### Type Scale
| Role | Font Size / Line Height | Weight | Color Token | Use Case |
|---|---|---|---|---|
| Page Title | 24px / 32px | 600 | `--text` | Primary page heading |
| Section Title | 18px / 24px | 600 | `--text` | Card group / drawer header |
| Card Title | 16px / 24px | 600 | `--text` | Card header, modal title |
| Body & Table | 14px / 20px | 400 | `--text` | Default content, table cells, form inputs |
| Body Medium | 14px / 20px | 500 | `--text` | Button labels, table summaries, bold body |
| Form Label | 12px / 16px | 500 | `--text-secondary` | Input labels, property filter labels |
| Caption / Hint | 12px / 16px | 400 | `--text-secondary` | Footers, helper text, chart captions |
| KPI Value | 32px / 40px | 500 | `--text` | Numeric KPI figures (tabular) |

---

## 6. Density System

Vayoshrestha supports three standard enterprise density modes toggled via `/account` and stored in `localStorage`:

| Element | Compact Mode | Comfortable-Compact (Default) | Spacious Mode |
|---|---|---|---|
| Control Height (Buttons, Inputs) | 28px | 32px | 36px |
| Table Row Height | 32px | 40px | 48px |
| Nav Item Height | 32px | 36px | 40px |
| Table Font Size | 13px | 14px | 14px |

---

## 7. Motion & Accessibility Standards

- **Approved Properties:** Only `opacity`, `transform`, and `background-color` are animated.
- **Timing:** 100ms (`--dur-fast`), 150ms (`--dur`), 220ms (`--dur-slow`).
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)`. No bounces, no parallax, no counting number animations.
- **Accessibility:** Meets WCAG 2.1 AA standards:
  - Text contrast >= 4.5:1 against surfaces (`--text` #1D2D3E on white is 11.8:1).
  - Secondary text contrast >= 4.5:1 (`--text-secondary` #556B82 on white is 4.8:1).
  - Interactive icons >= 3.0:1.
  - Full keyboard focus ring: 2px `--focus-ring` with 2px offset on `:focus-visible`.
  - Full `prefers-reduced-motion` compliance.

---

## 8. Floorplans Specification

1. **List Report (Fiori)**: Page Header → Filter Bar (Search + Dropdowns + Saved Views) → Command Bar → Data Table → Pagination.
2. **Object Page (Fiori + SLDS Highlights)**: Header Card with avatar/initials, key-value fact row, status indicator, action buttons → Tab strip → Sections + Right rail (320px).
3. **Overview Page (Fiori)**: Responsive 12-column grid of analytical cards (KPI tiles, trend charts, attention lists).
4. **Wizard (Assisted Onboarding)**: Stepper at top, single section card per step, inline validation, sticky footer with Back/Next/Save draft, final review step.
5. **Board + Split Panel (Cloudscape)**: Full-width alert table with 440px resizable right inspection panel for live SOS cases.
6. **Status Path (Salesforce Path)**: Chevron-less horizontal path with checkmarks and active tint.
7. **Settings Forms**: Left vertical section navigation, right stacked cards with title, helper text, and sticky footer for unsaved changes.
8. **Auth Page**: Centered 400px card on cool canvas with product wordmark.
9. **WhatsApp Simulator**: Three-card layout (Senior phone, Next-of-kin SMS phone, System event ticker).
