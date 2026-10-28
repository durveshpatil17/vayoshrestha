# Restore Audit — Vayoshreshtha v3

> Generated: 2026-10-28  
> Status codes: ✅ Present & correct | ⚠️ Present but drifted | 🔶 Partial | ❌ Missing

## Design System

| Item | Status | Notes |
|------|--------|-------|
| CSS tokens (forest green accent) | ⚠️ Drifted | Currently Horizon blue #0070F2 — MUST replace |
| Fonts (IBM Plex Sans + Source Serif 4) | ⚠️ Drifted | Currently Open Sans — MUST replace |
| Design lint (allow serif, ban blue) | ⚠️ Drifted | Currently bans serif, allows blue — MUST invert |
| Tailwind config (green palette) | ⚠️ Drifted | Currently blue palette |
| Sidebar width (248px) | ⚠️ Drifted | Currently 256px |
| TopBar height (56px) | ⚠️ Drifted | Currently 52px |

## Roles

| Role | Status | Notes |
|------|--------|-------|
| SA | ✅ Present | |
| NM | ✅ Present | |
| RA | ✅ Present | |
| CM | ✅ Present | |
| VF | ✅ Present | |
| CT | ✅ Present | |
| CD | ✅ Present | |
| SC | ✅ Present | Limited — no portal pages |
| NK | ✅ Present | |
| PM | ❌ Missing | Must add Programme Manager role |
| SP | ❌ Missing | Must add Service Partner role |
| FM | ❌ Missing | Must add Family Member role |

## Routes (46 registered vs 120 required)

| Module | Routes | Status |
|--------|--------|--------|
| Auth | /login, /mfa, /forgot-password, /reset-password/:token, /first-login, /privacy, /session-expired, /offline, /403, /404 | ✅ Built |
| Shell | /notifications, /account, /help | ✅ Built |
| SOS | /sos, /sos/:id, /sos/history, /sos/settings, /sos/drills, /sms-log | ✅ Built |
| Health | /health, /health/schedules, /health/reminders, /health/reminders/:id, /health/logs, /health/flags, /health/calls, /health/rules | ✅ Built |
| Onboarding | /onboarding, /onboarding/new, /onboarding/script | ✅ Built |
| Seniors | /seniors, /seniors/:id, /seniors/:id/edit | ✅ Built |
| Seniors (missing) | /seniors/duplicates, /seniors/:id/card | ❌ Missing |
| Design | /design | ✅ Built |
| Simulator | /simulator | ✅ Built |
| Reports | /reports/pilot, /reports/definitions | 🔶 Partial — 9 more routes missing |
| Admin | /admin/users, /admin/users/new, /admin/users/:id, /admin/roles, /admin/chapters, /admin/settings, /admin/approvals, /admin/audit-logs, /admin/integrations | ✅ Built |
| Admin (missing) | /admin/complaints, /admin/data-governance | ❌ Missing |
| Chapters | /chapters, /chapters/new, /chapters/:id, /chapters/:id/edit | ❌ Missing |
| Programmes | /programmes, /programmes/new, /programmes/:id, /programmes/:id/edit | ❌ Missing |
| Schedule | /schedule, /sessions/:id | ❌ Missing |
| Attendance | /attendance, /attendance/session/:id, /attendance/corrections, /attendance/history | ❌ Missing |
| Communication | /communication, /communication/templates, /communication/templates/new, /communication/templates/:id, /communication/announcements, /communication/announcements/new, /communication/delivery, /communication/consents | ❌ Missing |
| Services | /services, /services/new, /services/:id, /service-requests | ❌ Missing |
| Referrals | /referrals, /referrals/new, /referrals/:id | ❌ Missing |
| Partners | /partners, /partners/new, /partners/:id | ❌ Missing |
| Partner portal | /partner/home, /partner/referrals, /partner/referrals/:id, /partner/profile, /partner/reports | ❌ Missing |
| Feedback | /feedback, /feedback/forms, /feedback/new | ❌ Missing |
| Follow-ups | /follow-ups, /engagement | ❌ Missing |
| Support | /support/requests, /support/escalations, /support/escalations/:id, /support/rules, /support/voice-checkins, /support/handover | ❌ Missing |
| Reports (full) | /reports, /reports/overview, /reports/chapters, /reports/programmes, /reports/seniors, /reports/attendance, /reports/outcomes, /reports/csr, /reports/csr/:id, /reports/exports | ❌ Missing |
| SC portal | /me, /me/programmes, /me/bookings, /me/messages, /me/services, /me/profile, /me/health, /me/feedback, /me/help, /me/family | ❌ Missing |
| FM portal | /family, /family/:seniorId, /family/links | ❌ Missing |

## Infrastructure Files

| File | Status |
|------|--------|
| docs/FEATURE_LEDGER.md | ❌ Creating now |
| docs/feature-ledger.json | ❌ Creating now |
| docs/route-manifest.json | ❌ Creating now |
| docs/ratchet.json | ❌ Creating now |
| docs/RESTORE_AUDIT.md | ❌ Creating now |
| scripts/design-lint.mjs | ⚠️ Drifted — needs rewrite |
| scripts/ledger-check.mjs | ❌ Missing |
| scripts/route-manifest-check.mjs | ❌ Missing |
| scripts/ratchet-check.mjs | ❌ Missing |

## Conclusion

- **74 routes missing** (46 registered vs 120 manifest)
- **3 roles missing** (PM, SP, FM)
- **Design tokens completely wrong** for v3
- **Fonts wrong** (Open Sans vs IBM Plex Sans + Source Serif 4)
- **Infrastructure scripts missing**
