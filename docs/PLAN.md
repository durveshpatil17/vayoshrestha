# VAYOSHRESHTHA — Master Architecture & Implementation Plan

## 1. Project Overview & Scope
Vayoshreshtha is a digital eldercare ecosystem designed for the NGO **Vayoh Vikas** to manage 1,000 senior citizens across 6 Ekta Hubs during a 90-day pilot.
This repository implements a **complete, front-end-only, zero-backend web-app prototype** with simulated in-browser persistence, robust role-based access control (RBAC), deterministic synthetic seed data, and a suite of 92 distinct screen specifications.

---

## 2. Core Constraints & Principles
1. **Zero External Backend**: Completely self-contained in the browser using a mock API layer over `localStorage`.
2. **Desktop Canvas First**: Standardized for 1440×900 desktop viewport (minimum width 1280px).
3. **Calm, Institutional Design Language**: Strictly white background, forest green `#1F5F4B` accent, subtle surface `#F7F6F3`, 1px hairlines `#E4E2DC`, zero blue accents, zero gradients, zero dark mode, Source Serif 4 headings + IBM Plex Sans body.
4. **Data Minimization & Ethical Eldercare**: No Aadhaar, no biometric capture, no clinical diagnosis. Mandatory non-clinical disclaimer on all health routing.
5. **Strict Scope Isolation & 5-Layer RBAC**: Default-deny security model spanning route guards, sidebar filtering, `<Can>` component gates, mock API authorization, and field masking.

---

## 3. System Architecture Layers
The directory layout mirrors the specified architecture:

```
src/
├── api/                  # Typed endpoint contracts and mock client adapter
│   └── contracts.ts      # Single source of truth for all request/response models
├── domain/               # Pure business logic functions (100% unit-testable)
│   ├── idGenerator.ts    # VV-<centre>-<yy>-<sequence> format
│   ├── duplicateCheck.ts # Name + DOB + Phone duplicate scoring
│   ├── capacity.ts       # Booking waitlist and auto-promotion logic
│   ├── attendance.ts     # Lock window calculation and correction requests
│   ├── consent.ts        # Opt-in/opt-out gating and channel validation
│   ├── referrals.ts      # Referral finite-state machine
│   ├── escalation.ts     # Warning signs keyword matching & SLA clock
│   ├── metrics.ts        # Registered, Active, Participant, Total vs Unique
│   └── masking.ts        # Phone masking and small-number suppression (<5)
├── permissions/          # Single source of truth for authorization
│   ├── matrix.ts         # Machine-readable permission matrix (10 roles × 31 capabilities)
│   ├── authorize.ts      # Scope evaluation (centre, own, linked, assigned)
│   └── Can.tsx           # Declarative React authorization gate
├── mock/                 # In-browser simulated backend
│   ├── store.ts          # Namespaced localStorage repository
│   ├── seed.ts           # Deterministic Faker (en_IN) seed dataset
│   ├── handlers/         # Simulated API endpoints with delay and auth checks
│   └── backgroundJobs.ts # Mock notification queue worker & reminder scheduler
├── store/                # Zustand client state (Session, Filters, UI preferences)
│   └── authStore.ts      # Active user, MFA state, role switching
├── components/           # Reusable UI component kit
│   ├── layout/           # AppShell, TopBar, Sidebar, Breadcrumb, Ribbon
│   ├── ui/               # Restyled buttons, inputs, dialogs, tables, chips, tabs
│   ├── data/             # Virtualized DataTable, FilterBar, ExportDialog
│   └── feedback/         # Skeletons, EmptyState, ErrorBoundary, Forbidden403
├── pages/                # 92 route pages grouped by module (A through O)
└── routes/               # React Router v6 data router configuration
```

---

## 4. Execution Phases

| Phase | Description | Deliverables & Quality Gates |
|---|---|---|
| **P0: Planning** | System architecture, Page specs, RBAC matrix, Design tokens | `PLAN.md`, `PAGE_SPECS.md`, `RBAC_MATRIX.md`, `DESIGN_SYSTEM.md`, `DECISIONS.md`, `matrix.ts` |
| **P1: Foundation** | Scaffold, design tokens, UI kit, permission engine, mock API, seed data, shell | Vitest test suite for permissions, domain logic, mock store, auth flows; green lint and `tsc` |
| **P2: Modules (Loops 1–12)** | Implementation of all 92 pages across 15 sub-domains (A to O) | Each module verified at 1440×900 for permitted and forbidden roles, zero serious a11y defects |
| **P3: Test Hardening** | Unit & property testing | Vitest coverage >= 90% in `domain/` and `permissions/`, fast-check property tests |
| **P4: Integration Tests** | End-to-end multi-role browser simulation | Member lifecycle, Programme-booking-waitlist, Attendance correction, Referral & SLA |
| **P5: E2E & Accessibility** | Role-based browser testing and screenshots | Playwright test suites per role, axe-core clean, screenshots saved to `docs/screens/` |
| **P6: Security Testing** | Frontend vulnerability assessment | `docs/SECURITY_FINDINGS.md` (Report only, no code modifications) |
| **P7: Scale & Stress Testing** | Synthetic load and data scaling | `docs/SCALE_REPORT.md` (1k to 145k seed simulation, stress report) |
| **P8: Handover** | Documentation and walkthrough script | `README.md`, `docs/DEMO_SCRIPT.md`, final executive summary |
