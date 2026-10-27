# Architectural & Design Decisions Log

This document records all architectural, UX, data-model, security, and scope decisions made during the design and development of the Vayoshreshtha prototype for Vayoh Vikas, per the master prompt requirements.

---

## Decision 001: Machine-Readable Permission Matrix & Default-Deny Rule
- **Date**: 2026-10-27
- **Context**: The product requires 10 distinct roles with exact capabilities across 31 functional areas, with qualifiers (own, assigned centre, linked, masked, aggregates only).
- **Decision**: Define a single TypeScript source of truth in `src/permissions/matrix.ts` with explicit flags for actions `(create, read, update, delete, approve, export)` and scope qualifiers `(all, own, assigned_centres, assigned_items, linked_only, aggregates_only)`. All unauthorized routes or capabilities default to DENY.
- **Rationale**: Meets Hard Constraint 8 and Enforcement Rule 1 (five-layer defense) ensuring zero leaks and auto-generated test coverage across every role × route.

## Decision 002: In-Browser Mock Store with Seed Versioning & LocalStorage Isolation
- **Date**: 2026-10-27
- **Context**: The app must operate fully in the browser with 1,000 senior citizen seed records, 6 centres, 24 programmes, 600 sessions, 12 partners, 350 referrals, 900 feedback entries, 250 follow-ups, 40 escalations, 2,000 messages, and audit logs.
- **Decision**: Use a single versioned `localStorage` key `vayoshrestha_prototype_v1`. Provide a reset mechanism in Admin Settings (`/admin/settings`). Implement deterministic seeding using `@faker-js/faker` with seed `20261027` and `en_IN` locale.
- **Rationale**: Eliminates race conditions, allows instant resets, ensures reproducibility across automated tests and manual walkthroughs.

## Decision 003: Strict Desktop-First 1440×900 Layout & Dedicated Senior Mode
- **Date**: 2026-10-27
- **Context**: Staff require data density (tables, virtualized rows, audit trails, side rails), while seniors and family members need high legibility and low cognitive load.
- **Decision**: Design for 1440×900 desktop canvas (min width 1280px). Senior Citizen (`/me/*`) and Family (`/family/*`) routes switch typography to 18px base (scalable up to 22px via a persistent "Larger text" header toggle), simplified cards, and high contrast buttons (>= 48px click target).
- **Rationale**: Aligns with Section 4 and Section 7N/O guidelines while retaining institutional elegance.

## Decision 004: Pure CSS Variable Design System & Zero Tailwind Defaults
- **Date**: 2026-10-27
- **Context**: The prompt explicitly bans generic Tailwind/shadcn defaults, purple/blue gradients, glow, neon, glassmorphism, and uncurated palettes.
- **Decision**: Map all design tokens to CSS variables defined in `src/index.css`:
  - Background `#FFFFFF`, subtle `#F7F6F3`, hairline `#E4E2DC`, strong border `#CFCBC2`
  - Text `#1C1B19`, muted `#5F5C55`, disabled `#A19D94`
  - Forest Green accent `#1F5F4B`, hover `#174A3A`, subtle tint `#E8F1ED`
  - Semantic tokens (Success, Warning, Danger, Info/Neutral in warm grey)
  - Earthy chart categorical palette: Forest, Ochre, Terracotta, Slate, Olive, Sand.
- **Rationale**: Guarantees consistent calm, editorial, institutional appearance across all 92 screens.

## Decision 005: WhatsApp Channel Simulation via In-App Phone Frame
- **Date**: 2026-10-27
- **Context**: Hard constraint 5 forbids external API calls, but senior citizen WhatsApp interactions (language select, menu, booking confirmation, reminders, STOP opt-out, human handover) are critical pilot requirements.
- **Decision**: Build an interactive, animated WhatsApp phone-frame simulator at `/communication/simulator` and `/me/simulator` connected directly to the mock message store.
- **Rationale**: Allows comprehensive testing and demo of the senior citizen WhatsApp journey without external infrastructure or WhatsApp Business API costs.

## Decision 006: Non-Clinical Safeguards & Routing Language
- **Date**: 2026-10-27
- **Context**: Vayoh Vikas is an eldercare community platform, not a healthcare provider. Out-of-scope rules forbid clinical diagnosis and AI medical claims.
- **Decision**: Display a fixed institutional banner on all support and escalation screens:
  *"Vayoshreshtha does not diagnose or give clinical advice. Health-related requests are routed to qualified professionals."*
  All health escalation rules and notes use non-clinical terminology (e.g., "Assistance requested", "Mobility support referral", "Care team handover").
- **Rationale**: Ensures ethical compliance and risk mitigation per the concept note.

## Decision 007: Data Minimization & Privacy Guardrails
- **Date**: 2026-10-27
- **Context**: Concept note mandates data minimization: no Aadhaar, no biometric data, no detailed medical history.
- **Decision**: Senior citizen profiles only capture Name, Age/DOB, Gender, Primary Language, Centre, Emergency Contact Name/Phone, and Assisted Flag. Phone numbers are masked by default (`••••••3421`) and unmasking requires an explicit logged reason. Small numbers (<5) in CSR aggregate reports are suppressed to prevent re-identification.
- **Rationale**: Satisfies DPDP Act principles and prevents sensitive PII leakage.
