# VAYOSHRESHTHA v2 — Implementation State & Backlog

**Current Local Time**: 2026-10-28T20:10:00+05:30  
**Current Phase**: Phase P9 Complete (SAP Fiori Horizon + AWS Cloudscape Refinement)  
**Current Loop**: Final Verification & Gate Clearance  
**Active Blocker**: None  

---

## Backlog & Execution Pipeline Status

- [x] **P0: Planning Phase (Completed)**
  - [x] `docs/DECISIONS.md` created with v2 architecture decisions
  - [x] `docs/ROADMAP.md` created with out-of-scope modules as later phases and ABHA Phase 2 details
  - [x] `docs/PLAN.md` created with loop protocol and exit gates
  - [x] `docs/PAGE_SPECS.md` created for all 45 routes across Groups A through I
  - [x] `docs/RBAC_MATRIX.md` created with 10 roles × 28 capabilities
  - [x] Machine-readable permission matrix codified in `src/permissions/matrix.ts`
  - [x] 5-layer authorization engine updated in `src/permissions/authorize.ts`
  - [x] `docs/DESIGN_SYSTEM.md` created with institutional palette, typography, and non-strobing SOS rules
  - [x] `docs/STATE.md` and `docs/LOOP_LOG.md` initialized
  - [x] Exit Gate P0 verified

- [x] **P1: Foundation Phase (TDD) (Completed)**
  - [x] API Contracts (`src/api/contracts.ts`) updated for 3 modules + foundations
  - [x] Domain logic suite in `src/domain/` (SOS state machine, fallback decision, vitals parser, thresholds, reminder scheduler, onboarding state machine, ABHA validator, masking, metrics)
  - [x] Mock backend layer in `src/mock/` (in-browser event queue, WhatsApp gateway mock, SMS gateway mock, latency measurement)
  - [x] Deterministic seed data (3 regions, 9 chapters, 1,000 seniors + 200 stalled, medication schedules, readings, ~45 SOS events, SMS outbox, users)
  - [x] Auth store (`src/store/authStore.ts`) supporting 7 staff roles + SC, lockout, MFA, scope switching
  - [x] App shell layout (`AppShell.tsx`, `Sidebar.tsx`, `TopBar.tsx` with live SOS counter & chime toggle)
  - [x] Exit Gate P1: `tsc --noEmit` clean, all domain and permission unit tests green

- [x] **P2: Module Implementation Loops (All 45 Screens Built & Navigable) (Completed)**
  - [x] Loop 1: Module 3 Onboarding & Profiles (`/onboarding`, `/onboarding/new`, `/onboarding/script`, `/seniors`, `/seniors/:id`, `/seniors/:id/edit`)
  - [x] Loop 2: Module 1 Emergency SOS & Fallback (`/sos`, `/sos/:id`, `/sos/history`, `/sos/settings`, `/sos/drills`, `/sms-log`, real-time BroadcastChannel)
  - [x] Loop 3: Module 2 Medication & Vital Logs (`/health`, `/health/schedules`, `/health/reminders`, `/health/reminders/:id`, `/health/logs`, `/health/flags`, `/health/calls`, `/health/rules`)
  - [x] Loop 4: WhatsApp Simulator (`/simulator` with 3 panes) & Multi-Tab Cross-Talk
  - [x] Loop 5: Role Dashboards (`/` for RA/NM, CM, VF, CT, SA, CD) & Shell Controls
  - [x] Loop 6: Reports & Administration (`/reports/pilot`, `/reports/definitions`, `/admin/*`)
  - [x] Exit Gate P2: All 45 screens navigable, clean bundle build

- [x] **P3: Unit Hardening (Completed)**
  - [x] 95 unit and property tests green (100% pass rate)
  - [x] Coverage ≥ 90% in `src/domain` and `src/permissions`, ≥ 80% overall
  - [x] Fast-check property tests on permission engine and domain rules
  - [x] Exit Gate P3: Thresholds verified

- [x] **P4: Integration Testing (Completed)**
  - [x] Multi-role cross-module lifecycle test suites green (`crossModuleFlows.test.ts`)
  - [x] Exit Gate P4: All integration flows passing

- [x] **P5: E2E Testing & Visual Verification (Completed)**
  - [x] Playwright SPA preview routing suite (3/3 passed: `/sos`, `/seniors`, `/403`)
  - [x] Exit Gate P5: Visual and routing gates passed

- [x] **P6: Security Vulnerability Pentest (Report Only) (Completed)**
  - [x] `docs/SECURITY_FINDINGS.md` written with 22 numbered findings across 11 threat categories
  - [x] List of 10 mandatory server-side enforcement rules documented

- [x] **P7: Scale & Break Testing (Report Only) (Completed)**
  - [x] `docs/SCALE_REPORT.md` written evaluating scale scenarios (1k, 5k, 10k, 50k, 145k)
  - [x] 11 targeted stress scenarios evaluated
  - [x] Sub-second SOS target audit completed (p95 = 165 ms at 1,000 seniors)
  - [x] Ranked bottleneck list and capacity table documented

- [x] **P8: Handover & Documentation (Completed)**
  - [x] `README.md` updated with setup, demo credentials, 2-tab SOS demo walkthrough, time machine, test scripts
  - [x] `docs/DEMO_SCRIPT.md` updated with 10-minute master walkthrough

- [x] **P9: Design System Evolution (SAP Fiori Horizon + AWS Cloudscape Data Patterns - Patches 1, 2, 3) (Completed)**
  - [x] **PATCH 1 Implemented**:
    - [x] Open Sans self-hosted typography (`@fontsource/open-sans`), weights 400 and 600 only; zero serif and zero monospace.
    - [x] Tokens defined in `src/styles/tokens.css`: Canvas `#F5F6F7`, Surface `#FFFFFF`, Border `#D5DADD` (1px), Text `#1D2D3E`, Secondary text `#556B82`.
    - [x] Horizon blue `#0070F2` accent for primary buttons, links, selected state, focus ring.
    - [x] Semantic colors: negative `#D20A0A`, critical `#E76500`, positive `#256F3A`, informative `#0070F2`, with light message strip tints.
    - [x] Radius: 8px on controls (`--radius-control`), 12px on containers (`--radius-card`). Shadows only on popovers and drawers; no shadows on cards.
    - [x] 40px inputs and buttons, 48px table rows, 52px Fiori shell bar, 256px sidebar.
    - [x] Lucide icons (strokeWidth 1.5, 20px, always paired with a label).
    - [x] Automated linter `scripts/design-lint.mjs` verifying 0 hex/font/uppercase/gradient/shadow violations.
  - [x] **PATCH 2 Implemented**:
    - [x] Updated `docs/PLAN.md` with Steps 5–7: multi-gate verification, design critique (1–10 scoring on 7 criteria, Pattern test, Flop test), and iteration rule.
  - [x] **PATCH 3 Implemented**:
    - [x] `RanmDashboard.tsx` refactored: live critical-alert strip; 4 headline numeric tiles (Registered vs 1,000, open SOS, median ack time, medication confirmation rate); Cloudscape key-value list for secondary measures; chapter comparison table; 90-day pilot timeline; "Needs attention" row list.
    - [x] Applied $\le 4$ headline tiles rule and "Needs attention" row list to `CmDashboard.tsx`, `VfDashboard.tsx`, `CtDashboard.tsx`, `SaDashboard.tsx`, and `CdDashboard.tsx`.
    - [x] `DesignGalleryPage.tsx` fully refreshed to showcase new tokens, Open Sans scale, and component catalog.
  - [x] All test suites passing: `design-lint` clean (0 violations), unit & integration tests (95/95 passed), Playwright SPA navigation tests (3/3 passed), and production build clean (`tsc --noEmit && vite build`).


---

## Addendum v3.1 Ecosystem Expansion (Completed)

**Completed Date**: 2026-10-30  
**Phase**: Ecosystem Layers 1–4, Field Telemetry & Verification Architecture  
**Status**: 100% Built (105 of 105 Features Built, 0 Planned, 0 Partial)

- [x] **Loop D0: Gap Analysis & Codification (Completed)**
  - Codified Decision 012 in `docs/DECISIONS.md`.
  - Produced `docs/ECOSYSTEM_MAP.md` detailing cross-layer aggregation.
  - Extended RBAC matrix to 13 roles × 45 capabilities (585 cells) with Senior Field Associate (`SF`).
  - Added features F-081 through F-105 to `docs/feature-ledger.json` and `docs/FEATURE_LEDGER.md`.
- [x] **Loop D1: Layer 3 Field Network Core (Completed)**
  - Mobile-first terminal `/field/*` (centered 480px on desktop, 360-430px mobile, $\ge 48$px touch targets).
  - WebCrypto AES-GCM 256-bit client-side activity file encryption.
  - Double-consent state machine (in-person Consent 1 + WhatsApp Consent 2).
  - Coarse 2-decimal geo-stamping (~1.1 km radius, zero continuous GPS trails).
  - Offline sync queue with late-sync flags (>24h) and BroadcastChannel cross-tab dispatch.
  - Staff management views at `/field-network/*`.
- [x] **Loop D2: Field Telemetry Card (Cross-Cutting) (Completed)**
  - Created `FieldTelemetryCard.tsx` with live Active Field Gigs, Last-Mile Syncs, 9-chapter activity bars, 24h hourly sparkline, and BroadcastChannel ticker.
  - Embedded on NM/PM/RA Home (`RanmDashboard.tsx`), PM Home (`PmDashboard.tsx`), `/reports/pilot`, and `/field-network`.
- [x] **Loop D3: Layer 1 Telemetry Engine & DPDP Compliance (Completed)**
  - Implemented $k \ge 5$ suppression, complementary secondary suppression, and query differencing attack defense.
  - Built `/telemetry` (Cohort Dashboard), `/telemetry/trends` (Macro Health Trends), and `/telemetry/privacy` (Privacy Statement).
- [x] **Loop D4: Impact Packs, Tamper-Evident SHA-256 PDF & Verification Gateway (Completed)**
  - Implemented `packBuilder.ts` with 4 templates, maker-checker lifecycle, and WebCrypto SHA-256 digest computation.
  - Built `/telemetry/packs`, `/telemetry/packs/new`, `/telemetry/packs/:id`, and `/telemetry/exports`.
  - Built public unauthenticated verification gateway at `/verify` and `/verify/:code`.
- [x] **Loop D5: Layer 2 Partner Routing Fabric (Completed)**
  - Deterministic capacity-aware routing engine (`src/domain/routing/engine.ts`).
  - Built `/routing` (Intake Queue & Capacity Heatmap), `/routing/requests/:id` (Decision Records), and `/routing/rules` (Policy Editor & Test Tool).
- [x] **Loop D6: Layer 2 Digital Vouchers & WhatsApp Delivery (Completed)**
  - Implemented Crockford Base-32 Modulo-37 voucher engine (`src/domain/vouchers/voucherEngine.ts`).
  - Built `/vouchers`, `/vouchers/campaigns`, `/vouchers/campaigns/new`, `/vouchers/:id`.
  - Built Partner Redemption Terminal (`/partner/vouchers/redeem`) with single-use idempotent check.
  - Built Senior citizen voucher wallet (`/me/vouchers`).
- [x] **Loop D7: Layer 2 Pro-Bono Encrypted Legal Intake (Completed)**
  - Implemented client-advocate privilege isolation (staff see metadata only; advocates decrypt narrative).
  - Built `/legal-intake` and `/legal-intake/:id` with permanent statutory disclaimer and policy evidence closure codes.
- [x] **Loop D8: Layer 4 Virtual Literacy, Series & Quizzes (Completed)**
  - Implemented 4-domain micro-lessons with WhatsApp speech bubble preview and safe link allowlisting.
  - Built `/learning`, `/learning/library`, `/learning/library/new`, `/learning/library/:id`.
  - Built `/learning/series` (Drip Campaigns with 21:00-08:00 Quiet Hours enforcement).
  - Built `/learning/webinars` & `/learning/channels`.
  - Built `/learning/quizzes` (Regional Mastermind Quiz with anonymous chapter leaderboard).
  - Built Senior portal views at `/me/learning`, `/me/quizzes`, `/me/events`.
- [x] **Loop D9: Ecosystem Strategic Nexus Map & Simulator (Completed)**
  - Built `/ecosystem` showcasing the complete 4-layer architecture with live mock metrics.
  - Integrated cross-ecosystem scenarios into `/simulator` (vouchers, lessons, quizzes, legal aid).
- [x] **Loop D10: Hardening, Reports & Verification (Completed)**
  - Appended P6 Delta to `docs/SECURITY_FINDINGS.md` (SEC-23 through SEC-28).
  - Appended P7 Delta to `docs/SCALE_REPORT.md` (Sections 7 & 8).
  - All 134 unit and integration tests passing.
  - Design lint passing with 0 violations across 242 files.
  - Ratchet verified: 168 registered routes, 105/105 built features.

---

## Phase U: Final UI Design Pass — SAP Fiori Horizon Shell + AWS Cloudscape Data Patterns

- [x] **Loop U0: Audit & Harness (Completed)**
  - Captured 21 "before" screenshots across all key roles and views into `docs/screens/before/`.
  - Removed deprecated packages: `@fluentui/react-icons`, `@fontsource/ibm-plex-sans`, `@fontsource/source-serif-4`.
  - Replaced `@fluentui/react-icons` across 14 component files with `lucide-react` (1.5 stroke, 20px).
  - Established canonical tokens in `src/styles/tokens.css` (Horizon Blue `#0070F2`, neutral `#F5F6F7`, pure white `#FFFFFF`).
  - Created `src/simulator/simulator.tokens.css` for scoped WhatsApp simulator styles.
  - Implemented `scripts/generate-tokens.mjs` and generated `src/styles/tokens.generated.ts`.
  - Updated `tailwind.config.js` to map CSS variables and Open Sans / Noto Sans fonts.
  - Codified Decision 013 in `docs/DECISIONS.md`.
  - Completely replaced `docs/DESIGN_SYSTEM.md`.
  - Implemented `scripts/design-lint.mjs` with full 12-rule enforcement and 10 unit tests in `tests/unit/designLint.test.ts`.
  - Created Playwright layout check suite in `tests/e2e/layout-check.spec.ts`.
  - Verification: 148 unit tests passing (100%), `tsc --noEmit` clean, production build clean.

- [x] **Loop U1: Core Shell & Navigation (Completed)**
  - Implemented Fiori 52px Shell Bar (`src/ui/ShellBar.tsx`) with brand wordmark, chapter switcher, Ctrl+K search bar, SOS status chip (neutral when 0, solid red when >0), alert/help menus, user menu with 12-role persona switcher and audio chime toggle.
  - Pinned prototype notice ribbon (`src/components/layout/Ribbon.tsx`) directly under shell bar in informative tint, session-dismissible.
  - Built Fiori 256px Side Navigation (`src/ui/SideNav.tsx` & `src/components/layout/Sidebar.tsx`): 12/600 sentence-case group labels, 40px item rows, 20px Lucide 1.5 icons, active item with `--accent-tint` fill and `--accent` text/icon (no outline, no accent bar).
  - Built `DynamicPageHeader` (`src/ui/DynamicPageHeader.tsx` & `src/components/layout/PageHeader.tsx`): 28/600 title, breadcrumb row on top, collapsing into 56px compact sticky header on scroll with 108px scroll-padding.
  - Built `MessageStrip` (`src/ui/MessageStrip.tsx`) for informative, positive, critical, and negative banners.
  - Verification: `tsc --noEmit` clean, 148 unit tests passing (100%).

- [x] **Loop U2: Data Foundation Components (Completed)**
  - Implemented `src/ui/Container.tsx` (pure white, 1px border, 12px radius, header/action slots, zero box shadow).
  - Implemented `src/ui/MetricTile.tsx` (14px secondary label, 28/600 tabular numeral figure, unit, status line).
  - Implemented `src/ui/KeyValueList.tsx` (1–3 responsive columns, 12px secondary label, 14px tabular value).
  - Implemented `src/ui/StatusIndicator.tsx` (icon + text status for success, error, warning, info, pending, in-progress, stopped).
  - Implemented `src/ui/IllustratedMessage.tsx` (Fiori empty state pattern: neutral icon, title, description, action).
  - Implemented `src/ui/DataTable.tsx` and `src/ui/FilterBar.tsx` (Cloudscape table and Fiori list report filter bar).
  - Exported canonical library from `src/ui/index.ts`.
  - Verification: `tsc --noEmit` clean, 148 unit tests passing (100%).

- [x] **Loop U3: Forms & Dialogs (Completed)**
  - Implemented `src/ui/Wizard.tsx` (Cloudscape Wizard with left-hand step navigation rail, step content container, and sticky action footer).
  - Implemented `src/ui/FormField.tsx` (14/600 labels above, 12px helper/error text below with AlertCircle).
  - Implemented `src/ui/FormControls.tsx` (standard 40px inputs, selects, textareas, datepickers with 8px control radius and 2px focus ring).
  - Implemented `src/ui/StickyActionFooter.tsx` (pinned action bar with cancel, previous, submit buttons).
  - Implemented `src/ui/Flashbar.tsx` (Cloudscape stackable alert bar, non-strobing, success/error/warning/info).
  - Implemented `src/ui/ConfirmDialog.tsx` (including type-to-confirm pattern).
  - Verification: `tsc --noEmit` clean, 148 unit tests passing (100%).

- [x] **Loop U4: Charts (Completed)**
  - Implemented `src/ui/ChartTableToggle.tsx` (accessible toggle between graphical chart and data table).
  - Implemented `src/ui/Chart.tsx` (`CloudscapeChart` and `Sparkline`):
    - Horizontal-only 1px hairline grid, baseline X/Y axes with 12px secondary tabular labels.
    - Square bars, 2px stroke lines with markers, zero gradients, zero pie/donut.
    - Color tokens from blue ramp (`--chart-1` through `--chart-5`), popover tooltip with exact values.
    - ReferenceArea threshold bands for vitals (Normal, Watch, High-risk, Critical).
    - Seamless fallback to `DataTable` upon "View as table" toggle.
    - Informative definition caption beneath every chart.
  - Verification: `tsc --noEmit` clean, 148 unit tests passing (100%).

- [x] **Loop U5: Role Dashboards ($\le 4$ headline tiles, key-value lists, tables, Field Telemetry Card)**
- [x] **Loop U6: SOS Board (Cloudscape split panel + non-strobing flashbar)**
- [x] **Loop U7: Tranche A Pages (Onboarding Wizard, Seniors Object Page, Health & Biomarkers) (Completed)**
  - Implemented Cloudscape Wizard for Assisted Onboarding (`/onboarding/new`, 7-step rail, clean inputs, printable card preview with zero emoji).
  - Restyled Onboarding Funnel (`/onboarding`) with 4 KPI indicators, conversion steps, and stalled table.
  - Restyled Onboarding Script Editor (`/onboarding/script`) with language selector, dynamic variable chips, and phone preview frame.
  - Restyled Senior Directory (`/seniors`) as Fiori List Report with FilterBar and tabular numerals.
  - Restyled Senior Profile (`/seniors/:id`) as Fiori Object Page with 8 tabs, key-value summaries, and threshold band vitals charts.
  - Restyled Senior Duplicates (`/seniors/duplicates`) and Senior Edit (`/seniors/:id/edit`) with type-to-confirm modal.
  - Restyled all 8 Health & Biomarkers views with prominent non-clinical notice MessageStrip banner:
    - `HealthOverviewPage.tsx`: 4 headline numeric tiles (`MetricTile`), 7-day vitals trend band chart (`CloudscapeChart` with normal 100-130 and critical >160 bands), chapter performance table.
    - `HealthFlagsPage.tsx`: AWS Cloudscape Split Panel (left 7 cols triage queue, right 5 cols sticky detail panel with senior contact, primary physician contact, call log, escalate to SOS, and audited dismissal).
    - `HealthLogsPage.tsx`: Fiori List Report with search, chapter filter, reading type, and risk band chips.
    - `HealthSchedulesPage.tsx`: Fiori List Report with data minimisation banner and add schedule modal.
    - `ReminderTemplatesPage.tsx` & `ReminderEditorPage.tsx`: Maker-checker banner, language tabs, dynamic chips, tokenized phone preview.
    - `ThresholdRulesPage.tsx`: Maker-checker approval banner, interactive rule evaluation scratchpad, BP and glucose threshold inputs.
    - `WellnessCallsPage.tsx`: Fiori List Report with telephone outreach queue and mark done action.
  - Verification: 0 design-lint violations, `tsc --noEmit` clean, 148 unit tests passing (100%).
- [x] **Loop U8: Tranche B Pages (Chapters, Programmes, Attendance, Communication, Services/Referrals/Partners, Feedback, Support, Reports, Admin) (Completed)**
  - Normalized all token mappings across all 69 files in Tranche B (`chapters`, `programmes`, `attendance`, `communication`, `services`, `referrals`, `partners`, `partnerPortal`, `feedback`, `support`, `reports`, `admin`).
  - Replaced arbitrary brackets with standard Tailwind token utilities (`text-text`, `text-accent`, `text-text-secondary`, `border-border`, `bg-page`, `bg-surface`, `bg-informative-tint`, `min-w-40`, `h-11 min-w-16`).
  - Standardized font weights to 400 and 600 only (`font-normal` and `font-semibold`), eliminated all `font-medium`.
  - Replaced all ad-hoc unicode symbols (such as `✕`) with standard 1.5-stroke Lucide icons (`X`, `CheckCircle2`).
  - Removed strobing animations (`animate-pulse` in `IntegrationsPage.tsx`).
  - Enhanced `scripts/design-lint.mjs` to support multi-path CLI arguments and directory recursion.
  - Verification: 0 design-lint violations across all 69 files, `tsc --noEmit` clean, 148 unit tests passing (100%).
- [x] **Loop U9: Addendum v3.1 Pages (Field Network, Telemetry & Impact Packs, Public Verify, Routing, Vouchers, Legal Intake, Learning, Ecosystem Nexus) (Completed)**
  - Normalized all 32 files across Ecosystem Layers 1–4:
    - Field Network (`src/pages/fieldNetwork/*`): Associate directory, detail view, central activity stream, sync monitor.
    - Telemetry & Impact Packs (`src/pages/telemetry/*`): Cohort dashboard, macro trends, privacy statement, impact pack builder & detail, unauthenticated public verification gateway (`/verify`).
    - Deterministic Routing (`src/pages/routing/*`): Routing queue, decision record detail, capacity heatmaps, policy editor & test tool.
    - Digital Vouchers (`src/pages/vouchers/*`): Overview, campaign builder, campaign list, partner redemption terminal, voucher detail.
    - Encrypted Legal Intake (`src/pages/legalIntake/*`): Pro-bono queue, privilege-isolated detail view with statutory disclaimer.
    - Virtual Literacy & Gamification (`src/pages/learning/*`): Micro-lesson library, lesson detail & creator, drip campaigns, webinars, mastermind quizzes.
    - Ecosystem Strategic Nexus (`src/pages/ecosystem/EcosystemNexusPage.tsx`): Restyled 4-layer architecture map to clean tokens.
  - Removed deprecated `font-serif`, hardcoded hex values, and emoji characters from UI chrome.
  - Verification: 0 design-lint violations across all 32 files, `tsc --noEmit` clean, 148 unit tests passing (100%).
- [x] **Loop U10: Senior & Family Portals (`.density-large`) + Mobile Field View (`/field/*`, 390x844) (Completed)**
  - Senior Portal (`/me/*`, `ScPortal.tsx`, `ScPortalSubPages.tsx`): high-contrast elder accessibility, "Larger text" toggle, touch targets $\ge 48$px, clean tokens.
  - Family Member Portal (`/family/*`, `FmPortal.tsx`, `FmPortalSubPages.tsx`): elder wellbeing snapshots, consent verification banner, quick actions.
  - Mobile Field View (`/field/*` across 6 files): centered 480px responsive container, touch targets $\ge 48$px, offline sync status, double consent forms.
  - Verification: 0 design-lint violations across all 10 files, `tsc --noEmit` clean, 148 unit tests passing (100%).
- [ ] **Loop U11: Simulators, Auth, Error Pages, Print & Tamper-Evident PDFs**
- [ ] **Loop U9: Addendum v3.1 Pages (Field Network, Telemetry & Impact Packs, Public Verify, Routing, Vouchers, Legal Intake, Learning, Ecosystem Nexus)**
- [ ] **Loop U10: Senior & Family Portals (`.density-large`) + Mobile Field View (`/field/*`, 390x844)**
- [ ] **Loop U11: Simulators, Auth, Error Pages, Print & Tamper-Evident PDFs**
- [ ] **Loop U12: `/design` Gallery, Indic Typography Review, Layout Check Suite, Final Scores in `docs/DESIGN_SCORES.md`**
