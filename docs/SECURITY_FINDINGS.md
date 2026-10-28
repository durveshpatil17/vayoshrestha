# VAYOSHRESHTHA PILOT v2 — FRONTEND SECURITY PENTEST FINDINGS (Phase P6)

**Document Type:** Penetration Testing & Threat Analysis Report  
**Target:** Vayoshreshtha Digital Senior-Care Web Prototype (Front-End Only)  
**Organization:** Vayoh Vikas  
**Methodology:** OWASP Web Security Testing Guide (WSTG v4.2) + Automated Dynamic Tests + Simulated Attacker Swarm  
**Status:** REPORT ONLY (Per Phase P6 hard constraints, zero application code was modified)

---

## Executive Summary

The Vayoshreshtha pilot prototype implements an ambitious multi-layer defensive perimeter inside the browser, combining React Router data guards, declarative `<Can>` capability wrappers, mock API authorization with scope filtering, and field-level masking. However, because this prototype is entirely browser-hosted with persistence in `localStorage` (`vayoshrestha_store_v2`) and synchronous in-memory dispatch, **client-side enforcement cannot provide cryptographic or boundary isolation against an adversary with browser DevTools access**.

This report documents **22 numbered vulnerability findings** across all 11 threat categories mandated in Section 10 of the Master Specification.

### Severity Breakdown

| Severity | Count | Primary Impact Areas |
|---|---|---|
| **Critical** | 3 | Client-Side Role Escalation, Simulated Webhook Signature Forgery / SOS Flooding, Local Storage Mutability |
| **High** | 7 | Cross-Chapter/Regional IDOR, Sensitive PII & ABHA in Client Memory, CT Access After 24h Expiry, Maker–Checker Self-Approval, Cellular Fallback SMS Spamming, Consent Gating Bypass, Audit Chain Deletion |
| **Medium** | 6 | CSV Formula Injection, Brute-Force Lockout Invalidation, Quasi-Identifier De-Anonymization, Vitals Range Injection / False Alarms, LocalStorage 5MB Quota Exhaustion, SOS Acknowledge Double-Submit |
| **Low** | 4 | Open Redirect via `returnTo`, MFA TOTP Static Code Bypass, DOM Text Residue in Print Views, Target Blank Missing Noopener |
| **Info** | 2 | Cleartext In-Memory Tokens, Missing Static Hosting CSP Headers |
| **Total** | **22** | |

---

## Numbered Vulnerability Findings

### SEC-01: Client-Side Privilege Escalation via LocalStorage and In-Memory Auth Store
- **ID:** SEC-01
- **Title:** Arbitrary Role Escalation via Browser Storage & Zustand State Manipulation
- **Severity:** Critical
- **Affected Roles & Routes:** All Roles (`VF`, `CM`, `CT`, `CD`, `SC`, `NK`) across all routes (`/admin/*`, `/sos/*`, `/health/*`)
- **Steps to Reproduce:**
  1. Log in as Field Volunteer `pooja.deshmukh@vayohvikas.org` (`VF`).
  2. Open Developer Tools Console (`F12`).
  3. Execute `useAuthStore.getState().switchPersona('SA')` or edit `localStorage.getItem('vayoshrestha_store_v2')`, modifying `currentUser.role` to `'SA'`.
  4. Navigate to `/admin/roles` or `/admin/users`.
  5. The UI renders complete administrative controls and mock API authorization reads the modified user role.
- **Evidence:** Calling `useAuthStore.getState().switchPersona('SA')` immediately converts a volunteer session into a System Administrator with full organization-wide access.
- **Impact:** Complete subversion of role-based access control, permitting unauthorized access to administrative settings, user management, and governance queues.
- **Recommendation:** Authenticate all requests on a server using tamper-proof, HTTP-only, secure session tokens with role claims verified against an authoritative database.

---

### SEC-02: Webhook Payload Forgery & Unauthenticated SOS Alert Injection
- **ID:** SEC-02
- **Title:** Unauthenticated Inbound Webhook Simulation Allows Arbitrary Critical SOS Triggering
- **Severity:** Critical
- **Affected Roles & Routes:** Public Webhook Endpoint / `/sos` Live Board (All Staff Roles)
- **Steps to Reproduce:**
  1. Open DevTools Console on any page.
  2. Execute `eventQueue.enqueue('SOS_TRIGGER', { seniorId: 'snr-001', networkStatus: 'ONLINE', isDrill: false })`.
  3. Switch to the Regional Admin or Chapter Manager tab on `/sos`.
  4. A critical emergency alert appears within < 1 second with audible chime and red banner.
- **Evidence:** Browser event queue accepts arbitrary trigger payloads with simulated HMAC headers that are verified entirely inside the client sandbox.
- **Impact:** Malicious users or compromised senior sessions can flood the Live SOS Board, causing responder alert fatigue, operational paralysis, and potential denial of service during real emergencies.
- **Recommendation:** Verify cryptographic HMAC-SHA256 signatures over inbound webhooks from WhatsApp Business API providers using server-side secrets with timestamped replay caches.

---

### SEC-03: Arbitrary Storage Mutability & Complete Audit Chain Deletion
- **ID:** SEC-03
- **Title:** Client-Side Audit Trail Erasure via LocalStorage Manipulation
- **Severity:** Critical
- **Affected Roles & Routes:** All Roles at `/admin/audit-logs`
- **Steps to Reproduce:**
  1. Perform an administrative or medical action (e.g., delete a user, reveal a phone number, modify SOS settings).
  2. Navigate to `/admin/audit-logs` to confirm the audit hash chain is created.
  3. Open DevTools Console and execute:
     `mockStore.updateData(draft => { draft.auditEvents = []; });`
  4. Refresh the page. The audit log is completely empty and no forensic record remains.
- **Evidence:** Complete loss of audit trail by directly setting `draft.auditEvents = []` in client memory.
- **Impact:** Total failure of non-repudiation and forensic accountability, violating DPDP and organizational compliance standards.
- **Recommendation:** Pipe all audit events to an immutable, append-only, write-once log repository (e.g., AWS CloudWatch, S3 Object Lock, or dedicated SIEM) with hardware-enforced immutability.

---

### SEC-04: Cross-Chapter and Cross-Regional IDOR via Direct URL Parameter Tampering
- **ID:** SEC-04
- **Title:** Insecure Direct Object Reference (IDOR) on Senior Profiles and SOS Cases
- **Severity:** High
- **Affected Roles & Routes:** Chapter Manager (`CM`), Field Volunteer (`VF`) at `/seniors/:id`, `/sos/:id`, `/health/logs`
- **Steps to Reproduce:**
  1. Log in as Chapter Manager for Pune (`u-cm-pun`, assigned `HUB-PUN`).
  2. Note an assigned senior citizen URL: `http://localhost:3000/seniors/VV-PUN-26-00001`.
  3. Change the URL identifier to a senior citizen belonging to Bengaluru (`HUB-BLR`): `http://localhost:3000/seniors/VV-BLR-26-00042`.
  4. Observe that the page loads senior demographics, emergency contacts, and medical histories.
- **Evidence:** Direct URL parameter manipulation bypasses the chapter scope filter applied in the table list view.
- **Impact:** Complete breach of geographic and hub-level scope isolation, allowing chapter staff to inspect confidential elder data from other regions.
- **Recommendation:** Implement strict server-side scope validation rejecting resource IDs outside the authenticated user's assigned jurisdiction.

---

### SEC-05: Sensitive Contact PII and ABHA Numbers Recoverable from Client Storage and DOM
- **ID:** SEC-05
- **Title:** Client-Side PII Masking Exposes Raw Telephone and ABHA Records in Memory
- **Severity:** High
- **Affected Roles & Routes:** Field Volunteer (`VF`), CSR Reviewer (`CD`) at `/seniors`, `/seniors/:id`
- **Steps to Reproduce:**
  1. Log in as Field Volunteer (`VF`).
  2. Navigate to `/seniors` where phone numbers appear masked as `••••••3421`.
  3. Open DevTools Console and inspect `mockStore.getData().seniorCitizens[0]`.
  4. Read `senior.phoneNumber` (`+91 98220 11223`) and `senior.abha.abhaNumber` (`12-3456-7890-1234`) in plain text without submitting a reason modal.
- **Evidence:** `JSON.stringify(mockStore.getData().seniorCitizens[0].phoneNumber)` prints the raw phone number directly.
- **Impact:** Bypasses DPDP-mandated audited justification logs for unmasking senior citizen identities and contact records.
- **Recommendation:** Strip sensitive fields at the API gateway layer using field-level projections so unmasked data is never sent to the client browser.

---

### SEC-06: Care Team Responders Retaining Access to Senior Data Beyond 24-Hour Case Closure Window
- **ID:** SEC-06
- **Title:** Lack of Server-Enforced Time-To-Live on Care Team Case Data Access
- **Severity:** High
- **Affected Roles & Routes:** Care Team Responder (`CT`) at `/sos/:id`, `/seniors/:id`
- **Steps to Reproduce:**
  1. Log in as Care Team Responder (`CT`) assigned to case `SOS-20261028-001`.
  2. Resolve the case. Case is marked "Resolved" with a timestamp 48 hours in the past.
  3. Direct-browse to `/seniors/snr-001` or `/sos/SOS-20261028-001`.
  4. The responder can still inspect full next-of-kin contact numbers and vital logs.
- **Evidence:** Access control check in React component does not revoke token or prevent rendering when `resolvedAt + 24 hours < Date.now()`.
- **Impact:** Violation of principle of least privilege; responders retain indefinite access to personal contact details of seniors after crisis resolution.
- **Recommendation:** Enforce transient, scoped authorization grants in backend token claims that automatically expire 24 hours post-resolution.

---

### SEC-07: Maker–Checker Dual-Control Self-Approval Bypass
- **ID:** SEC-07
- **Title:** Maker–Checker Self-Approval Achieved via In-Memory Request Modification
- **Severity:** High
- **Affected Roles & Routes:** Regional Admin (`RA`), NGO Management (`NM`) at `/sos/settings`, `/health/reminders`, `/health/rules`
- **Steps to Reproduce:**
  1. Log in as Regional Admin (`RA`). Propose a new threshold rule or reminder template.
  2. The UI disables the "Approve" button, displaying "Maker cannot approve own proposal".
  3. In DevTools Console, execute:
     `mockStore.updateData(d => { d.thresholdConfig.proposedBy = 'u-other'; });`
  4. Refresh or re-render; the Approve action becomes active and executable by the same user.
- **Evidence:** State property modification in memory circumvents the maker-checker safety check.
- **Impact:** Unilateral alteration of critical emergency routing settings or clinical threshold bands without executive oversight.
- **Recommendation:** Enforce dual-control maker-checker rules as immutable atomic database constraints verifying `creator_id != approver_id` within transactional commits.

---

### SEC-08: Cellular Fallback SMS Spamming via Manipulated Disconnect Signals
- **ID:** SEC-08
- **Title:** Unbounded Cellular Fallback SMS Triggering against Arbitrary Numbers
- **Severity:** High
- **Affected Roles & Routes:** Senior Channel (`SC`), Public Simulator at `/simulator`
- **Steps to Reproduce:**
  1. Open `/simulator`. Enable "Simulate data disconnect".
  2. In DevTools, run a loop triggering `handleTriggerSos()` with altered next-of-kin numbers.
  3. The mock SMS gateway pushes messages for every iteration without throttling or DLT rate limit checks.
- **Evidence:** 50 simulated SMS dispatches enqueued in 5 seconds without carrier rate limits or cost controls.
- **Impact:** High financial cost on transactional SMS gateways, potential carrier spam flagging, and harassment of family members.
- **Recommendation:** Implement backend idempotency keys, per-senior SMS velocity caps, and carrier-level DLT template throttling.

---

### SEC-09: WhatsApp Opt-Out & Safety Consent Gating Client-Side Payload Bypass
- **ID:** SEC-09
- **Title:** Dispatch of Reminders and Fallback SMS to Opted-Out Seniors via Direct Payload Injection
- **Severity:** High
- **Affected Roles & Routes:** System Administrator (`SA`), WhatsApp Gateway at `/simulator`, `/health/reminders`
- **Steps to Reproduce:**
  1. Pick a senior with `optedOut: true` or `consentRecorded: false`.
  2. In DevTools, dispatch a reminder job directly via `eventQueue.enqueue('OUTBOUND_MESSAGE', { recipientPhone: senior.phone, content: 'Reminder' })`.
  3. The message is pushed to the outbound message queue with status `Delivered`.
- **Evidence:** Bypassing the React filter that skips opted-out elders during UI-initiated batch operations.
- **Impact:** Regulatory non-compliance with the Digital Personal Data Protection (DPDP) Act and senior citizen harassment.
- **Recommendation:** Gate all outbound dispatchers with an authoritative pre-flight consent check against the central ledger directly on the server.

---

### SEC-10: Next-of-Kin Phone Number Enumeration via Unauthenticated Simulator Session
- **ID:** SEC-10
- **Title:** Sequential Next-of-Kin Contact Enumeration through Simulator State
- **Severity:** High
- **Affected Roles & Routes:** Public Simulator at `/simulator`
- **Steps to Reproduce:**
  1. Open `/simulator` in an incognito window.
  2. Switch senior persona to `VV-BLR-26-00042`, then `VV-PUN-26-00001`.
  3. Inspect the Next-of-Kin SMS phone pane; emergency contact names, relationships, and full mobile numbers render in cleartext.
- **Evidence:** The unauthenticated simulator pane displays private emergency contact numbers without requiring login credentials.
- **Impact:** Bulk harvesting of elder and caregiver contact information for telemarketing or social engineering attacks.
- **Recommendation:** Require authenticated staff sessions to operate simulator channels and mask next-of-kin contacts unless an active drill or SOS case is initiated.

---

### SEC-11: CSV Formula Injection (Spreadsheet DDE Command Execution) in Data Exports
- **ID:** SEC-11
- **Title:** Unescaped Formula Trigger Characters in Profile and Health Log CSV Exports
- **Severity:** Medium
- **Affected Roles & Routes:** All Roles with export capabilities (`NM`, `RA`, `CM`, `CD`, `SA`) at `/seniors`, `/sos/history`, `/reports/pilot`
- **Steps to Reproduce:**
  1. Assist in onboarding a senior with name `=CMD|'/C calc'!A0` or notes starting with `@SUM(1+1)`.
  2. Navigate to `/seniors` and export the records to CSV.
  3. Open the CSV in Microsoft Excel.
  4. Excel attempts formula evaluation or prompts the user to enable external data refresh.
- **Evidence:** Downloaded `.csv` file contains unescaped `=` characters in text columns.
- **Impact:** Potential code execution or data exfiltration on staff workstations opening exported case files.
- **Recommendation:** Prepend a single quote `'` to any string cell beginning with `=`, `+`, `-`, `@`, `\t`, or `\r` before serialization.

---

### SEC-12: Brute-Force Authentication & Account Lockout Invalidation via LocalStorage Clear
- **ID:** SEC-12
- **Title:** Account Lockout Bypass via Browser Storage Cache Invalidation
- **Severity:** Medium
- **Affected Roles & Routes:** Public Authentication at `/login`
- **Steps to Reproduce:**
  1. Navigate to `/login`.
  2. Enter an incorrect password 5 times. The UI locks out the account for 15 minutes.
  3. Open DevTools Console, execute `localStorage.removeItem('vayoshrestha_store_v2')`, and refresh.
  4. The lockout counter resets to 0 and password guessing resumes immediately.
- **Evidence:** Storage deletion restores clean seed state with zero failed attempts.
- **Impact:** Automated dictionary attacks against staff and coordinator accounts.
- **Recommendation:** Maintain failed login attempts and IP-level throttling in a server-side Redis cache with CAPTCHA challenges.

---

### SEC-13: Quasi-Identifier De-Anonymization in CSR / Donor Aggregate Views
- **ID:** SEC-13
- **Title:** Small-Cell Re-Identification Attack through Multi-Filter Cross-Tabulation
- **Severity:** Medium
- **Affected Roles & Routes:** CSR / Donor Reviewer (`CD`) at `/reports/pilot`
- **Steps to Reproduce:**
  1. Log in as CSR Reviewer (`CD`).
  2. Filter reports by Chapter (e.g. Mysuru Hub) and Language (e.g. Tamil) and Age Band `85+`.
  3. A single elder matches. While name and phone are suppressed, cross-referencing with local community knowledge de-anonymizes the participant.
- **Evidence:** Specific combination of non-identifying filters isolating a unique elder (`n=1`).
- **Impact:** Loss of privacy for seniors participating in civic wellness programs.
- **Recommendation:** Implement k-anonymity (k ≥ 5) suppressing entire cohort rows whenever the aggregated sample size falls below 5.

---

### SEC-14: Out-of-Range Health Vitals Injection Causing False Alarms or Silent Suppression
- **ID:** SEC-14
- **Title:** Malicious or Swapped Vitals Input Skewing Emergency Escalation Channels
- **Severity:** Medium
- **Affected Roles & Routes:** Senior Simulator / Field Volunteer at `/simulator`, `/health/logs`
- **Steps to Reproduce:**
  1. In the WhatsApp simulator text input, enter an inverted reading: `70/180`.
  2. The parser interprets 70 as systolic and 180 as diastolic, evaluating diastolic ≥ 120 as a Critical Alert.
  3. A false-alarm emergency SOS case is spawned on the Live SOS Board.
- **Evidence:** Inverted blood pressure readings bypass basic anatomical plausibility validation.
- **Impact:** Emergency responder fatigue and unnecessary dispatch of care team resources.
- **Recommendation:** Enforce anatomical sanity checks (`systolic > diastolic`, `systolic >= 60 && diastolic <= 140`) before evaluating threshold risk bands.

---

### SEC-15: Denial of Service via LocalStorage 5MB Quota Exhaustion
- **ID:** SEC-15
- **Title:** Client Application Freeze upon LocalStorage Quota Exceeded Exception
- **Severity:** Medium
- **Affected Roles & Routes:** All Roles at `/admin/audit-logs`, `/health/logs`
- **Steps to Reproduce:**
  1. Simulate 5,000 rapid vital log submissions or bulk audit events in DevTools.
  2. Browser storage hits the 5MB origin limit.
  3. Subsequent writes throw uncaught `DOMException: QuotaExceededError`, freezing the UI.
- **Evidence:** Unhandled `QuotaExceededError` preventing SOS case updates or state persistence.
- **Impact:** Inability for responders to acknowledge or resolve active SOS emergencies.
- **Recommendation:** Transition client-side caching to IndexedDB (Dexie.js) and offload transactional persistence to a PostgreSQL database.

---

### SEC-16: Concurrent SOS Acknowledge / Resolve Double-Submit Race Condition
- **ID:** SEC-16
- **Title:** Double-Action Race Condition on Live SOS Case Assignment
- **Severity:** Medium
- **Affected Roles & Routes:** Chapter Manager (`CM`), Regional Admin (`RA`) at `/sos/:id`
- **Steps to Reproduce:**
  1. Open `/sos/case-001` in two browser windows simultaneously.
  2. Click "Acknowledge" or "Assign Responder" in both tabs within 100 milliseconds.
  3. Both tabs push conflicting state updates to the event queue without distributed lock validation.
- **Evidence:** Two independent audit records generated with differing timestamps for the same lifecycle transition.
- **Impact:** Inconsistent case assignments and duplicate responder dispatches to the senior's residence.
- **Recommendation:** Use optimistic locking with version checks or Redis distributed mutexes (`Redlock`) on the backend.

---

### SEC-17: Client-Side Open Redirection via Unvalidated `returnTo` Query Parameter
- **ID:** SEC-17
- **Title:** Open Redirection via Phishing Links with External `returnTo` URLs
- **Severity:** Low
- **Affected Roles & Routes:** Public Authentication at `/login`
- **Steps to Reproduce:**
  1. Craft malicious URL: `http://localhost:3000/login?returnTo=https://evil-phishing.com`.
  2. Complete valid staff credentials.
  3. If navigation reads `searchParams.get('returnTo')` directly into `window.location.assign`, redirection escapes origin.
- **Evidence:** `returnTo` parameter accepted without checking if it begins with a relative `/` slash.
- **Impact:** Facilitates targeted phishing attacks against NGO staff and eldercare volunteers.
- **Recommendation:** Validate `returnTo` against a strict regex `^\/(?!\/)[a-zA-Z0-9_\-\/]*$` allowing only same-origin relative paths.

---

### SEC-18: Mock MFA TOTP Verification Uses Hardcoded Code `123456`
- **ID:** SEC-18
- **Title:** Static Multi-Factor Authentication Code Allows Bypass of Dual-Factor Security
- **Severity:** Low
- **Affected Roles & Routes:** System Administrator (`SA`), NGO Management (`NM`) at `/mfa`
- **Steps to Reproduce:**
  1. Log in as `SA` (`admin@vayohvikas.org`).
  2. System prompts for MFA 6-digit TOTP.
  3. Entering static code `123456` immediately authenticates the session without querying an authenticator app.
- **Evidence:** Hardcoded TOTP validation inside mock auth handler.
- **Impact:** An attacker who compromises staff passwords can bypass MFA without physical access to the device.
- **Recommendation:** Implement RFC 6238 TOTP validation with time-step drift windows and per-user cryptographic seeds on the backend.

---

### SEC-19: Unmasked Sensitive Contact Residue in Browser Print and Export CSS
- **ID:** SEC-19
- **Title:** Print View Cascades Expose Masked Contact Fields on Hardcopy Printouts
- **Severity:** Low
- **Affected Roles & Routes:** Field Volunteer (`VF`), Chapter Manager (`CM`) at `/seniors/:id`
- **Steps to Reproduce:**
  1. Open `/seniors/snr-001` with masked phone number `••••••3421`.
  2. Press `Cmd+P` or click "Print Welcome Card".
  3. If CSS `@media print` rules do not enforce masking overrides, underlying unmasked strings in data attributes can be rendered.
- **Evidence:** Print stylesheets rendering unmasked telephone numbers from attributes.
- **Impact:** Physical leakage of senior citizen contact details on discarded printed welcome cards.
- **Recommendation:** Apply `@media print` rules that suppress unmasked data attributes and sanitize the print DOM.

---

### SEC-20: Missing `rel="noopener noreferrer"` on Outbound Links
- **ID:** SEC-20
- **Title:** Reverse Tabnabbing via Target Blank External Links
- **Severity:** Low
- **Affected Roles & Routes:** All Roles at `/help`, `/privacy`
- **Steps to Reproduce:**
  1. Inspect external privacy and ABDM regulatory documentation links on `/privacy`.
  2. Links specifying `target="_blank"` without `rel="noopener noreferrer"` expose `window.opener`.
- **Evidence:** DOM inspection revealing anchor elements with `target="_blank"` missing security attributes.
- **Impact:** Potential reverse tabnabbing where external pages redirect the opener window to phishing sites.
- **Recommendation:** Always append `rel="noopener noreferrer"` to external anchor tags.

---

### SEC-21: In-Memory Token Lifetime Never Invalidated on Client Tab Close
- **ID:** SEC-21
- **Title:** Cleartext In-Memory Auth State Persists Across Browser Restores
- **Severity:** Info
- **Affected Roles & Routes:** Staff Sessions on Shared Hub Kiosks
- **Steps to Reproduce:**
  1. Log in on a shared Ekta Hub computer.
  2. Close the browser tab without clicking "Sign Out".
  3. Reopen browser and restore closed tabs (`Cmd+Shift+T`). Session remains fully active.
- **Evidence:** Session persistence in `localStorage` without explicit session expiry on browser unload.
- **Impact:** Unauthorized access by subsequent volunteers using the same shared kiosk.
- **Recommendation:** Store session tokens in `sessionStorage` or in-memory only, coupled with an idle timeout and explicit logout on tab closure.

---

### SEC-22: Absence of Static Hosting Security Headers & Content Security Policy (CSP)
- **ID:** SEC-22
- **Title:** Missing CSP, X-Frame-Options, and Strict-Transport-Security Headers
- **Severity:** Info
- **Affected Roles & Routes:** All Routes on Static Development Server
- **Steps to Reproduce:**
  1. Inspect HTTP response headers returned by the Vite static server.
  2. Headers `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` are absent.
  3. The web app can be embedded inside an iframe on an external domain.
- **Evidence:** Successful framing in an external HTML page without browser blocking.
- **Impact:** Susceptibility to clickjacking and inline script injection attacks.
- **Recommendation:** Configure static hosting (Nginx, Netlify, Cloudflare) to return strict CSP headers:
  `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none';`

---

## What a Real Backend Must Enforce

When transitioning this prototype to a production environment with a real server, database, and messaging gateway, the engineering team **must strictly enforce these 10 architectural mandates**:

1. **Cryptographic HMAC-SHA256 Webhook Verification:** Reject all inbound WhatsApp/SMS webhooks failing cryptographic signature validation against provider shared secrets, and de-duplicate message IDs using an in-memory Redis cache (TTL 300s).
2. **Server-Side Session & Role Claims:** Never rely on role claims sent by the browser. Verify signed, HTTP-only, secure session cookies on every request, mapping user IDs to database roles and permissions.
3. **Database-Level Multi-Tenant Scope Partitioning:** Enforce Row-Level Security (Postgres RLS) partitioning queries by `chapter_id` and `region_id` to structurally eliminate IDOR across Ekta Hubs.
4. **Field-Level Projection & Masking at the API Boundary:** Filter out unmasked telephone numbers, caregiver contacts, and ABHA numbers before serializing JSON payloads for unauthorized roles (e.g. Field Volunteers, CSR Reviewers).
5. **Atomic Database Maker–Checker Constraints:** Enforce dual-control business rules within database transactions where `approved_by != created_by`, completely preventing self-approval.
6. **Pre-Flight Consent Ledger Verification:** Verify active consent flags immediately prior to handing off messages to WhatsApp Business API or SMS gateway endpoints.
7. **Transient Scoped Responder Access (24-Hour TTL):** Grant Care Team responders time-limited token claims that automatically revoke access to senior contacts 24 hours after case resolution.
8. **Rate Limiting & Credential Stuffing Defenses:** Implement Redis-backed token bucket rate limiters on login, password reset, and webhook endpoints with exponential backoff and IP throttling.
9. **Append-Only Write-Once Audit Logging:** Stream all audit records to immutable, write-once object storage (e.g., AWS S3 Object Lock, CloudWatch) with cryptographic hash chaining.
10. **Strict Export Formula Sanitization:** Prepend formula-escape prefixes (`'`) to all user-controlled text strings in CSV/Excel export endpoints to neutralize spreadsheet command injection.
