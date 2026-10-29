# VAYOSHRESHTHA — User Journey Test & Demo Scripts (J-01 through J-15)

**Version**: 4.0.0  
**Phase**: Pass v4  
**Target Coverage**: Playwright Multi-Context E2E & Funder Live Demo Protocols  

> [!NOTE] Non-Legal & Non-Clinical Notice: Workflows simulate operational coordination only. No clinical, financial, or legal advice is provided by Vayoshreshtha. Data handling is DPDP-aligned (prototype).

---

## Journey Architecture & Automation Protocol

Every journey script follows an identical 5-phase structure:
1. **Preconditions**: Verified state of single event store, active seed records, and user session.
2. **Actor 1 Execution**: Primary entry point trigger, form submission, and immediate optimistic feedback.
3. **Automated Event & Task Handoff**: Assertion that the event was processed by domain logic and placed a `Task` in the next actor's inbox queue with an active SLA timer.
4. **Actor 2 (or Checker) Execution**: Persona switch, task discovery in `/inbox`, opening task in split panel context, and taking terminal resolution action.
5. **Verification & Audit**: Assertion that metrics moved across all surfaces (Home tiles, workspace landing, reports, telemetry), activity feed recorded the transition, and the audit hash chain is intact.

---

## J-01: Senior Onboarding & Duplicate Resolution (P1)

- **Cast**: Volunteer Facilitator (`VF`), Programme Manager (`PM`), Chapter Manager (`CM`).
- **Initial State**: Senior *Shri Madhav Rao* arrives at Hubballi Central Ekta Hub for enrollment.
- **Steps**:
  1. `[VF]` Log in, navigate to `+ Create > New Senior` (`/onboarding/new`).
  2. `[VF]` Complete Assisted Onboarding Wizard:
     - Basic Info: Name: "Madhav Rao", Age: 71, Gender: Male, Phone: `+91 98450 12345`.
     - Chapter: Hubballi Central (`HUB-CEN`).
     - Consent: Check explicit verbal consent checkbox.
     - Click `Submit Registration`.
  3. *Engine Assertion*: System detects matching phone number with existing stalled record. Generates member ID `VV-HBL-26-00481` with status `Duplicate Review`. Emits task to PM inbox.
  4. `[Switch to PM]` Open `/inbox`.
     - Assert task `DUPLICATE_REVIEW` for "Madhav Rao" appears with `High` priority and `24h` SLA.
     - Click task $\to$ Split panel opens side-by-side comparison with existing record.
     - Click `Confirm Unique (Different Person)`.
  5. *Engine Assertion*: Status updates to `Registered`. Welcome WhatsApp message queued. Task closed.
  6. `[Switch to CM]` Open `/seniors/VV-HBL-26-00481`.
     - Assert Process Flow indicates `Registered` with green checkmark.
     - Assert `Print Membership Card` button is active.
- **Exception Path**: If PM clicks `Merge Duplicate`, new registration is purged, activity log of existing member updated, and zero orphaned records created.

---

## J-02: Emergency SOS Response & Post-Case Review (P2)

- **Cast**: Senior Citizen (`SC`), Care Triage (`CT`), Chapter Manager (`CM`).
- **Initial State**: Smt. Lakshmi Devi feels acute dizziness and chest pain at home.
- **Steps**:
  1. `[SC / Simulator]` In WhatsApp Simulator (`/simulator`) or Senior Portal (`/me`), trigger `SOS`.
  2. *Engine Assertion*:
     - BroadcastChannel emits alert to all connected staff windows.
     - Audio chime plays (if unmuted).
     - Shell Bar SOS Chip turns solid red with count `1`.
     - Generates `Task { type: 'SOS_ACKNOWLEDGE', roleQueue: 'CT', priority: 'Critical', sla: '2m' }`.
  3. `[CT]` On `/sos` Live Board, open case `SOS-26-00042` via split panel.
  4. `[CT]` Click `Acknowledge emergency`.
     - Case moves from *Unacknowledged* to *Active Triage*.
     - Shell chip updates; timer stops.
  5. `[CT]` Enter Triage Note: "Spoke to daughter Smt. Anuradha. Local volunteer Shri Ganesh dispatched with BP monitor."
  6. `[CT]` Click `Resolve Case`, select outcome code `RESOLVED_VOLUNTEER_DISPATCHED`.
  7. *Engine Assertion*: Case marked `Resolved`. Automatically generates post-case review task for CM: `Task { type: 'SOS_POST_REVIEW', assigneeRole: 'CM', priority: 'Medium', sla: '24h' }`.
  8. `[Switch to CM]` Open `/inbox`, select `SOS_POST_REVIEW` task.
     - Complete 3-item checklist: (1) Family re-contacted, (2) Follow-up doctor consult booked, (3) Incident classified.
     - Click `Complete Review & Archive`.
  9. *Verification*: On `/` (CM Home) and `/reports/pilot`, SOS count increments, median ack time reflects actual response time.

---

## J-03: Daily Biomarker Alert & Wellness Outreach (P3)

- **Cast**: Senior Citizen (`SC`), Care Triage (`CT`).
- **Initial State**: Shri Ramesh Kulkarni takes morning blood pressure reading.
- **Steps**:
  1. `[SC / Simulator]` Send message `"BP 168/102"` in response to scheduled 08:00 AM prompt.
  2. *Engine Assertion*:
     - Parser extracts Systolic: 168, Diastolic: 102.
     - Evaluates against threshold: Classified as `High-Risk`.
     - Telemetry records reading.
     - Generates `Task { type: 'WELLNESS_CALL', roleQueue: 'CT', priority: 'High', sla: '4h' }`.
  3. `[CT]` Navigate to `/inbox`, filter by `Care Queue`.
     - Click `Take next` $\to$ Automatically claims Shri Ramesh Kulkarni's wellness call task.
     - Task split panel displays previous 7-day vitals trend, primary physician details, and call script.
  4. `[CT]` Click `Initiate Call` $\to$ Record call outcome: "Senior reports mild headache. Advised to take prescribed Telmisartan and rest. Follow-up scheduled for 16:00."
  5. `[CT]` Click `Mark Call Completed`.
  6. *Verification*: Task cleared from inbox; `/health/queue?tab=calls` marks call completed; trend chart reflects reading.

---

## J-04: Community Programme Session & Attendance Corrections (P4)

- **Cast**: Volunteer Facilitator (`VF`), Chapter Manager (`CM`).
- **Initial State**: Weekly Gentle Yoga Session at Dharwad West Hub.
- **Steps**:
  1. `[VF]` Open `/attendance` on tablet / desktop at start of session.
  2. `[VF]` Select session "Gentle Yoga - Batch A".
  3. `[VF]` Mark 14 present, 2 absent. Click `Lock & Submit Attendance Sheet`.
  4. *Engine Assertion*: Attendance locked. Session marked `Completed`.
  5. *Late Arrival Exception*: Senior Smt. Pushpa arrived late after lock.
  6. `[VF]` Click `Request Correction`, select Smt. Pushpa, reason: "Arrived late during meditation phase; confirmed attendance." Click `Submit Request`.
  7. *Engine Assertion*: Generates `Task { type: 'ATTENDANCE_CORRECTION_APPROVAL', assigneeRole: 'CM', priority: 'Low', sla: '48h' }`.
  8. `[Switch to CM]` Open `/inbox`, select attendance correction task.
     - Review timestamp and reason. Click `Approve Correction`.
  9. *Verification*: Attendance sheet updates to 15 present; Chapter Attendance Index recalculates.

---

## J-05: Statutory Template Maker-Checker Approval (P5)

- **Cast**: Programme Manager (`PM`), National Manager (`NM`).
- **Initial State**: PM drafting seasonal monsoon health advisory for coastal chapters.
- **Steps**:
  1. `[PM]` Open `/communication/templates` (`+ Create > New Template`).
  2. `[PM]` Author template:
     - Name: "Monsoon Water Safety Advisory".
     - Language: Kannada + English.
     - Text: "Namaskara {{senior_name}}, heavy rains expected in {{chapter_name}}. Please avoid standing water and drink only boiled water. Call your Ekta Hub for support."
  3. `[PM]` Click `Submit for National Approval`.
  4. *Engine Assertion*: Template state set to `Pending Approval`. Strict maker-checker enforcement blocks PM from self-approving. Generates task for NM.
  5. `[Switch to NM]` Open `/inbox` or `/admin/approvals`.
     - Open template review drawer.
     - View side-by-side Kannada and English rendering with dynamic chip simulation.
     - Click `Approve Template`.
  6. *Verification*: Template state becomes `Active`; available in campaign broadcaster.

---

## J-06: Deterministic Partner Routing & Voucher Redemption (P6)

- **Cast**: Senior Citizen (`SC`), Service Partner (`SP`), Programme Manager (`PM`).
- **Initial State**: Smt. Savitri Patil requires an eye diagnostic examination.
- **Steps**:
  1. `[PM / VF]` Navigate to `+ Create > Service Request` (`/routing`).
     - Senior: Smt. Savitri Patil (Kolhapur).
     - Category: Diagnostic Eye Care.
  2. *Engine Assertion*: Deterministic routing engine queries partner capacity:
     - Partner A (Drishti Eye Care): Capacity 12/20, Distance 2.1 km $\to$ Selected.
     - Generates voucher `VCH-26-8942-D` (Crockford Base-32 with Modulo-37 checksum).
     - Dispatches voucher to senior's WhatsApp.
     - Emits task to Partner Portal.
  3. `[Switch to SP (Partner)]` Log in as Partner, open `/partner/vouchers/redeem`.
     - Enter voucher code `VCH-26-8942-D`.
     - System validates checksum: Displays "Valid: Smt. Savitri Patil - Comprehensive Geriatric Vision Test".
     - Click `Confirm Redemption`.
  4. *Engine Assertion*: Voucher marked `Redeemed`. Partner capacity decrements to 13/20. Idempotency lock prevents double redemption.
  5. *Verification*: Smt. Savitri's profile reflects service completed; `/reports` outcome indicator increments.

---

## J-07: Pro-Bono Encrypted Legal Intake (P7)

- **Cast**: Chapter Manager (`CM`), Pro-Bono Advocate (`SP`), Senior (`SC`).
- **Initial State**: Senior Shri Mohan Lal reports ancestral property coercion by distant relatives.
- **Steps**:
  1. `[CM]` Open `/legal-intake` (`+ Create > Legal Intake`).
     - Enter non-confidential intake: Category "Property Coercion", Urgency "High".
     - Enter confidential narrative in encrypted envelope.
     - Click `Submit Intake`.
  2. *Engine Assertion*: WebCrypto encrypts narrative; staff UI shows only `[Encrypted Attorney-Client Narrative]`. Emits task to credentialed advocate.
  3. `[Switch to SP (Advocate)]` Open `/partner/legal-intake`.
     - Advocate decrypts case file with session key.
     - Review facts, conduct consultation.
     - Click `Record Outcome`, select `SETTLED_WITH_FAMILY_MEDIATION`.
  4. *Verification*: Case archived; non-legal-advice notice verified in print export; demand analytics updated ($k \ge 5$).

---

## J-08: Virtual Literacy Daily Drip & Quiz Engagement (P8)

- **Cast**: Programme Manager (`PM`), Senior Citizen (`SC`).
- **Initial State**: PM authoring cyber-safety lesson on UPI fraud awareness.
- **Steps**:
  1. `[PM]` Open `/learning/library/new`.
     - Lesson Title: "Never Share Your UPI PIN".
     - Step 1: "A bank officer will never ask for your PIN."
     - Step 2: "Receiving money does not require entering a PIN."
     - Quiz Question: "Do you need to enter a PIN to receive an old-age pension payment?" (Options: Yes / No).
  2. `[PM]` Schedule series at 10:00 AM.
  3. *Engine Assertion*: Quiet hours check confirms 10:00 AM is permissible (outside 21:00-08:00 window). Dispatches to registered seniors.
  4. `[Switch to SC]` Open `/me/quizzes`.
     - Select "UPI Safety Quick Quiz".
     - Answer "No".
     - Click `Submit Answer`.
  5. *Engine Assertion*: Answer scored correct (100%). Congratulatory card displayed with celebratory badge. Anonymous chapter score increments.

---

## J-09: Field Associate Offline Terminal & Sync Supervision (P9)

- **Cast**: Senior Field Associate (`SF`), Chapter Manager (`CM`).
- **Initial State**: SF conducting door-to-door drive in low-connectivity rural ward.
- **Steps**:
  1. `[SF]` Open Field View (`/field/onboard`, mobile 390×844 layout).
  2. `[SF]` Simulate airplane mode / offline state.
  3. `[SF]` Capture senior registration: Name: "Hanumantappa K", Age: 78, Ward: Ward 12.
  4. `[SF]` Obtain in-person signature consent. Click `Save to Offline Queue`.
  5. *Engine Assertion*: WebCrypto AES-GCM 256-bit encrypts entry in IndexedDB. Coarse geo-stamp assigned (`15.36°N, 75.12°E`). Offline badge shows `1 Pending Sync`.
  6. `[SF]` Reconnect network, open `/field/sync`, click `Sync Now`.
  7. *Engine Assertion*: Item dispatched to server mock. Status becomes `Awaiting WhatsApp Second Consent`.
  8. `[Switch to CM]` Open `/field-network/sync`.
     - Verify sync health indicates 0 late syncs (>24h).
     - Field Telemetry Card on Home increments Active Field Gigs and Last-Mile Syncs.

---

## J-10: Multi-Tier Maker-Checker Policy Change (P10)

- **Cast**: Regional Admin (`RA`), National Manager (`NM`).
- **Initial State**: RA updates Chapter SOS auto-escalation timeout from 120s to 90s.
- **Steps**:
  1. `[RA]` Open `/sos/settings`.
  2. `[RA]` Edit `Escalation Timeout` $\to$ `90 seconds`. Click `Submit for Governance Sign-Off`.
  3. *Engine Assertion*: Settings change held in draft. Generates `Task { type: 'GOVERNANCE_APPROVAL', roleQueue: 'NM', priority: 'High', sla: '24h' }`.
  4. `[Switch to NM]` Open `/inbox`, select governance approval task.
     - View exact diff: `120s` (Current) $\to$ `90s` (Proposed).
     - Click `Approve & Deploy`.
  5. *Engine Assertion*: Production escalation timer updated to 90s. Cryptographic SHA-256 audit entry written.

---

## J-11: Statutory DPDP Personal Data Purge (P11)

- **Cast**: Senior Citizen (`SC`), National Manager (`NM`), System Admin (`SA`).
- **Initial State**: Senior moves out of state and requests complete profile erasure under DPDP Act.
- **Steps**:
  1. `[SC / Staff]` Open `/admin/data-governance/new`.
     - Requestor: Smt. Geeta Kulkarni (`VV-PUN-26-00109`).
     - Request Type: `Right to Erasure (Purge)`.
  2. `[NM]` Review identity verification document. Click `Authorize Data Purge`.
  3. `[Switch to SA]` Open `/inbox`, select `DPDP_PURGE_EXECUTION`.
     - Click `Execute Irrevocable Purge`.
     - Type confirmation string `PURGE` in modal.
  4. *Engine Assertion*: All PII fields (Name, Phone, Address, Vitals) overwritten with cryptographic zero-tokens. Member ID marked `PURGED`. Anonymous metrics aggregate count preserved.
  5. *Verification*: Navigating to `/seniors/VV-PUN-26-00109` displays `404 / Purged Record`; audit log records compliance certificate.

---

## J-12: Citizen Grievance Redressal (P12)

- **Cast**: Volunteer Facilitator (`VF`), Chapter Manager (`CM`).
- **Initial State**: VF reports broken wheelchair ramp at community centre venue.
- **Steps**:
  1. `[VF]` Click Help menu $\to$ `Raise Grievance / Complaint` (`/admin/complaints/new`).
     - Category: `Venue Accessibility`.
     - Severity: `Medium`.
     - Description: "Wheelchair ramp at Hubballi venue has a damaged handrail."
  2. *Engine Assertion*: Generates `Task { type: 'COMPLAINT_INVESTIGATION', assigneeRole: 'CM', priority: 'Medium', sla: '7d' }`.
  3. `[Switch to CM]` Open `/inbox`, claim complaint task.
     - Add internal note: "Contractor Shri Patil contacted for repair."
     - After physical inspection, click `Mark Resolved`, attach completion note.
  4. *Verification*: Status changes to `Resolved with Action`; resolution metrics reflect 100% compliance.

---

## J-13: Impact Pack Generation & Public Audit Verification (P13)

- **Cast**: Programme Manager (`PM`), National Manager (`NM`), CSR Auditor (`Public`).
- **Initial State**: PM assembling Q3 Pilot Impact Pack for CSR Funder.
- **Steps**:
  1. `[PM]` Open `/telemetry/packs/new`.
     - Select Template: `CSR Pilot Quarterly Impact Report`.
     - Scope: All 9 Chapters. Period: Last 90 Days.
     - Click `Generate Draft Pack`.
  2. *Engine Assertion*: Gathers all metrics from single event store. Applies $k \ge 5$ cell suppression. Generates tamper-evident SHA-256 hash.
  3. `[PM]` Click `Submit for Release`.
  4. `[Switch to NM]` Open `/inbox`, select `IMPACT_PACK_RELEASE`.
     - Review metrics and verification hash. Click `Release to Public Registry`.
  5. *Public Verification*:
     - Open unauthenticated verification gateway `/verify` in incognito window.
     - Enter verification code `VV-PACK-26-Q3-CSR`.
  6. *Engine Assertion*: Displays green shield "Authentic & Verified Document", matching SHA-256 digest, release date, and official Vayoh Vikas issuer signature.

---

## J-14: Partner Organization Accreditation & Activation (P14)

- **Cast**: Programme Manager (`PM`), National Manager (`NM`), Service Partner (`SP`).
- **Initial State**: Onboarding "Arogya Geriatric Lab Network".
- **Steps**:
  1. `[PM]` Open `/partners/new`.
     - Organization Name: "Arogya Geriatric Lab Network".
     - Registration: 80G/12A Statutory Verified.
     - Daily Capacity: 15 referrals.
     - Services: Blood Profile, Lipid Panel, HbA1c.
     - Click `Submit Accreditation`.
  2. `[Switch to NM]` Open `/admin/approvals`, select partner accreditation.
     - Click `Approve & Activate in Routing Pool`.
  3. *Engine Assertion*: Partner added to deterministic routing matrix with starting capacity of 15/day. Credentials created for `/partner/home`.
  4. *Verification*: Next diagnostic service request automatically includes Arogya in candidate ranking.

---

## J-15: Chapter Provisioning & Go-Live Readiness (P15)

- **Cast**: Regional Admin (`RA`), Chapter Manager (`CM`), National Manager (`NM`).
- **Initial State**: Launching new Ekta Hub in Belagavi South.
- **Steps**:
  1. `[RA]` Open `/chapters/new`.
     - Hub Name: "Belagavi South Ekta Hub".
     - Region: North Karnataka (`KA-NORTH`).
     - Click `Save Chapter`.
  2. `[CM]` Navigate to `/admin/settings?tab=pilot-readiness`.
     - Readiness checklist shows Belagavi as `Incomplete (Red)`:
       - [x] Chapter Record Created
       - [ ] Staff Roster Provisioned (Missing VF & CT)
       - [ ] Initial Cohort Enrolled ($\ge 20$ members required)
       - [ ] Local Language Templates Configured
  3. `[CM]` Click remediation links directly from checklist $\to$ assign staff and import initial cohort.
  4. *Engine Assertion*: Checklist dynamically turns `100% Ready (Green)`. Generates `GO_LIVE_AUTHORIZATION` task for NM.
  5. `[Switch to NM]` Open `/inbox`, click `Authorize Chapter Go-Live`.
  6. *Verification*: Chapter badge switches from `Provisioning` to `Live & Operational`; appears in active chapter filters.

