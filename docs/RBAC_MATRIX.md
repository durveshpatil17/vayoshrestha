# VAYOSHRESHTHA — Role-Based Access Control (RBAC) Matrix (v2 Pilot)

## 1. Role Definitions

| Code | Role Name | Intended User Persona | Scope of Access | Sensitive Field Handling |
|---|---|---|---|---|
| **SA** | System Administrator | IT & Platform Administrator | Organisation-wide configuration | **Strictly NO clinical or health-log data** |
| **NM** | NGO Management | Vayoh Vikas Executive Leadership | Organisation-wide executive oversight | Full oversight; Maker-checker approver |
| **RA** | Regional Admin | Regional Director / Incident Coordinator | **Assigned Region only** (South, West, North) | Receives critical SOS alerts; manages chapters |
| **CM** | Chapter Manager | Centre Head / Ekta Hub Lead | **Assigned Chapter only** (Hub scope) | Works wellness calls; oversees onboarding |
| **VF** | Field Volunteer | Community Outreach Volunteer | **Assigned Chapter & seniors only** | Masked contact data; assisted tasks |
| **CT** | Care Team / Responder | Clinical Triage Worker / Social Worker | **Assigned cases only** | Emergency contact unmask during open case only; expires 24h post-closure |
| **CD** | CSR / Donor Reviewer | Corporate Funder / Auditor | **Organisation-wide aggregate reports only** | Zero PII; counts < 5 suppressed to `<5` |
| **SC** | Senior Citizen | Elder Beneficiary | **Own record only** (via WhatsApp Simulator) | Large-text self-service mode |
| **NK** | Next-of-kin | Son, Daughter, Caregiver | **SMS Fallback Recipient** | **No web login**; simulated in SMS phone |

---

## 2. 28-Capability Single Source of Truth Matrix

**Legend:**
- **C**: Create | **R**: Read | **U**: Update | **D**: Delete / Deactivate | **A**: Approve (Maker-Checker) | **X**: Export (Audited)
- **Scope Qualifiers**:
  - `(o)`: Own record only
  - `(r)`: Own region only
  - `(c)`: Own chapter only
  - `(a)`: Assigned cases / seniors only
  - `(m)`: Masked fields applied (`••••••3421`, `••-••••-••••-1234`)
  - `(agg)`: Aggregate metrics only (no personal data; `<5` suppression)
  - `—`: Explicit Deny (Default Deny)

| # | Capability Area | SA | NM | RA | CM | VF | CT | CD | SC |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Users, roles, permissions, system settings | CRUD | R | — | — | — | — | — | — |
| 2 | Own account and security | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | — |
| 3 | Chapters, regions, duty rosters | CRUD | CRUD | R,U(r: roster, contacts) | R,U(c: roster) | R(c) | R | R(agg) | — |
| 4 | Senior profiles | R(m) | R | R,U(r) | CRU(c) | CR,U(c,m) | R(a, case-limited) | — | RU(o) |
| 5 | Onboarding (funnel, sessions, assisted onboarding) | R | R | R(r) | CRU(c) | CRU(c) | — | R(agg) | C(o) |
| 6 | Consent, language, opt-out | R | R | R(r) | RU(c) | CR(c) | — | — | RU(o) |
| 7 | Emergency contacts (next-of-kin) | R(m) | R | R(r) | CRU(c) | CRU(c) | R(a, open case only) | — | CRU(o) |
| 8 | ABHA number, ABHA address, ABDM consent (structure only, Phase 2) | — | R(m) | R(m,r) | R,U(c,m) | C,U(c,m) | — | — | RU(o) |
| 9 | Trigger SOS | — | — | — | C(c, on behalf) | C(c, on behalf) | — | — | C(o) |
| 10 | SOS alerts and cases | R(system, m) | R | R,U(r: ack, assign, escalate) | R,U(c: ack, assign) | R(own raised) | R,U(a: respond, resolve) | R(agg) | R(o: status) |
| 11 | SOS escalation chain & SMS fallback log | R,U(retry) | R | R(r) | R(c) | — | R(a) | — | — |
| 12 | SOS settings (SLA, escalation chain, fallback behaviour, SMS wording) | R | A | CRU(r: submit) | R | — | R | — | — |
| 13 | Drill mode events | R | CRU | CRU(r) | CRU(c) | — | R | — | — |
| 14 | Medication schedules (label + time) | — | R(agg) | R(r) | CRU(c) | CRU(c,a) | R(a) | — | R,U(o: preferred time) |
| 15 | Reminder templates (per language) | R | A | CRU(submit) | R | — | R | — | — |
| 16 | Reminder & message delivery status | R,U(retry) | R | R(r) | R(c) | — | — | R(agg) | — |
| 17 | Medication confirmations (adherence log) | — | R(agg) | R(r) | R(c) | R(a) | R(a) | R(agg) | CR(o) |
| 18 | Vitals log (BP, glucose) | — | R(agg) | R(r) | R(c) | C(assisted,a), R(a) | R(a: flagged) | R(agg) | CR(o) |
| 19 | Threshold rules (risk bands) | R | A | R | R | — | CRU(propose) | — | — |
| 20 | Health flags / anomaly queue | — | R(agg) | R(r) | RU(c: assign, close) | R(a) | RU(a) | R(agg) | — |
| 21 | Wellness check-in calls (tasks and outcomes) | — | R(agg) | R(r) | CRU(c) | CRU(a) | CRU(a) | — | — |
| 22 | Dashboards | R(system) | R | R(r) | R(c) | R(my tasks) | R(caseload) | R(agg) | — |
| 23 | Pilot outcome reports | R(system) | R,X | R,X(r) | R,X(c, no PII) | — | — | R(agg) | — |
| 24 | Data exports (any) | X(audit/system) | X | X(r) | X(c) | — | — | X(pilot summary) | X(o: my data) |
| 25 | Audit logs | R,X | R(summary) | R(r: SOS and access events) | — | — | — | — | — |
| 26 | Approvals queue (templates, thresholds, SOS settings, onboarding script, role changes) | R | A | R(own) | R(own) | — | R(own) | — | — |
| 27 | Onboarding script (WhatsApp flow) | R | A | CRU(submit) | R | R | — | — | — |
| 28 | Integration & queue monitor (WhatsApp, SMS, scheduler, queue latency) | RU | R | R(r) | — | — | — | — | — |

---

## 3. Enforcement Mechanisms
1. **5-Layer Defense**: Route Guards -> Sidebar Filtering -> `<Can>` UI Gates -> Mock API `authorize()` -> Field Masking.
2. **Default Deny**: Any missing rule evaluates strictly to `false`.
3. **Maker-Checker Rule**: The author of a template, threshold rule, SOS setting, or onboarding script cannot approve their own item.
4. **Scope Isolation**: Users cannot read, search, deep-link, or export entities outside their assigned region (`RA`) or chapter (`CM`/`VF`).
5. **Time-Limited Case Access**: Care Team (`CT`) access to emergency contacts and health records expires 24 hours after case resolution.
