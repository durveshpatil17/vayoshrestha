# VAYOSHRESHTHA — Data Realism & Seed Standards

**Version**: 4.0.0  
**Phase**: Pass v4  
**Scope**: Mock Data Generators, Single Event Store Seeds, and Live Demo Personas  

---

## 1. Principles of Realism

A prototype presented to CSR funders and enterprise IT directors must avoid "vibe-coded" demo artifacts (such as round numbers like 100 or 500, uniform timestamps, identical names, and pristine zero-error records). Real non-profit field operations are messy, nuanced, and human.

### 1.1 Non-Round Numbers & Realistic Rhythms
- **No Round Totals**: Figures must reflect organic operational counts (e.g., 1,042 enrolled seniors, 87.4% medication adherence, 14.2 min median response time, 43 pending tasks).
- **Time-of-Day Rhythms**:
  - Morning vitals & medication prompts: 07:00–09:00 IST.
  - Morning attendance marking: 10:00–11:30 IST.
  - Afternoon lull / quiet hours: 13:00–15:30 IST.
  - Evening wellness calls & community sessions: 16:30–18:30 IST.
  - Night quiet hours: 21:00–08:00 IST (strictly enforced on all automated campaigns).

### 1.2 Region-Appropriate Demographics & Honorifics
Seed cohorts across the three operating regions must use authentic local naming conventions, honorifics, and ward structures:

| Region | Chapters (Ekta Hubs) | Common Honorifics & Surnames | Representative Localities |
|---|---|---|---|
| **North Karnataka** | Hubballi Central, Dharwad West, Belagavi South | *Shri / Smt.*: Patil, Kulkarni, Shettar, Hiremath, Desai, Joshi, Kamat, Badiger | Keshwapur, Vidyanagar, Station Road, Saptapur, Maratha Colony, Tilakwadi |
| **Western Maharashtra** | Pune Kothrud, Kolhapur Shahupuri, Solapur East | *Shri / Smt.*: Deshmukh, Kulkarni, Joshi, Shinde, Pawar, Chavan, Gaikwad, More | Kothrud Dahanukar Colony, Sadashiv Peth, Shahupuri Ward 4, Juna Rajwada, Navi Peth |
| **Rajasthan Hubs** | Jaipur Malviya Nagar, Jodhpur Sardarpura, Udaipur City | *Shri / Smt.*: Sharma, Meena, Rathore, Singh, Choudhary, Agarwal, Gehlot, Mathur | Malviya Nagar Sector 3, C-Scheme, Sardarpura B-Road, Ratanada, City Palace Ward |

### 1.3 Age & Health Distribution
- Ages range from 60 to 94 years, with a median of 72.8 years and a realistic right-hand tail.
- Chronic conditions reflect urban/semi-urban elder reality: 62% Hypertension, 44% Type-2 Diabetes, 28% Arthritis/Mobility limitation, 14% Mild Cognitive Impairment.

### 1.4 Imperfect Records & Data Gaps
Real operations have incomplete data:
- **Optional Fields Missing**: ~35% of seniors lack an ABHA ID; ~18% lack a blood group; ~12% have no alternate phone number.
- **Stalled Onboarding**: ~15% of initiated registrations stall at the second-consent step or document verification.
- **Late Field Syncs**: ~4% of field mobile syncs have a sync delay $> 24\text{ hours}$ due to poor rural cellular connectivity.

---

## 2. Canonical In-Flight Stories (The Cast)

To allow any CSR funder demonstration to be entered mid-workflow without preliminary manual setup, the prototype contains 8 named, pre-seeded **In-Flight Stories**. Each appears in the corresponding role's inbox (`/inbox`) with live context and pending actions.

### Story 1: Smt. Lakshmi Devi (Hubballi) — Active Emergency SOS
- **Entity**: `SOS-26-00042`
- **Senior**: Smt. Lakshmi Devi, age 74, Hubballi Central.
- **Condition**: Severe dizziness and chest heaviness reported via Senior Portal.
- **Queue**: Care Triage (`CT`) and Chapter Manager (`CM`) Live Board.
- **State**: `Unacknowledged`, 3 minutes old (approaching 5-minute escalation SLA).
- **Demo Action**: Acknowledge emergency, review emergency contacts (daughter Anuradha), assign local responder Ganesh Patil.

### Story 2: Shri Ramesh Kulkarni (Pune) — Hypertensive Crisis Flag
- **Entity**: `FLAG-26-00189`
- **Senior**: Shri Ramesh Kulkarni, age 68, Pune Kothrud.
- **Condition**: Morning vitals prompt returned `"BP 168/102, pulse 88"`.
- **Queue**: Care Queue (`CT` / `CM` `/inbox`).
- **State**: `High-Risk Flag Open`, wellness call due within 4 hours.
- **Demo Action**: Click `Take next` in Care Queue, review 7-day vitals graph with threshold bands, record wellness phone call.

### Story 3: Shri Abdul Rehman (Jaipur) — Second Consent Pending
- **Entity**: `ONB-26-00312`
- **Senior**: Shri Abdul Rehman, age 79, Jaipur Malviya Nagar.
- **Channel**: Field Associate door-to-door capture by Associate Priya Sharma.
- **Queue**: Onboarding Stalled Queue (`CM` / `PM`).
- **State**: First in-person consent signed; awaiting WhatsApp interactive button confirmation.
- **Demo Action**: Open WhatsApp simulator, trigger second consent button, observe live state advance to `Registered` and ID issuance.

### Story 4: Smt. Savitri Patil (Kolhapur) — Diagnostic Voucher Unredeemed
- **Entity**: `VCH-26-8942-D`
- **Senior**: Smt. Savitri Patil, age 76, Kolhapur Shahupuri.
- **Service**: Geriatric Vision & Cataract Screening at Drishti Eye Care.
- **Queue**: Partner Portal (`SP`) and Kolhapur Referrals.
- **State**: Voucher issued 2 days ago; pending partner redemption.
- **Demo Action**: Switch to Partner persona (`SP`), navigate to `/partner/vouchers/redeem`, input code `VCH-26-8942-D`, verify checksum, click `Confirm Redemption`.

### Story 5: Shri Mohan Lal (Jodhpur) — Pro-Bono Legal Intake
- **Entity**: `LEG-26-00054`
- **Senior**: Shri Mohan Lal, age 82, Jodhpur Sardarpura.
- **Category**: Ancestral Property Coercion.
- **Queue**: Legal Queue (`SP` Advocate).
- **State**: Assigned to Advocate Smt. Sunita Rao; narrative encrypted.
- **Demo Action**: Switch to Advocate, observe encrypted client-advocate privilege badge, review case notes, record closure code `SETTLED_WITH_FAMILY_MEDIATION`.

### Story 6: Dharwad Quiz Channel — Weekly Mastermind Active
- **Entity**: `LRN-QZ-26-04`
- **Topic**: Cyber Safety & UPI Fraud Awareness.
- **Target**: North Karnataka Chapters.
- **State**: Round active; 84 seniors participated today; Hubballi leading Dharwad by 3 points.
- **Demo Action**: Switch to Senior Citizen (`SC`), open `/me/quizzes`, answer question on UPI PIN safety, observe instant celebratory score update and chapter leaderboard movement.

### Story 7: Governance Maker-Checker — Seasonal Advisory Pending
- **Entity**: `TMP-26-00018`
- **Author**: Programme Manager Shri Suresh Nair.
- **Subject**: "Monsoon Water Safety & Boil-Water Advisory" in Kannada & English.
- **Queue**: National Manager (`NM`) `/admin/approvals` & `/inbox`.
- **State**: Submitted 4 hours ago; awaiting statutory sign-off.
- **Demo Action**: Open approval task, review dual-language rendering with tokenized dynamic chips, approve template.

### Story 8: Community Programme — Attendance Correction
- **Entity**: `ATT-COR-26-00007`
- **Session**: Gentle Yoga Batch B at Belagavi South.
- **Applicant**: Volunteer Facilitator Meena Joshi.
- **Reason**: Senior Smt. Pushpa arrived during meditation; omitted from locked sheet.
- **Queue**: Chapter Manager (`CM`) `/inbox`.
- **State**: Pending approval.
- **Demo Action**: CM approves correction; Belagavi chapter attendance increments by 1.

---

## 3. ID Numbering Formats

All entities follow deterministic, human-readable formats with year prefix and domain codes:

| Entity | ID Format | Example |
|---|---|---|
| **Senior Member** | `VV-<CHAPTER>-<YY>-<NNNNN>` | `VV-HBL-26-00123` |
| **Emergency SOS Case** | `SOS-<YY>-<NNNNN>` | `SOS-26-00042` |
| **Health Reading** | `VIT-<YY>-<NNNNN>` | `VIT-26-00912` |
| **Service Referral** | `REF-<YY>-<NNNNN>` | `REF-26-00317` |
| **Digital Voucher** | `VCH-<YY>-<NNNN>-<C>` (Crockford-32) | `VCH-26-8942-D` |
| **Legal Intake** | `LEG-<YY>-<NNNNN>` | `LEG-26-00054` |
| **Task Item** | `TSK-<YY>-<NNNNN>` | `TSK-26-00088` |
| **Impact Pack** | `VV-PACK-<YY>-<QUARTER>-<TAG>` | `VV-PACK-26-Q3-CSR` |
| **Chapter Code** | `<REGION>-<LOCALITY>` | `KA-HBL-CEN` |

