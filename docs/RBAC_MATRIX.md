# VAYOSHRESHTHA — Role-Based Access Control (RBAC) Matrix (v3.1 Addendum)

## 1. Role Definitions (13 Roles)

| Code | Role Name | Intended User Persona | Scope of Access | Sensitive Field Handling |
|---|---|---|---|---|
| **SA** | System Administrator | IT & Platform Administrator | Organisation-wide configuration | **Strictly NO clinical or health-log data** |
| **NM** | NGO Management | Vayoh Vikas Executive Leadership | Organisation-wide executive oversight | Full oversight; Maker-checker approver |
| **PM** | Programme Manager | NGO Programme Team Lead | Organisation-wide programmes, catalogue, routing, packs | No direct clinical triage |
| **RA** | Regional Admin | Regional Director / Incident Coordinator | **Assigned Region only** (South, West, North) | Receives critical SOS alerts; manages chapters |
| **CM** | Chapter Manager | Centre Head / Ekta Hub Lead | **Assigned Chapter only** (Hub scope) | Works wellness calls; oversees onboarding |
| **VF** | Field Volunteer | Community Outreach Volunteer | **Assigned Chapter & seniors only** | Masked contact data; assisted tasks |
| **CT** | Care Team / Responder | Clinical Triage Worker / Social Worker | **Assigned cases only** | Emergency contact unmask during open case only; expires 24h post-closure |
| **CD** | CSR / Government / Policy Reviewer | Institutional Funder & Policy Auditor | **Organisation-wide aggregate reports only** | Zero PII; counts < 5 suppressed to `<5`; audience-scoped |
| **SP** | Approved Service Partner | External Partner (Hospital, Lab, Legal) | **Assigned referrals & vouchers only** | Minimal necessary fields; legal partner content only |
| **SC** | Senior Citizen | Elder Beneficiary | **Own record only** (via WhatsApp / Portal) | Large-text self-service mode |
| **FM** | Family Member | Pre-authorized Family Member | **Linked seniors only** with explicit consent | Read-only; proxy requests |
| **SF** | Senior Field Associate | Active Elder Community Worker | **Own activity log + peers onboarded** | Masked contact data; no SOS/health access |
| **NK** | Next-of-Kin | Son, Daughter, Family Caregiver | **SMS Fallback Recipient** | **No web login**; SMS alerts only |

---

## 2. Capability Matrix (Single Source of Truth: `src/permissions/matrix.ts`)

**Legend:**
- **C**: Create | **R**: Read | **U**: Update | **D**: Delete / Deactivate | **A**: Approve (Maker-Checker) | **X**: Export (Audited)
- **Scope Qualifiers**:
  - `(o)`: Own record only
  - `(r)`: Own region only
  - `(c)`: Own chapter only
  - `(a)`: Assigned cases / seniors only
  - `(l)`: Linked & consented seniors only
  - `(m)`: Masked fields applied (`••••••3421`, `••-••••-••••-1234`)
  - `(meta)`: Metadata only, no raw content
  - `(rel)`: Released to audience only
  - `(agg)`: Aggregate metrics only (no personal data; `<5` suppression)
  - `—`: Explicit Deny (Default Deny)

| # | Capability Area | SA | NM | PM | RA | CM | VF | CT | CD | SP | SC | FM | SF |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Users, roles, system settings | CRUD | R | — | — | — | — | — | — | — | — | — | — |
| 2 | Own account and security | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | RU(o) | — | RU(o) | RU(o) |
| 3 | Chapters, regions, duty rosters | CRUD | CRUD | CRU | R,U(r) | R,U(c) | R(c) | R | R(agg) | — | — | — | R(all) |
| 4 | Senior profiles | R(m) | R | R(m) | R,U(r) | CRU(c) | CR,U(c,m) | R(a) | — | — | RU(o) | R(l) | CR(c,m) |
| 5 | Onboarding (funnel, assisted) | R | R | R | R(r) | CRU(c) | CRU(c) | — | R(agg) | — | C(o) | — | C(peers) |
| 6 | Consent, language, opt-out | R | R | RU | R(r) | RU(c) | CR,U(c) | — | — | — | RU(o) | R(l) | C(c) |
| 7 | Emergency contacts | R(m) | R | R | R(r) | CRU(c) | CRU(c) | R(a) | — | — | CRU(o) | R(l) | C(c) |
| 8 | ABHA profile (structure-only) | — | R(m) | R(m) | R(m,r) | R,U(c,m) | C,U(c,m) | — | — | — | RU(o) | — | — |
| 9 | Trigger SOS | — | — | — | — | C(c) | C(c) | — | — | — | C(o) | C(l) | — |
| 10 | SOS cases & incident tracking | R(m) | R | R | R,U(r) | R,U(c) | R(own) | R,U(a) | R(agg) | — | R(o) | R(l) | — |
| 11 | SOS escalation chain & SMS log | R,U | R | — | R(r) | R(c) | — | R(a) | — | — | — | — | — |
| 12 | SOS settings (SLA, wording) | R | A | R | CRU(r) | R | — | R | — | — | — | — | — |
| 13 | Drill mode events | R | CRU | CRU | CRU(r) | CRU(c) | — | R | — | — | — | — | — |
| 14 | Medication schedules | — | R(agg) | R | R(r) | CRU(c) | CRU(c,a) | R(a) | — | — | R,U(o) | R(l) | — |
| 15 | Reminder templates | R | A | CRU | CRU | R | — | R | — | — | — | — | — |
| 16 | Message delivery status | R,U | R | R | R(r) | R(c) | — | — | R(agg) | — | — | — | — |
| 17 | Medication confirmations | — | R(agg) | R | R(r) | R(c) | R(a) | R(a) | R(agg) | — | CR(o) | R(l) | — |
| 18 | Vitals log (BP, glucose) | — | R(agg) | R | R(r) | R(c) | C(a),R(a) | R(a) | R(agg) | — | CR(o) | R(l) | — |
| 19 | Threshold rules (risk bands) | R | A | R | R | R | — | CRU(propose) | — | — | — | — | — |
| 20 | Health flags & anomaly queue | — | R(agg) | R | R(r) | RU(c) | R(a) | RU(a) | R(agg) | — | — | — | — |
| 21 | Wellness check-in calls | — | R(agg) | R | R(r) | CRU(c) | CRU(a) | CRU(a) | — | — | — | — | — |
| 22 | Dashboards | R(system) | R | R | R(r) | R(c) | R(my) | R(caseload) | R(agg) | R | — | — | R(my) |
| 23 | Pilot outcome reports | R(system) | R,X | R,X | R,X(r) | R,X(c) | — | — | R(agg) | — | — | — | — |
| 24 | Data exports (any) | X | X | X | X(r) | X(c) | — | — | X(agg) | — | X(o) | — | — |
| 25 | Audit logs | R,X | R | — | R(r) | — | — | — | — | — | — | — | — |
| 26 | Approvals queue | R | A | R(own) | R(own) | R(own) | — | R(own) | — | — | — | — | — |
| 27 | Onboarding script (WhatsApp) | R | A | CRU | CRU | R | R | — | — | — | — | — | — |
| 28 | Integration & queue monitor | RU | R | — | R(r) | — | — | — | — | — | — | — | — |
| 48 | Partner routing: requests, queue | R | R | CRU | R(r) | R(c) | C(c) | — | R(agg) | R(a,m) | C(o) | C(l) | C(c) |
| 49 | Routing rules (capacity, SLA) | R | A | CRU(submit) | R | — | — | — | — | — | — | — | — |
| 50 | Voucher campaigns & catalogue | R | A | CRUD(submit) | R(r) | R(c) | R | — | R(agg) | R(own) | R(pub) | R(pub) | — |
| 51 | Voucher issue, validate, redeem | R | R | CRU | R(r) | CR(c) | C(c) | — | R(agg) | RU(a) | R(o) | R(l) | — |
| 52 | Legal intake files (encrypted) | R(meta) | R(meta) | R(meta) | — | R(c,meta) | C(c) | — | R(agg) | RU(a,legal) | CR(o) | CR(l) | C(c) |
| 53 | Learning library, series, webinars | R | A | CRU(submit) | CRU(r) | R | R | — | R(agg) | — | R(inbox) | R(inbox) | R(train) |
| 54 | Webinar & community sign-ups | R | R | CRUD | RU(r) | CRU(c) | R(c) | — | R(agg) | — | CRD(o) | CRD(l) | R |
| 55 | Quizzes & broadcast channels | R | A | CRUD(submit) | CRU(r) | R(c) | — | — | R(agg) | — | CR(o) | R(l) | — |
| 56 | Field associates: roster, assign | CRU | R | CRUD | RU(r) | CRU(c) | R(c) | — | — | — | — | — | RU(o) |
| 57 | Field activity log & geo-stamps | R(meta) | R | R | R(r) | R(c) | R(c) | — | R(agg) | — | — | — | CR(o) |
| 58 | Field sync queue & telemetry | RU(retry) | R | R | R(r) | R(c) | — | — | R(agg) | — | — | — | R(o) |
| 59 | Double-consent state machine | — | R | R | R(r) | CRU(c) | CRU(c) | — | — | — | U(confirm) | — | C(consent1) |
| 60 | Vaccination status (coarse) | — | R(agg) | R | R(r) | RU(c) | CU(c,a) | — | R(agg) | — | RU(o) | R(l) | — |
| 61 | Telemetry dashboards & macro | R(system) | R | R | R(r,agg) | — | — | — | R(agg,rel) | — | — | — | — |
| 62 | Impact packs & signed PDF | R(reg) | A,R,X | CRU(draft) | R(r) | — | — | — | RX(rel) | — | — | — | — |
| 63 | Anonymisation settings (k >= 5) | U | A | R | — | — | — | — | R(stmt) | — | — | — | — |
| 64 | Public report verification (/verify) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) | R(pub) |

---

## 3. Enforcement Mechanisms
1. **5-Layer Defense**: Route Guards -> Sidebar Filtering -> `<Can>` UI Gates -> Mock API `authorize()` -> Field Masking.
2. **Default Deny**: Any missing rule evaluates strictly to `false`.
3. **Maker-Checker Rule**: The author of a rule, campaign, template, threshold, SOS setting, or impact pack cannot approve or release their own item.
4. **Scope Isolation**: Users cannot read, search, deep-link, or export entities outside their assigned region (`RA`) or chapter (`CM`/`VF`/`SF`).
5. **Time-Limited Case Access**: Care Team (`CT`) access to emergency contacts and health records expires 24 hours after case resolution.
6. **SF Isolation**: Senior Field Associates (`SF`) have zero access to clinical vitals, SOS cases, duplicate oracle lookups, or unassigned peers.
7. **Audience Scoping**: CD reviewers see only packs explicitly released to their audience (CSR / Government / Policy).
8. **Anonymisation Guarantee**: All aggregate views enforce $k$-anonymity ($\ge 5$) with complementary suppression and cell differencing protection at the API layer.
