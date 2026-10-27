# Vayoshreshtha — 15-Minute Demonstration Script

**Document Purpose:** Guided demonstration script for evaluating the Vayoshrestha Digital Senior-Care prototype, showcasing role-based user experiences, data minimization, and horizontal scope isolation.  
**Target Resolution:** 1440 × 900 Desktop Browser  
**Local URL:** `http://127.0.0.1:5173/`

---

## Timeline & Scene Overview

| Time | Persona Demonstrated | Route | Key Feature Showcased |
|---|---|---|---|
| **00:00 – 02:00** | Public & Staff Login | `/login` | Two-tab authentication + 1-Click Prototype Persona Panel |
| **02:00 – 04:00** | Programme Manager (`PM`) | `/`, `/members`, `/programmes` | Pilot KPI strip, 1,000 members, capacity & waitlist promote |
| **04:00 – 06:00** | Centre Coordinator (`CC`) | `/attendance`, `/centres/HUB-PUN` | Scope isolation: Pune CC cannot see Nashik; attendance lock |
| **06:00 – 08:00** | Field Volunteer (`VF`) | `/attendance/session/:id`, `/members/new` | Large-target roster, assisted registration, masked phone with reveal audit |
| **08:00 – 10:00** | Service Partner (`SP`) | `/partner/home`, `/partner/referrals` | Data minimization: DOB shown as age band, status updates |
| **10:00 – 12:00** | Care Team Expert (`CT`) | `/support/escalations/:id` | Non-clinical triage, keyword warning signs, SLA timer |
| **12:00 – 13:00** | Senior Citizen (`SC`) | `/me`, `/me/simulator` | High-contrast 18px portal, bookings, interactive WhatsApp simulator |
| **13:00 – 14:00** | CSR Donor Reviewer (`CD`) | `/reports/overview`, `/reports/csr` | Aggregate-only view: zero PII, small-number suppression (`<5`) |
| **14:00 – 15:00** | System Admin (`SA`) | `/admin/roles`, `/admin/audit-logs`, `/admin/settings` | 10×31 RBAC matrix, immutable hash audit diffs, 1-click seed reset |

---

## Detailed Step-by-Step Walkthrough

### Part 1: Public Authentication & Prototype Persona Switcher (00:00 – 02:00)
1. **Navigate to `http://127.0.0.1:5173/login`.**
2. **Observe Design Compliance:**
   - Pure white background (`#FFFFFF`), crisp hairline borders (`#E4E2DC`), Source Serif 4 title, and forest green accents (`#1F5F4B`).
   - Notice the two tabs: **"Staff & External Partners"** (email/password) and **"Senior & Family Members"** (mobile/OTP).
3. **Inspect the Prototype Access Panel:**
   - Under the login box, locate the **"Prototype Quick Access"** grid featuring 10 distinct persona buttons with role badges (`SA`, `NM`, `PM`, `CC`, `VF`, `SP`, `CT`, `CD`, `SC`, `FM`).
4. **Action:** Click **"Programme Manager (PM)"** to log in automatically as Arjun Nambiar.

---

### Part 2: Executive Management & Programme Operations (02:00 – 04:00)
1. **Executive Dashboard (`/`):**
   - Review the KPI strip: **Registered Members (1,000 / 1,000 Target)**, **Active Members**, **Unique Participants**, and **Notification Delivery Rate (94%)**.
   - Review the **90-Day Pilot Progress Bar** with phase checkpoints (Discovery → Configure → Launch → Operate → Review).
   - Scroll to **"Items Requiring Immediate Attention"**: review flagged sessions without attendance and pending templates.
2. **Member Directory (`/members`):**
   - Click **Members** in the sidebar. Observe the 1,000 synthetic seniors rendered with virtual scrolling.
   - Use the filter bar: select Centre `Ekta Hub Pune (Shivajinagar)` and Language `Marathi`. Observe instant client-side filtering (<30ms).
   - Point out status chips: subtle tints with green for `Active` and grey for `Registered`, never solid saturated blocks.
3. **Programmes & Capacity (`/programmes`):**
   - Click **Programmes**. Open `Gentle Yoga for Active Ageing`.
   - In the **Registrations** tab, observe capacity meter (25/25) and waitlist queue (4 seniors). Explain automatic FIFO promotion on cancellation.

---

### Part 3: Field Operations & Horizontal Scope Isolation (04:00 – 06:00)
1. **Switch Persona to Centre Coordinator (`CC` - Pune):**
   - In the top bar, click the persona switcher or log out and click **"Centre Coordinator (CC)"**.
2. **Demonstrate Centre Switcher Restriction:**
   - Click the Centre dropdown in the top bar. Notice it lists **only assigned centres** (`Ekta Hub Pune`). Unassigned hubs (Nashik, Nagpur, Indore) are omitted.
3. **Test Scope Isolation Violation (Deep-Link IDOR):**
   - In the browser address bar, navigate to a Nashik session or member: `/centres/HUB-NSK`.
   - Observe that the coordinator cannot manage or edit Nashik hub data.
4. **Attendance Overview (`/attendance`):**
   - Observe sessions filtered strictly to Pune.
   - Note the **24-Hour Attendance Lock Countdown**. Explain that once locked, direct edits are blocked and require a formal correction request.

---

### Part 4: Field Volunteer & Assisted Registration (06:00 – 08:00)
1. **Switch Persona to Volunteer (`VF`):**
   - Log in as Pooja Shinde (`VF`).
2. **Assisted Senior Registration Wizard (`/members/new`):**
   - Click **Register Senior Citizen**.
   - Note the 5-step wizard (Identity → Contact & Language → Centre & Programmes → Consent → Review).
   - Enable **"Assisted Registration Mode"**: enter volunteer relationship and declared-on-behalf statement.
   - Note real-time duplicate check against existing names and phone numbers.
   - Complete registration: observe generated ID format `VV-PUN-26-00001` and the printable membership card preview.
3. **Field Attendance Roster (`/attendance/session/sess-1`):**
   - Open a scheduled morning session. Observe the large-target roster with 48px touch targets for rapid field marking.
   - Tap **"Present"** / **"Absent"** or click **"Mark All Present"**.
   - Click **"Add Walk-in"** to register an unbooked senior on-site.
4. **Demonstrate Phone Masking:**
   - In the roster, phone numbers display as `••••••3421`.
   - Click **"Reveal"**: observe the mandatory reason modal. Enter *"Emergency transport coordination"* and submit. Explain that this reveal is written to the immutable audit log.

---

### Part 5: Approved Service Partner & Data Minimization (08:00 – 10:00)
1. **Switch Persona to Service Partner (`SP`):**
   - Log in as Dr. Kulkarni (Sanctuary Elder Health Clinic).
2. **Partner Portal (`/partner/home`):**
   - Observe the partner-specific layout: sidebar options are restricted to **My Referrals**, **Clinic Profile**, and **Partner Reports**.
3. **Verify Field Minimization (`/partner/referrals`):**
   - Click on an assigned referral for cataract screening.
   - Observe the **"Shared Data Panel"**: the elder's full Date of Birth is omitted; only the **Age Band (`75–79`)** is visible.
   - Notice the partner cannot view the member's complete profile, family records, or attendance in other programmes.
4. **Status Update:**
   - Change referral status from `Accepted` to `In Progress` with clinical appointment notes.

---

### Part 6: Care Team Expert & Non-Clinical Triage (10:00 – 12:00)
1. **Switch Persona to Care Team (`CT`):**
   - Log in as Meera Social Worker (`CT`).
2. **Escalations Queue (`/support/escalations`):**
   - Review incoming alerts sorted by SLA deadline.
   - Notice the color-coded urgency chips (`Immediate` 2h SLA, `High` 4h SLA, `Standard` 24h SLA).
3. **Institutional Disclaimer Notice:**
   - Point out the prominent institutional banner:  
     *“Vayoshreshtha does not diagnose or give clinical advice. Health-related requests are routed to qualified professionals.”*
4. **Warning Sign Rule Trigger (`/support/rules`):**
   - Demonstrate the keyword evaluator: type *"Elder felt dizzy and fell near the bathroom"* into the test box.
   - Observe instant matching on `fell down` / `fall` triggering **High Severity (4h SLA)** triage routing.

---

### Part 7: Senior Citizen High-Contrast Portal & WhatsApp Simulator (12:00 – 13:00)
1. **Switch Persona to Senior Citizen (`SC`):**
   - Log in as Elder Ramesh Patil (`SC`).
2. **Accessibility Features (`/me`):**
   - Observe high-contrast 18px base typography with generous spacing and simplified card navigation.
   - Click the **"Larger Text"** toggle in the header to enlarge body text to 22px for elder accessibility.
3. **Interactive WhatsApp Simulator (`/me/simulator`):**
   - Open the simulated mobile phone interface.
   - Select language: **Marathi** or **Hindi**.
   - Type `1` to browse upcoming hub sessions.
   - Type `STOP` to demonstrate instant statutory opt-out compliance (blocking subsequent marketing broadcasts).
   - Type `HELP` to trigger human handover to a centre coordinator.

---

### Part 8: CSR Donor Reviewer & Small-Number Suppression (13:00 – 14:00)
1. **Switch Persona to CSR Donor Reviewer (`CD`):**
   - Log in as Vikram Tata (`CD`).
2. **Aggregate Reports (`/reports/overview`):**
   - Observe that all individual member directories and contact details are completely hidden.
3. **Small-Number Suppression Enforcement:**
   - Navigate to `/reports/csr`.
   - Point out data cells where counts under 5 are displayed as **`<5`** (e.g. 3 seniors in an uncommon cohort). Explain that this prevents quasi-identifier linkage and re-identification attacks.

---

### Part 9: Administration, Audit Trails & Seed Reset (14:00 – 15:00)
1. **Switch Persona to System Administrator (`SA`):**
   - Log in as Rajesh Admin (`SA`).
2. **Role & Permission Matrix (`/admin/roles`):**
   - Review the interactive 10 Roles × 31 Capabilities matrix.
   - Demonstrate maker-checker rule: SA cannot grant themselves clinical triage capabilities.
3. **Audit Ledger (`/admin/audit-logs`):**
   - Review before/after JSON diffs of attendance corrections and PII reveals.
   - Point out the cryptographic hash chain verification pill.
4. **Admin Settings & 1-Click Reset (`/admin/settings`):**
   - View configurable parameters: Active-Member Window (30 days), Attendance Lock (12 hours), Message Volume Cap (10,000/mo).
   - Click **"Reset Demo Data"** to restore pristine seed state for the next review session.
