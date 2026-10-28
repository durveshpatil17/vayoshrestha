# VAYOSHRESHTHA — Product Roadmap & Future Phases

Per Hard Constraint 1 of the Pilot Master Prompt, the initial 90-day pilot is strictly bounded to the **three core operational service modules**:
1. **Module 1**: Core Safety Pillar — Emergency SOS Routing with Cellular Fallback SMS
2. **Module 2**: Preventive Health Pillar — Medication Adherence & Vital Logs with Non-Clinical Anomaly Escalation
3. **Module 3**: Civic & Profile Pillar — Secure Onboarding with ABHA-Ready Profile Structure

All other functional modules previously conceived for the wider ecosystem are deferred to post-pilot phases and are explicitly documented here.

---

## 1. Out-of-Scope Modules Deferred to Later Phases

The following modules are **not part of the pilot prototype** and will be considered only after the conclusion and evaluation of the 90-day pilot:

| Module / Capability | Proposed Phase | Description & Strategic Context |
|---|---|---|
| **Centres & Programmes Management** | Phase 2 | Ekta Hub physical facility management, activity calendars, instructor assignments, hall bookings, and recurrent weekly programmes. |
| **Attendance Tracking & Hall Rosters** | Phase 2 | Session attendance marking, offline QR badge check-in, 24-hour attendance locks, and maker-checker attendance corrections. |
| **Consultation & Service Catalogue** | Phase 2 | Directory of NGO-subsidized eldercare services, physiotherapy sessions, legal counselling, and home assistive visits. |
| **Approved Service Partner Network** | Phase 2 | External partner directory, partner portal (`/partner/*`), partner onboarding, SLA monitoring, and formal referral dispatch contracts. |
| **External Clinical Referrals** | Phase 2 | Two-way case referrals to specialized geriatric hospitals, pathology labs, and senior clinics. |
| **Automated Voice Calls (AI/IVR)** | Phase 2B | Automated interactive voice check-in calls for seniors with zero digital literacy or visual impairments. |
| **Beneficiary Feedback Form Builder** | Phase 3 | Dynamic survey builder, Likert satisfaction scales, NPS tracking, and post-activity feedback collection. |
| **Authorised Family Member Portal** | Phase 3 | Dedicated family proxy web portal (`/family/*`) for adult children living distantly, allowing proxy bookings and consent monitoring. |
| **CSR Custom Report Builder & Funder Portal** | Phase 3 | Interactive drag-and-drop report designer for corporate CSR donors, with automated tax compliance and grant auditing. |

---

## 2. ABHA / ABDM Phase 2 Roadmap

Per Hard Constraint 8, ABHA (Ayushman Bharat Health Account) is **structure-only** during the pilot:
- **Pilot Implementation**: Field structure for 14-digit ABHA number (`XX-XXXX-XXXX-XXXX`), optional ABHA address (`name@abdm`), format-only validation, separate ABDM consent flag, status "Provided, not verified", and disabled "Link ABHA (Phase 2)" button.
- **Phase 2 Implementation (Post-Pilot Execution Confirmation)**:
  1. Integration with ABDM Gateway / National Health Authority (NHA) APIs.
  2. OTP-based Aadhaar KYC verification via ABDM sandbox.
  3. Federated health record linking with approved diagnostic laboratories and hospitals.
  4. FHIR R4 compliance for digital prescription and lab report exchange.
  5. Consent Manager integration for revocable longitudinal health record access.
