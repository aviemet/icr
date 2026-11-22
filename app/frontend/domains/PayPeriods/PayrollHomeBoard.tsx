import { router } from "@inertiajs/react"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import {
	Box,
	Button,
	Group,
	Link,
	Section,
	Title,
} from "@/components"
import { CheckIcon, ClockIcon, WarningTriangleIcon } from "@/components/Icons"
import { MetricTile, MetricValue } from "@/features"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"
import { payrollDueDateLabel } from "./dueDateLabel"
import { PayPeriodsTable, type PayPeriodRow } from "./Table"
import { periodWorkflowLabel } from "./workflow"

interface PeriodSummary {
	pay_period_id: string
	starts_at: string
	ends_at: string
	payroll_due_date: string
	finalized_at?: string
	workflow_status: string
	approval_window_open: boolean
	total_count: number
	approved_count: number
	pending_count: number
	flagged_count: number
	overtime_hours: number
}

export interface PayrollHomeBoardProps {
	current_summary: PeriodSummary
	can_finalize: boolean
	can_export: boolean
	periods: PayPeriodRow[]
}

export function PayrollHomeBoard({
	current_summary,
	can_finalize,
	can_export,
	periods,
}: PayrollHomeBoardProps) {
	const { t } = useTranslation()
	const periodRange = formatter.datetime.range(current_summary.starts_at, current_summary.ends_at)
	const dueInDays = current_summary.payroll_due_date
		? dayjs(current_summary.payroll_due_date).startOf("day").diff(dayjs().startOf("day"), "day")
		: 0
	const payPeriodId = current_summary.pay_period_id
	const reviewHref = Routes.period(payPeriodId)
	const pendingHref = Routes.period(payPeriodId, { tab: "needs_approval" })
	const flaggedHref = Routes.period(payPeriodId, { tab: "flagged" })
	const approvedHref = Routes.period(payPeriodId, { tab: "approved" })
	const pendingTone = current_summary.pending_count > 0 ? "alert" : "default"
	const flaggedTone = current_summary.flagged_count > 0 ? "alert" : "default"

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Title order={ 2 }>{ t("views.pay_periods.index.title") }</Title>
						<Group gap="sm" wrap="wrap" align="center">
							<Link as="button" href={ reviewHref }>
								{ periodRange }
							</Link>
							<span className={ classes.subtitle }>
								{ periodWorkflowLabel(current_summary.workflow_status, t) }
							</span>
						</Group>
						{ current_summary.finalized_at
							? (
								<span className={ classes.subtitle }>
									{ t("views.pay_periods.index.summary.finalized_on", {
										date: formatter.datetime.dateShort(current_summary.finalized_at),
									}) }
								</span>
							)
							: (
								<span className={ classes.subtitle }>
									{ payrollDueDateLabel(dueInDays, t, {
										dueInDays: "views.pay_periods.index.summary.due_in_days",
										overdueByDays: "views.pay_periods.index.summary.overdue_by_days",
									}) }
								</span>
							) }
					</Box>
					{ (can_finalize || can_export) && (
						<Group gap="sm" wrap="wrap">
							{ can_finalize && (
								<Button
									variant="filled"
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
					) }
				</Section>

				<Box className={ classes.metricStrip }>
					<MetricTile
						title={ t("views.pay_periods.index.summary.pending") }
						tone={ pendingTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue href={ pendingHref }>
							{ current_summary.pending_count }
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.pay_periods.index.summary.flagged") }
						tone={ flaggedTone }
						icon={ <WarningTriangleIcon size={ 16 } /> }
					>
						<MetricValue href={ flaggedHref }>
							{ current_summary.flagged_count }
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.pay_periods.index.summary.overtime") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue href={ reviewHref }>
							{ t("views.timesheets.index.summary_hours", { count: current_summary.overtime_hours }) }
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.pay_periods.index.summary.approved_label") }
						icon={ <CheckIcon size={ 16 } /> }
					>
						<MetricValue href={ approvedHref }>
							{ t("views.pay_periods.index.summary.approved", {
								approved: current_summary.approved_count,
								total: current_summary.total_count,
							}) }
						</MetricValue>
					</MetricTile>
				</Box>

				<Section variant="panel" className={ classes.panel }>
					<Title order={ 4 }>{ t("views.pay_periods.index.periods") }</Title>
					<PayPeriodsTable
						periods={ periods }
						currentPeriodId={ payPeriodId }
					/>
				</Section>
			</Box>
		</Box>
	)
}
