# VAYOSHRESHTHA — COMPLETE PRODUCT v3
### Enterprise Web-App Platform for NGO Vayoh Vikas

A complete, full-breadth front-end-only web application prototype built for the NGO **Vayoh Vikas** to orchestrate the entire **Vayoshreshtha** Digital Senior-Care Ecosystem.

Built according to the unified **VAYOSHRESHTHA v3 Master Specification**:
- **Full Community Platform (Loops A–L):** Ekta Hub chapter operations, programmes & sessions, high-contrast 48px tactile attendance with auto-lock countdown, multi-lingual WhatsApp communication hub & audience broadcasts, services directory & referral tracking, external Partner Portal (`SP`), feedback collection & engagement index, assisted health support & triage, CSR reporting builder, complaints governance, Senior Citizen self-service portal (`/me/*`), and Family Caregiver portal (`/family/*`).
- **Core Pilot Modules:** Real-time Emergency SOS incident board with sub-second dashboard latency, cellular fallback SMS to next-of-kin during mobile data disconnects, 08:00 AM scheduled medication reminders, BP/glucose logging with non-clinical anomaly escalation, and 7-step assisted onboarding with duplicate phone detection and ABHA Phase 2 structural linkage.
- **Role-Based Access Control (RBAC):** 12 distinct personas (`SA`, `NM`, `RA`, `CM`, `VF`, `CT`, `CD`, `PM`, `SP`, `SC`, `FM`, `NK`) with fine-grained capability gating and automatic geographic/chapter scope isolation.
- **Zero Backend Architecture:** Runs entirely in modern browsers using an in-memory event queue (`BroadcastChannel`), simulated WhatsApp & SMS gateways, deterministic seed dataset, and versioned offline `localStorage` (`vayoshrestha_store_v3`).
- **Design System:** Calm, authoritative enterprise aesthetic (Forest Green `#1F5F4B` accent, `#F7F6F3` canvas, hairline `#E4E2DC` borders, IBM Plex Sans body, Source Serif 4 headings, tabular numerals, 0 blue accents, 0 gradients).
- **Anti-Regression Safeguards:** Monitored via machine-readable Feature Ledger (`docs/feature-ledger.json`, 80 features), Route Manifest (`docs/route-manifest.json`, 123 routes), and a monotonic ratchet check (`npm run ratchet`).

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v20 / v22)
- npm 9+

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (starts on http://localhost:3000/)
npm run dev

# 3. Production build and preview
npm run build
npm run preview
```

---

## 2. Test Suites & Verification Gates

The prototype includes an automated test and architectural compliance pipeline:

```bash
# Run all unit and integration test suites (95+ tests)
npm test

# Full Verification Gate (TypeScript + Design Lint + Tests + Ledger + Manifest + Ratchet)
npm run gate:full

# Individual verification scripts:
npm run design:lint      # AST/regex lint enforcing Section 4 tokens (0 violations)
npm run ledger:check     # Feature ledger consistency check (80 Built features)
npm run manifest:check   # 100% parity check between router and route manifest
npm run ratchet          # Monotonic check ensuring features/routes never decrease
```

---

## 3. Demo Persona Credentials (All 12 Personas)

All staff accounts use the prototype password:  
**`Demo@1234`**  
MFA TOTP code for System Administrator (`SA`) and NGO Management (`NM`):  
**`123456`**

> 💡 **Quick Switcher:** The `/login` page and the Top Bar include a **"Prototype Access"** menu allowing instant one-click switching to any persona without logging out.

| Role Code | Role Name | Demo Email | Primary Scope & Access |
|---|---|---|---|
| **SA** | System Administrator | `admin@vayohvikas.org` | Users, roles, system configuration, audit logs. **Strictly NO clinical/health logs.** |
| **NM** | NGO Management | `meera.director@vayohvikas.org` | Executive leadership, maker-checker approvals, outcome reporting, governance. |
| **RA** | Regional Admin | `suresh.south@vayohvikas.org` | Regional emergency alerts, SLA escalations, chapter oversight (**South Region only**). |
| **CM** | Chapter Manager | `sunita.pune@vayohvikas.org` | Ekta Hub operations, attendance locking, wellness check-in calls (**Pune Hub only**). |
| **VF** | Field Volunteer | `pooja.deshmukh@vayohvikas.org` | Assisted onboarding, attendance marking, assigned calls (**Masked phone numbers**). |
| **CT** | Care Team / Responder | `dr.swaminathan@vayohvikas.org` | Crisis responder (**Assigned cases only; contact access expires 24h post-closure**). |
| **CD** | CSR / Donor Reviewer | `csr.grant@hdfcbank.org` | Institutional outcome reports (**Aggregates only, zero PII, small numbers <5 suppressed**). |
| **PM** | Programme Manager | `vikram.programmes@vayohvikas.org` | Programme design, session scheduling, syllabus and capacity management. |
| **SP** | Service Partner | `partner.aarogya@healthcare.in` | External referral fulfilment via dedicated **Partner Portal** (`/partner/*`). |
| **SC** | Senior Citizen | `+91 98220 11223` | Elder self-service via **Senior Portal** (`/me/*`) and WhatsApp bot. |
| **FM** | Family Member | `+91 98220 55443` | Elder caregiver via **Family Portal** (`/family/*`) and proxy approvals. |
| **NK** | Next-of-Kin | `+91 98220 99887` | Receives cellular fallback SMS (**Transactional SMS phone simulator pane**). |

---

## 4. Key Platform Features & Guided Walkthroughs

### A. Two-Tab Real-Time Emergency SOS Alerting
1. Open **Tab 1** at `http://localhost:3000/simulator`.
2. Open **Tab 2** at `http://localhost:3000/login`, select **"Regional Admin (RA)"**, and open `/sos`.
3. In Tab 1, toggle **"Simulate data disconnect"** to **ON** (cellular fallback mode).
4. Tap **"🚨 Trigger Emergency SOS"** in the Senior WhatsApp phone.
5. Within **< 1,000 ms** (typically 120–180 ms via `BroadcastChannel`), the Regional Admin board triggers a critical red alert banner with live SLA countdown and measured latency telemetry, while the Next-of-Kin phone pane immediately displays the priority GSM transactional SMS.

### B. Ekta Hub Attendance & Auto-Lock Countdown
1. Log in as Chapter Manager (`CM`) and navigate to `/attendance`.
2. Open an active session (e.g. `/attendance/session/sess-101`).
3. Use the **48px high-contrast touch targets** to mark attendance (`Present`, `Absent`, `Late`).
4. Test walk-in registration with immediate duplicate phone checking.
5. Sessions auto-lock 2 hours after conclusion. Corrections post-lock require maker-checker approval via `/attendance/corrections`.

### C. External Partner Portal
1. Log in as Service Partner (`SP`) to arrive at `/partner/home`.
2. Review assigned health and eldercare referrals, update fulfilment milestones, and record dispatch timestamps.

### D. Senior Citizen (`/me`) & Family (`/family`) Portals
1. Switch to Senior Citizen (`SC`) to access `/me`: high-legibility interface with direct access to hub programmes, bookings, health vitals, emergency contacts, and one-tap SOS.
2. Switch to Family Member (`FM`) to access `/family`: remote caregiver dashboard with wellness vitals tracking, past SOS history, and authorized proxy consents.

---

## 5. Documentation Sitemap (`docs/`)

- [`docs/FEATURE_LEDGER.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/FEATURE_LEDGER.md) & [`docs/feature-ledger.json`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/feature-ledger.json) — Complete 80-feature tracking matrix.
- [`docs/route-manifest.json`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/route-manifest.json) — Complete 123-route registry mapped to capability permissions.
- [`docs/ratchet.json`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/ratchet.json) — Monotonic counters preventing feature or route regression.
- [`docs/DEMO_SCRIPT.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/DEMO_SCRIPT.md) — 15-minute guided master evaluation script.
- [`docs/DECISIONS.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/DECISIONS.md) — Architecture decisions log (including v3 full platform unification).
- [`docs/SECURITY_FINDINGS.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/SECURITY_FINDINGS.md) — Pentest report (22 numbered vulnerabilities across 11 threat categories).
- [`docs/SCALE_REPORT.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/SCALE_REPORT.md) — Stress and capacity report (1,000 to 145,000 seniors capacity assessment).
- [`docs/API_CONTRACT.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/API_CONTRACT.md) — TypeScript domain interfaces and backend integration schema.
- [`docs/DESIGN_SYSTEM.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/DESIGN_SYSTEM.md) — Design tokens, typography, and accessibility standards.
