# ICR

**Supported Living Services, run from one coherent surface.**

ICR is the operations suite for an SLS agency: clients, employees, schedules, care records, and payroll in a single Rails application. It is built for one company, tuned to how that company actually works, and designed so the screens that run the day tell one shared truth.

---

## Why this exists

SLS work is relationship-heavy and paperwork-heavy at the same time. Managers need to know who is working with whom, when shifts land, what credentials are current, and whether a pay period is ready to close. Spreadsheets and bolted-on tools drift. ICR keeps people, schedules, and hours on the same rails.

One company. One settings model. No multi-tenant maze. The product is the agency's system of record, not a marketplace of tenants.

---

## What you get

### People and care
- **Clients** with tabbed profiles: overview, contacts, health, medications, care and services, documents, and incidents
- **Employees** with HR depth: credentials, clearances, assignments, trainings, pay history, and status workflows
- **Households**, support contacts, enrollments, and IHSS-aware client fields where California funding details matter

### Scheduling
- Day, week, and month calendar views with overlap handling and conflict awareness
- Shifts assigned to employees and clients, with role-scoped visibility
- Schedule data that feeds the payroll story instead of living in a silo

### Payroll and timesheets
- Configurable pay periods (weekly, bi-weekly, semi-monthly, monthly)
- Overtime rules with exemptions by shift category, time range, and duration
- Approval workflow through finalize, with due dates as urgency signals
- Period review that keeps employee hours, timesheets, and roster ids in lockstep
- Vendor-neutral hours export after a period is locked

### Access and control
- Devise authentication, Rolify roles, Pundit policies
- Job-title permission matrix as the admin-facing grant surface
- Relationship-scoped access for attendants, managers, and self
- Shared Inertia permissions that mirror what the UI is allowed to show

### Agency polish
- Brand accent color for the site
- Command palette (Spotlight) gated by the same permissions as the sidebar
- Light and dark themes on a Mantine-based UI
- Paper Trail audit trail for who did what

---

## Stack

| Layer | Choice |
| --- | --- |
| Backend | Ruby 3.4, Rails 8, PostgreSQL |
| Frontend | TypeScript, React 19, Inertia.js, Vite, Yarn 4 |
| UI | Mantine, Linaria, TipTap |
| AuthZ | Devise, Rolify, Pundit |
| Jobs | Good Job |
| Tests | RSpec, Vitest, Playwright |

Server state travels through Inertia. Forms use `use-inertia-form`. Types for serializers are generated into TypeScript so the page contracts stay honest.

---

## Getting started

### Prerequisites
- Ruby `3.4.8` (see `.ruby-version`)
- Yarn 4 (Corepack)
- PostgreSQL
- Node.js compatible with the project's Vite toolchain

### Setup

```bash
bin/setup
yarn install
```

`bin/setup` installs gems and prepares the database. Then start the full stack:

```bash
yarn dev
```

That runs Overmind against `Procfile.dev` (Rails on port 3000 + Vite). Open [http://localhost:3000](http://localhost:3000).

Production-style local boot:

```bash
yarn start
```

---

## Day-to-day commands

```bash
yarn lint          # ESLint
yarn tsc           # TypeScript check
yarn test:once     # Vitest
yarn rspec         # RSpec
yarn verify        # lint + rubocop + tsc + vitest + rspec
yarn regenerate    # types, annotate, i18n export
```

Frontend package manager is Yarn. Use Yarn for installs and scripts.

---

## Architecture at a glance

```
app/
  controllers/     # Inertia endpoints, Decent Exposure, Pundit
  models/          # Domain under Client::, Employee::, Calendar::, etc.
  serializers/     # oj_serializers + TypesFromSerializers
  frontend/
    pages/         # Inertia route entrypoints only
    domains/       # Feature boards, forms, tables
    features/      # Shared shells and record-show chrome
    components/    # Primitives
    layouts/       # App chrome, providers, sidebar
```

**Single-tenant by design.** Company details live in a singleton settings model.

**One loaded set for one page.** Index and show screens that share domain numbers use the same population rules. Sibling id-keyed maps (employees, hours, timesheets) are meant to describe the same people.

**Audit.** Paper Trail `versions` is the audit store. Behavioral timestamps (`approved_at`, `finalized_at`) stay on the model; actor history lives on versions.

---

## Product shape

| Area | Status |
| --- | --- |
| Auth and job-title permissions | In place |
| Employee and client management | In place |
| Calendar and scheduling | In place (recurring UI still expanding) |
| Payroll / timesheet workflow | Active build |
| Documents | Active Storage in use; deeper versioning planned |
| IHSS hours engine | In place (co-employer OT + shift/period assignment) |

The app is already the place where staff live day to day. Payroll and hours depth are the current edge of the roadmap.

---

## Contributing posture

Keep changes atomic and focused. Prefer reusing existing formatters, routes (`Routes` from `@/lib`), serializers, and board primitives over inventing parallel ones. Frontend pages stay thin; domain UI lives under `app/frontend/domains/`. Shared chrome lives under `features/`.

When behavior changes, add or update specs and run the relevant suite before you call it done.

---

## License

MIT. See `package.json` / repository metadata for author details.
