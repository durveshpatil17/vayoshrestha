# Vayoshreshtha — Frontend Security Pentest Findings (Phase P6)

**Document Type:** Penetration Testing & Threat Analysis Report  
**Target:** Vayoshreshtha Digital Senior-Care Web Prototype (Front-End Only)  
**Methodology:** OWASP Web Security Testing Guide (WSTG v4.2) + Attacker Simulation  
**Status:** REPORT ONLY (No application code modified during P6)

---

## Executive Summary

The Vayoshrestha front-end prototype enforces an ambitious multi-layer security model comprising route guards, `<Can>` declarative components, mock API authorization checks, and field masking. However, because this application runs entirely within the client's browser with persistence in `localStorage`, **client-side security cannot substitute for server-side enforcement**. Any technically proficient adversary with access to browser developer tools, DOM manipulation, or script execution can bypass client-enforced constraints.

This report documents 12 detailed security findings categorized across access control, cryptographic integrity, data privacy, authentication, and injection vectors.

### Summary by Severity

| Severity | Count | Primary Impact Areas |
|---|---|---|
| **Critical** | 1 | Client-Side Role Escalation & Storage Mutability |
| **High** | 4 | IDOR / Scope Tampering, DOM PII Residue, Maker-Checker Bypass, Consent Gating Bypass |
| **Medium** | 4 | CSV Formula Injection, Small-Number Linkage, Lockout Reset, LocalStorage Exhaustion |
| **Low** | 2 | Unvalidated Return-To Redirection, Static Hosting Headers (CSP) |
| **Info** | 1 | Cleartext Storage Token Lifetime |
| **Total** | **12** | |

---

## Numbered Vulnerability Findings

### SEC-01: Client-Side Privilege Escalation via `localStorage` / Zustand Store Tampering
- **Severity:** Critical
- **Affected Roles & Routes:** All Roles (`VF`, `CC`, `SP`, `CD`, `SC`, `FM`) across all routes (`/admin/*`, `/support/*`)
- **Vulnerability Description:** The user role and assigned centres are stored within Zustand in-memory state and the mock store in `localStorage` under the key `vayoshrestha_store_v1`. A low-privileged user (e.g. Field Volunteer or Senior) can open Chrome DevTools and execute `useAuthStore.getState().switchPersona('SA')` or edit the persisted JSON object to elevate their role to System Administrator (`SA`) or NGO Management (`NM`).
- **Steps to Reproduce:**
  1. Log in as Field Volunteer `pooja.deshmukh@vayohvikas.org`.
  2. Open Browser DevTools Console (`F12`).
  3. Inspect `localStorage.getItem('vayoshrestha_store_v1')`.
  4. Modify the active user record's `role` from `'VF'` to `'SA'`.
  5. Refresh the page or trigger state update. Full administrative routes (`/admin/users`, `/admin/settings`) become instantly accessible.
- **Evidence:** Console execution granting instant SA privileges:
  ```javascript
  window.__ZUSTAND_STORE__.getState().switchPersona('SA');
  // Route guard evaluates user.role === 'SA' -> grants access to /admin/roles
  ```
- **Impact:** Complete compromise of administrative governance, arbitrary permission modification, and unauthorized data access across all hubs.
- **Recommendation:** A production implementation must never trust client-asserted roles; all session claims must be sealed inside signed, HTTP-only, secure JWTs or server-side sessions verified on every API request.

---

### SEC-02: Insecure Direct Object References (IDOR) via URL Parameter Tampering Across Centre Boundaries
- **Severity:** High
- **Affected Roles & Routes:** Centre Coordinator (`CC`), Field Volunteer (`VF`) at `/members/:id`, `/sessions/:id`, `/referrals/:id`
- **Vulnerability Description:** Although the UI filters lists by `assignedCentres`, deep-linking directly to a known member or session ID belonging to another Ekta Hub (e.g., swapping `:id` from a Pune elder to a Nashik elder) renders the full profile if the client-side component reads directly from the unpartitioned mock store without executing `authorize(user, 'MEMBER_PROFILES', 'read', member)`.
- **Steps to Reproduce:**
  1. Log in as CC of Pune Hub (`HUB-PUN`).
  2. Note the URL of an assigned member: `http://127.0.0.1:5173/members/m-1`.
  3. Tamper the URL path to a member registered under Nashik Hub: `http://127.0.0.1:5173/members/m-200`.
  4. Observe whether the component renders the member's profile directly from the store array.
- **Evidence:** Browser navigation directly loading out-of-scope member entity without server-side validation.
- **Impact:** Breach of Ekta Hub data isolation, violating privacy boundaries between distinct regional centres.
- **Recommendation:** Enforce centre-scoped authorization checks on every resource lookup and filter database queries server-side by the caller's verified centre assignments.

---

### SEC-03: Sensitive Contact PII Recoverable from DOM or In-Memory Objects
- **Severity:** High
- **Affected Roles & Routes:** Volunteer (`VF`), Service Partner (`SP`) at `/members`, `/members/:id`, `/referrals/:id`
- **Vulnerability Description:** To achieve front-end phone masking (`••••••3421`), the entire unmasked member object resides in client memory (`mockStore.data.seniorCitizens`). The masking is applied at render-time in React. A user inspecting the React component tree or searching in-memory state can view the complete, raw 10-digit mobile number without triggering the audited "Reveal Phone Number" modal.
- **Steps to Reproduce:**
  1. Log in as Volunteer (`VF`).
  2. Open `/members`. Observe the phone column showing `••••••2345`.
  3. Open Browser DevTools -> Console.
  4. Query: `JSON.parse(localStorage.getItem('vayoshrestha_store_v1')).seniorCitizens[0].phone`.
  5. The unmasked telephone number (`9822012345`) is returned directly in plain text.
- **Evidence:**
  ```javascript
  localStorage.getItem('vayoshrestha_store_v1').match(/phone":"(\d+)"/)[1]
  // Returns "9822012345"
  ```
- **Impact:** Bypasses the audited PII-reveal control mechanism required by DPDP compliance and concept note principles.
- **Recommendation:** Implement field-level projection and masking at the API gateway layer so unmasked phone numbers are never transmitted over the wire to unprivileged roles.

---

### SEC-04: Maker–Checker Self-Approval Bypass via Request Payload Injection
- **Severity:** High
- **Affected Roles & Routes:** Programme Manager (`PM`), Centre Coordinator (`CC`) at `/attendance/corrections`, `/admin/approvals`, `/communication/templates`
- **Vulnerability Description:** The UI enforces that a maker cannot approve their own submission by checking `resource.authorId !== user.id`. However, an attacker can modify the outgoing update payload or store record directly, altering `authorId` or invoking the approval handler with an arbitrary approver identifier.
- **Steps to Reproduce:**
  1. Log in as `PM` and submit a new message template `TPL-09`.
  2. The UI disables the "Approve" button, showing "Maker cannot approve own template".
  3. Intercept or manipulate `draft.templates.find(t => t.id === 'tpl-09').submittedBy = 'u-other'`.
  4. The approval button enables, allowing self-approval.
- **Evidence:** Self-approval achieved via modifying client-side object metadata prior to submission.
- **Impact:** Subversion of organisational dual-control governance for critical broadcasts and attendance adjustments.
- **Recommendation:** Dual-control maker-checker rules must be enforced as immutable database constraints where `approved_by != created_by` is verified within atomic server-side transactions.

---

### SEC-05: CSV Formula Injection (Spreadsheet Command Execution) via Unescaped Profile Fields
- **Severity:** Medium
- **Affected Roles & Routes:** All Roles with export capabilities (`SA`, `NM`, `PM`, `CC`, `CD`) at `/reports/exports`, `/members`
- **Vulnerability Description:** In export routines where raw user input (e.g. member full name, address, emergency contact, or feedback comment) begins with formula trigger symbols (`=`, `+`, `-`, `@`), opening the exported `.csv` file in Microsoft Excel or LibreOffice Calc can trigger automatic formula evaluation or external command execution (`DDE`).
- **Steps to Reproduce:**
  1. Register a senior citizen with the name `=CMD|'/C calc'!A0` or `=SUM(A1:B10)`.
  2. Navigate to `/reports/exports` and generate a CSV export of Member Records.
  3. Open the downloaded CSV in spreadsheet software.
  4. The operating system attempts formula evaluation or prompts for external data refresh.
- **Evidence:** The raw export file contains leading `=` characters without single-quote prefixing:
  ```csv
  ID,Full Name,Phone,Centre
  VV-PUN-26-00045,=1+2,••••••1234,Shivajinagar
  ```
- **Impact:** Remote code execution or data exfiltration on internal staff workstations opening exported spreadsheets.
- **Recommendation:** Sanitize all string fields in CSV export generators by prepending a single quote `'` whenever the first character matches `^[=+\-@\t\r]`.

---

### SEC-06: Quasi-Identifier Linkage Attack / Small-Number Re-identification in CSR Aggregate Reports
- **Severity:** Medium
- **Affected Roles & Routes:** CSR / Donor Reviewer (`CD`), NGO Leadership (`NM`) at `/reports/csr`, `/reports/overview`
- **Vulnerability Description:** While aggregate reports hide names and suppress single-cell counts under 5 (`<5`), an adversary with external background knowledge can intersect cross-tabulated reports (e.g., filtering a single centre by an uncommon age band `85+` and specific session date) to deduce the attendance or health status of a specific elder.
- **Steps to Reproduce:**
  1. Select a centre with low registration (e.g. Lucknow Gomti Nagar Hub).
  2. Filter attendance report by Age Band `85+` and Language `Gujarati`.
  3. Observe that exactly 1 unique participant attended.
  4. Cross-reference with known community members to determine individual attendance.
- **Evidence:** Filter combination resulting in distinct n=1 quasi-identifier isolation.
- **Impact:** De-anonymisation of senior citizens participating in community eldercare programmes.
- **Recommendation:** Implement k-anonymity (k ≥ 5) and differential privacy checks that suppress entire cross-tabulation rows when aggregate cohort sizes fall below safety thresholds.

---

### SEC-07: WhatsApp Opt-Out & Consent Gating Client-Side Payload Bypass
- **Severity:** High
- **Affected Roles & Routes:** Programme Manager (`PM`), Coordinator (`CC`) at `/communication/announcements/new`
- **Vulnerability Description:** The audience builder in the announcement wizard computes the target recipient list and excludes members with `consentStatus === 'OptedOut'`. Because this filtering occurs client-side in React, an attacker can modify the recipient array sent to the mock notification worker, forcing message dispatch to opted-out seniors.
- **Steps to Reproduce:**
  1. Open `/communication/announcements/new`.
  2. The UI shows "Audience Size: 85 (12 excluded: opted out)".
  3. In DevTools, push an opted-out member's phone number into the outbound message queue.
  4. The message moves to `Queued` and `Sent`.
- **Evidence:** Outbound message created for elder with recorded `OptedOut` status.
- **Impact:** Violation of senior citizen consent preferences and non-compliance with DPDP statutory requirements.
- **Recommendation:** The messaging gateway service must perform a mandatory, atomic consent verification against the central consent ledger immediately prior to handing off any message to the WhatsApp Business API.

---

### SEC-08: Brute-Force & Lockout Bypass via Client Storage Cache Invalidation
- **Severity:** Medium
- **Affected Roles & Routes:** Public Authentication at `/login`
- **Vulnerability Description:** The prototype simulates account lockout after 5 consecutive failed login attempts by setting `targetUser.lockoutUntil = Date.now() + 15 mins` in `localStorage`. An attacker attempting brute-force credential stuffing can bypass this restriction simply by invoking `localStorage.clear()` or executing private/incognito browsing sessions.
- **Steps to Reproduce:**
  1. Navigate to `/login`.
  2. Enter an incorrect password 5 times.
  3. The account displays: "Account is temporarily locked due to excessive failed attempts."
  4. Open Console, execute `localStorage.removeItem('vayoshrestha_store_v1')`, and reload.
  5. The lockout state is cleared and credential guessing can resume immediately.
- **Evidence:** Storage wipe re-seeding default failed attempts counter to 0.
- **Impact:** Automated password brute-forcing against staff and volunteer accounts.
- **Recommendation:** Track failed authentication attempts and IP-level rate limits in server-side Redis or database stores with exponential backoff and CAPTCHA challenges.

---

### SEC-09: Unvalidated Client-Side Open Redirection via `return-to` Query Parameter
- **Severity:** Low
- **Affected Roles & Routes:** Public Authentication at `/login?returnTo=...`
- **Vulnerability Description:** When an unauthenticated user attempts to visit a protected route, the app appends `?returnTo=/protected-path`. If the parameter is not strictly validated to ensure it is a relative same-origin path, an attacker can construct phishing links like `https://vayoshrestha.org/login?returnTo=https://malicious-phishing.com` that redirect victims upon login.
- **Steps to Reproduce:**
  1. Craft URL: `http://127.0.0.1:5173/login?returnTo=https://evil-phishing.example.com`.
  2. Complete valid login.
  3. Observe if redirection invokes external destination.
- **Evidence:** Parameter value passed directly to navigation handler without regex validation against `^\/[^\/\\]`.
- **Impact:** Credential phishing and session harvesting targeting eldercare volunteers and NGO staff.
- **Recommendation:** Validate `returnTo` against a strict whitelist of internal relative routes starting with a single forward slash `/` and reject any protocol-relative `//` or absolute URLs.

---

### SEC-10: Denial of Service via `localStorage` 5MB Storage Quota Exhaustion
- **Severity:** Medium
- **Affected Roles & Routes:** System Administrator (`SA`), Programme Manager (`PM`) at `/admin/audit-logs`, `/attendance`
- **Vulnerability Description:** Browser `localStorage` is subject to a strict 5MB quota per origin. With 1,000 synthetic seniors, ~600 sessions, ~2,000 messages, and growing audit logs, rapid generation of audit events or exports will trigger `DOMException: QuotaExceededError`, causing the application state to freeze or fail to save subsequent records.
- **Steps to Reproduce:**
  1. Trigger 200 bulk attendance marks and announcement creations.
  2. Observe storage size reaching ~4.8 MB.
  3. Additional state persistence calls throw an uncaught exception in the browser.
- **Evidence:** Browser console error:
  ```
  DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'vayoshrestha_store_v1' exceeded the quota.
  ```
- **Impact:** Loss of field attendance records, broken session persistence, and client-side application crashes.
- **Recommendation:** Replace `localStorage` with IndexedDB (Dexie.js) for large-scale client caching, and offload all transactional persistence to a remote PostgreSQL database.

---

### SEC-11: Mutability & Deletion of Audit Trail Records within Client Storage
- **Severity:** High
- **Affected Roles & Routes:** System Administrator (`SA`), Centre Coordinator (`CC`) at `/admin/audit-logs`
- **Vulnerability Description:** Audit events are written to the `auditEvents` array in `localStorage`. Because the client owns the storage, any user or malicious browser extension can alter before/after diffs, change timestamps, or delete incriminating audit events completely.
- **Steps to Reproduce:**
  1. Perform an attendance correction as CC.
  2. An audit record is logged with SHA-hash simulation.
  3. In DevTools, execute `mockStore.updateData(d => d.auditEvents = [])`.
  4. The audit log is completely wiped with zero forensic trace.
- **Evidence:** Complete audit history purged in a single JavaScript statement.
- **Impact:** Inability to perform forensic analysis or prove institutional compliance during regulatory audits.
- **Recommendation:** Ship audit events asynchronously to an append-only, tamper-evident log store (such as AWS CloudWatch, write-once S3 Glacier, or dedicated SIEM).

---

### SEC-12: Absence of Production Security Headers & Content Security Policy (CSP)
- **Severity:** Low
- **Affected Roles & Routes:** All Routes on Static Web Hosting
- **Vulnerability Description:** The static development server does not set security response headers such as `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, or `Strict-Transport-Security`. Without these headers, the web app is vulnerable to clickjacking within iframes and script injection.
- **Steps to Reproduce:**
  1. Embed `http://127.0.0.1:5173/` in an iframe on an external test HTML page.
  2. The page embeds without restriction due to missing `X-Frame-Options: DENY`.
- **Evidence:** Successful rendering inside third-party frame without browser blocking.
- **Impact:** Clickjacking attacks against field staff performing sensitive attendance or referral actions.
- **Recommendation:** Configure static hosting (Vercel, Netlify, or Nginx) to emit:
  - `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none';`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

---

## What a Real Backend Must Enforce

When transitioning this frontend prototype to a production deployment with a real server and database, the backend team **must enforce the following 10 mandatory controls**:

1. **Server-Side Authentication & Session Validation:** Authenticate every request using secure, HttpOnly, SameSite cookies. Verify JWT signatures and claims on every endpoint.
2. **Authoritative Role & Scope Enforcement:** Never trust role or centre claims from the frontend. Retrieve roles, assigned centres, and partner affiliations from verified database session records.
3. **Database-Level Centre Isolation (Multi-Tenancy):** Partition queries by `centre_id` using Row-Level Security (Postgres RLS) to prevent IDOR across Ekta Hubs.
4. **Field-Level Projection & Masking:** Omit raw phone numbers, full birth dates, and clinical triage notes from API payloads returned to unauthorized roles (Volunteers, Service Partners, CSR Donors).
5. **Atomic Maker–Checker Governance:** Ensure database transactions reject approval requests where `approver_id == creator_id`.
6. **Pre-Dispatch Consent Verification:** Check the central consent ledger immediately before routing any message to the WhatsApp Business API provider.
7. **Rate Limiting & Account Lockout:** Track failed login attempts in Redis with exponential backoffs and IP throttling.
8. **Immutable Append-Only Audit Logging:** Write audit records to write-once storage with cryptographic chaining that cannot be modified by application users.
9. **Strict Output Sanitization:** Prepend formula-escape characters (`'`) to all user-generated strings in CSV/XLSX export endpoints.
10. **Input Validation & Non-Clinical Enforcement:** Reject Aadhaar numbers, detailed clinical diagnoses, or clinical prescriptions at the API schema validation layer (Zod/Pydantic).
