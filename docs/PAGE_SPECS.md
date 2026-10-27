# VAYOSHRESHTHA — Page Specifications (Inventory 1–92)

Every screen in the Vayoshreshtha platform is specified below with route, role authorizations, key interactions, states, and FR mapping.

---

## Group A: Public & Authentication

### 1. `/login`
- **Roles**: All / Public
- **Features**: Dual tabbed authentication interface: (1) Staff & Partners (Email + Password), (2) Senior Citizen & Family Member (Mobile + OTP).
- **Interactions**: Password visibility toggle, caps-lock detector, 1-click "Prototype Access" persona switcher (10 roles), lockout indicator, language switcher, link to privacy notice.
- **States**: Loading button, invalid credentials (generic message to prevent user enumeration), locked-out account (15 min timer).

### 2. `/verify-otp`
- **Roles**: SC, FM
- **Features**: 6-box segmented OTP input, 30s resend timer, max 3 attempts before 15m lockout. Mock valid OTP: `123456`.
- **States**: In-flight verification skeleton, expired OTP, invalid attempt counter.

### 3. `/mfa`
- **Roles**: SA, NM (mandatory 2FA)
- **Features**: 6-digit TOTP input, fallback to single-use emergency recovery code. Mock TOTP: `123456`.
- **States**: Code expired, invalid code, recovery mode toggle.

### 4. `/forgot-password`, `/reset-password/:token`
- **Roles**: Staff (SA, NM, PM, CC, VF, SP, CT, CD)
- **Features**: Email submission, password strength meter (min 10 chars, uppercase, digit, symbol), confirm password.
- **States**: Request sent notification (doesn't reveal if email exists), expired reset token warning with re-request CTA.

### 5. `/first-login`
- **Roles**: All newly created staff accounts
- **Features**: Forced password rotation on initial access, mandatory acknowledgement checkbox for Vayoh Vikas Data Protection & Elder Safeguarding Code of Conduct.

### 6. `/privacy`
- **Roles**: All / Public
- **Features**: Plain-language, versioned privacy and consent declaration explaining why data is collected, DPDP Act compliance, data minimization, right to withdrawal, grievance officer contacts.

### 7. `/session-expired`, `/403`, `/404`, `/offline`
- **Roles**: All
- **Features**:
  - `/session-expired`: Notice after 15m inactivity with return-to path parameter.
  - `/403`: Institutional forbidden screen naming the missing permission and active role with back button.
  - `/404`: Clean page not found with navigation links.
  - `/offline`: Dev-tools simulation showing cached state and reconnect instructions.

---

## Group B: Global Shell & Universal Screens

### 8. App Shell (`/`)
- **Roles**: All authenticated
- **Features**: 26px synthetic data ribbon, 56px top bar with active centre switcher (limited to user's assigned hubs), global member search box (with masking and scope bounds), notifications bell, help icon, user avatar profile menu. 248px role-filtered collapsible left navigation.

### 9. `/notifications`
- **Roles**: All authenticated
- **Features**: Central feed categorised into Tasks, Approvals, Escalations, and Delivery Alerts. Filter by Unread / All. One-click "Mark all as read".

### 10. `/account`
- **Roles**: All authenticated
- **Features**: User profile details, password reset, TOTP MFA configuration (SA/NM), active login session list with "Sign out other devices", language preferences, and text-scaler selector (18px/20px/22px).

### 11. `/help`
- **Roles**: All authenticated
- **Features**: Role-specific FAQs, Ekta Hub coordinator support contact numbers, direct link to raise formal complaints (`/complaints/new`).

---

## Group C: Role-Specific Dashboards (Home at `/`)

### 12. NM / PM Dashboard
- **Features**: Primary KPI strip (Registered vs 1,000 target, Active members, Participants this month, Total attendance, Unique attendees, Delivery rate, Open escalations). 90-day pilot progress tracker (Discovery → Configure → Launch → Operate → Review). Centre comparison chart, attendance trends, and "Needs Attention" queue.

### 13. SA Dashboard (System Health)
- **Features**: Integration status indicators (WhatsApp Gateway, Webhooks, Scheduler Queue, Local Storage Quota), failed notification telemetry, locked account counter, pending role approvals, recent audit event stream.

### 14. CC Dashboard (Centre Head)
- **Features**: Today's active sessions at assigned Ekta Hub(s), live attendance status, attendance correction requests pending approval, follow-ups due today, new registrations, centre-level escalations.

### 15. VF Dashboard (Volunteer "My Day")
- **Features**: Assigned sessions for today with large "Mark Attendance" triggers, quick assisted registration starter, assigned follow-up checklist.

### 16. SP Dashboard (Service Partner Portal)
- **Features**: Referrals received, in-progress cases, completed consultations this month, average response turnaround SLA, active clinic availability toggle.

### 17. CT Dashboard (Care Team / Clinical Routing)
- **Features**: Health triage caseload sorted by SLA urgency countdown (Overdue / Critical <2h / Normal <24h), non-clinical routing banner, recently resolved cases.

### 18. CD Dashboard (CSR / Donor Reviewer)
- **Features**: Released governance reports, aggregate headline figures (all with `<5` small-number suppression), pilot KPI definitions footer.

### 19. SC Dashboard (Senior Citizen Home)
- **Features**: Large 18px typography, next booked programme card with date/time/hub, browse recommended activities, incoming announcements, high-contrast "Ask for Help" button, language toggle.

### 20. FM Dashboard (Family Member Portal)
- **Features**: Linked senior profile switcher, upcoming session schedules of linked elders, "Book on Behalf" action, "Request Assistance", consent indicator.

---

## Group D: Senior Citizen Management (FR-05–09)

### 21. `/members`
- **Roles**: PM, CC(s), VF(s,m), NM, SA(m)
- **Features**: Searchable data table of 1,000 members. Filters: Ekta Hub, Status (Active/Registered/Opted-out), Language, Assisted Flag, Consent State, Age Group. Bulk actions (Assign Centre, Send Consent Request), gated CSV export. Masked phone (`••••••3421`).

### 22. `/members/new`
- **Roles**: PM, CC, VF
- **Features**: 5-step stepper: 1. Identity, 2. Contact & Language, 3. Centre & Programmes, 4. Consent & Privacy, 5. Review & Submit. Assisted Registration toggle capturing proxy details. Real-time duplicate detector (Name + DOB + Phone). Auto-generates ID `VV-<hub>-26-<seq>`. Direct print membership card CTA.

### 23. `/members/:id`
- **Roles**: PM, CC(s), VF(s,m), NM, SA(m), CT(a), SC(o), FM(l)
- **Features**: Header with photo placeholder, membership ID, status badges. Tabs: Overview, Consent & Preferences (with audit timeline and Revoke action), Participation, Attendance Calendar Heatmap, Referrals & Services, Feedback & Follow-ups, Communication Log, Family Links, Audit Trail. Masked phone with "Reveal" button requiring typed reason.

### 24. `/members/:id/edit`
- **Roles**: PM, CC(s), VF(s, limited fields)
- **Features**: Update contact, emergency details, language, centre assignment. Audited with before/after diff.

### 25. `/members/:id/card`
- **Roles**: All authorized to view member
- **Features**: Printable 85mm×54mm physical membership card layout with high-contrast text, Ekta Hub name, emergency contact, issue date, and NGO helpline.

### 26. `/members/:id/deactivate` (Dialog)
- **Roles**: PM, CC(s)
- **Features**: Formal deactivation modal requiring typed reason, category (Moved away, deceased, withdrawn consent), and typed confirmation "DEACTIVATE".

### 27. `/members/duplicates`
- **Roles**: PM
- **Features**: Potential duplicate resolution queue. Side-by-side comparison of 2 records with field-by-field merge selector and audit recording.

---

## Group E: Centre Management (Ekta Hubs) (FR-10–13)

### 28. `/centres`
- **Roles**: SA, NM, PM, CC(s), VF(s), CT, CD(agg), SC(pub), FM(pub)
- **Features**: Directory of 6 pilot Ekta Hubs. Card / Table toggle. Snapshot cards with active member count, monthly sessions, and attendance percentage.

### 29. `/centres/new`, `/centres/:id/edit`
- **Roles**: SA, NM, PM
- **Features**: Centre creation form: name, hub code, address, ward, contact person, seating capacity, accessibility facilities (ramps, elevators, elder-friendly restrooms), weekly operating hours grid.

### 30. `/centres/:id`
- **Roles**: SA, NM, PM, CC(s), VF(s), CD(agg)
- **Features**: Detail page with tabs: Overview, Weekly Schedule, Coordinators & Field Staff (assign/unassign with date limits), Active Programmes, Participation & Drop-off Analytics, Centre Members Directory.

---

## Group F: Programme & Event Management (FR-14–18)

### 31. `/programmes`
- **Roles**: All staff, SP(pub), CD(agg), SC(pub), FM(pub)
- **Features**: Calendar / List view. Filter by category (Yoga, Digital Literacy, Health Camp, Legal Aid, Social), centre, and status (Draft, Published, Ongoing, Completed).

### 32. `/programmes/new`, `/programmes/:id/edit`
- **Roles**: SA, NM, PM, CC(s)
- **Features**: Programme builder: title, description, category, target age group, recurring schedule, capacity limits, waitlist toggle, walk-in policy, hub assignment, multi-language descriptions.

### 33. `/programmes/:id`
- **Roles**: All staff, CD(agg), SC(published)
- **Features**: Tabs: Details, Sessions (list with attendance status flags), Registrations (capacity meter, waitlist auto-promotion, cancel booking), Attendance Summary, Feedback Metrics, Publish & Visibility controls.

### 34. `/schedule`
- **Roles**: All staff, SC, FM
- **Features**: Unified interactive monthly/weekly schedule grid. Quick filter by assigned Ekta Hub and category.

### 35. `/sessions/:id`
- **Roles**: All staff
- **Features**: Individual session page: participant roster, capacity meter, walk-in records, attendance lock timer, coordinator notes, link to Mark Attendance.

---

## Group G: Attendance Management (FR-19–22)

### 36. `/attendance`
- **Roles**: VF, CC, PM, NM, SA
- **Features**: Session tracker organized by Today's Sessions, Upcoming, and Missing Attendance (>24h unrecorded). Quick filter by centre.

### 37. `/attendance/session/:id`
- **Roles**: VF(s), CC(s)
- **Features**: High-contrast roster with large Present / Absent touch targets. "Mark All Present" shortcut. Walk-in registration modal (search existing member or quick-register). Lock countdown timer. Unsaved changes guard.

### 38. `/attendance/corrections`
- **Roles**: CC, PM, VF(request)
- **Features**: Maker-checker correction queue. Lists member, session date, original mark, requested mark, reason, requester. Approve / Reject with mandatory note. Strict rule: Requitter cannot approve their own submission.

### 39. `/attendance/history`
- **Roles**: PM, CC(s), NM
- **Features**: Longitudinal attendance ledger with filters by member, programme, and centre. Attendance calendar heatmap. Export button with mandatory audit reason.

---

## Group H: Communication & WhatsApp Simulator (FR-23–29)

### 40. `/communication`
- **Roles**: PM, CC, NM, SA
- **Features**: Broadcast overview: monthly volume vs cap (e.g., 2,000 / 10,000), delivery success percentage, opt-out rate, pending announcement approvals.

### 41. `/communication/templates`
- **Roles**: PM, CC, NM, SA
- **Features**: Directory of WhatsApp message templates categorized by Booking Confirmation, Session Reminder, Announcement, and Educational Tip. Language variants (English, Hindi, Marathi). Provider approval badges.

### 42. `/communication/templates/new`, `/communication/templates/:id`
- **Roles**: PM (author), NM (approver)
- **Features**: Template editor with dynamic variable tokens (`{name}`, `{programme}`, `{time}`, `{centre}`). Live interactive WhatsApp chat bubble preview with character counter.

### 43. `/communication/announcements`, `/communication/announcements/new`
- **Roles**: PM, CC(s) author; NM approver
- **Features**: Broadcast announcement composer. Dynamic audience selector: filter by Hub, enrolled programme, language. Live audience calculator showing Eligible vs Excluded (Opted-out / No Consent). Volume cap validation. Submit to maker-checker queue.

### 44. `/communication/delivery`
- **Roles**: SA, NM, PM, CC(s)
- **Features**: Real-time message dispatch ledger showing state progression: *Queued → Sent → Delivered → Read* or *Failed*. Filter by failure reason (Opted-out, Invalid Number, Rate Limit). SA retry action.

### 45. `/communication/consents`
- **Roles**: PM, CC(s), NM
- **Features**: Registry of senior citizen consent states: Opted In, Opted Out, Pending. Bulk reminder trigger to collect physical consent forms. Full opt-out audit log.

### 46. `/communication/simulator`
- **Roles**: PM, CC, SA, NM (and `/me/simulator` for Seniors)
- **Features**: Authentic mobile phone frame simulating the senior citizen WhatsApp journey: language selection menu (1. English, 2. Hindi), interactive text menu (1. My Bookings, 2. Upcoming Programmes, 3. Request Service, 4. Talk to Coordinator, 5. STOP). Real-time response generation wired to the mock database.

---

## Group I: Services & Referrals (FR-30–34)

### 47. `/services`
- **Roles**: All staff, SP, SC(pub), FM(pub)
- **Features**: Service catalogue: Physiotherapy, Eye Care, Legal Aid Clinic, Pension Helpdesk. Provider name, centre availability, consultation fee (₹0 for pilot NGO services).

### 48. `/services/new`, `/services/:id`
- **Roles**: PM, NM(approve), SP(own submit)
- **Features**: Service configuration form: service name, description, partner organization, eligibility criteria, booking slots, NM maker-checker approval workflow.

### 49. `/service-requests`
- **Roles**: All staff, SC(o), FM(l)
- **Features**: Service booking queue: requested, confirmed, completed, cancelled. Ability for coordinators to book on behalf of seniors.

### 50. `/referrals`
- **Roles**: PM, CC(s), NM, SA(R), CT(a), SP(a)
- **Features**: Referral lifecycle management: Table view and Kanban pipeline (*Created → Sent → Accepted → In Progress → Closed*). Aging indicators (>7 days without update).

### 51. `/referrals/new`
- **Roles**: PM, CC, VF(propose), CT
- **Features**: Create referral modal: member picker (validates consent for external partner sharing), approved partner picker, service type, non-clinical reason, urgency tag.

### 52. `/referrals/:id`
- **Roles**: PM, CC(s), NM, CT(a), SP(a)
- **Features**: Referral timeline with status updates. Shared data panel detailing exactly which fields are exposed to the partner. Closure modal requiring outcome code.

### 53. `/partners`, `/partners/new`, `/partners/:id`
- **Roles**: PM, NM(approve), SA(R)
- **Features**: Directory of vetted community partners. Profile, operational addresses, signed MoU documentation, assigned services, NM onboarding approval.

### 54. Partner Dedicated Portal (`/partner/*`)
- **Roles**: SP (Approved Service Partner)
- **Sub-routes**:
  - `/partner/home`: Summary of pending referrals and active consultations.
  - `/partner/referrals`: List of referrals assigned strictly to the partner's organisation.
  - `/partner/referrals/:id`: Detail view displaying only shared fields (name, age band, urgency, non-clinical notes); status update dropdown (*Accepted / In Progress / Closed*).
  - `/partner/profile`: Clinic address, contact details, operating days.
  - `/partner/reports`: Aggregated monthly consultation counts and average resolution turnaround.

---

## Group J: Feedback & Follow-up (FR-35–38)

### 55. `/feedback`
- **Roles**: PM, CC(s), NM, CD(agg)
- **Features**: Feedback analytics and responses. 5-star rating distributions, theme tags (Instructor Quality, Venue Accessibility, Content Clarity), verbatim quotes with neutral tagging.

### 56. `/feedback/forms`, `/feedback/new`
- **Roles**: PM (form builder), VF (assisted entry)
- **Features**: Feedback form template editor (Rating scale, Yes/No, Short text). `/feedback/new` allows field volunteers to enter oral feedback collected from seniors after sessions.

### 57. `/follow-ups`
- **Roles**: PM, CC(s), VF(a)
- **Features**: Task board for welfare check-ins and session inquiries. Member name, reason, due date, assignee, status (Pending, Contacted, Escalated, Closed), overdue highlighting, bulk reassignment.

### 58. `/engagement`
- **Roles**: PM, CC(s)
- **Features**: Member drop-off detector (seniors absent for >30 days). Rule-based recommendation engine showing exact triggering criteria (e.g., "Attended 3 Yoga classes → Recommend Mobility & Balance Workshop").

---

## Group K: Health & Assisted Support (FR-39–42)

### 59. `/support/requests`
- **Roles**: PM, CC(s), CT(a)
- **Features**: Dedicated health assistance triage queue. Mandatory non-clinical disclaimer banner. Urgency tags (Low, Medium, Immediate), intake channel (WhatsApp, Hub visit, Family call), routed destination.

### 60. `/support/escalations`, `/support/escalations/:id`
- **Roles**: CC(s), PM, CT(a), NM(agg)
- **Features**: Active escalation case files with real-time countdown timer against SLA (2h for critical, 24h for standard). Timeline of notes, care team assignment, resolution protocol, and coordinator notification.

### 61. `/support/rules`
- **Roles**: SA (edit), NM (approve), PM/CT (read)
- **Features**: Warning-sign trigger rules configurator. Keyword matching engine (e.g., "dizziness", "fell down", "chest pain", "lonely"), severity level mapping, target assignee, SLA hours. Includes interactive "Test a Message" simulation tool.

### 62. `/support/voice-checkins`
- **Roles**: PM (manage), CC(R), CT(R) [Feature-Flagged]
- **Features**: Automated outbound voice check-in scheduler simulation. Call campaign setup, script preview, member consent verification, mock call outcomes (Completed, Unanswered, Help Requested).

### 63. `/support/handover` (Dialog)
- **Roles**: PM, CC, CT
- **Features**: Modal to escalate a WhatsApp simulation or field incident to a human specialist with handover notes and urgency level.

---

## Group L: Dashboards & Reporting (FR-43–49)

### 64. `/reports`
- **Roles**: NM, PM, CC(s), SA, SP(own), CD(released)
- **Features**: Central report directory with quick navigation cards to operational, member, attendance, outcome, and donor reports.

### 65. `/reports/overview`
- **Roles**: NM, PM, CC(s)
- **Features**: Executive operations report: 90-day pilot KPIs, target attainment, centre-by-centre cross-tabulation.

### 66. `/reports/centres`, `/reports/programmes`
- **Roles**: NM, PM, CC(s)
- **Features**: Deep-dive analytics on hub utilization and programme attendance popularity.

### 67. `/reports/members`
- **Roles**: NM, PM, CC(s)
- **Features**: Demographic breakdowns: Age distribution (60–70, 71–80, 81+), gender split (~58% female), preferred language mix (Hindi, Marathi, English), assisted vs self-registered ratio.

### 68. `/reports/attendance`
- **Roles**: NM, PM, CC(s)
- **Features**: Rigorous attendance analytics: Total Attendance marks vs Unique Participants. Repeat attendance histograms, peak weekday patterns. Clear definition notes displayed beneath every chart.

### 69. `/reports/outcomes`
- **Roles**: NM, PM, CC(s)
- **Features**: Referral resolution rates, partner response turnaround times, escalation SLA compliance metrics.

### 70. `/reports/csr`, `/reports/csr/:id`
- **Roles**: PM (draft), NM (release), CD (view released)
- **Features**: CSR Grant Report Builder. Select period, participating hubs, and verified aggregate metrics. Clean print-optimized layout. Small-number suppression applied (`<5` displayed for any sub-group with fewer than 5 members).

### 71. `/reports/exports`
- **Roles**: All authorized roles
- **Features**: Secure export generator. Select dataset, specify mandatory business justification reason, download CSV/PDF with embedded user watermark. Formula injection sanitization (`=`, `+`, `-`, `@` escaped).

### 72. `/reports/definitions`
- **Roles**: All
- **Features**: Comprehensive reference glossary defining: Registered Member, Active Member (attended within last 30 days), Participant, Total Attendance, Unique Attendees, and Engagement Score.

---

## Group M: Administration & Governance (FR-50–55)

### 73. `/admin/users`, `/admin/users/new`, `/admin/users/:id`
- **Roles**: SA (CRUD), NM (R)
- **Features**: User account directory with role filters, centre assignment modal, password reset dispatch, account unlock, and deactivation. Detail view shows permission overrides, active sessions, and audit history.

### 74. `/admin/roles`
- **Roles**: SA (edit), NM (approve)
- **Features**: Interactive Role & Permission Matrix Editor. Displays full 10×31 capability matrix. Impact preview ("34 users affected"). Requires NM approval before changes activate. Prevents granting clinical access to SA.

### 75. `/admin/settings`
- **Roles**: SA
- **Features**: Global configuration: Organisation profile, Pilot dates & target (1,000), Active member definition window (30 days), Attendance lock timeout (12h), WhatsApp message volume cap, Supported languages, Feature flags (Voice check-ins, Family access, Advanced referrals), Session idle timeout (15m), "Reset Demo Data" master action.

### 76. `/admin/approvals`
- **Roles**: NM (approver), PM/CC (submitter), SA (R)
- **Features**: Unified maker-checker approvals inbox. Handles Message Templates, Public Announcements, Partner Onboarding, CSR Reports, and Escalation Rule Changes. Side-by-side change preview. Maker cannot approve own item.

### 77. `/admin/audit-logs`
- **Roles**: SA, NM(summary), CC(s, corrections)
- **Features**: Tamper-evident audit trail with SHA-256 chain simulator. Filters by actor, role, centre, entity, date range. Before/After JSON diff inspector. Logged export.

### 78. `/admin/complaints`, `/complaints/new`
- **Roles**: SA, PM, CC(s), NM(R)
- **Features**: Grievance management system. Formal complaint ticketing, categorization (Staff conduct, Facility accessibility, Service delay), status progression (*New → Assigned → In Progress → Resolved*), threaded replies.

### 79. `/admin/integrations`
- **Roles**: SA, NM/PM(R)
- **Features**: Technical health monitor: WhatsApp Cloud API simulation, webhook latency, message queue depth, failed dispatches by error code, bulk retry mechanism.

### 80. `/admin/data-governance`
- **Roles**: SA, NM(approve), PM(R)
- **Features**: DPDP Act data stewardship panel: Data retention policy schedules, senior citizen correction and deletion requests queue, consent withdrawal ledger, data minimization compliance checklist.

---

## Group N: Senior Citizen Portal (`/me/*`)

### 81. `/me` (Home)
- Large 18px text, clear iconography. Next booked session banner, quick shortcuts to programmes and services, "Ask for Help" button, language switcher.
### 82. `/me/programmes`
- Browse upcoming activities at the senior's registered Ekta Hub. High-contrast "Book Seat" button with simple confirmation dialog.
### 83. `/me/bookings`
- View upcoming booked sessions with calendar details and 1-tap "Cancel Booking" option.
### 84. `/me/messages`
- Direct message inbox for announcements, reminders, and notifications. WhatsApp communication preferences toggles.
### 85. `/me/services`
- Browse approved community services (Physiotherapy, Eye Check-up, Legal Aid) and request a consultation.
### 86. `/me/profile`
- View personal details, digital membership card, recorded consent history, and "Request Data Correction / Deletion" action.
### 87. `/me/feedback`
- Submit 5-star ratings and simple comments on recently attended sessions.
### 88. `/me/help`
- Direct eldercare assistance request form. Clear non-clinical disclaimer. Phone call assistance number.
### 89. `/me/simulator`
- Senior citizen view of the WhatsApp simulated chat experience.

---

## Group O: Authorised Family Member Portal (`/family/*`)

### 90. `/family`
- List of linked seniors with individual consent status chips. Switch active senior context.
### 91. `/family/:seniorId`
- Dedicated proxy dashboard for the selected senior. View upcoming sessions, book activities on their behalf, request services, and view notifications. Persistent banner: *"Viewing on behalf of [Senior Name]"*.
### 92. `/family/links`
- Manage proxy authorizations: request new link to an elder, view pending approval requests, revoke existing authorization, and inspect activity log of actions taken on behalf of the elder.
