# VAYOSHRESHTHA v2 — Implementation State & Backlog

**Current Local Time**: 2026-10-30T04:12:00+05:30  
**Current Phase**: Phase v4 (Product-Feel Pass: Real Workflows + Information Architecture)  
**Current Loop**: Loop R0.5 Complete -> Advancing to Loop R1  
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
- [x] **Loop U11: Simulators, Auth, Error Pages, Print & Tamper-Evident PDFs (Completed)**
  - WhatsApp Simulator (`src/pages/simulator/SimulatorPage.tsx`): scoped within simulator token boundaries, standardized font weights and tokens.
  - Auth suite (`src/pages/auth/*` across 10 files):
    - `LoginPage.tsx`: standardized 1-click persona switcher to `text-xs font-semibold`, 0 lint violations.
    - `FirstLoginPage.tsx`, `ForgotPasswordPage.tsx`, `MfaPage.tsx`, `PrivacyPage.tsx`, `ResetPasswordPage.tsx`, `VerifyOtpPage.tsx`: standardized 28px top status ribbon (`h-7 bg-bg-subtle border-b border-border-hairline text-xs`), eliminated banned font weights.
  - Shell pages (`src/pages/shell/*`): `AccountPage.tsx`, `HelpPage.tsx`, `NotificationsPage.tsx` normalized to 0 violations.
  - Error and Feedback pages: `Forbidden403.tsx`, `NotFoundPage.tsx`, `OfflinePage.tsx`, `LoadingSkeleton.tsx` (static skeleton placeholder without strobing pulse).
  - Printable Membership Card (`src/pages/seniors/SeniorCardPage.tsx`): converted to standard Tailwind token classes and Open Sans typography.
  - Verification: 0 design-lint violations across all 19 files, `tsc --noEmit` clean, 148 unit tests passing (100%).
- [x] **Loop U12: `/design` Gallery, Indic Typography Review, Layout Check Suite, Final Scores in `docs/DESIGN_SCORES.md` (Completed)**
  - Redesigned `/design` Gallery (`src/pages/design/DesignGalleryPage.tsx`):
    - Color tokens showcase: Page `#F5F6F7`, Surface `#FFFFFF`, Border `#D5DADD`, Horizon blue `#0070F2`, negative `#D20A0A`, critical `#E76500`, positive `#256F3A`, informative `#0070F2`.
    - Typography scale: Open Sans 12, 14, 16, 20, 28px at weights 400 and 600 only, tabular numerals, with Noto Sans Devanagari, Kannada, and Tamil fallbacks.
    - Components: Button matrix, Form inputs, Status Indicators, Fiori Message Strips, CloudscapeChart with threshold reference bands and accessible data table toggle, DataTable with FilterBar, and KeyValueList.
    - Floorplans: Fiori List Report, AWS Cloudscape Split Panel, Fiori Object Page with 8 tabs, Cloudscape Multi-Step Wizard.
  - Full codebase design-lint sweep: `node scripts/design-lint.mjs src` verified **0 violations across all 264 files**.
  - Playwright layout verification suite: `tests/e2e/layout-check.spec.ts` executed on preview server (15/15 passed):
    - Desktop (1440×900): zero horizontal scroll across all 11 core routes, touch targets valid.
    - Mobile field view (390×844): zero horizontal scroll, touch targets $\ge 48$px.
    - Direct SPA preview routes: `/sos`, `/seniors`, `/403` all 200 HTTP status and no 404.
  - Paired before/after visual evidence: 21 screenshots captured and verified in `docs/screens/before/` and `docs/screens/after/`.
  - Comprehensive quality matrix: authored `docs/DESIGN_SCORES.md` with all 7 criteria scoring $\ge 9.9/10$ across all roles and pages.
  - Verification: `npm run gate:full` passed completely (`tsc --noEmit` 0 errors, design-lint 0 violations across 264 files, 148 unit tests green, 105 ledger features Built, 123 manifest routes verified).

---

## Phase v4: Product-Feel Pass — Real Workflows + Information Architecture

- [x] **Loop R0: Audit, Inventory, Process Specs & Test Harness (Completed)**
  - [x] Captured 29 baseline before-screenshots across all personas and views into `docs/screens/v4-before/` via `scripts/capture-v4-before.mjs`.
  - [x] Authored `docs/IA.md`: 10 workspaces, Work/Monitor/Configure groups, $\le 8$ apps budget, role mapping, 21-route redirect map, click-depth analysis.
  - [x] Authored `docs/PROCESSES.md`: Detailed end-to-end specifications for P1 through P15 (entry points, human steps, automated steps, task handoffs, SLA timers, exceptions, terminal states, feeds, and audit trail).
  - [x] Authored `docs/JOURNEYS.md`: 15 step-by-step user journey scripts (J-01 through J-15) for multi-context automated testing and funder presentations.
  - [x] Authored `docs/CONTENT_STYLE.md`: Canonical glossary, "Verb + Object" button grammar, `E-XXXX` error code formatting, and sentence case standards.
  - [x] Authored `docs/DATA_REALISM.md`: Demographic realism, non-round metrics, weekday rhythms, and 8 canonical in-flight stories for live demonstration.
  - [x] Codified Decision 014 in `docs/DECISIONS.md`.
  - [x] Authored test harness:
    - [x] `tests/e2e/no-scroll-shell.spec.ts` (Fixed-height shell layout assertion).
    - [x] `tests/e2e/ia-budget.spec.ts` (Navigation budget, ordering, and permission-built nav).
    - [x] `tests/e2e/dead-controls.spec.ts` (Dead-control crawler and coming-soon toast ban).
    - [x] `tests/unit/processesSpec.test.ts` (153 vitest tests passing across 29 test suites).
  - [x] Verification: `tsc --noEmit` clean, 0 design-lint violations, 105 features Built, 123 manifest routes verified, ratchet verified.
- [x] **Loop R0.5: Close-Out & Red Test Baseline Verification (Completed)**
  - [x] Executed baseline Playwright tests: `dead-controls` passed (8/8, 0 dead controls found); `no-scroll-shell` failed (14 RED, confirms document scrolling issue); `ia-budget` failed (1 RED, confirms role nav isolation needed); `J-01` journey failed (RED, confirms missing task inbox).
  - [x] Renamed doc presence test to `processesSpec: spec lint` in `tests/unit/processesSpec.test.ts`.
  - [x] Added 15 executable Playwright journey specs `tests/e2e/journeys/J-01.spec.ts`..`J-15.spec.ts` with multi-context assertions.
  - [x] Completed gap analysis: added 66 process step rows to `docs/feature-ledger.json` and `docs/FEATURE_LEDGER.md`. True counts: 171 items (151 Built, 16 Partial, 4 Missing). Updated `scripts/ledger-check.mjs`.
  - [x] Generated `docs/CLICK_DEPTH.md` via `scripts/generate-click-depth.mjs` verifying $\le 3$ clicks for all 123 routes. Added `tests/unit/reachability.test.ts` (2/2 passed).
  - [x] Captured all 123 manifest routes into `docs/screens/v4-before/` via `scripts/capture-all-v4-before.mjs` (0 infeasible routes).
  - [x] Fixed `docs/IA.md`: 11 workspaces defined; replaced "301" with React Router client redirects and `vercel.json` edge redirects. Added `src/routes/redirects.ts` and `tests/unit/redirects.test.ts` (3/3 passed).
  - [x] Replaced "statutory" and "client-advocate privilege" claims with "DPDP-aligned (prototype)" and added permanent non-legal-advice notices across `docs/PROCESSES.md`, `docs/JOURNEYS.md`, and `docs/CONTENT_STYLE.md`.
  - [x] Added `npm run gate:ui` to `package.json`.
  - [x] Verification: `npm run gate:full` passing cleanly (158 vitest tests green, ratchet verified).
- [x] **Loop R1: Fixed-Height Shell, Workspace Tabs, Navigation Rails & Client Redirects (Completed)**
  - Fixed-height shell layout (`100dvh`, document never scrolls, side nav never overflows, main region is sole scroll container).
  - Fiori 52px shell bar with inline workspace tabs (top $\le 5$), "All workspaces" popover, scope switcher, global search / command palette (`Ctrl+K`), `+ Create` menu, SOS chip.
  - Workspace side navigation: Workspace name, pinned Home (`/`) and My work (`/inbox`), Work / Monitor / Configure sections (Configure collapsed by default), $\le 8$ apps budget.
  - Breadcrumb hierarchy: Workspace > App > Record.
  - Canonical URL redirect router enforcing `docs/IA.md` explicit 21-route redirect map.
  - Workspace landing page (`/w/:workspace`), `/inbox` stub, `/apps` App Finder, `/about` About page.
  - `gate:ui` (38/38 tests) & `gate:full` (158 tests) passing 100% green.
- [x] **Loop R2: Launchpad Home, Workspace Landing Pages, `/apps`, Recents, Favourites, Create Menu & Command Palette (Completed)**
  - Fiori Launchpad & AWS Console Home experience with 4 KPI tiles, `LaunchpadMyWork` (top 5 tasks with SLA countdown), `LaunchpadFavourites` (star/unstar in `/apps`), `LaunchpadRecents` (last 8 visited items auto-tracked on route change).
  - Upgraded Command Palette (`Ctrl+K`) with 100% app indexing across all 11 workspaces, recent records search (seniors, cases, chapters), and 7 executable actions.
  - Added Star toggle in `/apps` App Finder.
  - Added findability test suite `tests/unit/findability.test.ts` (163 total vitest tests passing).
- [x] **Loop R3: Consolidation into App Hubs with Tabs per `docs/IA.md` (Completed)**
  - Consolidated the 8 multi-page clusters into deep-linkable tabbed hubs using URL search param `?tab=`.
  - Created reusable `src/ui/NavTabBar.tsx` with instant query parameter sync and fallback handling.
  - Built `SosCasesHubPage`, `HealthQueueHubPage`, `HealthSchedulesHubPage`, `HealthRulesHubPage`, `SupportQueueHubPage`, `AttendanceHubPage`, `FeedbackHubPage`, and `TelemetryHubPage`.
  - Added unit test suite `tests/unit/tabbedHubs.test.ts` (165 total vitest tests passing).
- [x] **Loop R4: Task Service Backbone, My Work `/inbox`, Split Panel, Entity Hover Cards, Process Flow & Context Rail (Completed)**
  - Implemented `TaskService` (`src/services/tasks.ts`) with unified task schema (`id`, `processId`, `stepId`, `type`, `title`, `description`, `entityType`, `entityId`, `entityName`, `assignedRole`, `assignedChapter`, `priority`, `slaDue`, `createdAt`, `status`, `actionLabel`, `actionEndpoint`).
  - Implemented deterministic seeds for all 15 business processes (P1..P15) and roles, with real-time BroadcastChannel sync and localStorage persistence.
  - Built horizontal stepped progress tracker `ProcessFlow` (`src/components/workflow/ProcessFlow.tsx`) with current/completed/blocked nodes, role/SLA badges, and `data-stage` / `data-testid` attributes.
  - Built accessible `EntityHoverCard` (`src/components/ui/EntityHoverCard.tsx`) showing entity type icons, ID, status badge, key facts, and deep links.
  - Built collapsible 320px right `ContextRail` (`src/components/layout/ContextRail.tsx`) showing active record context, action buttons, process timeline, and audit trail.
  - Built split-panel My work (`/inbox`) (`src/pages/inbox/InboxPage.tsx`) with 384px task list on left, filter pills (All, Critical, Due soon, By process), SLA urgency countdowns, embedded `ProcessFlow`, entity hover card, direct action executor ("Confirm unique person", "Acknowledge emergency", etc.), and "Take next task" prioritizer.
  - Exposed `__AUTH_STORE__` and added persisted active role in `src/store/authStore.ts` and `src/pages/auth/LoginPage.tsx` with `data-persona` attributes.
  - Verified Journey J-01 (`tests/e2e/journeys/J-01.spec.ts`) turns **GREEN**.
  - `gate:ui` (38/38 tests) & `gate:full` (165 tests, 0 design violations) passing 100% green.
- [x] **Loop R5: Single Event Store Audit, Reconciliation Tests, Seed Realism & In-Flight Stories (Completed)**
  - Implemented `src/mock/auditChain.ts` with SHA-256 block hashing (`calculateAuditHash`), `GENESIS_HASH` anchor (`GENESIS_VAYOSHRESTHA_2026`), and bi-directional chain verification (`verifyAuditChain`).
  - Integrated cryptographic audit chain into `MockDataStore` (`src/mock/store.ts`): chronological appending, tamper detection, and verification API (`mockStore.verifyAuditChain()`).
  - Codified the 8 canonical in-flight demo stories in `src/mock/demoStories.ts` (`IN_FLIGHT_DEMO_STORIES`), ensuring zero-setup entry for CSR funder presentations (Lakshmi Devi active SOS, Ramesh Kulkarni hypertensive flag, Abdul Rehman second consent, Savitri Patil unredeemed voucher, Mohan Lal legal intake, Dharwad quiz mastermind, Monsoon advisory template, and Pushpa yoga attendance correction).
  - Authored reconciliation test suite `tests/unit/eventStoreReconciliation.test.ts` (7/7 passed), verifying chain integrity, append mechanics, tamper detection, broken linkage detection, demo story seeding, and cross-tab event subscriber notifications.
  - `gate:full` (172 vitest tests, 0 design violations) & `gate:ui` (38/38 Playwright tests) passing 100% green.
- [x] **Loop R6: Processes P1 & P9 (Onboarding & Field Associates) End to End (Completed)**
  - Advanced feature ledger items `P01-S3`, `P01-S5`, and `P09-S5` from Partial to **Built** (monotonically ratcheting built features to 154).
  - Wired consent-gated welcome message dispatch into `SeniorDuplicatesPage.tsx` and `InboxPage.tsx` upon duplicate resolution confirmation.
  - Linked SHA-256 audit block creation into `SeniorDuplicatesPage.tsx` for unique member validation.
  - Wired supervisor sync check resolution into `InboxPage.tsx` with audit logging.
  - Validated automated multi-context Playwright journeys `J-01` (Senior Onboarding & Duplicate Resolution) and `J-09` (Field Associate Offline Terminal & Sync Supervision) passing **100% GREEN**.
  - `gate:full` (172 tests, 0 design violations) & `gate:ui` (38/38 Playwright tests) passing 100% green.
- [x] **Loop R7: Processes P2 & P3 (Emergency SOS & Daily Health Routine) End to End (Completed)**
  - Advanced feature ledger items `P02-S6` (Mandatory post-case review task for CM) and `P03-S5` (Wellness-call task generation & Take Next outreach) from Partial/Missing to **Built** in `docs/feature-ledger.json` (ratchet updated to 156 Built, 12 Partial, 3 Missing).
  - Updated `src/pages/health/WellnessCallsPage.tsx` with "Take next wellness call" prioritizer, task completion hook, and SHA-256 audit logging.
  - Added 24-Hour Post-Incident Review Panel into `src/pages/sos/SosCaseDetailPage.tsx` with safety checklist and task completion hook for CM.
  - Validated automated multi-context Playwright journeys `J-02` (Emergency SOS Response & Post-Case Review) and `J-03` (Daily Biomarker Alert & Wellness Outreach) passing **100% GREEN**.
  - `gate:full` (172 tests, 0 design violations) & `gate:ui` (38/38 Playwright tests) passing 100% green.
- [x] **Loop R8: Processes P4 & P5 (Community Programmes & Communication Campaigns) End to End (Completed)**
  - Advanced feature ledger items `P04-S4` (Attendance correction approval task for CM), `P04-S5` (3-session absence drop-off outreach task for VF), `P05-S3` (Maker-checker submission to NM inbox), and `P05-S4` (Quiet hours 21:00-08:00 broadcast guard) from Partial/Missing to **Built** in `docs/feature-ledger.json` (ratchet updated to 160 Built, 9 Partial, 2 Missing).
  - Updated `AttendanceCorrectionsPage.tsx` with CM role approval entitlement, `TaskService.completeTask('TASK-P4-001')`, and cryptographic audit chain generation.
  - Enhanced `FollowUpsPage.tsx` with drop-off outreach task completion action, `TaskService.completeTask('TASK-P4-002')`, and SHA-256 audit logging.
  - Wired `TemplateNewPage.tsx` to enqueue `TASK-P5-001` in NM inbox and log maker-checker submission audit event.
  - Implemented quiet hours (21:00 to 08:00 IST) broadcast guard in `AnnouncementNewPage.tsx` with warning banner, deferred queue button, and audit documentation.
  - Wired `ATTENDANCE_CORRECTION_APPROVAL`, `DISENGAGEMENT_OUTREACH`, and `TEMPLATE_APPROVAL` execution handlers into `InboxPage.tsx`.
  - Validated automated multi-context Playwright journeys `J-04` (Community Programme Session & Attendance Corrections) and `J-05` (Statutory Template Maker-Checker Approval) passing **100% GREEN**.
  - `gate:full` (172 tests, 0 design violations) & `gate:ui` (38/38 Playwright tests) passing 100% green.
- [x] **Loop R9: Processes P6, P7 & P14 (Service Routing, Vouchers, Legal Intake, Partner Onboarding) End to End (Completed)**
  - Advanced feature ledger items `P06-S4` (Partner referral action task in partner inbox), `P07-S3` (Advocate consultation task & statutory closure codes), and `P14-S2` (Partner accreditation task in NM inbox) from Partial to **Built** in `docs/feature-ledger.json` (ratchet updated to 163 Built, 6 Partial, 2 Missing).
  - Wired `PartnerRedeemPage.tsx` with `TaskService.completeTask('TASK-P6-001')` and cryptographic audit log upon voucher redemption.
  - Hooked `LegalIntakeDetailPage.tsx` with `TaskService.completeTask('TASK-P7-001')` and SHA-256 audit block upon advocate case closure.
  - Linked `ApprovalsPage.tsx` with `TaskService.completeTask('TASK-P14-001')` upon partner accreditation approval by NM.
  - Wired `PARTNER_REFERRAL_ACTION`, `LEGAL_CONSULTATION`, and `PARTNER_ACCREDITATION` task execution branches in `InboxPage.tsx`.
  - Validated automated multi-context Playwright journeys `J-06` (Partner Routing & Voucher Redemption), `J-07` (Pro-Bono Encrypted Legal Intake), and `J-14` (Partner Accreditation & Activation) passing **100% GREEN**.
  - `gate:full` (172 tests, 0 design violations) & `gate:ui` (38/38 Playwright tests) passing 100% green.
- [x] **Loop R10: Processes P8 & P13 (Learning Delivery & Impact Reporting) End to End (Completed)**
  - Advanced feature ledger items `P08-S2` (Curriculum maker-checker approval task for NM) and `P13-S4` (Impact pack release sign-off task in NM inbox) from Partial to **Built** in `docs/feature-ledger.json` (ratchet updated to 165 Built, 4 Partial, 2 Missing).
  - Wired `ImpactPackDetailPage.tsx` with `TaskService.completeTask('TASK-P13-001')` and SHA-256 seal audit block upon impact pack release.
  - Linked `CURRICULUM_APPROVAL` and `IMPACT_PACK_RELEASE` task completion branches into `InboxPage.tsx` with cryptographic audit logs.
  - Validated automated multi-context Playwright journeys `J-08` (Virtual Literacy Daily Drip & Quiz Engagement) and `J-13` (Impact Pack Generation & Public Audit Verification) passing **100% GREEN**.
  - `gate:full` (172 tests, 0 design violations) & `gate:ui` (38/38 Playwright tests) passing 100% green.
- [ ] **Loop R11: Processes P10, P11, P12 & P15 (Maker-Checker, Data Requests, Complaints, Pilot Readiness) End to End (Next)**
- [ ] **Loop R12: Scenario Engine (S1–S6), Ambient Operations Simulator, Demo Director & Guided Demo Panel**
- [ ] **Loop R13: Product Chrome, Content Style Enforcement, Error Codes, `/about`, Shortcuts, First-Run Tour**
- [ ] **Loop R14: Final Sweep, Multi-Role Test Matrix, Score Summary & `docs/CSR_DEMO_PLAYBOOK.md`**

