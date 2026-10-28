# VAYOSHRESHTHA — Design System & Visual Specification (v2 Pilot)

This document codifies the design language for the Vayoshreshtha eldercare ecosystem for the NGO Vayoh Vikas.

---

## 1. Aesthetic Philosophy & Brand Voice
The visual design conveys **institutional trustworthiness, editorial calm, and operational precision**.
- **Dense and functional** for staff who manage registrations, SOS emergencies, vital logs, and audit trails.
- **Spacious and crystal clear** for senior citizens navigating the WhatsApp channel.
- **Strictly White Theme**: Crisp backgrounds `#FFFFFF` with muted surfaces `#F7F6F3` and subtle 1px border lines `#E4E2DC`.
- **Zero Decorative Noise**: No glassmorphism, no neon glows, no gradient buttons, no blue accents, no floating 3D spheres, no stock photography, no emoji in app chrome.
- **SOS Urgency Without Strobing**: The SOS board achieves urgency through clean typographic hierarchy, a persistent red banner, a distinct row highlight, an optional chime (off by default, toggle in top bar), and a browser tab title badge `(🚨 X)`. Respects `prefers-reduced-motion`.

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
| Semantic Danger | `--color-danger` | `#B42318` | Destructive actions, SLA breached, critical SOS |
| Semantic Danger BG | `--color-danger-bg` | `#FDECEA` | Danger badge background |
| Neutral / Info | `--color-info` | `#3F3D38` | Informational notices (Warm grey, never blue) |
| Neutral / Info BG | `--color-info-bg` | `#F0EEE9` | Info container background |

### Earthy Categorical Chart Palette
Calibrated for high contrast, color-blind safety, direct labels, and pattern fills:
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
- **Tabular Numerals**: Standard `font-feature-settings: "tnum" 1` for all counts, timestamps, percentages, and metrics.
- **Indian Regional Text**: `Noto Sans Devanagari / Kannada / Tamil` fallback.

### Scale Rules
- **Staff Interfaces**: Base font 14px / line-height 20px. Target size >= 32px.
- **Senior Mode (Simulator)**: 18px base text scalable to 22px (`.senior-text-normal`, `.senior-text-large`, `.senior-text-xlarge`).

---

## 4. Layout & Navigation Chrome

- **Left Sidebar (248px)**: Grouped navigation links, permission-filtered, with a 2px forest green accent bar indicating the active route.
- **Top Bar (56px)**:
  - Chapter/Region switcher limited to assigned scope (`RA` sees own region; `CM`/`VF` sees own chapter).
  - Global senior search (name, phone-last-4, membership ID, with masking and scope).
  - **SOS Status Indicator**: Live counter pill showing open alerts (e.g. `🚨 2 Open`), clicking navigates directly to `/sos`.
  - Notification bell with unread badge.
  - Chime toggle (Muted by default; respects user preference).
  - Help link and User Profile dropdown.
- **Prototype Ribbon**: Fixed 20px banner across the top: *"Prototype · synthetic data only"*.
- **Content Area**: Max width 1280px on 1440×900 desktop viewport, with standardized PageHeader (breadcrumb, serif title, subtitle, primary action button).

---

## 5. UI Component Patterns

### Data Lists & Tables
- Title + count header, filter bar (search input, status/language filters, saved views).
- Sticky header table, sortable columns, row hover actions, pagination (25/50/100).
- Virtualised rendering for large rosters.
- Permission-gated export modal requiring a typed business reason.

### Status Chips
- Clean typography with subtle tinted backgrounds (e.g., `#EAF5EE` for active, `#FEF3E2` for watch/pending).
- Critical SOS severity is the only place solid `#B42318` fill is utilized.

### The Four Universal States
Every data view must explicitly handle all four states:
1. **Loading**: Structural skeletons mimicking the target layout.
2. **Empty**: One descriptive sentence + one obvious primary call-to-action.
3. **Error**: Plain explanation of failure + "Retry" button.
4. **No-Permission (403)**: Specific notice stating missing capability and user's current role, with a clear link to return.

### Simulator Styling
- Phone frame layout representing the WhatsApp chat interface without proprietary brand marks.
- Green message bubbles (`#E8F1ED`), quick-reply action buttons, timestamps (IST format `5:30 PM`), and checkmark delivery indicators.

---

## 6. Design Checklist (Verified in Every Loop)
- [ ] Visual hierarchy instantly obvious in under 3 seconds.
- [ ] Exactly one primary action button per view.
- [ ] All table numbers tabular and right-aligned.
- [ ] No truncated labels or broken wrapping.
- [ ] All four states (loading, empty, error, 403) cleanly handled.
- [ ] Zero banned styles (no purple/blue gradients, no neon glows, no glassmorphism).
- [ ] WCAG 2.2 AA contrast passed (≥ 4.5:1 text, visible 2px focus ring).
