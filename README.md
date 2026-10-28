# VAYOSHRESHTHA — PILOT FRONTEND PROTOTYPE v2
### Complete Web-App Prototype for NGO Vayoh Vikas

A complete, front-end-only web application prototype built for the NGO **Vayoh Vikas** to manage the **Vayoshreshtha** eldercare pilot (1,000 senior citizens across 9 Ekta Hubs, 3 Regions, 90-day duration).

Built strictly according to the **Master Product Specification**:
- **Module 1 (Safety & SOS):** Real-time Emergency SOS routing with simulated sub-second dashboard latency, cellular fallback SMS to next-of-kin during mobile data drops mid-transaction, live SLA countdown, non-strobing alert banner, and drill mode.
- **Module 2 (Preventive Health):** Scheduled 08:00 AM medication reminders, quick-reply confirmations (Taken/Not yet/Skip), BP/glucose text logging, and non-clinical anomaly escalation to Chapter Managers for wellness check-in calls with clinician placeholder thresholds.
- **Module 3 (Civic & Profile):** Structured senior onboarding (WhatsApp bot script and assisted web wizard) with ABHA format validation (`XX-XXXX-XXXX-XXXX`), separate ABDM consent, and Phase 2 linkage tags (structure only).
- **Zero Backend:** Runs entirely in the browser using an in-memory event queue (`BroadcastChannel`), simulated WhatsApp and SMS gateways, deterministic seed data, and versioned `localStorage` (`vayoshrestha_store_v2`).
- **White Theme Only:** Forest green (`#1F5F4B`) accents, subtle surface (`#F7F6F3`), hairline borders (`#E4E2DC`), Source Serif 4 headings, IBM Plex Sans body, tabular numerals, and zero blue accents or gradients.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v20/v22)
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

## 2. Test Suites & Verification Commands

All unit, property-based, and cross-module integration tests pass 100% green:

```bash
# Run all 20 test suites (95 tests)
npm test

# Run tests in watch mode
npm run test:watch

# Run test coverage enforcement
npm run test:coverage

# TypeScript strict typecheck (zero errors)
npx tsc --noEmit
```

---

## 3. Demo Persona Credentials (All 10 Personas)

All staff accounts use the prototype password:  
**`Demo@1234`**  
MFA TOTP code for System Administrator (`SA`) and NGO Management (`NM`):  
**`123456`**

> 💡 **Quick Login:** The `/login` page includes a **"Prototype Access"** panel featuring one-click buttons to sign in immediately as any of the roles without typing credentials.

| Role Code | Role Name | Demo Email | Primary Scope & Enforced Access |
|---|---|---|---|
| **SA** | System Administrator | `admin@vayohvikas.org` | Users, roles, system settings, integrations, audit logs. **Strictly NO health/clinical logs.** |
| **NM** | NGO Management | `meera.director@vayohvikas.org` | Organization-wide leadership oversight, governance approvals, pilot outcomes. |
| **RA** | Regional Admin | `suresh.south@vayohvikas.org` | Regional emergency alerts, SLA escalations, chapter oversight (**South Region only**). |
| **CM** | Chapter Manager | `sunita.pune@vayohvikas.org` | Runs Ekta Hub operations, works wellness check-in calls (**Pune Chapter only**). |
| **VF** | Field Volunteer | `pooja.deshmukh@vayohvikas.org` | Assisted onboarding, assisted logging (**Assigned Pune seniors only, masked contacts**). |
| **CT** | Care Team / Responder | `dr.swaminathan@vayohvikas.org` | Human crisis responder (**Assigned cases only; contact access expires 24h post-closure**). |
| **CD** | CSR / Donor Reviewer | `csr.grant@hdfcbank.org` | Institutional outcome reports (**Aggregates only, zero PII, small numbers <5 suppressed**). |
| **SC** | Senior Citizen | `+91 98220 11223` | WhatsApp senior chat (**Senior phone simulator pane**). |
| **NK** | Next-of-Kin | `+91 98220 99887` | Receives cellular fallback SMS (**NO web login; SMS simulator pane**). |

---

## 4. How to Run Key Features & Demos

### A. The Two-Tab Real-Time SOS Demo (Multi-Tab BroadcastChannel)
1. Open **Tab 1** at `http://localhost:3000/simulator`.
2. Open **Tab 2** at `http://localhost:3000/login`, click **"Regional Admin (RA)"**, and navigate to `/sos` (Live SOS Board).
3. Arrange Tab 1 and Tab 2 side-by-side on your 1440×900 display.
4. In Tab 1, toggle **"Simulate data disconnect"** to **ON** (red).
5. In the Senior WhatsApp phone, tap **"🚨 Trigger Emergency SOS"**.
6. **Watch in real time (< 1 second):**
   - Senior phone receives instant acknowledgement (*"Help is being alerted..."*).
   - Next-of-Kin phone receives priority transactional SMS (*"EMERGENCY: Smt. Shakuntala Devi triggered an SOS..."*).
   - Regional Admin board in Tab 2 lights up with a **persistent red critical alert banner**, live age timer, and measured latency ticker (typically 120–180 ms).

### B. Using the Time Machine (08:00 AM Reminder Burst)
1. In the top navigation bar (or dev panel via `?dev=1`), locate the **Time Machine** control.
2. Click **"Jump to 08:00 IST (Fire Morning Reminders)"**.
3. Open `/simulator`: the senior receives the utility prescription reminder with buttons `[ Taken ]` `[ Not yet ]` `[ Skip ]` and a blood pressure prompt.
4. Reply with an elevated reading like `165/105`.
5. Switch to `/health/flags` as Chapter Manager (`CM`) to inspect the newly raised anomaly flag and initiate the **non-clinical wellness check-in call script**.

### C. Resetting Demo Data to Clean Seed
1. Navigate to `/admin/settings` as System Administrator (`SA`).
2. Click **"Reset Demo Seed Data"** in the page header.
3. Confirm the modal prompt: `localStorage` key `vayoshrestha_store_v2` is wiped and immediately re-seeded with the deterministic 1,000-senior dataset.

---

## 5. Documentation Sitemap (`docs/`)

- [`docs/PLAN.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/PLAN.md) — Master implementation plan and phase breakdown.
- [`docs/PAGE_SPECS.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/PAGE_SPECS.md) — Detailed UI/UX and functional specification for all 45 routes.
- [`docs/RBAC_MATRIX.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/RBAC_MATRIX.md) — Complete 8-role × 28-capability permission matrix.
- [`docs/DESIGN_SYSTEM.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/DESIGN_SYSTEM.md) — Design tokens, typography (Source Serif 4 + IBM Plex Sans), and banned aesthetic patterns.
- [`docs/API_CONTRACT.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/API_CONTRACT.md) — Typed data contracts for future server-side backend migration.
- [`docs/DECISIONS.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/DECISIONS.md) — Architecture and design decisions log.
- [`docs/ROADMAP.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/ROADMAP.md) — Post-pilot roadmap items (ABHA Phase 2 federated linkage, CSR custom report builder, family portal, AI voice calls).
- [`docs/DEMO_SCRIPT.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/DEMO_SCRIPT.md) — Step-by-step 10-minute master demonstration walkthrough.
- [`docs/SECURITY_FINDINGS.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/SECURITY_FINDINGS.md) — Phase P6 pentest report (22 numbered vulnerabilities across 11 threat categories).
- [`docs/SCALE_REPORT.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/SCALE_REPORT.md) — Phase P7 stress and capacity report (benchmarking 1k to 145k seniors, sub-second SOS latency audit).
- [`docs/screens/`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/screens/) — Evidence screenshots captured at 1440×900 desktop viewport.
- [`docs/STATE.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/STATE.md) & [`docs/LOOP_LOG.md`](file:///Users/durveshpatil/Downloads/vayoshrestha/docs/LOOP_LOG.md) — Loop protocol engineering log.
