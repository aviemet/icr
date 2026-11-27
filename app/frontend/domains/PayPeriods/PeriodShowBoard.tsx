import { router } from "@inertiajs/react"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import {
	Badge,
	Box,
	Button,
	Group,
	Link,
	Section,
	Stack,
	Table,
	Text,
	Title,
} from "@/components"
import { CheckIcon, ClockIcon, PreviousIcon, WarningTriangleIcon } from "@/components/Icons"
import { MetricTile, MetricValue } from "@/features"
import { formatter, Routes } from "@/lib"

import { AdjustmentForm } from "./AdjustmentForm"
import * as classes from "./Board.css"
import { payrollDueDateLabel } from "./dueDateLabel"
import { periodWorkflowLabel } from "./workflow"
import { WorkQueue } from "./WorkQueue"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
	ihss_hours?: number
	company_hours?: number
}

interface EmployeeExceptionsMap {
	exception_count?: number
}

interface UnreviewedShiftRow {
	id: string
	starts_at?: string
	client_names: string[]
}

interface PayrollIndexSummary {
	total_count: number
	approved_count: number
	pending_count: number
	flagged_count: number
	facilitator_pending_shift_count?: number
}

interface AdjustmentRow {
	id: string
	reason: string
	change_set: Record<string, unknown>
	user_id: string
	employee_id?: string
	timesheet_id?: string
	created_at: string
}

type FinalizeBlockedReason = "already_finalized" | "before_period_end" | "no_timesheets" | "pending_approvals" | null

export interface PeriodShowBoardProps {
	pay_period: Schema.PayPeriod
	period_dates: [string, string]
	payroll_due_date: string
	workflow_status: string
	finalized: boolean
	can_approve: boolean
	can_finalize: boolean
	finalize_blocked_reason: FinalizeBlockedReason
	can_export: boolean
	can_view_clients?: boolean
	ihss_assignment_mode?: string
	timesheet_ids_by_employee: Record<string, string>
	approved_at_by_employee: Record<string, string>
	employee_exceptions: Record<string, EmployeeExceptionsMap>
	facilitator_shift_count_by_employee?: Record<string, number>
	facilitator_reviewed_shift_count_by_employee?: Record<string, number>
	unreviewed_shifts_by_timesheet?: Record<string, UnreviewedShiftRow[]>
	summary: PayrollIndexSummary
	employees: Schema.EmployeesPersisted[]
	employee_hours: Record<string, EmployeeHoursMap>
	adjustments: AdjustmentRow[]
	pagination: Schema.Pagination
}

function finalizeBlockedMessage(
	reason: FinalizeBlockedReason,
	translate: (key: string) => string,
) {
	switch(reason) {
		case "before_period_end":
			return translate("views.pay_periods.show.finalize_blocked_before_period_end")
		case "pending_approvals":
			return translate("views.pay_periods.show.finalize_blocked_pending")
		case "no_timesheets":
			return translate("views.pay_periods.show.finalize_blocked_no_timesheets")
		default:
			return null
	}
}

export function PeriodShowBoard({
	pay_period,
	period_dates,
	payroll_due_date,
	workflow_status,
	finalized,
	can_approve,
	can_finalize,
	finalize_blocked_reason,
	can_export,
	can_view_clients = true,
	ihss_assignment_mode = "shift",
	timesheet_ids_by_employee = {},
	approved_at_by_employee = {},
	employee_exceptions = {},
	facilitator_shift_count_by_employee = {},
	facilitator_reviewed_shift_count_by_employee = {},
	unreviewed_shifts_by_timesheet = {},
	summary,
	employees,
	employee_hours,
	adjustments = [],
	pagination,
}: PeriodShowBoardProps) {
	const { t } = useTranslation()
	const payPeriodId = pay_period.id
	const payPeriodSlug = pay_period.slug
	const [periodStart, periodEnd] = period_dates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const approvedCount = summary?.approved_count ?? 0
	const totalCount = summary?.total_count ?? employees.length
	const pendingCount = summary?.pending_count ?? 0
	const flaggedCount = summary?.flagged_count ?? 0
	const overtimeHours = Object.values(employee_hours).reduce((sum, hours) => sum + (hours.ot_hours ?? 0), 0)
	const dueInDays = payroll_due_date
		? dayjs(payroll_due_date).startOf("day").diff(dayjs().startOf("day"), "day")
		: 0
	const blockedMessage = finalizeBlockedMessage(finalize_blocked_reason, t)
	const pendingTone = pendingCount > 0 ? "alert" : "default"
	const flaggedTone = flaggedCount > 0 ? "alert" : "default"

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Group gap="sm" wrap="wrap" align="center">
							<Title order={ 2 }>{ t("views.pay_periods.show.title") }</Title>
							<Badge variant="light" color={ finalized ? "gray" : "blue" }>
								{ periodWorkflowLabel(workflow_status, t) }
							</Badge>
						</Group>
						{ periodRange && (
							<span className={ classes.subtitle }>{ periodRange }</span>
						) }
						<span className={ classes.subtitle }>
							{ t("views.pay_periods.show.workflow_help") }
						</span>
						<Group gap="md" wrap="wrap">
							<span className={ classes.subtitle }>
								{ t("views.timesheets.index.approved_count", {
									approved: approvedCount,
									total: totalCount,
								}) }
							</span>
							{ !finalized && (
								<span className={ classes.subtitle }>
									{ payrollDueDateLabel(dueInDays, t, {
										dueInDays: "views.timesheets.index.due_in_days",
										overdueByDays: "views.timesheets.index.overdue_by_days",
									}) }
								</span>
							) }
							{ finalized && pay_period.finalized_at && (
								<span className={ classes.subtitle }>
									{ t("views.pay_periods.show.finalized_stamp", {
										date: formatter.datetime.dateShort(String(pay_period.finalized_at)),
									}) }
								</span>
							) }
						</Group>
						{ !finalized && blockedMessage && (
							<span className={ classes.subtitle }>{ blockedMessage }</span>
						) }
					</Box>
					<Group gap="sm" wrap="wrap">
						{ !finalized && (
							<Button
								variant="filled"
								disabled={ !can_finalize }
								onClick={ () => router.post(Routes.finalizePeriod(payPeriodSlug)) }
							>
								{ t("views.pay_periods.show.finalize") }
							</Button>
						) }
						{ can_export && (
							<Button
								component="a"
								href={ Routes.exportPeriod(payPeriodSlug) }
								variant="default"
							>
								{ t("views.pay_periods.show.export") }
							</Button>
						) }
						{ can_view_clients && (
							<Link
								as="button"
								href={ Routes.clientsPeriod(payPeriodSlug) }
								buttonProps={ { variant: "light" } }
							>
								{ t("views.pay_periods.show.view_clients") }
							</Link>
						) }
						{ ihss_assignment_mode === "period" && (
							<Link
								as="button"
								href={ Routes.ihssPeriod(payPeriodSlug) }
								buttonProps={ { variant: "light" } }
							>
								{ t("views.pay_periods.show.view_ihss") }
							</Link>
						) }
					</Group>
				</Section>

				<Box className={ classes.metricStrip }>
					<MetricTile
						title={ t("views.timesheets.index.summary_pending") }
						tone={ pendingTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>{ pendingCount }</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.index.summary_flagged") }
						tone={ flaggedTone }
						icon={ <WarningTriangleIcon size={ 16 } /> }
					>
						<MetricValue>{ flaggedCount }</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.index.summary_overtime") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ t("views.timesheets.index.summary_hours", { count: overtimeHours }) }
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.pay_periods.index.summary.approved_label") }
						icon={ <CheckIcon size={ 16 } /> }
					>
						<MetricValue>
							{ t("views.pay_periods.index.summary.approved", {
								approved: approvedCount,
								total: totalCount,
							}) }
						</MetricValue>
					</MetricTile>
				</Box>

				<Section variant="panel" className={ classes.panel }>
					<Table.Provider selectable model="employees">
						<WorkQueue
							payPeriodId={ payPeriodId }
							payPeriodSlug={ payPeriodSlug }
							employees={ employees }
							employeeHours={ employee_hours }
							canApprove={ can_approve }
							timesheetIdsByEmployee={ timesheet_ids_by_employee }
							approvedAtByEmployee={ approved_at_by_employee }
							employeeExceptions={ employee_exceptions }
							facilitatorShiftCountByEmployee={ facilitator_shift_count_by_employee }
							facilitatorReviewedShiftCountByEmployee={ facilitator_reviewed_shift_count_by_employee }
							unreviewedShiftsByTimesheet={ unreviewed_shifts_by_timesheet }
							pagination={ pagination }
							pendingCount={ pendingCount }
							flaggedCount={ flaggedCount }
							defaultTab="needs_approval"
						/>
					</Table.Provider>
				</Section>

				{ finalized && (
					<Section variant="panel" className={ classes.panel }>
						<Title order={ 4 }>{ t("views.pay_periods.show.adjustments_title") }</Title>
						<AdjustmentForm payPeriodSlug={ payPeriodSlug } />
						{ adjustments.length === 0
							? (
								<Text size="sm" c="dimmed">{ t("views.pay_periods.show.no_adjustments") }</Text>
							)
							: (
								<Stack gap="xs">
									{ adjustments.map(adjustment => (
										<Box key={ adjustment.id }>
											<Text size="sm" fw={ 600 }>{ adjustment.reason }</Text>
											<Text size="xs" c="dimmed">
												{ formatter.datetime.dateShort(adjustment.created_at) }
											</Text>
											<Text size="xs" c="dimmed">
												{ JSON.stringify(adjustment.change_set) }
											</Text>
										</Box>
									)) }
								</Stack>
							) }
					</Section>
				) }

				<Group>
					<Link
						as="button"
						href={ Routes.payrollPeriods() }
						variant="default"
						leftSection={ <PreviousIcon size={ 16 } /> }
					>
						{ t("views.pay_periods.show.back_to_payroll") }
					</Link>
				</Group>
			</Box>
		</Box>
	)
}
