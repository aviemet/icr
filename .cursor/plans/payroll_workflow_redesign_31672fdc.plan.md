---
name: Payroll workflow redesign
overview: "Payroll index is a list of employees; historical view (/payroll/historical) deferred. PayPeriod is a snapshot of a pay period (derived from settings, no overlapping). Timesheet is created before submittal and tracks approval status. Shift creation and PayPeriod creation drive Timesheet/PayPeriod association via model callbacks."
todos: []
isProject: false
---

# Payroll workflow redesign

## Payroll index and historical view

- **`/payroll` (index):** A **list of employees** only. Each row links to that employee’s payroll detail (e.g. `/payroll/employees/:employee_id`). No period selector or approval queue on this page.
- **Historical view:** A separate link (e.g. `/payroll/historical`) for looking backwards in time is planned but **not implemented yet**. No period-scoped list or archive on the main index for now.

## Approval window

- **Approve** actions (index row menu, footer "Approve selected" / "Approve all clean", and employee review page "Approve" button) are shown only when the current date is within the **approval window**: from **3 days before the pay period end** through the end of the period. Before that, approval controls are hidden. Implemented on the frontend using `period_dates` from the server; no backend flag yet.
- When the backend gains payroll deadline or "lock date" settings, visibility can be driven by that instead.

## Index and employee review UX (current)

- **Actions column:** One "Review" link (navigates to employee review). When approval window is open, a row menu (kebab) offers "Approve" only (no duplicate Review).
- **Exception column (index):** Shows "--" until per-employee exception data is available from the API.
- **Employee review page:** Approve button only when approval window open. Request changes and orphan action icons removed until endpoints exist. In/Out times in the review table are **read-only**; editing shift times is deferred (future: inline edit or link to shift/event edit).
- **Review table Exception column:** Shows "--" for each shift until the API provides per-shift exception/flag data (e.g. overlapping, missing punch).

---

## PayPeriod and Timesheet model behavior

### PayPeriod

- **PayPeriod** is a snapshot of an actual pay period that happened in time.
- Derived according to pay period settings (e.g. via `Payroll::Period.period_dates`); no overlapping periods (DB unique on `starts_at`, `ends_at`).
- Allows settings to change later while preserving historical accuracy.

### Timesheet

- **Timesheet** is created **before** submittal (not only at approval).
- It tracks **approval status** and remains the record for the employee’s time in that pay period.
- Belongs to **PayPeriod** and **Employee**; has many **Shifts** (shifts can reference a timesheet via `timesheet_id`).

---

## Shift creation callback

**On creation of a Shift:**

1. Determine whether the shift falls within the **active pay period** (the period containing `Date.current` from `Payroll::Period.period_dates(Date.current)`).
2. **If the shift is before the active pay period:** Do nothing for now (TBD later).
3. **If the shift is after the active pay period:** Just persist the shift; no Timesheet/PayPeriod association.
4. **If the shift is within the active pay period:**
   - Find or create the **PayPeriod** for that span (`starts_at`/`ends_at` from `Payroll::Period.period_dates(Date.current)`).
   - If the PayPeriod was **newly created**, its `after_create` callback will create Timesheets and associate all shifts in range (including this one); nothing else to do in the Shift callback.
   - If the PayPeriod **already existed**, find or create a **Timesheet** for this employee and this PayPeriod, then set this shift’s `timesheet_id` to that Timesheet.

Implemented as **`Shift`** `after_create :associate_with_timesheet_if_in_active_period` (or equivalent).

---

## PayPeriod creation callback

**When a PayPeriod is created:**

1. Find all **Shifts** whose `calendar_event` overlaps the period (i.e. `calendar_events.starts_at <= pay_period.ends_at` and `calendar_events.ends_at >= pay_period.starts_at`).
2. Group those shifts by **employee_id**.
3. For each employee that has at least one shift in range, **create a Timesheet** for that employee and this PayPeriod.
4. **Associate** each of those shifts with the corresponding Timesheet (set `shift.timesheet_id`).

Implemented as **`PayPeriod`** `after_create :backfill_timesheets_from_shifts`.

---

## Next steps (backend)

- Add approval/update endpoints so Approve and "Approve selected" / "Approve all clean" submit to the server. Optionally add a `payroll_due_at` or `approval_window` flag to index/employee_review props so visibility can be server-driven.
- Provide per-employee exception counts (or flags) for the index and per-shift exception reasons for the review table so the Exception column can show real data instead of "--".

## Future UX (when adding period-scoped or historical views)

When implementing a period-scoped approval view or `/payroll/historical`, consider:

- Top bar: period context, approval progress, deadline, Export (enabled when complete or override).
- Summary strip: Pending, Flagged, Overtime total, PTO total (text only, no charts).
- Filtering: All / Needs Approval / Flagged / Approved; optional My Reports vs All Employees.
- Exception-driven table: elevate flagged rows, show reason inline, filter by Flagged.
- Directors: Manager Approval Status column (toggle), filter by Manager.
- Scale: search, pagination or virtualization, bulk approval.
- In/Out times: allow editing (inline or via link to shift/event edit) when supported by the API.
