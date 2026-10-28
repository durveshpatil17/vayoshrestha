# VAYOSHRESHTHA — Page Specifications (v2 Pilot Inventory)

This document contains interaction, layout, and authorization specifications for all 45 distinct views across the 9 functional groups (A to I) of the Vayoshreshtha v2 Pilot.

---

## Group A: Public & Authentication

### 1. `/login`
- **Roles**: All Staff (SA, NM, RA, CM, VF, CT, CD)
- **Layout**: Centred card (max-width 420px) on subtle background `#F5F6F7`.
- **Elements**: 
  - Vayoh Vikas institutional crest, title "Vayoshreshtha Staff Portal".
  - Email and password input with show/hide password toggle.
  - Caps-lock indicator alert.
  - Generic non-enumerating error messages ("Invalid email or password").
  - Account lockout banner after 5 consecutive failed attempts (15-min countdown).
  - **Prototype Quick Access Panel**: One-click demo login buttons for all 7 staff roles, plus a direct button to launch the Senior Phone Simulator (`/simulator`).
  - Plain-language privacy policy footer link.

### 2. `/mfa`
- **Roles**: SA, NM (Required multi-factor authentication)
- **Elements**: 6-digit numeric input with auto-advance and paste support. Mock TOTP helper (`123456`). Recovery code fallback option.

### 3. `/forgot-password` & `/reset-password/:token`
- **Roles**: Public / Unauthenticated
- **Elements**: Email request form. Reset password screen with inline strength meter (length >= 8, uppercase, lowercase, number, symbol), and expired-token simulation state.

### 4. `/first-login`
- **Roles**: Authenticated users flagged with `mustChangePassword: true`
- **Elements**: Mandatory password change input + data protection & privacy acknowledgement checkbox ("I agree to abide by DPDP data minimization principles").

### 5. `/privacy`
- **Roles**: All / Public
- **Elements**: Plain-language policy explaining data minimization, purpose limitation, next-of-kin safety fallback SMS consent, and optional ABDM ABHA linkage.

### 6. System Fallbacks: `/session-expired`, `/403`, `/404`, `/offline`
- **`/403`**: Displays missing capability code, active user role, and a "Return to Dashboard" button.
- **`/session-expired`**: Preserves validated return-to path.
- **`/offline`**: Advises staff when browser loses network connectivity.

---

## Group B: Shell & Global Chrome

### 7. Global App Shell
- **Sidebar (256px)**: Role-filtered navigation links with Horizon blue `#0070F2` selection fill and text.
- **Top Bar (52px)**:
  - **Scope Switcher**: Regional Admins see assigned region; Chapter Managers and Volunteers see assigned chapter.
  - **Global Senior Search**: Debounced search by Name, Phone last 4, or Member ID, obeying field masking and scope isolation.
  - **Live SOS Indicator**: Real-time counter pill (e.g. `🚨 2 Open`) linked directly to `/sos`.
  - Notification bell with unread count.
  - Audio Chime toggle (Muted by default; audio synthesis beep on new SOS).
  - Help link and User Profile dropdown.
- **Fixed Ribbon**: 20px top banner: *"Prototype · synthetic data only"*.

### 8. `/notifications`
- **Roles**: All Staff
- **Elements**: Filterable list (SOS alerts, anomaly flags, approval requests, failed SMS/WhatsApp dispatches). Mark as read/unread.

### 9. `/account`
- **Roles**: All Staff
- **Elements**: Personal profile info, password change, notification preference checkboxes, active session devices.

### 10. `/help`
- **Roles**: All Staff
- **Elements**: Role-specific operating guides, standard operating procedures for SOS handling, and emergency support contacts.

---

## Group C: Role-Specific Dashboards (`/`)

### 11. Regional Admin & NGO Management Home (`RA`, `NM`)
- **Elements**:
  - Live critical-alert strip.
  - 4 headline numeric tiles (Registered vs 1,000, open SOS, median time to acknowledge, medication confirmation rate).
  - A key-value list for the remaining measures (Active, reminders delivered today, open anomaly flags, stalled onboardings).
  - Chapter comparison table.
  - 90-day pilot timeline.
  - "Needs attention" row list.

*Rule for every role home*: At most 4 headline tiles, everything else as lists or tables.

### 12. Chapter Manager Home (`CM`)
- **Elements**: Chapter-scoped operational overview: Open SOS within hub, Today's medication reminders & responses, Flags awaiting wellness calls, Stalled onboarding funnel, Today's duty roster.

### 13. Field Volunteer Home (`VF`)
- **Elements**: My assigned seniors list, Assisted onboarding tasks in progress, Pending wellness follow-up calls, Assisted vitals recording checklist.

### 14. Care Team / Responder Home (`CT`)
- **Elements**: Assigned active SOS cases, Health anomaly flags sorted by SLA timer (24h countdown), Recently resolved cases log.

### 15. System Administrator Home (`SA`)
- **Elements**: Integration status (WhatsApp gateway, SMS gateway, Scheduler), Queue depth and simulated latency graph, Delivery failure rates, Account lockout monitor, Storage quota usage gauge.

### 16. CSR / Donor Reviewer Home (`CD`)
- **Elements**: High-level impact KPIs with explicit definitions, aggregate charts only, zero individual PII, small-number rule (`<5`) enforced.

---

## Group D: Module 1 — Emergency SOS Routing

### 17. `/sos` — Live SOS Board
- **Roles**: RA, CM, CT, NM (SA sees masked metadata only)
- **Real-Time Cross-Talk**: List updates instantaneously across tabs via `BroadcastChannel`.
- **Elements**:
  - Critical persistent red banner for active emergencies.
  - Table Columns: Live alert age timer (`00:42`), Senior Name & Member ID (masked), Chapter, Network status at trigger (Online / Disconnected), Fallback SMS status, Incident status (`Triggered`, `Acknowledged`, `Assigned`, `Resolved`), Assignee, SLA countdown chip.
  - Row Actions: Acknowledge, Assign Responder, Call Senior (simulated), Escalate, Mark as Drill.
  - Filter: All / Real Events / Drill Mode.

### 18. `/sos/:id` — Case Detail View
- **Elements**:
  - Interactive Incident Timeline: Triggered -> Enqueued -> Dashboard alerted (with simulated latency in ms) -> Acknowledged -> Responder Assigned -> Senior/NOK Contacted -> Resolved.
  - Senior Identity & Emergency Contacts Card (unmasked for assigned responders and chapter/regional leads).
  - **Cellular Fallback SMS Panel**: Trigger reason ("Data connection dropped mid-transaction"), Target Next-of-Kin numbers, SMS delivery receipt timestamp, Manual retry button.
  - Location Pin Card: Static placeholder card with physical street address and landmark text (map-less).
  - Clinical Safety Disclaimer: *"Call 112 immediately in life-threatening medical emergencies."*
  - Case notes journal, resolution outcome selector (Medical assistance, False alarm, Cancelled by senior, Drill), and audit trail snippet.

### 19. `/sos/history`
- **Elements**: Historical log of all closed SOS cases. Filters by Region, Chapter, Date range, Outcome, Real vs Drill. Response time distribution chart. Gated CSV export with audit reason modal.

### 20. `/sos/settings`
- **Roles**: RA (Submit), NM (Approve), SA (Read)
- **Elements**: Acknowledgement SLA (default 2 min), Auto-escalation chain intervals (Chapter Manager -> Regional Admin -> Care Team/NM), Fallback dispatch rule (First delivered vs All contacts), SMS wording template editor per language, Emergency 112 notice text. Versioned with approval status.

### 21. `/sos/drills`
- **Roles**: RA, CM, NM, CT
- **Elements**: Drill schedule manager. "Run Simulated Drill" wizard selecting test seniors and target hub. Drill performance metrics (measured alert latency, acknowledgment speed) strictly partitioned from pilot operational statistics.

### 22. `/sms-log`
- **Roles**: RA, CM, CT, SA
- **Elements**: Outbound SMS fallback queue and delivery ledger. Statuses: `Queued`, `Sent`, `Delivered`, `Failed`. Failure reason chips (Invalid number, Network timeout, DND blocked), and single-click retry action.

---

## Group E: Module 2 — Medication & Vital Logs

### 23. `/health` — Overview
- **Roles**: RA, CM, NM, CT
- **Elements**: Medication confirmation rate trend chart, Vitals logging compliance rate, Anomaly flags volume, Completed wellness calls. Chapter breakdown table.

### 24. `/health/schedules`
- **Roles**: CM, VF (assigned), RA
- **Elements**: Senior medication schedules roster. Columns: Senior, Prescription Label (e.g. "Morning wellness prescription"), Scheduled Time (e.g. `08:00 IST`), Frequency (Daily/Weekly), Preferred Language, Status (Active/Paused). Bulk schedule assign modal.

### 25. `/health/reminders` & `/health/reminders/:id`
- **Roles**: RA (Submit), NM (Approve), CM/CT (Read)
- **Elements**: Reminder template directory. Editor includes dynamic variable chips (`{name}`, `{time}`, `{chapter}`), per-language translations, and an interactive **WhatsApp message bubble preview** featuring the interactive quick-reply buttons (Taken / Not yet / Skip) and blood pressure/glucose logging prompt.

### 26. `/health/logs`
- **Roles**: CM, RA, CT, VF
- **Elements**: Raw log of all logged confirmations and readings. Filters by Type (Medication, Blood Pressure, Blood Glucose), Chapter, Date, Flagged status.

### 27. `/health/flags` — Anomaly Queue
- **Roles**: CM, CT, RA, VF
- **Elements**: Anomaly triage queue. Displays reading value, risk band crossed (High-risk, Critical), Rule version.
- **Action**: "Open Wellness Check-in Call" prompt opening a structured non-clinical modal:
  - Non-clinical conversational script (inquire about wellbeing, confirm readings, prompt local clinic visit).
  - Outcome recording form: `Reached — Well`, `Reached — Follow-up Needed`, `No Answer`, `Escalate to SOS`.
  - SLA timer for overdue check-ins.

### 28. `/health/calls`
- **Roles**: CM, VF, CT
- **Elements**: Directory of scheduled and completed wellness call tasks. Assignee selector, attempt counter, recorded notes.

### 29. `/health/rules` — Threshold Configuration
- **Roles**: CT (Propose), NM (Approve), Others (Read)
- **Prominent Banner**: *"Placeholder — to be set by a qualified clinician and approved by NGO Management"*.
- **Elements**: Band matrix for Blood Pressure (Systolic/Diastolic) and Glucose: Normal, Watch, High-risk, Critical. Action configuration (Log only, Flag for wellness call, Escalate to SOS). "Test a Reading" sandbox simulator.

---

## Group F: Module 3 — Onboarding & ABHA-Ready Profiles

### 30. `/onboarding` — Funnel & Stalled Pipeline
- **Roles**: CM, VF, RA, NM, CD (Aggregates)
- **Elements**:
  - Visual 7-step Onboarding Funnel: Invited -> Started -> Name -> Language -> Emergency Contact -> Consent -> Completed.
  - Stalled Onboarding List with "Days Stalled" chip, "Send Nudge" action (consent-gated), and "Assign Field Volunteer for Assisted Onboarding".

### 31. `/onboarding/new` — Assisted Onboarding Wizard
- **Roles**: CM, VF
- **Elements**: 7-Step Step-by-Step Assisted Form:
  1. Identity & Declaration: Assisting volunteer name, relationship, declaration.
  2. Full Name: English & regional script name.
  3. Language: Preferred communication channel language.
  4. Emergency Contacts: Next-of-Kin 1 (Full name, relationship, +91 mobile, safety consent) + optional Contact 2.
  5. **ABHA (Phase 2 Ready)**: Optional 14-digit ABHA input (`XX-XXXX-XXXX-XXXX`), format validation, separate ABDM consent toggle, Phase 2 badge.
  6. Medication Schedule: Optional morning prescription schedule.
  7. Review & Submit: Instant duplicate detection check. On submit, issues `VV-<CHAPTER>-<YY>-<SEQ>` ID, displays printable welcome card, and triggers welcome WhatsApp message (if consented).

### 32. `/onboarding/script` — Bot Script Editor
- **Roles**: RA (Submit), NM (Approve), CM/VF (Read)
- **Elements**: Sequential script builder showing bot prompts, validation criteria, and regional language variations. Includes a live interactive phone preview pane showing the script execution.

### 33. `/seniors` — Senior Citizen Directory
- **Roles**: CM (Chapter), VF (Chapter/Masked), RA (Region), NM, SA (Masked)
- **Elements**: High-density table: Membership ID, Senior Name, Age Band / DOB, Chapter, Language, Consent Status, Next-of-Kin status, ABHA Status (`Not provided` / `Provided, not verified`), Flagged state. Bulk communication nudge and CSV export.

### 34. `/seniors/:id` — Senior Profile 360 View
- **Elements**:
  - Header: Membership ID, Name, Photo placeholder avatar, Chapter, Status tags.
  - Tabs:
    1. **Overview**: Key personal demographics, language, address.
    2. **Emergency Contacts**: Next-of-Kin priority list, simulated "Send Test SMS" button, missing contact warning banner.
    3. **Consent & Language**: Granular consent registry (WhatsApp communications, Safety fallback SMS, ABDM linkage), consent audit timeline, withdrawal action.
    4. **ABHA (Phase 2 Ready)**: Masked ABHA number (`••-••••-••••-1234`), optional ABHA address, status badge "Provided, not verified", disabled "Link ABHA" button tagged **Phase 2**.
    5. **SOS History**: Senior's past emergency dispatches and resolution logs.
    6. **Health Logs**: Medication adherence calendar and longitudinal BP/glucose trend charts with shaded threshold bands.
    7. **Communication Log**: WhatsApp & SMS message history with delivery receipts.
    8. **Audit Trail**: Field-level modification log for this profile.

### 35. `/seniors/:id/edit`
- **Roles**: CM, VF (limited fields), RA
- **Elements**: Edit form with inline validation, audited before/after diff summary, and "Deactivate Senior" type-to-confirm modal.

---

## Group G: WhatsApp & SMS Simulator

### 36. `/simulator`
- **Roles**: All Staff (Training & Demo) + Senior Citizen Persona
- **Layout**: 3-Pane Side-by-Side Canvas:
  - **Pane 1: Senior Citizen WhatsApp Phone Frame**:
    - Unbranded WhatsApp-style chat interface.
    - Full Onboarding bot flow.
    - Main Menu: 🚨 Trigger Emergency SOS (first & prominent), Medication & readings, My details, Talk to a person, Stop messages.
    - SOS Trigger flow with instant acknowledgement, Cancel option, and status ticks.
    - **"Simulate Data Disconnect" toggle switch**: cuts simulated data network to trigger fallback.
    - 08:00 Morning Reminder card with quick-reply buttons (Taken / Not yet / Skip) and blood pressure/glucose entry parser (e.g. `130/85`, `112 mg/dl`).
    - Language switcher.
  - **Pane 2: Next-of-Kin SMS Phone Frame**:
    - Displays incoming transactional SMS fallback messages with priority indicator.
  - **Pane 3: System Event Ticker**:
    - Real-time logging console displaying Enqueue events, Webhook receipts, Gateway dispatches, and measured latency in milliseconds.
    - Synchronized across browser tabs via `BroadcastChannel`.

---

## Group H: Reports

### 37. `/reports/pilot` — Pilot Outcomes Dashboard
- **Roles**: NM, RA (Region), CM (Chapter), SA (System), CD (Aggregates)
- **Elements**:
  - Enrollment progress: Registered vs 1,000 target.
  - Onboarding funnel completion rate.
  - SOS Summary: Real vs Drill count, Latency distribution, Median time to acknowledge, % within SLA, SMS fallback delivery rate.
  - Medication confirmation rate & Vitals logging adherence rate.
  - Anomaly flags raised and wellness check-in completion velocity.
  - "View as Table" toggle and audited export.
  - Small-number suppression (`<5`) enforced for `CD` role.

### 38. `/reports/definitions`
- **Roles**: All Staff
- **Elements**: Glossary of pilot metrics, standard KPI calculation formulas, and configurable reporting window definitions.

---

## Group I: Administration & Governance

### 39. `/admin/users`, `/admin/users/new`, `/admin/users/:id`
- **Roles**: SA (CRUD), NM (Read)
- **Elements**: Staff directory, invite modal, role assignment, region/chapter assignment, account unlock, active session termination, and user audit logs.

### 40. `/admin/roles`
- **Roles**: SA (Propose), NM (Approve)
- **Elements**: Interactive 28-capability matrix grid, role modification proposal modal, and impact preview. SA cannot be granted clinical or health-log permissions.

### 41. `/admin/chapters`
- **Roles**: SA, NM (CRUD), RA/CM (Update Roster)
- **Elements**: 3 Regions (South, West, North) and 9 Chapters (Bengaluru, Mysuru, Pune, Nashik, Nagpur, Jaipur, Lucknow, Chennai, Indore). Address, languages served, and **SOS Duty Roster** (on-call staff, shift hours, escalation sequence).

### 42. `/admin/settings`
- **Roles**: SA
- **Elements**:
  - Pilot configuration: Target (1,000 seniors), Active window (14 days), Quiet hours (21:00–07:00 IST), Daily message volume cap.
  - Feature flags: ABHA capture toggle, Drill mode toggle, SOS chime default.
  - Data retention settings.
  - **"Reset Demo Data to Initial Seed"** button with confirmation modal.

### 43. `/admin/approvals`
- **Roles**: NM (Approve/Reject), Others (View own submissions)
- **Elements**: Unified governance queue for Reminder Templates, Threshold Rules, SOS Settings, Onboarding Scripts, and Role Changes. Maker-checker enforcement (makers cannot self-approve).

### 44. `/admin/audit-logs`
- **Roles**: SA, NM (Summary), RA (Region SOS & access)
- **Elements**: Complete immutable audit ledger with before/after diff viewer, cryptographic hash-chain verification badge, and reason-gated export.

### 45. `/admin/integrations`
- **Roles**: SA (Configure/Test), NM/RA (Read)
- **Elements**: Integration status monitors for WhatsApp Webhook, SMS Gateway, and Cron Scheduler. Real-time Queue Depth and simulated Enqueue-to-Dashboard Latency chart. Delivery failure error breakdown with bulk retry trigger.
