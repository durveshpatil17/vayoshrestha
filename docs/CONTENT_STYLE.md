# VAYOSHRESHTHA — Content Style & Terminology Guide

**Version**: 4.0.0  
**Phase**: Pass v4  
**Scope**: All UI Chrome, Buttons, Modals, Error Messages, and User Communications  

---

## 1. Canonical Terminology & Glossary

To ensure professional consistency and institutional trust, the following canonical terms are mandatory across all code, labels, headers, and tooltips. Deprecated variants are banned.

| Canonical Term | Permitted Context / Definition | Banned Variants (Do NOT use) |
|---|---|---|
| **Chapter** | A community operating unit. The UI may say "Chapter (Ekta Hub)" on first formal introduction, thereafter strictly "Chapter". | "centre", "hub", "branch", "club", "facility", "station" |
| **Senior** | An older adult (aged 60+) enrolled in the care ecosystem. | "member", "elder", "old person", "patient", "beneficiary", "client" |
| **Field associate** | An accredited field worker conducting last-mile outreach, offline capture, and home visits. | "agent", "gig worker", "field boy", "canvaser", "surveyor" |
| **Emergency** | An active life-safety SOS trigger requiring immediate operational triage. Use "Emergency SOS" or "Emergency". | "SOS alarm", "panic trigger", "distress call", "incident" |
| **Wellness call** | A proactive telephonic health consultation following an abnormal vitals reading or flag. | "support call", "tele-call", "check-in call", "outreach call" |
| **Reading** | A recorded biometric data point (Blood Pressure, Blood Glucose, Pulse, SpO2). | "vitals entry", "measurement", "metric", "health stat" |
| **Reminder** | An automated scheduled WhatsApp or SMS notification prompting medication or vital check. | "nudge", "alert", "ping", "alarm" |
| **Referral** | A structured assignment of a senior's need to an accredited NGO, clinic, or diagnostic partner. | "lead", "ticket", "case handover", "transfer" |
| **Voucher** | A cryptographic, capacity-gated entitlement redeemable by a partner for senior services. | "coupon", "token", "pass", "ticket", "discount" |
| **Legal intake** | A confidential pro-bono consultation request protected by attorney-client privilege. | "legal case", "lawsuit", "dispute ticket", "court matter" |
| **Impact pack** | A cryptographic, tamper-evident SHA-256 PDF report of audited ecosystem outcomes. | "report bundle", "CSR export", "data pack", "metrics dump" |

---

## 2. Action & Button Grammar ("Verb + Object")

All interactive buttons and action menu items must use explicit **Verb + Object** syntax. Single-word ambiguous buttons (e.g., "Submit", "Save", "OK", "Done", "Next") are strictly prohibited.

### Standard Action Patterns

| Good (Verb + Object) | Bad (Vague / Single-Word) | Context |
|---|---|---|
| `Acknowledge emergency` | `Acknowledge` or `OK` | Live SOS triage board |
| `Assign responder` | `Assign` | Emergency dispatch |
| `Resolve emergency` | `Close` or `Resolve` | Emergency resolution |
| `Submit registration` | `Submit` or `Done` | Senior onboarding wizard |
| `Confirm unique person` | `Confirm` or `Next` | Duplicate review triage |
| `Initiate wellness call` | `Call` | Care triage queue |
| `Log vitals reading` | `Save` | Manual biometric entry |
| `Lock attendance sheet` | `Lock` | Session attendance marking |
| `Request correction` | `Edit` | Post-session attendance correction |
| `Submit for approval` | `Send` or `Submit` | Maker-checker workflows |
| `Approve template` | `Approve` | Announcement template review |
| `Redeem voucher` | `Redeem` or `Process` | Partner redemption terminal |
| `Authorize go-live` | `Go live` or `Activate` | Pilot readiness checklist |
| `Download verified pack` | `Download` | Impact pack registry |

---

## 3. Error Message Formatting & `E-XXXX` Codes

Every error message presented to a user must follow a structured 3-part format:
1. **Error Code**: A unique uppercase identifier (`E-XXXX`).
2. **Plain-English Cause**: What actually happened (respectful, no internal stack traces).
3. **Specific Remediation**: Exactly what the user or administrator can do to resolve it.

### Canonical Error Codes Catalogue

| Code | Trigger Cause | User-Facing Message | Remediation Action |
|---|---|---|---|
| `E-4031` | Missing capability | `E-4031: Permission denied for capability '{capability}'. Your current role ({role}) does not have access to this action.` | `Contact your Chapter Manager or System Admin if you believe this is in error.` |
| `E-4032` | Scope isolation violation | `E-4032: Scope restriction. You can only view or modify records within your assigned chapter ({chapter}).` | `Switch to your assigned chapter or request regional scope authorization.` |
| `E-4041` | Entity not found | `E-4041: Senior record not found. The record may have been deleted, merged, or purged under DPDP compliance.` | `Verify the member ID in the Senior Directory or check the merge log.` |
| `E-4091` | Duplicate phone conflict | `E-4091: Phone number already registered to active senior {member_id}.` | `Review existing record in Duplicate Review or verify phone number.` |
| `E-4221` | Quiet hours violation | `E-4221: Broadcast delivery prohibited during quiet hours (21:00 to 08:00 IST).` | `Schedule dispatch for 08:00 AM tomorrow or request emergency exception.` |
| `E-4222` | Maker-checker self-approval | `E-4222: Maker-checker violation. The author of a change cannot approve their own submission.` | `Assign an independent reviewer (NM or SA) to evaluate this change.` |
| `E-4223` | Voucher already redeemed | `E-4223: Voucher {code} has already been redeemed on {date} at {time}. Double redemption blocked.` | `Verify voucher status with partner administrator.` |
| `E-5001` | Offline sync timeout | `E-5001: Offline synchronization queue timed out while attempting cellular reconnection.` | `Check internet connection and tap 'Retry Sync' in Field Operations.` |

---

## 4. Confirmation Dialog Grammar

Confirmation dialogs for state changes or irreversible actions must clearly state:
1. **The Target Entity**: Name and ID.
2. **The Exact Consequence**: What will happen to related records, notifications, or tasks.
3. **High-Risk Actions**: Actions causing data deletion or statutory record closure must use the type-to-confirm pattern (e.g. typing `PURGE` or `RESOLVE`).

**Example: Resolving an Emergency SOS**
> **Title**: Resolve emergency case SOS-26-00042?  
> **Body**: Resolving this case will record Shri Ramesh Kulkarni's condition as stable, notify his emergency contact Smt. Anuradha via WhatsApp, and generate a mandatory 24-hour follow-up review task for Chapter Manager Shri Arvind Rao.  
> **Buttons**: `Cancel` · `Resolve emergency`

---

## 5. Typography, Sentence Case & Formatting

1. **Sentence Case Everywhere**: Page titles, section headings, table headers, form labels, badges, and button text must strictly use sentence case. Never Title Case or UPPERCASE (except for standard acronyms like SOS, SMS, DPDP, CSR, BP, PII, ID).
   - *Correct*: "Assisted senior registration", "Median acknowledgement time", "Needs attention".
   - *Incorrect*: "Assisted Senior Registration", "MEDIAN ACKNOWLEDGEMENT TIME".
2. **Numbers & Dates**:
   - Dates: `27 Oct 2026, 5:30 pm IST`.
   - Relative Dates: "3 min ago" with exact timestamp on hover.
   - Numerals: Always use Open Sans tabular figures (`font-variant-numeric: tabular-nums`).
   - Currency: Indian Rupee format (e.g., `₹12,500`).
