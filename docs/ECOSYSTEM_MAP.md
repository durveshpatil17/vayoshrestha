# VAYOSHRESHTHA — Ecosystem Architecture Map (v3.1)
### Strategic Framework & Multi-Layer Operations

This document maps the four ecosystem operational layers and foundational pillars requested by the founder (Addendum v3.1, 29 Oct 2026), connecting third-party partners, last-mile active seniors, virtual engagement channels, and institutional policy advocacy.

---

## Strategic Framing

1. **Ecosystem Aggregation**: A single digital conduit linking verified third-party partners (hospitals, diagnostic laboratories, legal networks, financial experts, insurers) with senior citizens. The platform builds the integration and routing pipeline without attempting to provide clinical, legal, or financial advice.
2. **National Policy & Rights Advocacy**: A credible, data-backed foundation for evidence-driven advocacy (e.g. eliminating age-bar exclusions in health insurance and strengthening elder protection acts).
3. **Holistic Wellness Ecosystem**: Preventive health monitoring, digital and financial fraud literacy, and community participation unified in one ecosystem.
4. **Active Senior Capital Mobilisation**: Seniors transition from passive beneficiaries to dignified community leaders through peer-to-peer outreach as **Senior Field Associates (SF)**.

---

## Ecosystem Layers & Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              LAYER 4: AGGREGATED ANONYMOUS TELEMETRY ENGINE                     │
│  - Real-Time Cohort Compliance Dashboard (/telemetry, /telemetry/trends)        │
│  - Tamper-Evident Impact Pack Builder & PDF Generator (/telemetry/packs)        │
│  - Public Tamper Verification Gateway (/verify, /verify/:code)                  │
│  - Macro Health & Coarse Vaccination Trend Analysis (k-anonymity >= 5)          │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Telemetry & Outcomes Stream
┌────────────────────────────────────────┴────────────────────────────────────────┐
│                   CORE SAFETY & PREVENTIVE HEALTH FOUNDATION                    │
│  - Real-Time Emergency SOS Board & Cellular Fallback SMS (/sos, /sms-log)       │
│  - Medication Adherence & Vital Telemetry Logs (/health, /health/logs)          │
│  - Non-Clinical Wellness Check-In Call Triage (/health/flags, /health/calls)    │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Requests, Referrals & Enrolments
┌────────────────────────────────────────┴────────────────────────────────────────┐
│                   LAYER 1: PARTNER ROUTING FABRIC & INTAKE                      │
│  - Partner Routing Engine & Load-Balancing (/routing, /routing/rules)           │
│  - WhatsApp Diagnostic Voucher Generation & Redemption (/vouchers)              │
│  - Encrypted Pro-Bono Legal Intake & Consultation Queue (/legal-intake)         │
│  - Third-Party Partner Management Portal (/partners, /partner/*)                │
└───────────────────┬─────────────────────────────────────────┬───────────────────┘
                    │                                         │
┌───────────────────┴──────────────────┐   ┌──────────────────┴───────────────────┐
│     LAYER 2: VIRTUAL LITERACY &      │   │       LAYER 3: GIG WORKER TERMINAL   │
│         ENGAGEMENT (WhatsApp)        │   │          ("Field View" /field/*)     │
│ - Cyber & Fraud Safety Micro-Lessons │   │ - Mobile-First Senior Peer Intake    │
│ - Regional Mastermind Quizzes        │   │ - Double-Consent State Machine       │
│ - Community Webinars & Broadcasts    │   │ - Coarse Geo-Stamped Activity Log    │
│ - Routes: /learning/*, /me/*         │   │ - AES-GCM Encrypted Offline Sync     │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

---

## Detailed Layer Mapping

### Layer 1: Partner Routing Fabric
- **Purpose**: Automated allocation of senior support requests to verified service partners (Hospitals, Diagnostic Labs, Legal Networks, Financial Experts, Insurers).
- **Core Pages**:
  - `/routing` — Routing Overview, partner load balancing, unrouted requests.
  - `/routing/requests/:id` — Decision record ("Why this partner": language, capacity, region, SLA).
  - `/routing/rules` — Categorical routing rules editor with deterministic tie-breaks.
  - `/vouchers` & `/vouchers/campaigns` — Single-use Crockford Base-32 diagnostic vouchers delivered via WhatsApp.
  - `/partner/vouchers` & `/partner/vouchers/redeem` — Service Partner redemption terminal.
  - `/legal-intake` & `/legal-intake/:id` — WebCrypto AES-GCM encrypted intake queue with access logs.
- **Key Roles**: PM (Configure & Propose), NM (Approve Campaigns & Rules), SP (Partner Fulfilment), CM/VF (Assisted Intake).

### Layer 2: Virtual Literacy & Community Engagement
- **Purpose**: WhatsApp-delivered educational campaigns, cybersecurity micro-lessons, and regional community events.
- **Core Pages**:
  - `/learning` — Literacy overview, reach, and completion rates.
  - `/learning/library` & `/:id` — 40 micro-lessons across Fraud Safety, Digital Skills, Wellness, Government Schemes.
  - `/learning/series` — 30-day sequential drip campaigns with quiet-hour rules.
  - `/learning/webinars` & `/:id` — Community sessions with consent-gated reminder dispatches.
  - `/learning/channels` & `/learning/quizzes` — Regional Mastermind Quiz with minimal-identifiability leaderboards.
  - `/me/learning`, `/me/quizzes`, `/me/events` — Senior Citizen self-service portal views.
- **Key Roles**: PM, CM, RA, SC (Participate), FM (Proxy Support).

### Layer 3: Gig Worker Terminal ("Field View")
- **Purpose**: Lightweight, mobile-first touch interface for active Senior Field Associates (SF) conducting peer-to-peer community onboarding.
- **Core Pages**:
  - `/field` — Mobile-first home with sync status banner and one-tap actions.
  - `/field/onboard` — 4-step onboarding flow with DPDP double-consent capture.
  - `/field/activity` — Coarse geo-stamped interaction history (`Hubballi Central`).
  - `/field/sync` — Offline sync queue with AES-GCM encryption and late-sync tracking.
  - `/field/learn` — Associate training micro-lessons on consent and eldercare ethics.
  - `/field-network` (Staff) — Operational dashboard with real-time **Field Telemetry Card**.
  - `/field-network/associates` & `/field-network/activity` — Associate rosters and activity logs.
- **Key Roles**: SF (Senior Field Associate), CM, PM, RA, NM.

### Layer 4: Aggregated Anonymous Telemetry Engine
- **Purpose**: Macro-level compliance reporting, policy lobbying evidence, and tamper-evident impact exports for institutional boards.
- **Core Pages**:
  - `/telemetry` — Cohort compliance dashboard with $k$-anonymity ($\ge 5$) and complementary suppression.
  - `/telemetry/trends` — Multi-axis trends (medication adherence, coarse vaccination coverage, insurance age-bar decline indicators).
  - `/telemetry/packs` & `/:id` — Impact pack builder (CSR Impact Brief, Government Health Brief, Insurance Age-Bar Evidence).
  - `/telemetry/exports` — Audited export registry with SHA-256 hash chains.
  - `/telemetry/privacy` — Anonymisation method statement and differential privacy bounds.
  - `/verify` & `/verify/:code` — Public, unauthenticated verification tool to validate tamper-evident PDFs.
- **Key Roles**: CD (CSR / Government Reviewer), NM, PM, RA, Public.

### Cross-Cutting: Foundational Safety & Health Core
- **Emergency SOS & Fallback**: `/sos`, `/sos/:id`, `/sms-log`, `/sos/settings`, `/sos/drills`.
- **Preventive Health**: `/health`, `/health/schedules`, `/health/logs`, `/health/flags`, `/health/calls`.
- **Ecosystem Nexus (`/ecosystem`)**: Interactive architecture diagram with live data telemetry counters.
