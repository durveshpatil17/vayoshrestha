# Vayoshrestha — CSR Funder Demonstration Playbook (v4.0.0)

**Organization**: Vayoh Vikas (Senior Welfare NGO)  
**Platform**: Vayoshrestha Digital Senior-Care Ecosystem  
**Design System**: SAP Fiori Horizon Shell + AWS Cloudscape Data Patterns  
**Architecture**: 11 Enterprise Workspaces, Fixed-Height Shell (`100dvh`), Single-Event Cryptographic Audit Ledger  
**Release Target**: CSR Evaluation & Funder Showcase  

---

## 1. Executive Summary

Vayoshrestha is an enterprise digital senior-care ecosystem designed for **Vayoh Vikas** to manage preventive healthcare, community engagement, and life-safety emergency response across community chapters (**Ekta Hubs**).

### Key Architectural Pillars for CSR Evaluators
1. **SAP Fiori Horizon Shell**: Fixed-height viewport (`100dvh`, zero window scrolling), 52px Shell Bar with scope switching, breadcrumbs, responsive side navigation ($\le 8$ apps per workspace), and 320px contextual rails.
2. **Single Event Store & Cryptographic Hash Chain**: Every state transition, SOS escalation, consent modification, and maker-checker approval is chained via SHA-256 blocks anchored to the genesis block (`GENESIS_HASH`).
3. **Autonomous End-to-End Workflows**: 15 mission-critical processes (P1 through P15) operate with live mock backend behavior, real task inbox (`/inbox`), and cross-role handoffs.
4. **Privacy-Preserving Telemetry**: Automated $k$-anonymity suppression ($k \ge 5$), DPDP-aligned consent gating, 21:00–08:00 IST quiet-hours dispatch suppression, and public unauthenticated verification at `/verify`.
5. **Edge Resilience**: Full offline operation for field associates with WebCrypto AES-GCM local storage encryption and phonetic duplicate detection.

---

## 2. Interactive Demonstration Controls

During live evaluations, present the platform using built-in interactive tools:

- **Demo Director Drawer (`Ctrl+Shift+D` / `Cmd+Shift+D`)**:
  - Accessible via the **"Demo director"** pill in the top ribbon or global shortcut.
  - Instantly loads any scenario (S1 through S6) with pre-configured persona and starting route.
  - Controls the **Ambient Operations Simulator** speed (`Paused`, `1x`, `5x Fast`, `Realtime`).
  - Displays real-time background operation tickers (WhatsApp vitals, gateway delivery receipts, attendance check-ins, field tablet syncs).
  - Provides one-click step navigation for guided walkthroughs.

- **Universal Command Palette (`Ctrl+K` / `Cmd+K`)**:
  - Indexes 100% of applications, workflows, and seniors across all 11 workspaces.

- **Keyboard Shortcuts Directory (`?`)**:
  - Press `?` anytime to open the accelerator key reference.
  - Quick chord navigation: `g h` (Home Launchpad), `g i` (Task Inbox), `g s` (SOS Board), `g m` (My Work), `g a` (All Apps Directory).

- **Instant Persona Switcher**:
  - Switch between all 12 operational personas via the user avatar in the top-right Shell Bar.

---

## 3. Scripted Demonstration Scenarios (S1 through S6)

### Scenario S1: Normal Weekday Rhythms
- **Funder Value Proposition**: Demonstrates scale, autonomous operation, and high daily adherence with low staff overhead.
- **Scale**: 1,000 enrolled seniors across 3 regions and 9 community chapters; >85% WhatsApp daily response rate; 0 dropped life-safety alerts.
- **Recommended Role**: Regional Administrator (`RA`)
- **Starting Route**: `/` (Home Launchpad)

#### Step-by-Step Walkthrough
1. **Home Launchpad Overview (`/` as RA)**:
   - Point out the KPI tiles: Active Seniors (1,000), 24h Check-in Adherence (87.4%), Community Hubs (9).
   - Show the **"My work"** container: Aggregates personal pending tasks from the unified task queue.
   - Show pinned favorites and recent workspace visits.
2. **Community Attendance Hub (`/attendance` as VF)**:
   - Switch role to Volunteer Facilitator (`VF`).
   - Open `/attendance`. Inspect the morning Chair Yoga session roster.
   - Highlight the 100% check-in rate with zero unverified absences.
3. **Care Telemetry Queue (`/health/queue?tab=logs` as CT)**:
   - Switch role to Care Triage (`CT`).
   - Open `/health/queue?tab=logs`.
   - Point out live vital streams parsed automatically from senior WhatsApp messages.

---

### Scenario S2: Monsoon Heatwave Advisory & Surge
- **Funder Value Proposition**: Demonstrates regulatory DPDP compliance and proactive medical triage before symptoms escalate to emergency hospitalization.
- **Recommended Role**: Programme Manager (`PM`)
- **Starting Route**: `/communication/announcements`

#### Step-by-Step Walkthrough
1. **Broadcast Announcement (`/communication/announcements` as PM)**:
   - Inspect the heatwave hydration advisory dispatched across language variants (English, Hindi, Kannada, Tamil).
   - Highlight DPDP consent filtering: 8 seniors who opted out of general advisories are automatically suppressed.
2. **Biomarker Anomaly Flags (`/health/queue?tab=flags` as CT)**:
   - Switch role to Care Triage (`CT`).
   - Observe hypertensive alerts flagged by the NLP parser (e.g. Savitri Amma, 168/98 mmHg).
3. **Take Next Wellness Call (`/health/queue?tab=calls` as CT)**:
   - Click **"Take next wellness call"** in the calls tab.
   - System automatically locks and prioritizes the highest-acuity elder.
   - Log call notes, confirm hydration status, and record clinical resolution.

---

### Scenario S3: Emergency Escalation Cascade
- **Funder Value Proposition**: Proves life-safety reliability with sub-2-second telephony fallback, strict 3-minute SLA response, and mandatory institutional post-incident accountability.
- **Recommended Role**: Care Triage (`CT`)
- **Starting Route**: `/sos`

#### Step-by-Step Walkthrough
1. **Emergency SOS Board (`/sos` as CT)**:
   - Observe flashing emergency chip in the top Shell Bar showing active critical incidents.
   - Locate incident `SOS-20261030-001` (Lakshmi Devi, Fall detected at Jayanagar Hub).
   - Click **"Acknowledge incident"** to beat the 3-minute SLA countdown timer.
2. **Incident Coordination (`/sos/SOS-20261030-001` as CT)**:
   - Review primary next-of-kin contacts, field volunteer proximity, and medical history card.
   - Note telephony fallback log: Dispatched encrypted SMS in 1.2s when cellular data was delayed.
   - Click **"Mark resolved"**.
3. **Mandatory 24-Hour Post-Incident Review (`/sos/SOS-20261030-001` as CM)**:
   - Switch role to Centre Manager (`CM`).
   - Notice the system blocks case closure until the post-incident review is submitted.
   - Complete the 3-point checklist: Senior medical stabilization confirmed, family notified, home safety check scheduled.
   - Click **"Submit & seal post-incident review"**.
   - Observe the cryptographic SHA-256 audit seal generated instantly.

---

### Scenario S4: Field Registration Blitz & Offline Deduplication
- **Funder Value Proposition**: Demonstrates rural and disconnected edge operations with WebCrypto AES-GCM security and phonetic deduplication preventing duplicate CSR subsidies.
- **Recommended Role**: Field Associate (`SF`)
- **Starting Route**: `/field`

#### Step-by-Step Walkthrough
1. **Field Mobile Terminal (`/field` as SF)**:
   - View mobile responsive layout (optimized for 390×844 tablets/phones).
   - Observe offline indicator and local encrypted queue count.
   - Register a walk-in elder with double consent (member thumbprint and field worker attestation).
2. **Phonetic Deduplication Workbench (`/seniors/duplicates` as PM)**:
   - Switch role to Programme Manager (`PM`).
   - Open `/seniors/duplicates`.
   - Inspect phonetic Soundex/Metaphone duplicate detection for "Anasuya Bai" vs "Anusuya Bayi" (94% confidence match).
   - Click **"Confirm unique identity"** to approve enrollment.
3. **Sync Supervision Queue (`/field-network` as CM)**:
   - Switch role to Centre Manager (`CM`).
   - Verify terminal synchronization health, battery telemetry, and audit trail.

---

### Scenario S5: Festival Holiday & Quiet-Hours Compliance
- **Funder Value Proposition**: Demonstrates respectful community engagement that honors Indian holidays while maintaining regulatory compliance with DPDP communication quiet-hours rules.
- **Recommended Role**: Programme Manager (`PM`)
- **Starting Route**: `/communication/announcements/new`

#### Step-by-Step Walkthrough
1. **Quiet-Hours Guard (`/communication/announcements/new` as PM)**:
   - Open the broadcast creation wizard.
   - Notice the active **Quiet Hours Alert**: Highlights that communications between 21:00 and 08:00 IST are held until morning.
   - Click **"Queue for morning delivery"**; system schedules release for 08:00:00 IST.
2. **Holiday Attendance Correction Review (`/attendance` as CM)**:
   - Switch role to Centre Manager (`CM`).
   - In `/attendance?tab=corrections`, review volunteer request to excuse 12 seniors absent during Diwali festival.
   - Click **"Approve correction"**.
   - Task `TASK-P4-001` completes automatically, updating chapter metrics and appending to the audit ledger.

---

### Scenario S6: CSR Audit & Public Verification
- **Funder Value Proposition**: Gives corporate funders complete confidence in reported impact metrics through privacy-preserving $k$-anonymity suppression and public cryptographic verification.
- **Recommended Role**: National Manager (`NM`)
- **Starting Route**: `/telemetry`

#### Step-by-Step Walkthrough
1. **Impact Pack Dossier (`/telemetry` as PM)**:
   - Review Quarterly CSR Report `PACK-2026-CSR-03`.
   - Observe differential privacy: Any demographic or medical cell with $<5$ seniors is suppressed with an asterisk (`*`) to eliminate re-identification risk.
2. **Maker-Checker Cryptographic Release (`/telemetry` as NM)**:
   - Switch role to National Manager (`NM`).
   - Review pending release task `TASK-P13-001` in `/inbox`.
   - Click **"Authorize impact pack release"**.
   - System computes SHA-256 digest of the entire pack dataset:
     `d4e2a8...` linked to genesis audit hash.
3. **Zero-Login Public Verification Portal (`/verify`)**:
   - Log out or open `/verify` as an unauthenticated external auditor.
   - Enter receipt code `PACK-2026-CSR-03`.
   - Click **"Verify authenticity"**.
   - System confirms: Valid cryptographic seal, untampered timestamp, signed by National Manager, 0 modified records.

---

## 4. Multi-Role RBAC Capability Matrix

| Role Code | Full Title | Workspace Scope | Key Capabilities |
|---|---|---|---|
| **RA** | Regional Administrator | Multi-Chapter / Regional | Regional KPI monitoring, senior onboarding, voucher approvals, global audit view |
| **NM** | National Manager | National Enterprise Scope | Statutory template approvals, impact pack releases, pilot readiness authorization |
| **PM** | Programme Manager | Chapter / Operational | Communication campaigns, curriculum authoring, duplicate resolution |
| **CM** | Centre Manager | Ekta Hub Community Hub | Attendance approvals, volunteer supervision, 24h post-SOS incident reviews |
| **VF** | Volunteer Facilitator | Ekta Hub Field Hub | Session attendance capture, elder drop-off outreach, localized reminders |
| **CT** | Care Triage Lead | Life-Safety & Clinical Queue | SOS incident acknowledgment, vital anomaly triage, wellness outreach calls |
| **SA** | System Administrator | Platform Infrastructure | Telemetry logs, DPDP erasure execution, RBAC configuration, audit verification |
| **SF** | Field Associate | Edge / Tablet Terminal | Assisted offline onboarding, coarse geo-tagging, double-consent capture |
| **SC** | Senior Citizen | Self-Service Portal | Personal care schedules, community event signups, consent management |
| **FM** | Family Member | Nominated Kin Portal | Elder health timeline, check-in confirmations, emergency alert notifications |

---

## 5. Verification Evidence & Quality Metrics

- **Feature Ledger Completion**: **171 / 171 features Built (100% complete, 0 regressions)**.
- **Automated Journey Specs**: **15 / 15 multi-role Playwright journeys passing 100% GREEN** (`tests/e2e/journeys/J-01.spec.ts` through `J-15.spec.ts`).
- **Core UI Gate Suites**: **38 / 38 Playwright tests passing 100% GREEN** (`no-scroll-shell`, `ia-budget`, `layout-check`, `dead-controls`).
- **Unit & Integration Tests**: **179 passing tests across 36 test suites** in Vitest.
- **Fixed-Height Shell Hard Rule**: Zero page scroll at 1440×900 and 1280×720 viewports (`document.scrollingElement.scrollHeight === clientHeight`).
- **Design Linter Strictness**: **0 violations across 290 source files** (Open Sans font, sentence case, no arbitrary brackets, standard tokens only).
- **Edge Redirects & Routing**: 21 canonical redirects in `vercel.json` and client router guarantee 0 broken URLs.

