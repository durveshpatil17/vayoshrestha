# 4. DESIGN BRIEF: SAP FIORI HORIZON SHELL + AWS CLOUDSCAPE DATA PATTERNS (white theme)

The product must look like a first-party SAP/AWS enterprise product: clean, precise, spacious and instantly familiar. Use the real patterns below. Do not invent new component styles. Where Fiori and Cloudscape both offer a pattern, use the one named here.

## Tokens (CSS variables only, no hard-coded colors anywhere)
- Page `#F5F6F7`, surface `#FFFFFF`, border `#D5DADD` (1px), text `#1D2D3E`, secondary text `#556B82`
- One accent: Horizon blue `#0070F2` for primary buttons, links, selected state, focus ring
- Semantic: negative `#D20A0A`, critical `#E76500`, positive `#256F3A`, informative `#0070F2`, each with a light tint for message strips
- Radius 8px on controls, 12px on containers. Shadows only on popovers and drawers.
- 4px spacing grid. Page padding 32px.
- Type: ONE family, Open Sans (self-hosted), with Noto Sans Devanagari, Kannada and Tamil at matching weights. Sizes 12 / 14 / 16 / 20 / 28. Weights 400 and 600 only. Sentence case everywhere. Tabular numerals. No serif and no monospace anywhere.
- Icons: Lucide 1.5 stroke, 20px, always paired with a label. Never inside colored circles.

## Shell (Fiori)
52px white shell bar with a 1px bottom border (brand, scope switcher, global search with Ctrl K, SOS status chip, notifications, help, user menu). 256px side navigation with plain muted sentence-case group labels; the selected item has a light blue tint fill and blue text, with no outline box. The SOS chip is neutral when there are no open alerts and solid red with a count when there are.

## Page Header (Fiori Dynamic Page Header)
Breadcrumb row on top (back links live here), title 28/600, one-line subtitle, actions on the right, collapsing to a compact sticky title on scroll. Content has proper scroll padding so the sticky header never covers it.

## Dashboards
At most 3 to 4 numeric tiles for the persona's primary measures (label, large figure with unit, one status line). Every other measure goes in a Cloudscape key-value list or table below. "Needs attention" is a list of rows (status, sentence, age, one action), not tiles. Zero states say one plain positive line, for example "No open emergencies."

## Lists
Fiori List Report. A filter bar with variant, filters and Go, then a Cloudscape table with the title and count in the header, text filter, preferences, pagination, sticky header, 48px rows, no zebra, hover tint, right-aligned tabular numbers, and status shown as an icon plus text (no filled blocks, except SOS severity).

## Records
Fiori Object Page. A header with avatar, title, key attributes, then sections or tabs. Each section is a white container with key-value pairs in 2 to 3 columns.

## SOS Board
Cloudscape split panel (table left, resizable detail right) with a Cloudscape-style flashbar for the active emergency. No strobing.

## Forms
Single column, 40px inputs, labels above, helper text below, sticky action footer.

## Empty States
Fiori Illustrated Message style (small neutral line icon, title, one line, one action).

## Banned Styles
Serif, monospace, uppercase or letter-spaced labels, gradients, glass, glow, colored icon badges, emoji in the UI, shadows on cards, a second accent color, equal-weight tile grids as the main structure of a page, and decorative elements that carry no information.

## Token Enforcement
Add `scripts/design-lint.mjs` that FAILS the build on any hex color outside `tokens.css`, any font-family other than Open Sans and the Noto fallbacks, uppercase or letter-spacing utilities, font-weight above 600, gradients, and box-shadow outside popover/drawer components.
