import { router } from "@inertiajs/react"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import {
	Badge,
	Button,
	Card,
	Group,
	Link,
	Page,
	Section,
	Stack,
	Table,
	Text,
	Title,
} from "@/components"
import { PreviousIcon } from "@/components/Icons"
import { AdjustmentForm } from "@/domains/PayPeriods/AdjustmentForm"
import { WorkQueue } from "@/domains/PayPeriods/WorkQueue"
import { periodWorkflowLabel } from "@/domains/PayPeriods/workflow"
import { formatter, Routes } from "@/lib"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface EmployeeExceptionsMap {
	exception_count?: number
}

interface PayrollIndexSummary {
	total_count: number
	approved_count: number
	pending_count: number
	flagged_count: number
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

interface PayPeriodsShowProps {
	pay_period: Schema.PayPeriod
	period_dates: [string, string]
	payroll_due_date: string
	approval_window_open: boolean
	workflow_status: string
	finalized: boolean
	can_approve: boolean
	can_finalize: boolean
	finalize_blocked_reason: FinalizeBlockedReason
	can_export: boolean
	timesheet_ids_by_employee: Record<string, string>
	approved_at_by_employee: Record<string, string>
	employee_exceptions: Record<string, EmployeeExceptionsMap>
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

export default function PayPeriodsShow({
	pay_period,
	period_dates,
	payroll_due_date,
	workflow_status,
	finalized,
	can_approve,
	can_finalize,
	finalize_blocked_reason,
	can_export,
	timesheet_ids_by_employee = {},
	approved_at_by_employee = {},
	employee_exceptions = {},
	summary,
	employees,
	employee_hours,
	adjustments = [],
	pagination,
}: PayPeriodsShowProps) {
	const { t } = useTranslation()
	const payPeriodId = pay_period.id

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

	return (
		<Page
			title={ t("views.pay_periods.show.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: periodRange || t("views.pay_periods.show.title") },
			] }
		>
			<Section>
				<Table.TableProvider
					selectable
					model="employees"
					pagination={ pagination }
				>
					<Stack gap="lg">
						<Stack gap={ 4 }>
							<Group gap="sm" wrap="wrap" align="center">
								<Title order={ 2 }>{ t("views.pay_periods.show.title") }</Title>
								<Badge variant="light" color={ finalized ? "gray" : "blue" }>
									{ periodWorkflowLabel(workflow_status, t) }
								</Badge>
								{ !finalized && (
									<Button
										variant="filled"
										disabled={ !can_finalize }
										onClick={ () => router.post(Routes.finalizePeriod(payPeriodId)) }
									>
										{ t("views.pay_periods.show.finalize") }
									</Button>
								) }
								{ can_export && (
									<Button
										component="a"
										href={ Routes.exportPeriod(payPeriodId) }
										variant="default"
									>
										{ t("views.pay_periods.show.export") }
									</Button>
								) }
							</Group>
							{ periodRange && (
								<Text size="sm" c="dimmed">
									{ periodRange }
								</Text>
							) }
							<Text size="sm" c="dimmed">
								{ t("views.pay_periods.show.workflow_help") }
							</Text>
							<Group gap="md" wrap="wrap">
								<Text size="sm" c="dimmed">
									{ t("views.timesheets.index.approved_count", {
										approved: approvedCount,
										total: totalCount,
									}) }
								</Text>
								{ !finalized && (
									<Text size="sm" c="dimmed">
										{ t("views.timesheets.index.due_in_days", { count: dueInDays }) }
									</Text>
								) }
								{ finalized && pay_period.finalized_at && (
									<Text size="sm" fw={ 600 }>
										{ t("views.pay_periods.show.finalized_stamp", {
											date: formatter.datetime.dateShort(String(pay_period.finalized_at)),
										}) }
									</Text>
								) }
							</Group>
						</Stack>

						{ !finalized && blockedMessage && (
							<Text size="sm" c="dimmed">
								{ blockedMessage }
							</Text>
						) }

						<Group gap="md">
							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_pending") }</Text>
								<Text fw={ 600 } size="lg">{ pendingCount }</Text>
							</Card>
							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_flagged") }</Text>
								<Text fw={ 600 } size="lg">{ flaggedCount }</Text>
							</Card>
							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">{ t("views.timesheets.index.summary_overtime") }</Text>
								<Text fw={ 600 } size="lg">{ t("views.timesheets.index.summary_hours", { count: overtimeHours }) }</Text>
							</Card>
							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">{ t("views.pay_periods.index.summary.approved_label") }</Text>
								<Text fw={ 600 } size="lg">
									{ t("views.pay_periods.index.summary.approved", {
										approved: approvedCount,
										total: totalCount,
									}) }
								</Text>
							</Card>
						</Group>

						<WorkQueue
							payPeriodId={ payPeriodId }
							employees={ employees }
							employeeHours={ employee_hours }
							canApprove={ can_approve }
							timesheetIdsByEmployee={ timesheet_ids_by_employee }
							approvedAtByEmployee={ approved_at_by_employee }
							employeeExceptions={ employee_exceptions }
							pagination={ pagination }
							pendingCount={ pendingCount }
							flaggedCount={ flaggedCount }
							defaultTab="needs_approval"
						/>

						{ finalized && (
							<Stack gap="md">
								<Title order={ 4 }>{ t("views.pay_periods.show.adjustments_title") }</Title>
								<AdjustmentForm payPeriodId={ payPeriodId } />
								{ adjustments.length === 0
									? (
										<Text size="sm" c="dimmed">{ t("views.pay_periods.show.no_adjustments") }</Text>
									)
									: (
										<Stack gap="xs">
											{ adjustments.map(adjustment => (
												<Card key={ adjustment.id } withBorder padding="sm">
													<Text size="sm" fw={ 600 }>{ adjustment.reason }</Text>
													<Text size="xs" c="dimmed">
														{ formatter.datetime.dateShort(adjustment.created_at) }
													</Text>
													<Text size="xs" c="dimmed">
														{ JSON.stringify(adjustment.change_set) }
													</Text>
												</Card>
											)) }
										</Stack>
									) }
							</Stack>
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
					</Stack>
				</Table.TableProvider>
			</Section>
		</Page>
	)
}
