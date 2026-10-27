# VAYOSHRESHTHA — Digital Senior-Care Ecosystem
### Complete Frontend Web-App Prototype for NGO Vayoh Vikas

A comprehensive, production-grade, front-end-only web application prototype designed for the NGO **Vayoh Vikas** to support eldercare operations across **Ekta Hubs** community centres. This prototype codifies all **55 Functional Requirements (FR-01 to FR-55)** across **92 distinct screens**, supporting 10 distinct institutional personas with a 5-layer simulated Role-Based Access Control (RBAC) engine.

---

## 1. Quick Start

### Prerequisites
- Node.js 18+ (tested on Node v22.18.0)
- npm 9+

### Installation & Launch
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (starts at http://127.0.0.1:5173/)
npm run dev

# 3. (Optional) Build production bundle and preview
npm run build
npm run preview
```

---

## 2. Testing Commands

The project includes unit tests, property-based tests (fast-check), and cross-module integration tests with V8 coverage enforcement:

```bash
# Run all 13 test suites (66 tests)
npm test

# Run tests in watch mode
npm run test:watch

# Run unit & domain coverage check (enforces ≥90% domain/permissions and ≥80% branches)
npm run test:coverage

# TypeScript strict type-check without emit
npx tsc --noEmit
```

---

## 3. Demo Persona Credentials (All 10 Roles)

All staff and external partner accounts use the fixed prototype password:  
**`Demo@1234`**  
Senior citizens and family proxies authenticate via Mobile Number + OTP:  
**Mock OTP: `123456`**

> 💡 **Quick Login:** The `/login` page includes a **"Prototype Quick Access"** panel featuring one-click buttons to immediately sign in as any of the 10 personas without manual typing.

| Role Code | Role Name | Demo Email / Mobile | Primary Scope & Permissions |
|---|---|---|---|
| **SA** | System Administrator | `rajesh.admin@vayohvikas.org` | System settings, user accounts, integration monitor, audit logs. **Strictly NO clinical access.** |
| **NM** | NGO Management | `vandana.sharma@vayohvikas.org` | Executive governance, partner approvals, CSR report releases, audit summaries. |
| **PM** | Programme Manager | `arjun.nambiar@vayohvikas.org` | Organisation-wide operations: programmes, follow-ups, reports, templates. |
| **CC** | Centre Coordinator (Pune) | `sunita.patil@vayohvikas.org` | Assigned hub (`HUB-PUN`) only: attendance, registrations, follow-ups, corrections. |
| **CC-2**| Centre Coordinator (Nashik)| `anand.deshmukh@vayohvikas.org`| Assigned hub (`HUB-NSK`) only — verifies horizontal centre isolation. |
| **VF** | Volunteer / Field Staff | `pooja.shinde@vayohvikas.org` | Assigned hub & sessions: assisted registration, attendance marking, masked phones. |
| **SP** | Approved Service Partner | `dr.kulkarni@sanctuaryclinic.org`| Sanctuary Elder Clinic: view assigned referrals with minimized data (DOB as age band). |
| **SP-2**| Approved Service Partner | `adv.mehta@justiceelders.org` | Legal Aid Foundation — verifies horizontal partner isolation. |
| **CT** | Care Team / Human Expert | `meera.socialworker@vayohvikas.org`| Non-clinical elder triage, warning-sign escalations with SLA countdown. |
| **CD** | CSR / Donor Reviewer | `vikram.tata@tatatrusts.org` | Aggregate operational & CSR reports only. Zero PII; counts < 5 suppressed to `<5`. |
| **SC** | Senior Citizen | `9822012345` (OTP: `123456`) | Self-service portal (`/me`): large text (18px base), bookings, messages, WhatsApp simulator. |
| **FM** | Authorised Family Member | `9822019999` (OTP: `123456`) | Proxy portal (`/family`): linked seniors with recorded consent, book on behalf. |

---

## 4. How to Reset Demo Data

The prototype seeds **1,000 synthetic seniors**, 6 Ekta Hubs, 24 programmes, ~600 sessions, ~350 referrals, ~40 escalations, and ~2,000 messages deterministically into browser `localStorage` (`vayoshrestha_store_v1`).

To reset the mock store to its clean initial seed:
1. **Via UI:** Log in as System Administrator (`SA`) or Programme Manager (`PM`), navigate to **Admin Settings** (`/admin/settings`), and click the **"Reset Demo Data to Initial Seed"** button with confirmation.
2. **Via DevTools Console:**
   ```javascript
   localStorage.removeItem('vayoshrestha_store_v1');
   location.reload();
   ```

---

## 5. Architectural Compliance & Design System

- **Desktop-First Standard:** Designed for 1440×900 desktop displays (minimum supported width: 1280px).
- **Institutional Editorial Palette:**
  - Background: `#FFFFFF` / Subtle Surface: `#F7F6F3` / Hairline Border: `#E4E2DC`
  - Text Primary: `#1C1B19` / Muted Text: `#5F5C55`
  - Accent: Single Forest Green `#1F5F4B` (Hover `#174A3A`, Tint `#E8F1ED`)
  - Strict Prohibitions Enforced: Zero purple/blue accents, zero dark mode, zero gradients, zero glassmorphism, zero stock hero photos.
- **Typography:** Headings in **Source Serif 4** (600), UI body in **IBM Plex Sans** (14px staff, 18px senior base), tabular numerals for all data columns, and **Noto Sans Devanagari** fallback for Hindi copy.
- **5-Layer RBAC Security:**
  1. Route Guards with `<GuardedRoute>`
  2. Permission-filtered sidebar navigation
  3. Declarative `<Can>` component UI gates
  4. Mock API `authorize(user, capability, action, resource)` checks
  5. Field-level data masking (phone masking `••••••1234`, age bands, small-number suppression `<5`).
- **Data Minimisation & Non-Clinical Notice:** No Aadhaar numbers or medical histories are collected. A permanent institutional notice appears on all health triage views:  
  *“Vayoshreshtha does not diagnose or give clinical advice. Health-related requests are routed to qualified professionals.”*

---

## 6. Project Documentation Index

- `docs/PLAN.md` — P0 architectural breakdown and implementation roadmap
- `docs/PAGE_SPECS.md` — Detailed UX & interaction specifications for all 92 screens
- `docs/RBAC_MATRIX.md` — Complete 10 roles × 31 capabilities permission matrix
- `docs/DESIGN_SYSTEM.md` — CSS variable design tokens, typography, and component styling rules
- `docs/API_CONTRACT.md` — Typed request/response specifications for mock API endpoints
- `docs/SECURITY_FINDINGS.md` — Phase P6 frontend penetration testing report (12 findings)
- `docs/SCALE_REPORT.md` — Phase P7 scale & break testing report (1k to 145k seniors)
- `docs/DEMO_SCRIPT.md` — 15-minute scripted walkthrough demonstrating role views and isolation
- `docs/DECISIONS.md` — Architecture decisions and rationale log
- `docs/STATE.md` — Project backlog, completed loops, and phase verification gates
- `docs/LOOP_LOG.md` — Detailed loop-by-loop engineering log
