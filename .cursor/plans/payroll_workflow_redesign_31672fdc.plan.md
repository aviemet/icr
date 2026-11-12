---
name: Payroll workflow redesign
overview: "Payroll index is a list of employees; historical view (/payroll/historical) deferred. PayPeriod is a snapshot of a pay period (derived from settings, no overlapping). Payroll due date is a user-configurable setting (duration/date rule: days after period end, day of week, or day of month); approval window is after period close through that due date. Timesheet is created before submittal and tracks approval status. Shift creation and PayPeriod creation drive Timesheet/PayPeriod association via model callbacks."
todos: []
isProject: false
---

# Payroll workflow redesign

## Payroll index and historical view

- **`/payroll` (index):** A **list of employees** only. Each row links to that employee’s payroll detail (e.g. `/payroll/employees/:employee_id`). No period selector or approval queue on this page.
- **Historical view:** A separate link (e.g. `/payroll/historical`) for looking backwards in time is planned but **not implemented yet**. No period-scoped list or archive on the main index for now.

## Approval window

- **Period close:** The last day of the pay period is the last day employees can log hours. Timesheets are therefore incomplete until the period has closed; managers cannot meaningfully approve during the open period.
- **Payroll due date:** The date by which timesheets must be approved and payroll is processed is a **user-configurable setting** that supports multiple rule types. Examples: semi-monthly might use "5 days after period end"; bi-weekly might use "the following Tuesday"; monthly might use "the 5th of the month." The setting is a duration/date rule the user can change (not a fixed "N days" only).
- **Approval window:** Approve actions are shown only when the current date is **after** the period has closed and **before** the payroll due date. So the window is: **(period_close + 1)** through **(payroll_due_date)**. Implemented on the frontend today using `period_dates` and a hardcoded "3 days before period end" rule, which is **incorrect**; when the backend gains the payroll due date setting and computes the resulting date per period, visibility should be driven by server-computed `approval_window_opens_at` / `approval_window_closes_at` (or a single `approval_window_open` boolean).

## Timesheet due and approval timeline

- **Period close** = last day of period (from `Payroll::Period.period_dates` end date).
- **Payroll due date** = user-configurable setting that defines when payroll (and thus the approval window) ends for each period. The setting must support multiple duration/date rule types, for example:
  - **Days after period end:** e.g. 5 days after the period closes (common for semi-monthly).
  - **Day of week after period end:** e.g. the following Tuesday (common for bi-weekly).
  - **Day of month:** e.g. the 5th of the month (common for monthly).
  The backend computes the actual due date for a given period from this setting; the approval window closes on that date.
- **Approval window** = from the day after period close through the payroll due date. Frontend and backend should use server-provided window bounds so the UI does not assume a wrong timeline.

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

- Add a **user-configurable payroll due date** setting that supports multiple rule types (e.g. days after period end, day of week after period end, day of month). Compute the resulting due date per period from this setting; the approval window ends on that date. Expose `approval_window_open` or `approval_window_opens_at` / `approval_window_closes_at` (or equivalent) so the frontend can show Approve actions only when the current date is within the post-close, pre-payroll-due window.
- Add approval/update endpoints so Approve and "Approve selected" / "Approve all clean" submit to the server.
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
