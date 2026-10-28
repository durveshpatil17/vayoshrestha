# VAYOSHRESHTHA v2 — Master Architecture & Implementation Plan

## 1. Project Overview & Scope
Vayoshreshtha is a digital eldercare ecosystem designed for the NGO **Vayoh Vikas** to manage 1,000 senior citizens across 9 Ekta Hub chapters (in 3 regions) during a 90-day pilot.
Per Hard Constraint 1, the pilot is strictly bounded to the **core high-value operational tranche**:
1. **Module 1**: Core Safety Pillar — Emergency SOS Routing with Cellular Fallback SMS
2. **Module 2**: Preventive Health Pillar — Medication & Vital Logs with Anomaly Triage
3. **Module 3**: Civic & Profile Pillar — Secure Onboarding with ABHA-ready profile structure
Plus the required operational foundations (login, 5-layer RBAC, senior profiles, chapters, WhatsApp/SMS simulation, dashboards, audit, admin). All non-core modules are documented in `docs/ROADMAP.md` as "later phases".

---

## 2. Hard Constraints & Operational Principles
1. **Zero Backend**: All state persisted to browser `localStorage` under versioned namespaced storage (`vayoshrestha_store_v2`).
2. **Multi-Tab Cross-Talk via BroadcastChannel**: The senior simulator in Tab A drives the live SOS Board in Tab B in real-time, computing simulated enqueue-to-dashboard latency in milliseconds.
3. **Desktop Canvas (1440×900)**: Minimum 1280px width. Senior citizen mode is rendered strictly inside an unbranded phone-frame simulator.
4. **Institutional Editorial Design**: Crisp white theme (`#FFFFFF`), subtle surfaces (`#F7F6F3`), hairline borders (`#E4E2DC`), forest green accent (`#1F5F4B`), Source Serif 4 headings + IBM Plex Sans body. Zero gradients, zero neon, zero glassmorphism.
5. **Non-Strobing Urgency**: SOS board uses a persistent red banner, distinct row highlights, optional chime toggle, and browser tab title badges `(🚨 X)`. Respects `prefers-reduced-motion`.
6. **Data Minimization & Ethical Eldercare**: No Aadhaar, no biometric capture, no clinical diagnoses. Thresholds are clearly labelled as clinician placeholders.
7. **ABHA Structure-Only**: 14-digit format validation (`XX-XXXX-XXXX-XXXX`), separate ABDM consent, never marked "verified", with disabled "Link ABHA" button tagged **Phase 2**.
8. **Cellular Fallback SMS**: If data drops mid-SOS, automatically pushes transactional SMS to pre-registered Next-of-Kin.

---

## 3. System Architecture Layers

```
src/
├── api/
│   └── contracts.ts        # Typed TypeScript contracts for all pilot entities
├── domain/                 # Pure business logic functions (100% unit testable)
│   ├── sos.ts              # SOS state machine, SLA timer, escalation chain
│   ├── fallback.ts         # Cellular fallback decision engine & contact priority
│   ├── vitalsParser.ts     # BP & Glucose text parser (e.g. 130/85, 112 mg/dl)
│   ├── thresholds.ts       # Risk band evaluation (Normal, Watch, High-Risk, Critical)
│   ├── reminders.ts        # 08:00 IST scheduler, quiet hours, compliance metrics
│   ├── onboarding.ts       # Bot onboarding script state machine & resume
│   ├── abha.ts             # 14-digit format validation & masking (Phase 2 ready)
│   ├── idGenerator.ts      # VV-<chapter>-<yy>-<sequence> format
│   ├── duplicateCheck.ts   # Name, phone, DOB duplicate detection
│   ├── masking.ts          # Phone masking, age bands, small-number <5 suppression
│   └── metrics.ts          # Registered vs 1000, Active (14d), compliance rates
├── permissions/
│   ├── matrix.ts           # 10 roles (8 web + SC + NK) × 28 capabilities
│   ├── authorize.ts        # 5-layer authorization engine (region, chapter, case, own)
│   └── Can.tsx             # Declarative React UI gate
├── mock/
│   ├── store.ts            # Namespaced localStorage repository
│   ├── seed.ts             # Deterministic Faker (en_IN) seed dataset (1,000 seniors + 200 stalled)
│   ├── eventQueue.ts       # In-browser event queue with latency measurement
│   ├── whatsappGateway.ts  # Webhook handler & WhatsApp delivery simulation
│   └── smsGateway.ts       # Transactional SMS gateway with retry & NOK fallback
├── store/
│   └── authStore.ts        # Zustand auth state, active persona switching, active scope
├── components/             # Reusable UI component kit (layout, data, ui, feedback)
├── pages/                  # 45 route pages grouped into Groups A through I
└── routes/                 # React Router v6 data router with <GuardedRoute />
```

---

## 4. Execution Phases & Loop Protocol

| Phase | Output | Exit Gate |
|---|---|---|
| **P0: Planning** | `PLAN.md`, `PAGE_SPECS.md`, `RBAC_MATRIX.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `DECISIONS.md`, `STATE.md`, `LOOP_LOG.md` | All 45 routes specified; RBAC matrix encoded in machine-readable TypeScript |
| **P1: Foundation** | Scaffold, design tokens, UI kit, permission engine, mock event queue, gateways, deterministic seed (1,000 seniors, 9 chapters), auth store, app shell | All domain and permission unit tests green; `tsc --noEmit` clean |
| **P2: Modules** | Loop 1: Onboarding & Profiles<br>Loop 2: Emergency SOS & Fallback<br>Loop 3: Medication & Vital Logs<br>Loop 4: WhatsApp & SMS Simulator + Cross-Tab<br>Loop 5: Dashboards & Shell Controls<br>Loop 6: Reports & Administration | All 45 screens navigable and role-gated; cross-tab SOS real-time verified |
| **P3: Unit Hardening**| Coverage ≥ 90% on `src/domain` and `src/permissions`, ≥ 80% overall; property tests (`fast-check`) | Enforced in `vite.config.ts` |
| **P4: Integration Tests**| Multi-role cross-module integration test suites | All end-to-end flows green |
| **P5: E2E & Visual** | Browser tool verification at 1440×900 across roles; axe accessibility clean; screenshots saved | Zero serious/critical axe defects; visual checklist passed |
| **P6: Security Pentest**| `docs/SECURITY_FINDINGS.md` (Report only; no code changes) | Numbered list of findings across 11 attack vectors |
| **P7: Scale & Break** | `docs/SCALE_REPORT.md` (Report only; no code changes) | Benchmarks for 1k, 5k, 10k, 50k, 145k; bottleneck ranking; <1s latency audit |
| **P8: Handover** | `README.md`, `docs/DEMO_SCRIPT.md`, final master handover summary | Complete delivery |

---

## 5. Loop Protocol Steps 5 to 7

5. **Gate**: tsc, ESLint, design-lint, unit and integration tests, axe (zero serious or critical), AND a Playwright layout check at 1440x900 for every page and allowed role: no element overlaps the shell bar or page header, no horizontal scroll, no truncated labels.
6. **Design critique**: score each page 1 to 10 on hierarchy, spacing and rhythm, typography (incl. Indic scripts), token consistency, correct Fiori/Cloudscape pattern use, state polish, and alignment. Then run two tests: Pattern test (would an SAP or AWS designer accept this as correct use of the pattern?) and Flop test (could this pass as a default shadcn/Tailwind dashboard? Name the elements that fail).
7. **A page is done only if every score is 8 or higher and both tests pass.** Otherwise fix the top 3 weaknesses and repeat, up to 5 times. After 5, log the issue in `docs/STATE.md` as a visible blocker, not as done.
