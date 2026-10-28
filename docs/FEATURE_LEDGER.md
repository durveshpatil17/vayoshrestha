# Feature Ledger — Vayoshreshtha v3

> Machine-readable twin: `docs/feature-ledger.json`  
> Ratchet enforces counts never go down: `npm run ratchet`

| ID | Name | FR | Routes | Roles | Status | Notes |
|----|------|----|--------|-------|--------|-------|
| F-001 | Authentication & MFA | FR-01 | /login, /mfa, /forgot-password, /reset-password/:token, /first-login | ALL | Built | |
| F-002 | Session management & timeout | FR-02 | /session-expired | ALL | Built | |
| F-003 | Privacy consent | FR-03 | /privacy | ALL | Built | |
| F-004 | 403 / 404 / offline | FR-04 | /403, /404, /offline | ALL | Built | |
| F-005 | Role-based dashboards | FR-05 | / | SA,NM,RA,CM,VF,CT,CD,PM,SP,SC,FM | Partial | PM,SP,SC,FM dashboards missing |
| F-006 | SA dashboard | FR-05 | / (SA) | SA | Built | |
| F-007 | NM dashboard | FR-05 | / (NM) | NM | Built | |
| F-008 | RA dashboard | FR-05 | / (RA) | RA | Built | |
| F-009 | CM dashboard | FR-05 | / (CM) | CM | Built | |
| F-010 | VF dashboard | FR-05 | / (VF) | VF | Built | |
| F-011 | CT dashboard | FR-05 | / (CT) | CT | Built | |
| F-012 | CD dashboard | FR-05 | / (CD) | CD | Built | |
| F-013 | PM dashboard | FR-05 | / (PM) | PM | Planned | |
| F-014 | SP dashboard | FR-05 | / (SP) | SP | Planned | |
| F-015 | SC home portal | FR-05 | /me | SC | Planned | |
| F-016 | FM home portal | FR-05 | /family | FM | Planned | Feature-flagged |
| F-017 | RBAC permission matrix | FR-06 | — | ALL | Built | 9 roles, needs PM/SP/FM |
| F-018 | Field masking | FR-07 | — | VF,NK | Built | |
| F-019 | Maker-checker approvals | FR-08 | /admin/approvals | NM,SA | Built | |
| F-020 | Audit log | FR-09 | /admin/audit-logs | SA | Built | |
| F-021 | Senior onboarding wizard | FR-11 | /onboarding, /onboarding/new, /onboarding/script | CM,VF,RA | Built | 4-step; needs expansion to 7-step |
| F-022 | Senior profile | FR-12 | /seniors, /seniors/:id, /seniors/:id/edit | CM,VF,RA,NM | Built | Missing tabs |
| F-023 | Duplicate detection | FR-13 | /seniors/duplicates | CM,RA | Planned | |
| F-024 | Membership card print | FR-14 | /seniors/:id/card | CM,VF | Planned | |
| F-025 | Chapter (Ekta Hub) management | FR-15 | /chapters, /chapters/new, /chapters/:id, /chapters/:id/edit | SA,NM,RA,CM | Planned | |
| F-026 | Chapter detail tabs | FR-16 | /chapters/:id | SA,NM,RA,CM | Planned | |
| F-027 | Programme management | FR-17 | /programmes, /programmes/new, /programmes/:id, /programmes/:id/edit | PM,CM,NM,RA | Planned | |
| F-028 | Programme detail tabs | FR-18 | /programmes/:id | PM,CM,NM,RA | Planned | |
| F-029 | Session schedule calendar | FR-19 | /schedule, /sessions/:id | PM,CM,CT,VF | Planned | |
| F-030 | Attendance marking | FR-20 | /attendance, /attendance/session/:id | CM,VF,CT | Planned | |
| F-031 | Attendance corrections | FR-21 | /attendance/corrections | NM,CM | Planned | Maker≠checker |
| F-032 | Attendance history heatmap | FR-22 | /attendance/history | CM,RA,NM | Planned | |
| F-033 | Emergency SOS board | FR-23 | /sos, /sos/:id, /sos/history, /sos/settings, /sos/drills | SA,NM,RA,CM,VF,CT,CD | Built | |
| F-034 | SOS fallback SMS | FR-24 | /sms-log | SA,NM | Built | |
| F-035 | WhatsApp communication hub | FR-25 | /communication, /communication/delivery | CM,NM,RA | Planned | |
| F-036 | Message templates | FR-26 | /communication/templates, /communication/templates/new, /communication/templates/:id | CM,NM | Planned | |
| F-037 | Announcements | FR-27 | /communication/announcements, /communication/announcements/new | CM,NM,RA | Planned | |
| F-038 | Consent management | FR-28 | /communication/consents | CM,NM | Planned | |
| F-039 | Service catalogue | FR-29 | /services, /services/new, /services/:id | PM,NM,RA | Planned | |
| F-040 | Service requests | FR-30 | /service-requests | CM,VF,SP | Planned | |
| F-041 | Referral management | FR-31 | /referrals, /referrals/new, /referrals/:id | CM,VF,SP | Planned | |
| F-042 | Partner management | FR-32 | /partners, /partners/new, /partners/:id | PM,NM | Planned | |
| F-043 | Partner portal | FR-33 | /partner/home, /partner/referrals, /partner/referrals/:id, /partner/profile, /partner/reports | SP | Planned | |
| F-044 | Feedback collection | FR-34 | /feedback, /feedback/forms, /feedback/new | CM,VF,CT | Planned | |
| F-045 | Follow-ups & engagement | FR-35 | /follow-ups, /engagement | CM,VF,CT | Planned | |
| F-046 | Medication & vital logs | FR-36 | /health, /health/logs, /health/flags, /health/schedules, /health/reminders, /health/reminders/:id, /health/rules, /health/calls | CM,VF,CT,SC | Built | |
| F-047 | Assisted health support | FR-37 | /support/requests, /support/escalations, /support/escalations/:id, /support/rules, /support/voice-checkins, /support/handover | CM,CT,RA | Planned | |
| F-048 | CSR reporting | FR-38 | /reports/csr, /reports/csr/:id | NM,CD | Planned | |
| F-049 | Pilot report | FR-39 | /reports/pilot, /reports/definitions | NM,SA,RA | Built | |
| F-050 | Reports overview | FR-40 | /reports, /reports/overview | NM,RA,SA | Planned | |
| F-051 | Chapter reports | FR-41 | /reports/chapters | NM,RA | Planned | |
| F-052 | Programme reports | FR-42 | /reports/programmes | PM,NM,RA | Planned | |
| F-053 | Senior reports | FR-43 | /reports/seniors | NM,RA,CM | Planned | |
| F-054 | Attendance reports | FR-44 | /reports/attendance | NM,RA,CM | Planned | |
| F-055 | Outcomes & impact | FR-45 | /reports/outcomes | NM,RA | Planned | |
| F-056 | Data exports | FR-46 | /reports/exports | NM,SA | Planned | |
| F-057 | User management | FR-47 | /admin/users, /admin/users/new, /admin/users/:id | SA | Built | |
| F-058 | Role management | FR-48 | /admin/roles | SA | Built | |
| F-059 | Chapter admin | FR-49 | /admin/chapters | SA,NM | Built | Redirect to /chapters |
| F-060 | System settings | FR-50 | /admin/settings | SA | Built | |
| F-061 | Integrations | FR-51 | /admin/integrations | SA | Built | |
| F-062 | Complaints management | FR-52 | /admin/complaints, /complaints/new | NM,CM | Planned | |
| F-063 | Data governance | FR-53 | /admin/data-governance | SA,NM | Planned | |
| F-064 | ABHA profile structure | FR-54 | /seniors/:id (ABHA tab) | CM,VF | Planned | Phase 2 structure only, no verified state |
| F-065 | Design system & tokens | FR-55 | /design | SA | Built | v3 tokens |
| F-066 | WhatsApp simulator | — | /simulator | SA,NM | Built | Needs 3rd SMS pane |
| F-067 | Notifications centre | — | /notifications | ALL | Built | |
| F-068 | Account settings | — | /account | ALL | Built | |
| F-069 | Help centre | — | /help | ALL | Built | |
| F-070 | SC programmes list | — | /me/programmes | SC | Planned | |
| F-071 | SC bookings | — | /me/bookings | SC | Planned | |
| F-072 | SC messages | — | /me/messages | SC | Planned | |
| F-073 | SC services | — | /me/services | SC | Planned | |
| F-074 | SC profile | — | /me/profile | SC | Planned | |
| F-075 | SC health view | — | /me/health | SC | Planned | |
| F-076 | SC feedback | — | /me/feedback | SC | Planned | |
| F-077 | SC help | — | /me/help | SC | Planned | |
| F-078 | SC family links | — | /me/family | SC | Planned | |
| F-079 | FM senior overview | — | /family/:seniorId | FM | Planned | Feature-flagged |
| F-080 | FM family links | — | /family/links | FM | Planned | Feature-flagged |
