# VAYOSHRESHTHA — Design System & Visual Specification

This document codifies the design language for the Vayoshreshtha eldercare ecosystem, built for Vayoh Vikas.

---

## 1. Aesthetic Philosophy & Brand Voice
The visual design conveys **institutional trustworthiness, editorial calm, and accessibility**.
- **Dense and functional** for staff who manage registrations, attendance, and audit trails.
- **Spacious and crystal clear** for senior citizens and family members navigating programmes and help requests.
- **Strictly White Theme**: Crisp backgrounds `#FFFFFF` with muted surfaces `#F7F6F3` and subtle 1px border lines `#E4E2DC`.
- **Zero Decorative Noise**: No glassmorphism, no neon glows, no gradient buttons, no blue accents, no floating 3D spheres, no stock photography.

---

## 2. Color Palette & CSS Variables

| Token | CSS Variable | Hex Value | Usage |
|---|---|---|---|
| Background | `--color-bg-base` | `#FFFFFF` | Primary viewport and card background |
| Surface Subtle | `--color-bg-subtle` | `#F7F6F3` | Table headers, sidebars, panel backgrounds |
| Surface Active | `--color-bg-active` | `#EFECE6` | Active navigation rows, hover fills |
| Border Hairline | `--color-border-hairline` | `#E4E2DC` | 1px dividers, card outlines, table borders |
| Border Strong | `--color-border-strong` | `#CFCBC2` | Input borders, focused component edges |
| Text Primary | `--color-text-primary` | `#1C1B19` | Main headers, table values, primary labels |
| Text Muted | `--color-text-muted` | `#5F5C55` | Captions, secondary descriptors, helper text |
| Text Disabled | `--color-text-disabled` | `#A19D94` | Inactive buttons, disabled inputs |
| Accent Forest | `--color-accent` | `#1F5F4B` | Primary CTAs, active indicator bars, brand anchor |
| Accent Hover | `--color-accent-hover` | `#174A3A` | Button hover and pressed states |
| Accent Tint | `--color-accent-tint` | `#E8F1ED` | Active badges, selected row highlights |
| Semantic Success | `--color-success` | `#2F7D4F` | Successful state text, approved badges |
| Semantic Success BG| `--color-success-bg` | `#EAF5EE` | Success badge background |
| Semantic Warning | `--color-warning` | `#9A5B0A` | Pending approvals, SLA due soon |
| Semantic Warning BG| `--color-warning-bg` | `#FEF3E2` | Warning badge background |
| Semantic Danger | `--color-danger` | `#B42318` | Destructive actions, SLA breached, errors |
| Semantic Danger BG | `--color-danger-bg` | `#FDECEA` | Danger badge background |
| Neutral / Info | `--color-info` | `#3F3D38` | Informational notices (Warm grey, never blue) |
| Neutral / Info BG | `--color-info-bg` | `#F0EEE9` | Info container background |

### Earthy Categorical Chart Palette
Calibrated for high contrast, color-blind safety, and direct label support:
1. **Forest Green**: `#1F5F4B`
2. **Ochre / Warm Amber**: `#B7791F`
3. **Terracotta / Rust**: `#B4533A`
4. **Slate Grey**: `#5F6B73`
5. **Olive**: `#7A8B3A`
6. **Sand**: `#C9B89A`

---

## 3. Typography & Sizing

### Fonts
- **Headings (Editorial Anchor)**: `Source Serif 4`, weights 600 (Semi-bold), letter-spacing `-0.015em`.
- **UI & Data Body**: `IBM Plex Sans`, weights 400 (Regular), 500 (Medium), 600 (Semi-bold).
- **Tabular Numerals**: Standard `font-feature-settings: "tnum" 1` for all counts, percentages, and financial values.
- **Indian Regional Text**: `Noto Sans Devanagari` fallback for Hindi and Marathi scripts.

### Scale Rules
- **Staff Interfaces**: Base font 14px / line-height 20px. Target size >= 32px.
- **Senior & Family Interfaces (`/me/*`, `/family/*`)**: Base font 18px / line-height 26px. Target size >= 48px.
- **Accessibility Text Scaler**: Header toggle offering standard, medium (+2px), and large (+4px) text modes.

---

## 4. Layout Dimensions & 8-pt Grid
- **Global Canvas**: Optimized for 1440×900 desktop (min-width 1280px).
- **Prototype Watermark Ribbon**: Fixed 26px top banner: *"Vayoshreshtha Prototype · Synthetic Data Only · Vayoh Vikas NGO"*.
- **Top Application Bar**: Fixed height 56px with Centre Switcher, Global Member Search, Notifications, Help, and Account Profile.
- **Left Navigation Sidebar**: Fixed width 248px with collapsible role-filtered capability groups. Active links have a 2px left accent bar (`#1F5F4B`).
- **Content Max Width**: 1280px centred with 24px horizontal padding.
- **Border Radii**: 6px for interactive inputs, cards, and buttons; 4px for tags, chips, and small badges.
- **Shadows**: Pure 1px hairline borders for resting states. Elevation shadows strictly reserved for modals (`box-shadow: 0 10px 25px -5px rgba(28, 27, 25, 0.1)`).

---

## 5. Reusable Component Rules

1. **Four States Required on Every View**:
   - **Loading**: Structured skeleton placeholders matching layout dimensions (no spinning loaders).
   - **Empty**: Contextual single-sentence explanation + primary action button.
   - **Error**: Clear error message + "Retry Request" button.
   - **403 Forbidden**: Explicit badge citing the missing permission and active role, with a "Return to Dashboard" CTA.
2. **Standard List Views**:
   - Filter bar with quick search, multi-select dropdowns, active chips, and clear filters.
   - Sticky table header, column sorting, pagination controls (25 / 50 / 100).
   - Checkbox multi-select with floating bulk-action toolbar.
3. **Standard Detail Views**:
   - Breadcrumb navigation.
   - Header with prominent status chip, key metadata tags, and primary action buttons.
   - Tabbed panels for deep information architecture (Overview, Attendance, Consents, Audit).
4. **Forms & Inputs**:
   - Single-column flow up to 640px max width.
   - Labels positioned above fields with distinct helper and error text.
   - Destructive dialogs require typed confirmation string (e.g., "DEACTIVATE").

---

## 6. Accessibility & WCAG 2.2 AA Compliance
- Focus ring: 2px solid `#1F5F4B` with 2px offset.
- Contrast ratio: Minimum 4.5:1 for standard text, 3:1 for large text and key UI borders.
- Full keyboard operability for dialogs, dropdowns, and virtualized tables.
- All icons paired with screen-reader labels or visible text.
