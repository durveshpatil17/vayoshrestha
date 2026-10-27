# VAYOSHRESHTHA — API Endpoint Contracts Specification

This document defines the REST-compatible endpoint contracts implemented by the in-browser Mock API Layer (`src/mock/store.ts`). A future production backend can be built directly against this specification.

---

## 1. Authentication & Session Endpoints

### `POST /api/auth/login`
- **Request**:
  ```json
  { "email": "coordinator.pune@vayohvikas.org", "password": "Demo@1234" }
  ```
- **Response `200 OK`**:
  ```json
  { "user": { "id": "u-cc-pune", "role": "CC", "name": "Meera Joshi", "assignedCentres": ["HUB-PUN"] }, "token": "mock-jwt-token" }
  ```
- **Errors**: `401 Unauthorized` (Invalid credentials), `423 Locked` (Too many failed attempts).

### `POST /api/auth/login-otp`
- **Request**: `{ "phone": "9822011223" }`
- **Response `200 OK`**: `{ "message": "OTP dispatched", "expiresIn": 300 }`

### `POST /api/auth/verify-otp`
- **Request**: `{ "phone": "9822011223", "otp": "123456" }`
- **Response `200 OK`**: `{ "user": UserAccount, "token": "mock-jwt-token" }`

### `POST /api/auth/verify-mfa`
- **Request**: `{ "userId": "u-sa-1", "totp": "123456" }`
- **Response `200 OK`**: `{ "authenticated": true, "token": "mock-jwt-token" }`

---

## 2. Senior Citizen Management

### `GET /api/members`
- **Query Params**: `centreId`, `status`, `language`, `search`, `page`, `pageSize`, `sort`
- **Response `200 OK`**:
  ```json
  {
    "items": SeniorCitizen[],
    "total": 1000,
    "page": 1,
    "pageSize": 25,
    "totalPages": 40
  }
  ```
- **Scope**: Scoped to user's assigned centres if CC/VF. Field `phone` masked unless authorized reveal.

### `POST /api/members`
- **Request**: `Omit<SeniorCitizen, 'id' | 'membershipId'>`
- **Response `201 Created`**: Returns newly registered `SeniorCitizen` with generated `membershipId` (e.g. `VV-PUN-26-00042`). Writes `CREATE` audit event.

### `GET /api/members/:id`
- **Response `200 OK`**: Single `SeniorCitizen` record. `phone` masked for VF.
- **Errors**: `403 Forbidden` if CC/VF attempts cross-centre access or FM unlinked.

### `POST /api/members/:id/reveal-phone`
- **Request**: `{ "reason": "Emergency contact regarding clinic transport" }`
- **Response `200 OK`**: `{ "phone": "9822011223" }`
- **Side Effect**: Emits `PII_REVEAL` audit log record with actor ID and typed reason.

---

## 3. Centres & Hubs

### `GET /api/centres`
- **Response `200 OK`**: `EktaHub[]`
- **Scope**: All public directory info; coordinators see their assigned operational tags.

### `GET /api/centres/:id`
- **Response `200 OK`**: `EktaHub` detail with aggregated metrics (active members, monthly attendance).

---

## 4. Programmes & Sessions

### `GET /api/programmes`
- **Query Params**: `centreId`, `category`, `status`
- **Response `200 OK`**: `Programme[]`

### `GET /api/sessions`
- **Query Params**: `centreId`, `from`, `to`, `programmeId`
- **Response `200 OK`**: `ProgrammeSession[]`

### `POST /api/sessions/:id/register`
- **Request**: `{ "memberId": "m-12", "isWalkIn": false }`
- **Response `200 OK`**: `SessionRegistration` with status `Confirmed` or `Waitlisted`.

---

## 5. Attendance & Corrections

### `GET /api/sessions/:id/attendance`
- **Response `200 OK`**: `{ "session": ProgrammeSession, "records": AttendanceRecord[], "lockRemainingHours": 8 }`

### `POST /api/sessions/:id/attendance`
- **Request**: `{ "records": { "memberId": string, "status": "Present" | "Absent" }[] }`
- **Response `200 OK`**: `{ "updated": number, "attendanceRecorded": true }`
- **Constraint**: Rejects with `403` if lock window has expired.

### `POST /api/attendance/corrections`
- **Request**: `AttendanceCorrectionRequest` (Requires mandatory `reason`)
- **Response `201 Created`**: Returns `AttendanceCorrection` with status `Pending`.

### `POST /api/attendance/corrections/:id/review`
- **Request**: `{ "decision": "Approved" | "Rejected", "comment": string }`
- **Response `200 OK`**: Updates attendance record and emits `ATTENDANCE_CORRECTION` audit diff.
- **Rule**: Rejects if reviewer ID matches requester ID (Maker-Checker).

---

## 6. Communication & WhatsApp

### `GET /api/communication/stats`
- **Response `200 OK`**: `{ "monthlyVolume": 2040, "volumeCap": 10000, "deliveryRate": 98.4, "optOutCount": 60 }`

### `POST /api/communication/announcements`
- **Request**: `{ "title": string, "content": string, "filters": object }`
- **Response `201 Created`**: Queues outbound messages for approved members with recorded consent. Excludes opted-out members.

---

## 7. Referrals & Partner Portal

### `GET /api/referrals`
- **Query Params**: `status`, `partnerId`, `centreId`
- **Response `200 OK`**: `Referral[]`
- **Scope**: Service Partners (`SP`) only receive referrals assigned to their organisation with masked demographic fields.

### `PATCH /api/referrals/:id/status`
- **Request**: `{ "status": ReferralStatus, "notes"?: string, "closureOutcome"?: string }`
- **Response `200 OK`**: Updated `Referral`. Enforces state machine transitions.

---

## 8. Health Escalations & Warning Signs

### `GET /api/support/escalations`
- **Response `200 OK`**: `HealthEscalation[]` with SLA countdown status.

### `POST /api/support/escalations/:id/resolve`
- **Request**: `{ "resolutionSummary": string, "handoverNotes": string }`
- **Response `200 OK`**: Escalation status updated to `Resolved`. Coordinator notified.

---

## 9. Governance, Settings & Audit Logs

### `GET /api/admin/audit-logs`
- **Query Params**: `actorId`, `action`, `centreId`, `entity`, `from`, `to`
- **Response `200 OK`**: `AuditEvent[]` with SHA-256 hash chains.

### `POST /api/admin/reset-demo-data`
- **Response `200 OK`**: Purges and re-seeds deterministic synthetic data store.
