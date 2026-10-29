# Vayoshrestha Feature Ledger (Features F-001..F-105 & Process Steps P1..P15)

Total Items: 171 | Built: 151 | Partial: 16 | Missing/Planned: 4

| ID | Name | Module / FR | Routes | Roles | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| F-001 | Authentication & MFA | FR-01 | /login, /mfa, /forgot-password, /reset-password/:token, /first-login | ALL | Built |  |
| F-002 | Session management & timeout | FR-02 | /session-expired | ALL | Built |  |
| F-003 | Privacy consent | FR-03 | /privacy | ALL | Built |  |
| F-004 | 403 / 404 / offline | FR-04 | /403, /404, /offline | ALL | Built |  |
| F-005 | Role-based dashboards | FR-05 | / | SA,NM,RA,CM,VF,CT,CD,PM,SP,SC,FM | Built |  |
| F-006 | SA dashboard | FR-05 | / (SA) | SA | Built |  |
| F-007 | NM dashboard | FR-05 | / (NM) | NM | Built |  |
| F-008 | RA dashboard | FR-05 | / (RA) | RA | Built |  |
| F-009 | CM dashboard | FR-05 | / (CM) | CM | Built |  |
| F-010 | VF dashboard | FR-05 | / (VF) | VF | Built |  |
| F-011 | CT dashboard | FR-05 | / (CT) | CT | Built |  |
| F-012 | CD dashboard | FR-05 | / (CD) | CD | Built |  |
| F-013 | PM dashboard | FR-05 | / (PM) | PM | Built |  |
| F-014 | SP dashboard | FR-05 | / (SP) | SP | Built |  |
| F-015 | SC home portal | FR-05 | /me | SC | Built |  |
| F-016 | FM home portal | FR-05 | /family | FM | Built |  |
| F-017 | RBAC permission matrix | FR-06 |  | ALL | Built |  |
| F-018 | Field masking | FR-07 |  | VF,NK | Built |  |
| F-019 | Maker-checker approvals | FR-08 | /admin/approvals | NM,SA | Built |  |
| F-020 | Audit log | FR-09 | /admin/audit-logs | SA | Built |  |
| F-021 | Senior onboarding wizard | FR-11 | /onboarding, /onboarding/new, /onboarding/script | CM,VF,RA | Built |  |
| F-022 | Senior profile | FR-12 | /seniors, /seniors/:id, /seniors/:id/edit | CM,VF,RA,NM | Built |  |
| F-023 | Duplicate detection | FR-13 | /seniors/duplicates | CM,RA | Built |  |
| F-024 | Membership card print | FR-14 | /seniors/:id/card | CM,VF | Built |  |
| F-025 | Chapter (Ekta Hub) management | FR-15 | /chapters, /chapters/new, /chapters/:id, /chapters/:id/edit | SA,NM,RA,CM | Built |  |
| F-026 | Chapter detail tabs | FR-16 | /chapters/:id | SA,NM,RA,CM | Built |  |
| F-027 | Programme management | FR-17 | /programmes, /programmes/new, /programmes/:id, /programmes/:id/edit | PM,CM,NM,RA | Built |  |
| F-028 | Programme detail tabs | FR-18 | /programmes/:id | PM,CM,NM,RA | Built |  |
| F-029 | Session schedule calendar | FR-19 | /schedule, /sessions/:id | PM,CM,CT,VF | Built |  |
| F-030 | Attendance marking | FR-20 | /attendance, /attendance/session/:id | CM,VF,CT | Built |  |
| F-031 | Attendance corrections | FR-21 | /attendance/corrections | NM,CM | Built |  |
| F-032 | Attendance history heatmap | FR-22 | /attendance/history | CM,RA,NM | Built |  |
| F-033 | Emergency SOS board | FR-23 | /sos, /sos/:id, /sos/history, /sos/settings, /sos/drills | SA,NM,RA,CM,VF,CT,CD | Built |  |
| F-034 | SOS fallback SMS | FR-24 | /sms-log | SA,NM | Built |  |
| F-035 | WhatsApp communication hub | FR-25 | /communication, /communication/delivery | CM,NM,RA | Built |  |
| F-036 | Message templates | FR-26 | /communication/templates, /communication/templates/new, /communication/templates/:id | CM,NM | Built |  |
| F-037 | Announcements | FR-27 | /communication/announcements, /communication/announcements/new | CM,NM,RA | Built |  |
| F-038 | Consent management | FR-28 | /communication/consents | CM,NM | Built |  |
| F-039 | Service catalogue | FR-29 | /services, /services/new, /services/:id | PM,NM,RA | Built |  |
| F-040 | Service requests | FR-30 | /service-requests | CM,VF,SP | Built |  |
| F-041 | Referral management | FR-31 | /referrals, /referrals/new, /referrals/:id | CM,VF,SP | Built |  |
| F-042 | Partner management | FR-32 | /partners, /partners/new, /partners/:id | PM,NM | Built |  |
| F-043 | Partner portal | FR-33 | /partner/home, /partner/referrals, /partner/referrals/:id, /partner/profile, /partner/reports | SP | Built |  |
| F-044 | Feedback collection | FR-34 | /feedback, /feedback/forms, /feedback/new | CM,VF,CT | Built |  |
| F-045 | Follow-ups & engagement | FR-35 | /follow-ups, /engagement | CM,VF,CT | Built |  |
| F-046 | Medication & vital logs | FR-36 | /health, /health/logs, /health/flags, /health/schedules, /health/reminders, /health/reminders/:id, /health/rules, /health/calls | CM,VF,CT,SC | Built |  |
| F-047 | Assisted health support | FR-37 | /support/requests, /support/escalations, /support/escalations/:id, /support/rules, /support/voice-checkins, /support/handover | CM,CT,RA | Built |  |
| F-048 | CSR reporting | FR-38 | /reports/csr, /reports/csr/:id | NM,CD | Built |  |
| F-049 | Pilot report | FR-39 | /reports/pilot, /reports/definitions | NM,SA,RA | Built |  |
| F-050 | Reports overview | FR-40 | /reports, /reports/overview | NM,RA,SA | Built |  |
| F-051 | Chapter reports | FR-41 | /reports/chapters | NM,RA | Built |  |
| F-052 | Programme reports | FR-42 | /reports/programmes | PM,NM,RA | Built |  |
| F-053 | Senior reports | FR-43 | /reports/seniors | NM,RA,CM | Built |  |
| F-054 | Attendance reports | FR-44 | /reports/attendance | NM,RA,CM | Built |  |
| F-055 | Outcomes & impact | FR-45 | /reports/outcomes | NM,RA | Built |  |
| F-056 | Data exports | FR-46 | /reports/exports | NM,SA | Built |  |
| F-057 | User management | FR-47 | /admin/users, /admin/users/new, /admin/users/:id | SA | Built |  |
| F-058 | Role management | FR-48 | /admin/roles | SA | Built |  |
| F-059 | Chapter admin | FR-49 | /admin/chapters | SA,NM | Built |  |
| F-060 | System settings | FR-50 | /admin/settings | SA | Built |  |
| F-061 | Integrations | FR-51 | /admin/integrations | SA | Built |  |
| F-062 | Complaints management | FR-52 | /admin/complaints, /complaints/new | NM,CM | Built |  |
| F-063 | Data governance | FR-53 | /admin/data-governance | SA,NM | Built |  |
| F-064 | ABHA profile structure | FR-54 | /seniors/:id (ABHA tab) | CM,VF | Built |  |
| F-065 | Design system & tokens | FR-55 | /design | SA | Built |  |
| F-066 | WhatsApp simulator | — | /simulator | SA,NM | Built |  |
| F-067 | Notifications centre | — | /notifications | ALL | Built |  |
| F-068 | Account settings | — | /account | ALL | Built |  |
| F-069 | Help centre | — | /help | ALL | Built |  |
| F-070 | SC programmes list | — | /me/programmes | SC | Built |  |
| F-071 | SC bookings | — | /me/bookings | SC | Built |  |
| F-072 | SC messages | — | /me/messages | SC | Built |  |
| F-073 | SC services | — | /me/services | SC | Built |  |
| F-074 | SC profile | — | /me/profile | SC | Built |  |
| F-075 | SC health view | — | /me/health | SC | Built |  |
| F-076 | SC feedback | — | /me/feedback | SC | Built |  |
| F-077 | SC help | — | /me/help | SC | Built |  |
| F-078 | SC family links | — | /me/family | SC | Built |  |
| F-079 | FM senior overview | — | /family/:seniorId | FM | Built |  |
| F-080 | FM family links | — | /family/links | FM | Built |  |
| F-081 | Field Network Terminal Home | Layer 3 | /field | SF,SA,NM,PM,RA,CM | Built | Mobile-first terminal for active elder field associates; sync status, add peer, task queue. |
| F-082 | Field Peer Double-Consent Onboarding Wizard | Layer 3 | /field/onboard | SF,CM,VF | Built | 4-step mobile wizard: Peer details -> Consent 1 in-person -> WhatsApp Consent 2 -> AES-GCM encrypted save & coarse geo-stamp. |
| F-083 | Field Associate Activity Log | Layer 3 | /field/activity | SF | Built | Associate personal log: timestamps, coarse area labels, double consent status chips. |
| F-084 | Field Offline Sync Queue & Simulation | Layer 3 | /field/sync | SF | Built | Encrypted local queue, simulate offline toggle, manual retry, latency tracking. |
| F-085 | Field Associate Training Micro-Lessons | Layer 3 | /field/learn | SF | Built | Short field training modules on ethical consent capture and fraud prevention. |
| F-086 | Field Associate Profile & High-Contrast Toggle | Layer 3 | /field/profile | SF | Built | Display preferences: 22px large type toggle, >=7:1 high-contrast toggle, privacy statement. |
| F-087 | Field Operations Management & Telemetry Hub | Layer 3 | /field-network | PM,CM,RA,NM,SA | Built | Staff oversight hub embedding the cross-cutting Field Telemetry Card. |
| F-088 | Field Associates Roster & Chapter Assignment | Layer 3 | /field-network/associates, /field-network/associates/:id | PM,CM,RA,NM,SA | Built | Roster, chapter assignment, training completion, deactivation with type-to-confirm. |
| F-089 | Field Activity Coarse Audit Stream | Layer 3 | /field-network/activity | PM,CM,RA,NM,SA | Built | Area-level interaction stream with chapter and date filtering; gated export. |
| F-090 | Field Sync Queue Telemetry & Late-Sync Flags | Layer 3 | /field-network/sync | PM,CM,RA,NM,SA | Built | Central sync telemetry, late-sync flags (>24h), retry monitor. |
| F-091 | Field Telemetry Card (Cross-Cutting Live Metrics) | Layer 3/4 | /field-network, /reports/pilot | NM,PM,RA,CM,SA,CD | Built | Live event-computed component: Active Field Gigs, Last-Mile Syncs, chapter strips, 24h sparkline, BroadcastChannel ticker. |
| F-092 | Partner Routing Fabric Overview & Queue | Layer 1 | /routing | PM,NM,RA,CM,SA,CD | Built | Categorical routing overview: capacity load-balancing, auto-routed vs manual, SLA monitoring. |
| F-093 | Routing Decision Records & Reassignment | Layer 1 | /routing/requests/:id | PM,NM,RA,CM,SA | Built | Transparent decision record (rules matched, capacity, tie-break), reassignment timeline. |
| F-094 | Routing Rules Configuration & Test Harness | Layer 1 | /routing/rules | PM,NM,RA,SA | Built | Deterministic rule configuration with maker-checker (PM drafts, NM approves), test request tool. |
| F-095 | Voucher Campaigns & Catalogue Management | Layer 1 | /vouchers, /vouchers/campaigns, /vouchers/campaigns/new, /vouchers/:id | PM,NM,RA,CM,SA | Built | Diagnostic voucher campaigns, validity caps, maker-checker, WhatsApp simulator delivery. |
| F-096 | Voucher Validation & Single-Use Redemption | Layer 1 | /partner/vouchers, /partner/vouchers/redeem, /me/vouchers | SP,SC,FM,PM,CM | Built | Crockford base-32 check-digit verification, rate-limited validation, single-use idempotent redemption. |
| F-097 | Pro-Bono Encrypted Legal Intake | Layer 1 | /legal-intake, /legal-intake/:id | SP,PM,NM,CM,SA,SC,FM,SF,VF | Built | Encrypted intake queue: assigned legal SP sees content; staff see metadata; policy closure codes. |
| F-098 | Virtual Literacy Learning Library | Layer 2 | /learning, /learning/library, /learning/library/new, /learning/library/:id | PM,NM,RA,CM,SA,SC,FM,SF | Built | 4-category micro-lessons, WhatsApp chat bubble preview, allow-listed link safety, maker-checker. |
| F-099 | Micro-Lesson Daily Series Campaigns | Layer 2 | /learning/series | PM,NM,RA,SA | Built | Drip campaigns, quiet hours enforcement, consent-filtered audience builder. |
| F-100 | Community Webinars & Broadcast Channels | Layer 2 | /learning/webinars, /learning/channels, /me/events | PM,NM,RA,CM,SA,SC,FM,SF | Built | Event sign-ups, consent-gated reminders, regional one-way broadcast channels. |
| F-101 | Regional Mastermind Quizzes | Layer 2 | /learning/quizzes, /learning/quizzes/:id, /me/quizzes | PM,NM,RA,CM,SA,SC,FM | Built | Regional quiz rounds delivered via channel, simulator gameplay, minimal privacy-safe leaderboard. |
| F-102 | Telemetry Engine & Cohort Compliance Dashboard | Layer 4 | /telemetry, /telemetry/trends, /telemetry/privacy | CD,NM,PM,RA,SA | Built | Cohort compliance, coarse 5-category vaccination status, k>=5 suppression, policy decline indicator. |
| F-103 | Impact Packs Builder & Signed Tamper-Evident PDF | Layer 4 | /telemetry/packs, /telemetry/packs/new, /telemetry/packs/:id, /telemetry/exports | PM,NM,RA,SA,CD | Built | Audience-scoped packs (PM drafts, NM releases), SHA-256 calculation, synthetic watermark, export registry. |
| F-104 | Public Report Verification Gateway | Layer 4 | /verify, /verify/:code | ALL | Built | Unauthenticated public gateway recomputing SHA-256 in browser to verify impact packs. |
| F-105 | Ecosystem Strategic Nexus Architecture Map | Nexus | /ecosystem | NM,PM,RA,SA,CD | Built | Interactive diagram of Layers 1-4 with live mock telemetry counters and strategic goals. |
| P01-S1 | P1: Demographic capture (Wizard, Field, Chatbot) | P1 | /onboarding/new, /field/onboard | VF,CM,SF,SC | Built | Assisted wizard and mobile field capture operational. |
| P01-S2 | P1: Consent capture & DPDP recording | P1 | /onboarding/new, /field/onboard | VF,CM,SF | Built | In-person checkbox and double-consent state machine. |
| P01-S3 | P1: Duplicate detection evaluation & PM inbox task | P1 | /seniors/duplicates | PM | Partial | Detection logic exists; handoff task in PM inbox missing (Loop R4/R6). |
| P01-S4 | P1: Member ID issuance & chapter assignment | P1 | /seniors | CM,VF | Built | Luhn-like VV-HBL-26 ID generator and chapter roster. |
| P01-S5 | P1: Consent-gated welcome message dispatch | P1 | /communication/delivery | CM | Partial | Gateway mock exists; auto-trigger upon duplicate resolution missing. |
| P02-S1 | P2: Emergency SOS trigger (Portal/Chat/On-behalf) | P2 | /sos, /me | SC,VF,CT | Built | BroadcastChannel dispatch and real-time state machine. |
| P02-S2 | P2: Real-time chime & Live Board alert | P2 | /sos | CT,CM,RA | Built | Solid red chip and audio alert. |
| P02-S3 | P2: 60s WhatsApp timeout & Cellular fallback SMS | P2 | /sms-log | CT,SA | Built | Cellular fallback decision and SMS outbox logging. |
| P02-S4 | P2: Multi-tier escalation chain (CT -> RA -> NM) | P2 | /sos | CT,RA,NM | Built | Escalation timers at 120s and 300s. |
| P02-S5 | P2: Triage notes & outcome resolution code | P2 | /sos/:id | CT,CM | Built | Case detail notes and terminal resolution codes. |
| P02-S6 | P2: Mandatory post-case review task for CM | P2 | /sos/:id | CM | Missing | Mandatory 24h CM review checklist task (Loop R4/R7). |
| P03-S1 | P3: Scheduled vitals & medication prompt dispatch | P3 | /health/schedules | CT,CM | Built | Reminders engine with 08:00 AM morning prompt. |
| P03-S2 | P3: Vitals response string NLP parsing | P3 | /health/logs | CT | Built | Systolic/diastolic/glucose regex extraction. |
| P03-S3 | P3: Risk band classification | P3 | /health/rules | CT,CM | Built | Normal, Watch, High-Risk, Critical bands. |
| P03-S4 | P3: High-risk flag generation | P3 | /health/flags | CT,CM | Built | Flags triage queue with threshold indicators. |
| P03-S5 | P3: Wellness-call task generation & Take Next outreach | P3 | /health/calls | CT | Partial | Calls list exists; task in inbox and Take Next queue missing (Loop R4/R7). |
| P04-S1 | P4: Programme scheduling & registration | P4 | /programmes, /schedule | PM,CM | Built | Recurrence engine and capacity limits. |
| P04-S2 | P4: Session attendance marking & locking | P4 | /attendance | VF,CM | Built | Presence toggle and 2h session locking. |
| P04-S3 | P4: Attendance correction request submission | P4 | /attendance/corrections | VF | Built | Correction modal with reason documentation. |
| P04-S4 | P4: Attendance correction approval task for CM | P4 | /attendance/corrections | CM | Partial | Approval action exists; task in CM inbox missing (Loop R4/R8). |
| P04-S5 | P4: 3-session absence drop-off outreach task | P4 | /feedback/follow-ups | VF,CM | Missing | Disengagement detection and outreach task (Loop R8). |
| P05-S1 | P5: Campaign template authoring & variable chips | P5 | /communication/templates | PM | Built | Multi-lingual template builder with token chips. |
| P05-S2 | P5: DPDP consent-gated audience filtering | P5 | /communication/consents | PM,NM | Built | Automatic stripping of opted-out recipients. |
| P05-S3 | P5: Maker-checker submission to NM inbox | P5 | /communication/templates | NM | Partial | Template status exists; inbox task for NM missing (Loop R4/R8). |
| P05-S4 | P5: Quiet hours (21:00-08:00) broadcast guard | P5 | /communication/announcements | PM,SA | Partial | Enforced on learning series; broadcaster deferral missing (Loop R8). |
| P05-S5 | P5: Delivery log & failure retry queue | P5 | /communication/delivery | SA,PM | Built | Delivery states (Sent/Delivered/Read) and retry action. |
| P06-S1 | P6: Service request initiation | P6 | /services/requests | SC,VF,CM | Built | Diagnostic/mobility service requests. |
| P06-S2 | P6: Deterministic capacity routing engine | P6 | /routing | PM,NM | Built | Capacity-aware provider matching. |
| P06-S3 | P6: Crockford-32 Modulo-37 voucher issuance | P6 | /vouchers | PM,SP | Built | VCH-26-XXXX alphanumeric voucher codes. |
| P06-S4 | P6: Partner referral action task in partner inbox | P6 | /partner/referrals | SP | Partial | Referrals view exists; inbox task model missing (Loop R4/R9). |
| P06-S5 | P6: Idempotent partner voucher redemption | P6 | /partner/vouchers/redeem | SP | Built | Checksum validation and single-use lock. |
| P07-S1 | P7: Pro-bono legal intake submission | P7 | /legal-intake | CM,SC | Built | WebCrypto AES-GCM envelope encryption. |
| P07-S2 | P7: Client-advocate privilege badge & statutory disclaimer | P7 | /legal-intake/:id | SP,CM | Built | Staff metadata-only view; non-legal advice notice. |
| P07-S3 | P7: Advocate consultation task & statutory closure codes | P7 | /legal-intake/:id | SP | Partial | Outcome codes exist; advocate inbox task missing (Loop R4/R9). |
| P08-S1 | P8: Micro-lesson authoring & phone preview | P8 | /learning/library/new | PM | Built | 4-step lesson creator with simulated bubbles. |
| P08-S2 | P8: Curriculum maker-checker approval task for NM | P8 | /learning/library | NM | Partial | Status flag exists; NM approval task missing (Loop R4/R10). |
| P08-S3 | P8: Quiet hours 21:00-08:00 drip campaign delivery | P8 | /learning/series | PM | Built | Night window delivery block. |
| P08-S4 | P8: Mastermind quiz & anonymous chapter leaderboard | P8 | /learning/quizzes, /me/quizzes | SC,PM | Built | Instant score evaluation and chapter totals. |
| P09-S1 | P9: Field associate roster & ward allocation | P9 | /field-network/associates | PM,CM | Built | Staff directory and geographical wards. |
| P09-S2 | P9: Mobile offline capture with WebCrypto encryption | P9 | /field/onboard | SF | Built | Client-side AES-GCM IndexedDB storage. |
| P09-S3 | P9: Coarse 2-decimal geo-stamping (~1.1 km radius) | P9 | /field/activity | SF,CM | Built | Zero continuous GPS tracking. |
| P09-S4 | P9: Sync monitor & >24h late-sync warnings | P9 | /field-network/sync | CM,RA | Built | Delayed sync health tracking. |
| P09-S5 | P9: Supervisor sync review task in CM inbox | P9 | /field-network/sync | CM | Partial | Late-sync flag exists; supervisor inbox task missing (Loop R4/R6). |
| P10-S1 | P10: Maker submission of sensitive parameter change | P10 | /admin/approvals | ALL | Built | Draft hold on thresholds and templates. |
| P10-S2 | P10: Strict maker-checker dual control enforcement | P10 | /admin/approvals | NM,SA | Built | Self-approval blocked (maker_id !== checker_id). |
| P10-S3 | P10: Governance approval task in NM inbox | P10 | /admin/approvals | NM | Partial | Approvals queue exists; task in inbox missing (Loop R4/R11). |
| P10-S4 | P10: Cryptographic SHA-256 audit entry recording | P10 | /admin/audit-logs | SA | Built | Tamper-evident audit chain write. |
| P11-S1 | P11: DPDP deletion/export request submission | P11 | /admin/data-governance | SC,CM | Built | Statutory request intake. |
| P11-S2 | P11: NM identity verification & approval task | P11 | /admin/data-governance | NM | Partial | Review modal exists; inbox task missing (Loop R4/R11). |
| P11-S3 | P11: SA irrevocable purge execution with type-to-confirm | P11 | /admin/data-governance | SA | Partial | Purge modal exists; SA execution task missing (Loop R4/R11). |
| P12-S1 | P12: Grievance/complaint lodging with severity | P12 | /admin/complaints/new | ALL | Built | Complaint submission form. |
| P12-S2 | P12: Chapter scope-based auto-assignment | P12 | /admin/complaints | CM,NM | Built | Assigned to jurisdictional CM. |
| P12-S3 | P12: Investigation task & internal notes thread | P12 | /admin/complaints/:id | CM | Partial | Thread notes exist; inbox task missing (Loop R4/R11). |
| P12-S4 | P12: Remediation action & resolution code recording | P12 | /admin/complaints/:id | CM,NM | Built | Resolution status updates. |
| P13-S1 | P13: Event store aggregation across 9 chapters | P13 | /telemetry/packs/new | PM | Built | Multi-chapter metric aggregator. |
| P13-S2 | P13: k >= 5 cell suppression privacy defense | P13 | /telemetry/packs | PM,NM | Built | Small-cell suppression against differencing. |
| P13-S3 | P13: In-browser SHA-256 digest computation & PDF export | P13 | /telemetry/packs/:id | PM,NM,CD | Built | Tamper-evident client cryptographic digest. |
| P13-S4 | P13: Impact pack release sign-off task in NM inbox | P13 | /telemetry/packs/:id | NM | Partial | Release button exists; inbox task missing (Loop R4/R10). |
| P13-S5 | P13: Unauthenticated public verification gateway | P13 | /verify | ALL | Built | Zero-login public hash verification. |
| P14-S1 | P14: Partner organization profile & 80G/12A details | P14 | /partners/new | PM | Built | Statutory verification registration. |
| P14-S2 | P14: Partner accreditation task in NM inbox | P14 | /admin/approvals | NM | Partial | Approvals queue exists; inbox task missing (Loop R4/R9). |
| P14-S3 | P14: Capacity-aware routing pool activation | P14 | /partners | PM,NM | Built | Active status in routing engine. |
| P15-S1 | P15: Chapter provisioning & regional geofence | P15 | /chapters/new | RA,SA | Built | Chapter creation and locality setup. |
| P15-S2 | P15: Chapter staff roster allocation | P15 | /admin/chapters | CM,RA | Built | Staff assigned to Ekta Hub. |
| P15-S3 | P15: Real-time Pilot Readiness Checklist with remediation links | P15 | /admin/settings | CM,NM | Missing | Dynamic checklist tab computed from store state (Loop R11). |
| P15-S4 | P15: Chapter Go-Live milestone authorization task | P15 | /admin/settings | NM | Missing | Go-live milestone authorization task for NM (Loop R11). |
