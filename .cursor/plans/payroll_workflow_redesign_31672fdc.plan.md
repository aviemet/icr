---
name: Payroll workflow redesign
overview: "Update the payroll workflow redesign plan to incorporate the recommended layout and UX: period-scoped approval queue as primary view with top bar (period context, progress, export), compact summary strip, status/exception filtering tabs, exception-driven table, director-oriented filters, and scale-ready design (search, pagination, bulk approval)."
todos: []
isProject: false
---

# Payroll workflow redesign — plan update (ChatGPT recommendations)

This update **merges** the existing plan at [.cursor/plans/payroll_workflow_redesign_80191109.plan.md](.cursor/plans/payroll_workflow_redesign_80191109.plan.md) with the ChatGPT recommendations. All existing sections (routes, PayrollController, policies, serializers, period identity, Timesheet = snapshot on approval) **remain in force**. The changes below add and refine **layout, UX, and scaling** only.

---

## 1. Primary view: period-scoped approval queue

**Recommendation:** The payroll index primary content is a **pay-period-scoped, filterable, exception-driven approval queue** with bulk actions and an export-readiness indicator. Period selection is **visible but secondary** (users mostly work on the current period; avoid making them hunt through archived periods).

**Alignment with existing plan:**

- Keep **two entry paths**: (1) **Approval queue** (default) = one period’s worth of employees/timecards; (2) **Past periods / by employee** = existing “Pay periods” tab and “Employees” tab for archive and by-employee navigation.
- **Default view:** Current pay period’s approval queue (derived current period + any approved timesheets for that period). Period selector in the **top bar** switches which period is in scope (current + recent/past in dropdown).
- **Employees tab** (existing): List employees → link to `/payroll/employees/:employee_id` (employee’s pay periods). Stays as secondary navigation.
- **Pay periods tab** (existing): List past periods (from DB) → link to `/payroll/periods?pay_period_start=...&pay_period_end=...`. Stays for archive; optional “Past periods” in period dropdown can mirror this.

So: **Section 5 (Frontend)** in the original plan is extended so the main payroll index screen is the approval queue for the **selected period** (default = current), with the new layout below; the existing Employees and Pay periods tabs remain as secondary entry points.

---

## 2. Top bar — period context (no charts)

Include in the payroll index (approval queue) view:

- **Title:** e.g. “Payroll Approval”.
- **Period selector:** Dropdown to choose current period (default) or a past period (e.g. from distinct timesheet periods or from `Payroll::Period` for current/adjacent).
- **Period type label:** e.g. “Bi-Weekly” (from `Setting.payroll_period_type` / locale).
- **Approval progress:** e.g. “38 / 42 Approved” (counts for the selected period, scope-aware).
- **Deadline indicator:** e.g. “Due in 2 days” (requires deadline source: setting, or derived from period end + config).
- **Export Summary:** Button; **enabled only when** period is fully approved or an override applies (e.g. admin). No charts in the top bar.

**Backend:** Index (or dedicated endpoint) must return, for the selected period: period dates, period type, approval counts (approved / total), deadline if any, and an “export ready” (or override) flag for the Export button.

---

## 3. Summary strip (compact, text only)

Directly under the top bar, a **compact summary strip** — small stat blocks, **text only** (no bar graphs):

- **Pending:** count of timecards not yet approved for the period.
- **Flagged:** count of timecards with exceptions (see Exception-driven UX below).
- **Overtime total:** total overtime hours for the period (e.g. from `Payroll::PeriodHoursSummary` or equivalent).
- **PTO total:** total PTO hours for the period (source TBD: e.g. leave/absence or existing PTO tracking).

**Backend:** Same index/endpoint can return these aggregates for the selected period and scope (e.g. “My Reports” vs “All Employees”).

---

## 4. Filtering controls (critical)

**Status tabs** (filter the approval queue table):

- **All**
- **Needs Approval**
- **Flagged**
- **Approved**

**Optional scope toggle** (role/permission-based):

- **My Reports** (default for managers): only employees the current user manages (`managed_employees.current`).
- **All Employees** (e.g. directors only): full list for the period.

Implementation: tabs and scope drive query params or client state; backend filters the list by status (and by manager scope when “My Reports” is used). Existing plan’s policy (admin/super_admin see all; others permission/`managed_employees`) applies.

---

## 5. Exception-driven UX

The table is an **exception queue**, not just a list. Exceptions to support (elevate and filter):

- Missing punches
- Overlapping shifts
- Overtime threshold breaches
- PTO over-allocation

**UX:**

- **Elevate** flagged rows visually (e.g. row styling or icon).
- **Surface reason inline** (e.g. “Missing punch”, “Overtime > 40h”) in the row or exceptions column.
- **Filterable** via the “Flagged” tab.

**Backend:** Exceptions can be **computed** when building the current-period draft (from shifts/punches and rules) and/or stored on a timesheet/audit record; exact schema can be decided in implementation. Existing [EmployeesTable](app/frontend/pages/Timesheets/Index/EmployeesTable.tsx) already has an “Exceptions” column; wire it to real exception data and flag state.

---

## 6. What directors need (no full redesign)

Directors care about: manager approval status, anomalies, overtime totals, clean export. Do **not** redesign the whole page; add:

- **Manager Approval Status** column (optional toggle): e.g. “Approved by [Manager]” or “Pending manager approval”.
- **Filter by Manager:** Optional filter to restrict the list to employees under a selected manager.

Use existing permission/role checks to show these only to users who have “see all” (e.g. director) permission.

---

## 7. Scaling to large headcount (e.g. 1,000 employees)

Design for scale even if initial deployment is smaller:

- **Filtering and search:** Status tabs + optional “My Reports” and “Filter by Manager” are required; add **search** (e.g. by employee name) on the approval queue.
- **Pagination or virtualization:** Approval queue list must support pagination (or virtualization) so the table is not one giant DOM list. Existing index already uses `paginate(employees, :employees)`; keep and enforce page size and “load more” or pagination UI.
- **Bulk approval:** Allow selecting multiple rows and approving in one action (backend: batch approve endpoint; policy applies to each record).

No change to the existing plan’s route or controller structure; ensure the period-scoped index (or period_employees) supports search, pagination, and bulk approve.

---

## 8. One-line product summary

**The payroll index page is:** a pay-period-scoped, filterable, exception-driven approval queue with bulk actions and an export-readiness indicator.

---

## 9. What stays unchanged from the original plan

- **Routes:** PayrollController#index, employee_periods, period_employees, current_period; TimesheetsController for show/edit/update and create-on-approve.
- **Period identity:** Stored only as `(pay_period_start, pay_period_end)`; no period_key from current settings; past periods from DB only.
- **Timesheet creation:** Only on approval; current period is derived until then.
- **Policies:** Rolify admin/super_admin; everyone else via permission system and `managed_employees.current` where applicable.
- **Employees tab and Pay periods tab:** Retained as secondary navigation (by employee, by past period).

---

## 10. Suggested implementation order (add to plan)

1. **Backend:** PayrollController#index (and any period-scoped endpoint) returns: period context (dates, type, approval counts, deadline, export-ready), summary strip (pending, flagged, overtime total, PTO total), and paginated, filterable list (status, scope, search). Add bulk approve endpoint.
2. **Frontend:** Top bar (period selector, period type, progress, due, Export) and summary strip (text only).
3. **Frontend:** Status tabs (All, Needs Approval, Flagged, Approved) and optional My Reports / All Employees; wire to backend filters.
4. **Backend + frontend:** Exception detection (missing punch, overlap, overtime, PTO over-allocation); expose in API; show inline and use for Flagged tab and row styling.
5. **Frontend:** Director-only: Manager Approval Status column (toggle) and Filter by Manager; permission-gate.
6. **Frontend:** Search and pagination (or virtualization) on the queue table; bulk approval UI.

This keeps the original plan as the source of truth for routes, policies, and data model, and adds the recommended layout, UX, and scaling details in one place.
