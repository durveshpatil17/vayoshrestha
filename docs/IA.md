# VAYOSHRESHTHA — Information Architecture (IA) Specification

**Version**: 4.0.0  
**Phase**: Pass v4 (Real Workflows + Information Architecture)  
**Status**: Approved Master IA  
**Reference Alignment**: SAP S/4HANA Fiori Launchpad (Spaces & Pages) + AWS Management Console  

---

## 1. Core Principles

1. **Role-Filtered Exposure**: A user only sees what their role has capability to access. Forbidden workspaces, apps, or views never render.
2. **Nouns as Apps**: Navigation lists nouns (things: "Referrals", "Vouchers", "Programmes", "Seniors"), not screens or actions.
3. **Consolidation**: Variations of an entity or workflow are tabs, views, or split panels inside an app, never disjoint top-level pages.
4. **Consistent 3-Part Grouping**: Every workspace organizes its apps into up to three groups, strictly ordered:
   - **Work**: Daily transactional tasks and active queues.
   - **Monitor**: Dashboards, audit logs, reports, and read-only telemetry.
   - **Configure**: Rules, templates, master data, and settings (**collapsed by default**, hidden if user lacks configuration capability).
5. **Pinned Common Apps**: Every workspace pins **Home (`/`)** and **My work (`/inbox`)** (with a live actionable task count badge) at the top of the side navigation.
6. **Triple Reachability**: Every entity and function is discoverable through:
   - Workspace Side Navigation
   - Global Search & Command Palette (`Ctrl+K`)
   - Entity Links & Contextual Hover Cards from related objects
7. **Fixed-Height Shell Layout**: The app shell viewport is strictly fixed (`100dvh`, `overflow: hidden`). The document element never scrolls; the side navigation never scrolls; the main container is the sole scrollable region.

---

## 2. Shell Navigation Architecture

```
+-----------------------------------------------------------------------------------------------------------------------------+
| [Brand: Vayoshreshtha]  |  [Workspace 1]  [Workspace 2]  [Workspace 3]  [Workspace 4]  [Workspace 5]  [All Workspaces v]     |
| [Scope Switcher] | [Global Search / Command Palette Ctrl+K] | [+ Create v] | [SOS Status Chip] | [Bell] | [Help] | [User Menu]   |
+-----------------------------------------------------------------------------------------------------------------------------+
| [Prototype Notice Ribbon: Informative banner, session dismissible]                                                         |
+------------------------------------+--------------------------------------------------------------------+-------------------+
| SIDEBAR (256px / 56px rail)        | MAIN SCROLL CONTAINER (`min-height: 0; overflow: auto`)             | CONTEXT RAIL      |
| [Workspace Title + Purpose]        | +----------------------------------------------------------------+ | (320px, >=1440px) |
| PINNED:                            | | Dynamic Page Header: Breadcrumb (Workspace > App > Record)     | | Process Flow:     |
|   * Home                           | | Title (28/600) + Status Badge + Action Bar                     | |   Step 1 -> 2 -> 3|
|   * My work (Badge: 4)             | +----------------------------------------------------------------+ | Related Objects:  |
|                                    | |                                                                | |   Voucher, Senior |
| WORK:                              | | View Content (Tabs / Table / Split Panel / Wizard)             | | Activity & Notes|
|   * App 1                          | | Flex-filling container (>= 60% viewport height)                | | Help on this app|
|   * App 2                          | | Empty state inside table container                             | |                   |
| MONITOR:                           | |                                                                | |                   |
|   * App 3                          | |                                                                | |                   |
| CONFIGURE (collapsed by default):  | |                                                                | |                   |
|   * App 4                          | |                                                                | |                   |
|                                    | |                                                                | |                   |
| FOOTER: [All Workspaces] [All Apps]| +----------------------------------------------------------------+ |                   |
+------------------------------------+--------------------------------------------------------------------+-------------------+
```

### 2.1 Shell Bar (52px)
- **Brand Wordmark**: Vayoshreshtha (by Vayoh Vikas).
- **Workspace Tabs**: Top $\le 5$ primary workspaces for current role. Selected tab = `--accent` (`#0070F2`) text with 2px bottom border.
- **"All workspaces" Popover**: Grid icon button displaying all permitted workspaces with one-line descriptions and user favourites pinned to top.
- **Scope Switcher**: National / Region / Chapter selector (contextually scoped by RBAC layer).
- **Global Search / Command Palette (`Ctrl+K`)**: Instant search across Apps, Seniors (masked), Records by ID (`SOS-...`, `REF-...`), and Role-gated Actions ("Add senior", "Start drill", "Log reading", "Acknowledge next emergency").
- **+ Create Quick Menu**: Top 6 role-based creation actions (e.g., New Senior, New Referral, New Session, New Announcement).
- **Emergency SOS Status Chip**: Neutral badge when 0 open; solid high-contrast negative badge when $\ge 1$ open SOS.
- **Notifications Bell**: FYI activity drawer with unread count.
- **Help Button**: Opens Cloudscape-style collapsible Help Panel with page-specific guidance, glossary links, and permission diagnostics.
- **User Persona Menu**: Account settings, About this prototype, Keyboard shortcuts (`?`), Language, Larger text toggle, Density toggle, Demo Director (demo mode), and Experience As switcher.

### 2.2 Side Navigation (256px, collapsible to 56px rail)
- **Header**: Workspace title and domain subtitle.
- **Pinned Section**:
  - *Home* (`/`)
  - *My work* (`/inbox`) with active task count badge.
- **Categorized Sections**:
  - **Work** (Daily operations, intake, active cases)
  - **Monitor** (Dashboards, telemetry, reports)
  - **Configure** (Master data, rules, templates — collapsed by default; hidden if no configure capability)
- **Strict Budget**: $\le 8$ apps per workspace (excluding pinned Home & My work).
- **Footer**: Link to "All workspaces" popover and "All apps" (`/apps` App Finder).

---

## 3. Workspace Catalogue & App Consolidation

| Workspace | Section | App (Sidebar Item) | URL | Consolidated Tabs / Views / Old URLs |
|---|---|---|---|---|
| **Emergency** | Work | Live board | `/sos` | Real-time triage split panel |
| | Work | Cases | `/sos/cases` | Tabs: Open, All, Drills. Consolidates `/sos/history` (`?tab=all`), `/sos/drills` (`?tab=drills`) |
| | Monitor | Fallback SMS log | `/sms-log` | SMS outbox and cellular fallback audit |
| | Configure | Emergency settings | `/sos/settings` | Escalation tiers, timeout thresholds, broadcast channels |
| **Care** | Work | Care queue | `/health/queue` | Tabs: Flags (`?tab=flags`), Calls (`?tab=calls`), Logs/Readings (`?tab=logs`), Adherence. Consolidates `/health/flags`, `/health/calls`, `/health/logs` |
| | Work | Support & escalations | `/support/queue` | Tabs: Requests, Escalations, Handover. Consolidates `/support-requests`, `/support/escalations`, `/support/handover` |
| | Monitor | Care overview | `/health` | 4 headline tiles, vitals trend chart, chapter triage matrix |
| | Configure | Schedules & reminders | `/health/schedules-hub` | Tabs: Schedules, Templates. Consolidates `/health/schedules`, `/health/reminders` |
| | Configure | Care rules | `/health/rules-hub` | Tabs: Thresholds, Warning signs. Consolidates `/health/rules`, `/support/rules` |
| **Seniors** | Work | Onboarding | `/onboarding` | Tabs: Funnel, Stalled, New senior wizard (`/onboarding/new`), Script editor (`/onboarding/script`). Consolidates `/onboarding/script` |
| | Work | Directory | `/seniors` | Fiori List Report with FilterBar, links to Senior Object Page (`/seniors/:id`) |
| | Work | Duplicate review | `/seniors/duplicates` | Potential duplicate pair triage queue |
| | Monitor | Consent & preferences | `/communication/consents` | DPDP consent audit and opt-out registry |
| **Community** | Work | Programmes | `/programmes` | Fiori List Report with views per programme: Sessions, Registrations, Feedback |
| | Work | Attendance | `/attendance` | Tabs: Today, Missing, Corrections (`?tab=corrections`), History (`?tab=history`). Consolidates `/attendance/corrections`, `/attendance/history` |
| | Work | Follow-ups & engagement | `/feedback/follow-ups` | Tabs: Follow-ups, Engagement index. Consolidates `/feedback/follow-ups`, `/feedback/engagement` |
| | Work | Feedback | `/feedback` | Tabs: Responses, Forms (`?tab=forms`). Consolidates `/feedback/forms` |
| | Monitor | Schedule calendar | `/schedule` | Community session calendar |
| | Monitor | Chapters (Ekta Hubs) | `/chapters` | Chapter directory and Chapter Object Page (`/chapters/:id`) |
| **Learning** | Work | Library | `/learning/library` | Micro-lesson catalogue, creator wizard (`/learning/library/new`) |
| | Work | Daily series | `/learning/series` | Drip campaign management with 21:00-08:00 quiet hours enforcement |
| | Work | Webinars & events | `/learning/webinars` | Virtual events and community channels |
| | Work | Quizzes & channels | `/learning/quizzes` | Regional Mastermind quizzes and leaderboards |
| | Monitor | Learning overview | `/learning` | Reach, completion rates, domain breakdown |
| **Messaging** | Work | Announcements | `/communication/announcements` | Announcement creator and broadcasts |
| | Work | Delivery log | `/communication/delivery` | WhatsApp delivery status, failures, and retry queue |
| | Work | Phone simulator | `/simulator` | 3-pane live WhatsApp and SMS simulation |
| | Monitor | Messaging overview | `/communication` | Message volume, delivery rate, opt-out trends |
| | Configure | Templates | `/communication/templates` | Approved templates and template builder |
| **Partners** | Work | Routing | `/routing` | Tabs: Requests (`?tab=requests`), Decisions (`?tab=decisions`), Unrouted. Capacity heatmap |
| | Work | Referrals | `/referrals` | Table and kanban pipeline views |
| | Work | Vouchers | `/vouchers` | Tabs: Vouchers (`?tab=vouchers`), Campaigns (`?tab=campaigns`). Consolidates `/vouchers/campaigns` |
| | Work | Legal intake | `/legal-intake` | Pro-bono legal queue with client-advocate privilege isolation |
| | Monitor | Partner directory | `/partners` | Directory of verified service providers |
| | Configure | Services catalogue | `/services` | Directory of services offered |
| | Configure | Routing rules | `/routing/rules` | Capacity-aware routing policy editor & scratchpad |
| **Field network** | Work | Associates | `/field-network/associates` | Field staff roster and associate object page |
| | Work | Activity stream | `/field-network/activity` | Field activity feed with 2-decimal geo-tagging |
| | Monitor | Field operations | `/field-network` | Real-time Field Telemetry Card and chapter sync bars |
| | Monitor | Sync monitor | `/field-network/sync` | Offline queue sync health and >24h late-sync warnings |
| **Insights** | Monitor | Pilot scorecard | `/reports/pilot` | 90-day pilot KPI tracking |
| | Monitor | Operational reports | `/reports` | Tabs: Overview, Chapters, Programmes, Seniors, Attendance, Outcomes |
| | Monitor | Live telemetry | `/telemetry` | Tabs: Cohort (`?tab=cohort`), Trends (`?tab=trends`), Privacy (`?tab=privacy`). Consolidates `/telemetry/trends`, `/telemetry/privacy` |
| | Work | Impact packs | `/telemetry/packs` | Tabs: Packs, Export registry, Verify. Consolidates `/telemetry/exports` |
| | Configure | Definitions | `/reports/definitions` | Metric formulas and indicator specifications |
| **Governance** | Work | Approvals | `/admin/approvals` | Maker-checker review queue |
| | Work | Complaints | `/admin/complaints` | Citizen and volunteer complaint threads |
| | Work | Data requests | `/admin/data-governance` | DPDP data subject access/deletion requests |
| | Monitor | Audit logs | `/admin/audit-logs` | Cryptographic SHA-256 audit chain monitor |
| | Configure | Privacy notices | `/privacy` | Statutory consent texts and notices |
| **Administration** | Work | Users | `/admin/users` | User management and invite wizard |
| | Work | Chapters & rosters | `/admin/chapters` | Chapter roster configuration |
| | Monitor | Integrations & queues | `/admin/integrations` | Mock gateway health and sync queues |
| | Monitor | Ecosystem map | `/ecosystem` | Strategic 4-layer nexus architecture map |
| | Configure | Roles & permissions | `/admin/roles` | RBAC matrix explorer |
| | Configure | System settings | `/admin/settings` | Tabs: General, Flags, Pilot readiness checklist, Demo data |
| | Configure | Design gallery | `/design` | Component library and token showcase |

---

## 4. Role to Workspaces Matrix

| Role | Primary Workspaces (Inline Shell Tabs, max 5) | More Workspaces (Under "All Workspaces" Popover) |
|---|---|---|
| **NM** (National Manager) | Insights · Governance · Emergency · Partners · Field network | Seniors · Community · Learning · Messaging · Care · Administration |
| **PM** (Programme Manager) | Community · Seniors · Partners · Learning · Insights | Messaging · Care · Field network · Emergency (read-only) · Governance |
| **RA** (Regional Admin) | Emergency · Care · Seniors · Community · Insights | Field network · Governance |
| **CM** (Chapter Manager) | Emergency · Care · Seniors · Community · Messaging | Insights · Field network · Governance |
| **VF** (Volunteer Facilitator) | Seniors · Care · Community | — |
| **CT** (Care Triage Staff) | Emergency · Care | — |
| **SA** (System Admin) | Administration · Governance · Messaging · Insights | Emergency |
| **CD** (CSR Director / Donor) | Insights · Ecosystem map | — |
| **SF** (Senior Field Associate) | Field View (`/field/*`, dedicated mobile layout) | — |
| **SP** (Service Partner) | Partner Portal (`/partner/*`, dedicated partner shell) | — |
| **SC** (Senior Citizen) | Senior Portal (`/me/*`, elder accessibility shell) | — |
| **FM** (Family Member) | Family Portal (`/family/*`, caregiver shell) | — |

---

## 5. Explicit URL Redirect & Consolidation Map

To maintain the **feature freeze and brownfield integrity rules**, no old URLs are broken. Every consolidated page redirects to the new canonical app location with the appropriate tab or view query parameter.

| Old URL | Canonical New URL | HTTP / SPA Action |
|---|---|---|
| `/sos/history` | `/sos/cases?tab=all` | Redirect (301 SPA) |
| `/sos/drills` | `/sos/cases?tab=drills` | Redirect (301 SPA) |
| `/health/flags` | `/health/queue?tab=flags` | Redirect (301 SPA) |
| `/health/calls` | `/health/queue?tab=calls` | Redirect (301 SPA) |
| `/health/logs` | `/health/queue?tab=logs` | Redirect (301 SPA) |
| `/health/schedules` | `/health/schedules-hub?tab=schedules` | Redirect (301 SPA) |
| `/health/reminders` | `/health/schedules-hub?tab=templates` | Redirect (301 SPA) |
| `/health/rules` | `/health/rules-hub?tab=thresholds` | Redirect (301 SPA) |
| `/support/rules` | `/health/rules-hub?tab=warning-signs` | Redirect (301 SPA) |
| `/support-requests` | `/support/queue?tab=requests` | Redirect (301 SPA) |
| `/support/escalations` | `/support/queue?tab=escalations` | Redirect (301 SPA) |
| `/support/handover` | `/support/queue?tab=handover` | Redirect (301 SPA) |
| `/onboarding/script` | `/onboarding?tab=script` | Redirect (301 SPA) |
| `/attendance/corrections` | `/attendance?tab=corrections` | Redirect (301 SPA) |
| `/attendance/history` | `/attendance?tab=history` | Redirect (301 SPA) |
| `/feedback/forms` | `/feedback?tab=forms` | Redirect (301 SPA) |
| `/feedback/engagement` | `/feedback/follow-ups?tab=engagement` | Redirect (301 SPA) |
| `/vouchers/campaigns` | `/vouchers?tab=campaigns` | Redirect (301 SPA) |
| `/telemetry/trends` | `/telemetry?tab=trends` | Redirect (301 SPA) |
| `/telemetry/privacy` | `/telemetry?tab=privacy` | Redirect (301 SPA) |
| `/telemetry/exports` | `/telemetry/packs?tab=exports` | Redirect (301 SPA) |

---

## 6. Click-Depth & Reachability Inventory

| Depth from Home (`/`) | Access Method | Routes Covered |
|---|---|---|
| **Depth 1 (1 Click)** | Pinned Nav or Primary Shell Tab | `/inbox` (My work), `/apps` (All apps), Primary Workspaces overview (`/w/:workspace`), `/sos`, `/health`, `/seniors`, `/programmes`, `/reports/pilot` |
| **Depth 2 (2 Clicks)** | Workspace Nav item or Quick Menu `+ Create` | All Work/Monitor/Configure apps within current workspace, e.g. `/seniors/duplicates`, `/routing`, `/vouchers`, `/learning/library`, `/field-network`, `/admin/approvals` |
| **Depth 3 (3 Clicks)** | Consolidated App Tab or Secondary Workspace Popover | Any tab inside consolidated hubs (`/health/queue?tab=calls`, `/attendance?tab=corrections`), or switching to a secondary workspace via "All workspaces" popover and clicking an app |
| **Direct (0–1 Interaction)** | Global Command Palette (`Ctrl+K`) | Every page, every senior by ID, every emergency by code, every action |
| **Contextual (1 Click)** | Entity Hover Cards & Links | Directly navigates to Senior Object Page, Chapter Detail, Referral Record, Voucher Detail |

**Verification Guarantee**: Every single route in `docs/route-manifest.json` is reachable in $\le 3$ clicks from Home or via direct Command Palette search.
