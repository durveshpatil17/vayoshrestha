# VAYOSHRESHTHA v2 — Architectural & Design Decisions Log

This document records architectural, UX, data-model, security, and scope decisions made for the Vayoshreshtha v2 Pilot Prototype for the NGO Vayoh Vikas, per the master prompt requirements.

---

## Decision 001: Strict Three-Module Pilot Scope & Deprecation of Non-Core Modules
- **Date**: 2026-10-28
- **Context**: The pilot requires deep operational fidelity for the core high-value operational tranche rather than surface-level breadth across the entire platform.
- **Decision**: Restrict prototype implementation strictly to:
  1. Module 1: Emergency SOS Routing with cellular fallback SMS to next-of-kin.
  2. Module 2: Preventive Health (Medication adherence and blood pressure / glucose logging with anomaly triage).
  3. Module 3: Civic & Profile Pillar (Secure Onboarding with ABHA-ready profile structure).
  All previously scaffolded modules (Programmes, Attendance, Bookings, External Service Referrals, Partner Directory, Feedback Forms, CSR Custom Builder, Family Portal, AI Voice Calls) are removed from active routing and documented in `docs/ROADMAP.md` as "later phases".
- **Rationale**: Meets Hard Constraint 1. Maximizes engineering depth on life-critical SOS reliability, health flag escalation, and privacy-preserving onboarding.

---

## Decision 002: Role Realignment (RA & CM Hierarchy, Removal of PM & SP)
- **Date**: 2026-10-28
- **Context**: The operational field structure for Vayoh Vikas requires a 2-tier geographical hierarchy: Regional Admins (RA) overseeing regions (South, West, North), and Chapter Managers (CM) running individual Ekta Hubs (Pune, Bengaluru, etc.), supported by Field Volunteers (VF), Care Team responders (CT), Executive Leadership (NM), System Admin (SA), CSR Donors (CD), Senior Citizens (SC), and Next-of-Kin (NK).
- **Decision**: Refactor RBAC roles:
  - Add `RA` (Regional Admin) with region-level scope.
  - Add `CM` (Chapter Manager) with chapter-level scope.
  - Remove `PM` and `SP` (out-of-scope for the 3-module pilot; SP belongs to external referrals).
  - Define `NK` as an SMS-only recipient without web authentication.
- **Rationale**: Aligns directly with Section 6.1 and operational incident management requirements.

---

## Decision 003: Multi-Tab Real-Time Cross-Talk via BroadcastChannel & LocalStorage Event Fallback
- **Date**: 2026-10-28
- **Context**: In a demo or automated verification, the senior simulator running in Tab A must instantly trigger an SOS alert on the Regional Admin/Chapter Manager SOS board running in Tab B without a server or WebSocket infrastructure.
- **Decision**: Implement `BroadcastChannel('vayoshrestha_channel')` with fallback to `window.addEventListener('storage')`. Every SOS trigger, cancellation, or status update broadcasts an envelope with a high-resolution timestamp (`performance.now()`), allowing the receiving tab to compute simulated enqueue-to-dashboard latency in milliseconds.
- **Rationale**: Satisfies Section 2 and Hard Constraint 10 while keeping the entire prototype zero-backend.

---

## Decision 004: Cellular Fallback Decision Function & SMS Gateway Simulation
- **Date**: 2026-10-28
- **Context**: Seniors in low-connectivity areas may experience network drops mid-SOS transaction.
- **Decision**: Provide a "Simulate data disconnect" toggle in the senior simulator and dev panel. When enabled, if an SOS dispatch is initiated while disconnected or fails receipt within a simulated network drop window:
  1. The fallback decision function immediately fires a simulated transactional SMS to Next-of-Kin 1.
  2. If Next-of-Kin 1 delivery fails and settings specify "all contacts" or "retry next", it fires to Next-of-Kin 2.
  3. If consent or number is missing, the case is flagged on the admin dashboard as "no next-of-kin SMS possible: consent/number missing".
  4. The event is recorded in the `/sms-log` outbox.
- **Rationale**: Directly satisfies Module 1 Core Safety Pillar and Hard Constraint 10.

---

## Decision 005: ABHA Structure-Only Implementation (Phase 2 Preparation)
- **Date**: 2026-10-28
- **Context**: National health account (ABHA) linkage is critical for long-term health federation under ABDM, but federated lookup and KYC verification are not in the pilot scope.
- **Decision**: 
  - Store ABHA number (14 digits formatted as `XX-XXXX-XXXX-XXXX`) and optional ABHA address (`name@abdm`).
  - Validate format only via regex `^\d{2}-\d{4}-\d{4}-\d{4}$`.
  - Enforce separate ABDM consent toggle.
  - Never display a "Verified" state. Status is strictly "Not provided" or "Provided, not verified".
  - Disable any "Link ABHA" button with a visible badge: `"Phase 2"`.
- **Rationale**: Meets Hard Constraint 8. Guarantees ethical and regulatory transparency.

---

## Decision 006: Non-Clinical Language & Configurable Placeholder Thresholds
- **Date**: 2026-10-28
- **Context**: Vayoh Vikas is an eldercare NGO, not a clinical hospital. The prototype must never provide medical diagnoses or advice.
- **Decision**:
  - Display a permanent institutional notice on all health views: *"Vayoshreshtha does not diagnose or give clinical advice. High readings prompt a non-clinical wellness check-in call."*
  - Pre-configure default vital thresholds (BP: Systolic Normal <130, Watch 130–139, High-Risk 140–179, Critical >=180; Diastolic Normal <85, Watch 85–89, High-Risk 90–119, Critical >=120) with a prominent banner: *"Placeholder — to be set by a qualified clinician and approved by NGO Management"*.
  - When an anomaly is detected, generate a "Wellness check-in call" task with a non-clinical script (listening, reassurance, prompting in-person clinic visit).
- **Rationale**: Complies with Hard Constraint 9 and ethical standards for community health workers.

---

## Decision 007: In-Browser Event Queue & Time Machine
- **Date**: 2026-10-28
- **Context**: The pilot requires scheduled 08:00 morning medication reminders, quiet hours, and queue depth/latency metrics without a live Redis server.
- **Decision**: Implement an in-memory priority event queue with persistent storage in `localStorage`. Provide a developer panel (`?dev=1` or top bar quick action) with a "Time Machine" control that can advance virtual time to 08:00 IST to fire scheduled reminder jobs on demand for testing and live demonstrations.
- **Rationale**: Eliminates waiting 24 hours to test cron jobs and reminder flows.
