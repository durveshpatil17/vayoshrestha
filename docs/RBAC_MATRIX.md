# VAYOSHRESHTHA — Role-Based Access Control (RBAC) Matrix

## 1. Role Definitions

| Code | Role Name | Intended User Persona | Scope of Access | Sensitive Field Handling |
|---|---|---|---|---|
| **SA** | System Administrator | IT / Platform Administrator | Organisation-wide configuration | Strictly **no clinical notes** |
| **NM** | NGO Management | Vayoh Vikas Executive Leadership | Organisation-wide executive oversight | Full access, Maker-checker approver |
| **PM** | Programme Manager | Central NGO Operations Team | Organisation-wide operations | Full operational access |
| **CC** | Centre Coordinator | Ekta Hub Centre Head | **Assigned Ekta Hub(s) only** | Full access within assigned centres |
| **VF** | Volunteer / Field Staff | Community Outreach Worker | **Assigned Centre & Sessions only** | Masked phone (`••••••3421`), reason required to reveal |
| **SP** | Approved Service Partner | External Clinic, Physiotherapist, Legal Aid | **Assigned referrals only** | DOB reduced to Age Band; minimal shared fields |
| **CT** | Care Team / Expert | Geriatric Nurse, Social Worker | **Assigned health cases only** | Authorized for health requests & triage |
| **CD** | CSR / Donor Reviewer | Corporate Funder / Auditor | **Organisation-wide aggregate reports** | Personal fields suppressed; `<5` small-number rule |
| **SC** | Senior Citizen | Registered Elder | **Own record only** | High-contrast large-type self-service |
| **FM** | Authorised Family Member | Son, Daughter, or Guardian | **Linked & consented seniors only** | Revocable proxy access |

---

## 2. Capability Matrix (Single Source of Truth)

**Legend:**
- **C**: Create
- **R**: Read
- **U**: Update
- **D**: Delete / Deactivate
- **A**: Approve (Maker-Checker)
- **X**: Export (Requires reason, audited)
- **Qualifiers**:
  - `(s)`: Assigned centres only
  - `(o)`: Own record only
  - `(l)`: Linked and consented seniors only
  - `(a)`: Assigned items only
  - `(m)`: Masked fields applied
  - `(agg)`: Aggregate metrics only (no PII)
  - `—`: Explicit Deny

| # | Capability Area (FR References) | SA | NM | PM | CC | VF | SP | CT | CD | SC | FM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Users, roles, system settings (FR-01–04, 50) | CRUD | R | — | — | — | — | — | — | — | — |
| 2 | Own account & security | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) |
| 3 | Member profiles (FR-05–08) | R(m) | R | CRU | CRU(s) | CR,U(s,m) | R(a,m) | R(a) | — | RU(o) | RU(l) |
| 4 | Consent & preferences (FR-09, 29) | R | R | RU | RU(s) | CR(s) | — | — | — | RU(o) | R(l) |
| 5 | Centres (FR-10–13) | CRUD | CRUD | CRU | R,U(s) | R(s) | — | R | R(agg) | R(pub) | R(pub) |
| 6 | Programmes & events (FR-14–16) | R | CRUD | CRUD | R,U(s) | R(s) | R(pub) | R | R(agg) | R(pub) | R(pub) |
| 7 | Registrations, capacity, waitlist (FR-17, 18)| R | R | CRUD | CRUD(s) | CRU(s) | — | — | — | CRD(o) | CRD(l) |
| 8 | Attendance records (FR-19, 20, 22) | R | R | R | CRU(s) | CR,U(s) | — | — | — | R(o) | R(l) |
| 9 | Attendance corrections (FR-21) | R | R | A(any) | A(s) | C(req,s)| — | — | — | — | — |
| 10 | Message templates (FR-25–27) | R | A | CRU | R | — | — | — | — | — | — |
| 11 | Announcements & educational content (FR-27, 54)| R | A | CRU | C(s) | — | — | — | — | R(inbox)| R(inbox)|
| 12 | Delivery status & retry (FR-28, 55) | RU(ret)| R | R | R(s) | — | — | — | — | — | — |
| 13 | Opt-in / opt-out management (FR-29) | R | R | U | U(s) | U(s) | — | — | — | U(o) | U(l) |
| 14 | Services & consultations catalogue (FR-30) | R | CRUDA| CRUD | R | R | CRU(own)| R | — | R | R |
| 15 | Service bookings & requests (FR-31) | R | R | RU | CRU(s) | CR(s) | R(a) | — | — | CR(o) | CR(l) |
| 16 | Referrals management (FR-32, 33) | R | R | CRUD | CRU(s) | C(prop) | RU(a,st)| CR(a) | R(agg) | R(o) | R(l) |
| 17 | Partner profiles & approvals (FR-34, 51) | R | AR | CRU | R | R | RU(o) | R | — | — | — |
| 18 | Feedback collection (FR-35) | — | R | R | R(s) | C(asst) | — | — | R(agg) | C(o) | C(l) |
| 19 | Follow-ups & recommendations (FR-36–38) | — | R | CRUD | CRUD(s) | CRU(a) | — | R(a) | — | R(o) | R(l) |
| 20 | Health requests & escalations (FR-39, 40, 42)| — | R(agg) | R | CRU(s) | C(s) | — | RU(a) | — | C(o) | C(l) |
| 21 | Escalation rules configuration (FR-40) | CRU | A | R | — | — | — | R | — | — | — |
| 22 | AI voice check-ins (optional flag) (FR-41) | U(flag)| A | CRU | R(s) | — | — | R | — | R(o) | — |
| 23 | Dashboards (FR-43–45) | R(sys) | R | R | R(s) | R(tasks)| R(part) | R(cases)| R(agg) | Home(o)| Home(l)|
| 24 | Operational reports (FR-44–47) | R(sys) | RX | RX | RX(s,noP)| — | R(own) | — | R(rel) | — | — |
| 25 | CSR & donor reports (FR-48) | — | ARX | CRU | — | — | — | — | RX(rel) | — | — |
| 26 | Data exports (FR-49) | X(aud) | X | X | X(s) | — | — | — | X(rel) | X(o) | — |
| 27 | Audit logs (FR-52) | RX | R(sum) | — | R(s,corr)| — | — | — | — | — | — |
| 28 | Complaints & support requests (FR-53) | RU | R | RU | RU(s) | C | C | C | — | CR(o) | CR(l) |
| 29 | Content & announcement approvals (FR-54) | R | A | R(own) | R(own) | — | — | — | — | — | — |
| 30 | Integration & job monitor (FR-55) | RU | R | R | — | — | — | — | — | — | — |
| 31 | Data governance & privacy requests | U(exec)| A | R | — | — | — | — | — | C(o,req)| C(l,req)|

---

## 3. Maker–Checker Separation of Duties
To protect organizational integrity, sensitive actions enforce strict Maker-Checker rules:
1. **Announcements & Templates**: PM or CC submits → NM must approve. (Maker cannot approve own submission).
2. **Attendance Corrections**: Field Volunteer requests → Centre Coordinator or PM approves.
3. **Partner Onboarding & Services**: PM creates → NM approves.
4. **CSR Reports Release**: PM drafts → NM releases to CSR/Donor reviewer.
5. **Role & Permission Changes**: SA edits → NM approves before taking effect.
