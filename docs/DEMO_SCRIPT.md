# VAYOSHRESHTHA PILOT v2 — 10-MINUTE MASTER DEMONSTRATION SCRIPT

**Document Purpose:** Guided 10-minute demonstration walkthrough for evaluators, showcasing the 3 core pilot service modules, cross-tab real-time SOS alerting, cellular SMS fallback, preventive wellness call flows, and 5-layer RBAC scope isolation.  
**Target Viewport:** 1440 × 900 Desktop Browser  
**Local Prototype URL:** `http://localhost:3000/`

---

## 10-Minute Walkthrough Timeline

| Timestamp | Module / Focus | Persona | Routes Demonstrated | Key Objective |
|---|---|---|---|---|
| **00:00 – 02:00** | **Module 3: Civic & Profile** | Senior Citizen (`SC`) / CM | `/simulator`, `/onboarding/new` | Onboard a senior citizen through the WhatsApp bot script; capture emergency contacts & ABHA (structure only). |
| **02:00 – 04:00** | **Module 1: Safety & SOS** | Senior (`SC`) → RA (`RA`) | `/simulator` (Tab 1), `/sos` (Tab 2) | Trigger 🚨 Emergency SOS with cellular disconnect; verify real-time cross-tab alert (<1s) & NOK SMS fallback. |
| **04:00 – 06:00** | **Module 1: Case Management** | Regional Admin / Care Team | `/sos/:id` | Live SLA countdown, case timeline, contacting next-of-kin, responder assignment, resolution with audit trail. |
| **06:00 – 08:00** | **Module 2: Preventive Health** | Senior (`SC`) → CM (`CM`) | `/simulator`, `/health/flags`, `/health/calls` | Use Time Machine to jump to 08:00, confirm medication, submit high BP (`165/105`), work wellness check-in call. |
| **08:00 – 10:00** | **Foundations: RBAC & Governance** | CM (`CM`), SA (`SA`), CD (`CD`), NM | `/seniors`, `/reports/pilot`, `/admin/approvals` | Prove chapter isolation, SA health-log lockout, CD `<5` small-number suppression, and maker–checker dual control. |

---

## Detailed Step-by-Step Instructions

### Step 1: Senior Citizen WhatsApp Onboarding (00:00 – 02:00)
1. **Open Tab 1** at `http://localhost:3000/simulator`.
2. **Examine the 3-Pane Simulator:**
   - Left: **Senior Citizen WhatsApp Phone** (unbranded, forest green theme, message timestamps).
   - Centre: **Next-of-Kin Transactional SMS Phone** (clean feature-phone screen).
   - Right: **System Event Ticker** (real-time telemetry of queue events and gateway webhooks).
3. **Execute the Bot Onboarding Flow:**
   - Tap **"Get Started"** or type `Hi`.
   - Bot displays organizational consent terms covering safety SMS to next-of-kin. Tap **"I Agree"**.
   - Enter Full Name: `Smt. Shakuntala Devi`.
   - Select Preferred Language: `Marathi` or `English`.
   - Enter Emergency Contact 1: `Ramesh Devi` (Relationship: `Son`, Mobile: `+91 98220 11223`, Consent: `Yes`).
   - Enter Optional ABHA ID: `14-1234-5678-9012`.
   - Bot confirms registration: generates Member ID `VV-PUN-26-00045` and displays the Phase 2 notice (*"Structure only — federated linkage scheduled for Phase 2"*).
4. **Assisted Onboarding Mirror (Optional):**
   - In another tab as Volunteer (`VF`), navigate to `/onboarding/new` to show the identical 7-step staff wizard with duplicate phone detection.

---

### Step 2: Emergency SOS with Mobile Data Disconnect (02:00 – 04:00)
1. **Set Up the Two-Tab Demonstration:**
   - **Window/Tab A:** Keep `http://localhost:3000/simulator` open on the left half of your screen.
   - **Window/Tab B:** Open `http://localhost:3000/login` on the right half. Click **"Regional Admin (RA)"** in the Prototype Access panel, then navigate to `/sos` (Live SOS Board).
2. **Simulate Cellular Network Disconnect:**
   - In Tab A (Simulator), toggle **"Simulate data disconnect"** to **ON** (turns red).
3. **Trigger Emergency SOS:**
   - In the Senior WhatsApp phone, tap the prominent **"🚨 Trigger Emergency SOS"** quick-reply button.
4. **Observe Synchronized Results in Real Time:**
   - **Senior WhatsApp Phone:** Immediately receives instant acknowledgement: *"Help is being alerted. Reply CANCEL if this was a mistake."*
   - **Next-of-Kin SMS Phone (Centre Pane):** Within ~300 ms, receives a priority cellular SMS:
     > *"EMERGENCY: Smt. Shakuntala Devi triggered an SOS via Vayoh Vikas. Cellular fallback activated due to data disconnect. Contact: 112. Details: bit.ly/vv-sos"*
   - **Regional Admin Board (Tab B):** Within **< 1,000 ms** (typically 120–180 ms via `BroadcastChannel`), a **persistent red critical alert banner** appears with an audible chime toggle and live SLA countdown timer (2:00 min default SLA).
   - Point out the **measured enqueue-to-dashboard latency** displayed in the ticker (e.g. `142 ms (sub-second target met)`).

---

### Step 3: SOS Incident Triage & Resolution (04:00 – 06:00)
1. In Tab B (`/sos`), click on the active SOS case row (`SOS-20261028-001`).
2. **Review Case Page Details (`/sos/:id`):**
   - **SLA Countdown Clock:** Shows remaining seconds before regional escalation.
   - **Latency Diagnostic:** Displays `Enqueue-to-Dashboard Latency: 142 ms (Simulated under browser)`.
   - **Cellular Fallback Panel:** Confirms SMS pushed to next-of-kin Ramesh Devi (`+91 98220 11223`) with delivery status `Delivered` and DLT Template ID `1407161234567890123`.
   - **Permanent Emergency Notice:** Prominent institutional callout: *"In a life-threatening emergency, call 112."*
3. **Take Action:**
   - Click **"Acknowledge Case"**. Timer transitions to Acknowledged.
   - Click **"Assign Responder"** -> Select Care Team member `Dr. Meera Swaminathan`.
   - Click **"Simulate Call to NOK"** -> Confirms phone call initiated.
   - Select Outcome Code **"Resolved — Senior Safe / Field Responder Attended"**, enter case notes, and click **"Resolve Case"**.
   - Case moves to Resolved; audit record is written with cryptographic SHA-chain.

---

### Step 4: 08:00 AM Reminder Burst & Wellness Call Flow (06:00 – 08:00)
1. **Time Machine Activation:**
   - In the top bar (or dev panel via `?dev=1`), locate the **Time Machine** control.
   - Click **"Jump to 08:00 IST (Fire Morning Reminders)"**.
2. **Inspect Senior Response:**
   - Switch to Tab A (`/simulator`).
   - Senior WhatsApp phone receives utility reminder:
     > *"Good morning Smt. Shakuntala Devi, time to take your morning wellness prescription and log your blood pressure."*
     > Buttons: `[ Taken ]` `[ Not yet ]` `[ Skip ]`
   - Tap **"Taken"**. Confirmation is logged.
3. **Submit High-Risk Blood Pressure Reading:**
   - Bot prompts: *"Please reply with your blood pressure reading (e.g. 120/80)."*
   - Type an elevated reading: `165/105`.
   - Bot replies politely without clinical advice: *"Thank you. Your reading 165/105 mmHg has been recorded for your chapter care team."* (Explicitly **no diagnosis or clinical wording** sent to elder).
4. **Chapter Manager Anomaly Queue (`/health/flags`):**
   - Switch to Tab B. Log in as Chapter Manager Pune (`CM`).
   - Navigate to `/health/flags`. Observe new flag: `165/105 mmHg (High-Risk Band)`.
   - Click **"Initiate Wellness Check-In Call"**.
   - A modal opens with the **Non-Clinical Call Script**:
     - *"Good morning, I am calling from Vayoh Vikas to check in on how you are feeling today..."*
   - Select Outcome: **"Senior Reached — Confirmed Meds Taken, Advised Rest"**.
   - Submit outcome. Flag status updates to `Closed`; call task marked `Completed`.

---

### Step 5: Role Isolation & Governance Verification (08:00 – 10:00)
1. **Horizontal Chapter Isolation:**
   - While logged in as `CM` (Pune Hub), open `/seniors`. Notice only Pune members (`VV-PUN-...`) appear.
   - Search for a Bengaluru member (`VV-BLR-26-00042`). Result is empty.
   - In the address bar, type direct link `/seniors/snr-blr-001`. The route guard blocks access with a 403 Forbidden explaining missing chapter scope.
2. **System Administrator Clinical Lockout:**
   - Log out and log in as System Administrator (`SA`).
   - Navigate to `/health/logs` or attempt to inspect senior vital logs.
   - Route guard displays **403 Forbidden**: *"System Administrators are strictly restricted from viewing clinical and personal health logs per organizational data-minimization policies."*
3. **CSR / Donor Reviewer Differential Privacy (`<5` Suppression):**
   - Log in as CSR Reviewer (`CD`).
   - Navigate to `/reports/pilot`. Notice all elder names, phone numbers, and addresses are stripped.
   - Locate any small-cell count (< 5). Observe it renders as **`<5`** to prevent quasi-identifier re-identification attacks.
4. **Maker–Checker Dual-Control Governance:**
   - Navigate to `/sos/settings` as Regional Admin (`RA`). Modify SLA to 3 minutes and click "Submit Changes".
   - Notice status is `Pending Approval`. The RA cannot approve their own submission.
   - Log in as NGO Management (`NM`) -> Navigate to `/admin/approvals`. Review diff and click **"Approve Changes"**. Status updates to `Approved`.
