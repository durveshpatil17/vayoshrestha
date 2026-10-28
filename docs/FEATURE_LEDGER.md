# Feature Ledger — Vayoshreshtha v3

> Machine-readable twin: docs/feature-ledger.json  
> Ratchet enforces counts never go down: npm run ratchet

| ID | Name | FR | Routes | Roles | Status | Notes |
|----|------|----|--------|-------|--------|-------|
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
| F-017 | RBAC permission matrix | FR-06 | — | ALL | Built |  |
| F-018 | Field masking | FR-07 | — | VF,NK | Built |  |
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
