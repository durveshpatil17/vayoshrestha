# VAYOSHRESHTHA v2 — Architectural & Design Decisions Log

This document records architectural, UX, data-model, security, and scope decisions made for the Vayoshreshtha v2 Pilot Prototype for the NGO Vayoh Vikas, per the master prompt requirements.

---

## Decision 001: Strict Three-Module Pilot Scope & Deprecation of Non-Core Modules
- **Date**: 2026-10-28
- **Context**: The pilot requires deep operational fidelity for the core high-value operational tranche rather than surface-level breadth across the entire platform.
- **Decision**: Restrict prototype implementation strictly to:
  1. Module 1: Emergency SOS Routing with cellular fallback SMS to next-of-kin.
  2. Module 2: Preventive Health (Medication adherence and blood pressure / glucose logging with anomaly triage).
  3. Module 3: Civic & Profile Pillar (Secure Onboarding with ABHA-ready profile structure).
  All previously scaffolded modules (Programmes, Attendance, Bookings, External Service Referrals, Partner Directory, Feedback Forms, CSR Custom Builder, Family Portal, AI Voice Calls) are removed from active routing and documented in `docs/ROADMAP.md` as "later phases".
- **Rationale**: Meets Hard Constraint 1. Maximizes engineering depth on life-critical SOS reliability, health flag escalation, and privacy-preserving onboarding.

---

## Decision 002: Role Realignment (RA & CM Hierarchy, Removal of PM & SP)
- **Date**: 2026-10-28
- **Context**: The operational field structure for Vayoh Vikas requires a 2-tier geographical hierarchy: Regional Admins (RA) overseeing regions (South, West, North), and Chapter Managers (CM) running individual Ekta Hubs (Pune, Bengaluru, etc.), supported by Field Volunteers (VF), Care Team responders (CT), Executive Leadership (NM), System Admin (SA), CSR Donors (CD), Senior Citizens (SC), and Next-of-Kin (NK).
- **Decision**: Refactor RBAC roles:
  - Add `RA` (Regional Admin) with region-level scope.
  - Add `CM` (Chapter Manager) with chapter-level scope.
  - Remove `PM` and `SP` (out-of-scope for the 3-module pilot; SP belongs to external referrals).
  - Define `NK` as an SMS-only recipient without web authentication.
- **Rationale**: Aligns directly with Section 6.1 and operational incident management requirements.

---

## Decision 003: Multi-Tab Real-Time Cross-Talk via BroadcastChannel & LocalStorage Event Fallback
- **Date**: 2026-10-28
- **Context**: In a demo or automated verification, the senior simulator running in Tab A must instantly trigger an SOS alert on the Regional Admin/Chapter Manager SOS board running in Tab B without a server or WebSocket infrastructure.
- **Decision**: Implement `BroadcastChannel('vayoshrestha_channel')` with fallback to `window.addEventListener('storage')`. Every SOS trigger, cancellation, or status update broadcasts an envelope with a high-resolution timestamp (`performance.now()`), allowing the receiving tab to compute simulated enqueue-to-dashboard latency in milliseconds.
- **Rationale**: Satisfies Section 2 and Hard Constraint 10 while keeping the entire prototype zero-backend.

---

## Decision 004: Cellular Fallback Decision Function & SMS Gateway Simulation
- **Date**: 2026-10-28
- **Context**: Seniors in low-connectivity areas may experience network drops mid-SOS transaction.
- **Decision**: Provide a "Simulate data disconnect" toggle in the senior simulator and dev panel. When enabled, if an SOS dispatch is initiated while disconnected or fails receipt within a simulated network drop window:
  1. The fallback decision function immediately fires a simulated transactional SMS to Next-of-Kin 1.
  2. If Next-of-Kin 1 delivery fails and settings specify "all contacts" or "retry next", it fires to Next-of-Kin 2.
  3. If consent or number is missing, the case is flagged on the admin dashboard as "no next-of-kin SMS possible: consent/number missing".
  4. The event is recorded in the `/sms-log` outbox.
- **Rationale**: Directly satisfies Module 1 Core Safety Pillar and Hard Constraint 10.

---

## Decision 005: ABHA Structure-Only Implementation (Phase 2 Preparation)
- **Date**: 2026-10-28
- **Context**: National health account (ABHA) linkage is critical for long-term health federation under ABDM, but federated lookup and KYC verification are not in the pilot scope.
- **Decision**: 
  - Store ABHA number (14 digits formatted as `XX-XXXX-XXXX-XXXX`) and optional ABHA address (`name@abdm`).
  - Validate format only via regex `^\d{2}-\d{4}-\d{4}-\d{4}$`.
  - Enforce separate ABDM consent toggle.
  - Never display a "Verified" state. Status is strictly "Not provided" or "Provided, not verified".
  - Disable any "Link ABHA" button with a visible badge: `"Phase 2"`.
- **Rationale**: Meets Hard Constraint 8. Guarantees ethical and regulatory transparency.

---

## Decision 006: Non-Clinical Language & Configurable Placeholder Thresholds
- **Date**: 2026-10-28
- **Context**: Vayoh Vikas is an eldercare NGO, not a clinical hospital. The prototype must never provide medical diagnoses or advice.
- **Decision**:
  - Display a permanent institutional notice on all health views: *"Vayoshreshtha does not diagnose or give clinical advice. High readings prompt a non-clinical wellness check-in call."*
  - Pre-configure default vital thresholds (BP: Systolic Normal <130, Watch 130–139, High-Risk 140–179, Critical >=180; Diastolic Normal <85, Watch 85–89, High-Risk 90–119, Critical >=120) with a prominent banner: *"Placeholder — to be set by a qualified clinician and approved by NGO Management"*.
  - When an anomaly is detected, generate a "Wellness check-in call" task with a non-clinical script (listening, reassurance, prompting in-person clinic visit).
- **Rationale**: Complies with Hard Constraint 9 and ethical standards for community health workers.

---

## Decision 007: In-Browser Event Queue & Time Machine
- **Date**: 2026-10-28
- **Context**: The pilot requires scheduled 08:00 morning medication reminders, quiet hours, and queue depth/latency metrics without a live Redis server.
- **Decision**: Implement an in-memory priority event queue with persistent storage in `localStorage`. Provide a developer panel (`?dev=1` or top bar quick action) with a "Time Machine" control that can advance virtual time to 08:00 IST to fire scheduled reminder jobs on demand for testing and live demonstrations.
- **Rationale**: Eliminates waiting 24 hours to test cron jobs and reminder flows.

---

## Decision 008: Full Platform Unification (v3 Cumulative Scope Re-integration)
- **Date**: 2026-10-28
- **Context**: An earlier two-prompt sequence temporarily pruned modules because the pilot brief was mistakenly interpreted as a replacement rather than an addition. The v3 master prompt mandates a cumulative architecture containing both the full community ecosystem and the pilot modules without feature loss.
- **Decision**:
  - Supersede Decision 001 and restore all 12 operational loops (A to L): Chapters, Programmes, Attendance, WhatsApp Communication, Services & Referrals, External Partner Portal, Feedback, Assisted Health Support, CSR Reporting, Senior Citizen Portal (`/me/*`), Family Member Portal (`/family/*`), and Governance/Complaints.
  - Supersede Decision 002 to re-incorporate `PM` (Programme Manager), `SP` (Service Partner), and `FM` (Family Member) alongside the full 12-role matrix.
  - Retain the spelling: Platform = **Vayoshreshtha**, Organisation = **Vayoh Vikas**, Community Hubs = **Ekta Hubs** ("Chapter (Ekta Hub)").
- **Rationale**: Fulfills the anti-regression and cumulative fidelity requirements of the v3 master prompt.

---

## Decision 009: Design System Evolution — Forest Green & High-Legibility Typography
- **Date**: 2026-10-28
- **Context**: Section 4 of the v3 master specification overrides previous Fiori Horizon blue branding in favor of an authoritative, dignified identity designed for civic trust.
- **Decision**:
  - Primary Accent: Forest Green `#1F5F4B` with light sage tint `#E8F2EE` and active hover `#174738`. Horizon Blue `#0070F2` is banned.
  - Neutrals: Warm canvas `#F7F6F3`, pure white card surface `#FFFFFF`, 1px hairline border `#E4E2DC`.
  - Typography: IBM Plex Sans for body/controls (weights 400, 500, 600) and Source Serif 4 for display headings (weight 600). Open Sans is banned.
  - Design Lint: An automated AST/regex validator (`scripts/design-lint.mjs`) is integrated into the pre-commit and CI test gate to ban blue accents, CSS gradients, uppercase text, monospace fonts, and heavy outlines.
- **Rationale**: Aligns strictly with Section 4 and ensures a consistent visual standard.

---

## Decision 010: Anti-Regression Infrastructure (Ledger, Manifest, and Monotonic Ratchet)
- **Date**: 2026-10-28
- **Context**: To guarantee that future iterations cannot drop routes, features, or tests.
- **Decision**:
  - Implement a three-part validation harness:
    1. `docs/feature-ledger.json` tracking all 80 features (F-001 through F-080) and FR-01 through FR-55.
    2. `docs/route-manifest.json` declaring all 120+ registered routes with required capabilities.
    3. `scripts/ratchet-check.mjs` verifying that metrics (`routes_registered`, `ledger_built`, `tests_passing`, `permission_cells`) never decrease.
- **Rationale**: Ensures continuous cumulative growth and prevents unintended code regressions.

---

## Decision 011: SAP Fiori Horizon Shell + AWS Cloudscape Data Patterns (White Theme Realignment)
- **Date**: 2026-10-28
- **Context**: Per user instruction (PATCH 1, 2, and 3), Section 4 of the master prompt was completely replaced with the SAP Fiori Horizon Shell and AWS Cloudscape Data Patterns specification. The old "Banned: any blue accent / blue links" rules and previous tokens were deleted.
- **Decision**:
  - Replaced design tokens with official Fiori/Cloudscape variables:
    - Canvas `#F5F6F7`, Surface `#FFFFFF`, Border 1px `#D5DADD`, Text `#1D2D3E`, Secondary text `#556B82`.
    - Single accent: Horizon blue `#0070F2` (hover `#005FD1`, active `#004EB0`, tint `#EBF4FE`).
    - Semantic: Negative `#D20A0A` (`#FDEDED`), Critical `#E76500` (`#FEF3EB`), Positive `#256F3A` (`#EDF7ED`), Informative `#0070F2` (`#EBF4FE`).
    - Radius: 8px on controls, 12px on containers. Shadows only on popovers and drawers.
    - 4px spacing grid. Page padding 32px.
  - Typography: ONE family, Open Sans (self-hosted), with Noto Sans Devanagari, Kannada, and Tamil at matching weights. Sizes 12 / 14 / 16 / 20 / 28. Weights 400 and 600 only. Banned serif and monospace.
  - Shell (Fiori): 52px white shell bar with 1px bottom border, 256px side navigation with light blue tint fill and blue text for selected items.
  - Dashboards (Patch 3): At most 3 to 4 numeric tiles for persona primary measures, everything else as Cloudscape key-value lists or tables. "Needs attention" as actionable row lists.
  - Loop Protocol (Patch 2): Replaced steps 5 to 7 with the strict Gate (tsc, ESLint, design-lint, unit/integration tests, axe zero serious/critical, Playwright layout check at 1440x900) and design critique (Pattern test and Flop test, score >= 8).
  - Design Lint: Updated `scripts/design-lint.mjs` to strictly enforce these tokens and fail on hex colors outside tokens, serif, monospace, gradients, uppercase/tracking, and shadows outside popovers/drawers.
- **Rationale**: Complies with Patch 1, Patch 2, and Patch 3 requirements for enterprise-grade product precision.

---

## Decision 012: Addendum v3.1 Architecture — Ecosystem Layers 1–4, Field Telemetry, and Constraint Overrides
- **Date**: 2026-10-29
- **Context**: The NGO founder reviewed the prototype and provided directive inputs ("Might try to integrate if it is missing, so we can address what is required") introducing four overarching ecosystem layers, a Senior Field Associate (SF) role, and operational field telemetry.
- **Decisions**:
  1. **Field View Mobile Layout Exception (`/field/*`)**: While the primary enterprise platform remains desktop-first (1440×900), `/field/*` is designed mobile-first (360–430px) and displayed inside a centered 480px column on desktop. Features touch targets $\ge 48$px, base type 18px, larger-text toggle to 22px, and high-contrast mode (contrast ratio $\ge 7:1$).
  2. **Coarse Geo-Stamping Policy (No Continuous Tracking)**: Continuous GPS tracking and real-time maps remain strictly banned. Field activity logging captures a single, consent-gated, coarse ($\approx 1$ km, 2-decimal) coordinate simulated from the chapter's geofence. Staff see area labels (e.g., "Hubballi Central"), never raw coordinates (except SA metadata view). A prominent privacy notice informs the user what is recorded.
  3. **Simulated Partner & Telemetry Integrations**: Partner routing, voucher issuance/redemption, webinar hosting, WhatsApp dispatches, and PDF signatures are simulated with explicit "Simulated" badges.
  4. **WebCrypto AES-GCM Encrypted Files**: Field logs and pro-bono legal intakes are encrypted client-side using WebCrypto AES-GCM with wrapped demo keys and audited access logs.
  5. **Tamper-Evident Impact Packs & Public Verification**: Reports generate a tamper-evident PDF with SHA-256 content hashing, version metadata, issuer ID, synthetic watermark, and registration in an export hash chain. A public, unauthenticated `/verify` route verifies uploaded or code-matched PDFs.
  6. **Coarse Vaccination Status Capture**: Captures self-reported status for 5 categories (Influenza, Pneumococcal, COVID-19, Shingles, Tetanus/Td; values Yes/No/Unsure/Not asked) under a feature flag. Strictly no certificates or clinical records; exposed exclusively as aggregate telemetry.
  7. **Role CD Renamed**: CSR / Government / Policy Reviewer, partitioned with audience-scoped impact packs (CSR vs Government).
  8. **Advanced Referrals Activated**: Activated by default to support Layer 1 Partner Routing Fabric.
  9. **Strict Non-Advice Disclaimer**: The platform explicitly provides no financial, legal, or insurance advice. Permanent institutional notices accompany all referral workflows.
  10. **Design System & Palette Alignment**: The design system strictly adheres to Master Prompt v3 (Forest Green `#1F5F4B` accent, Source Serif 4 headings + IBM Plex Sans body, Lucide 1.5 stroke icons, zero blue accents, zero gradients, zero strobing).
- **Rationale**: Aligns with Addendum v3.1 Section 1 and codifies founder requirements while upholding ethical data-minimization boundaries.



