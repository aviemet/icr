import { router } from "@inertiajs/react"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import {
	Button,
	Card,
	Group,
	Link,
	Page,
	Section,
	Stack,
	Text,
	Title,
} from "@/components"
import { PayPeriodsTable, type PayPeriodRow } from "@/domains/PayPeriods/Table"
import { periodWorkflowLabel } from "@/domains/PayPeriods/workflow"
import { formatter, Routes } from "@/lib"

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

interface PayPeriodsIndexProps {
	current_period: Schema.PayPeriod
	current_summary: PeriodSummary
	can_finalize: boolean
	can_export: boolean
	periods: PayPeriodRow[]
}

export default function PayPeriodsIndex({
	current_summary,
	can_finalize,
	can_export,
	periods,
}: PayPeriodsIndexProps) {
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

	return (
		<Page
			title={ t("views.pay_periods.index.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
			] }
		>
			<Section>
				<Stack gap="xl">
					<Stack gap="md">
						<Stack gap={ 4 }>
							<Title order={ 2 }>{ t("views.pay_periods.index.title") }</Title>
							<Group gap="sm" wrap="wrap">
								<Link href={ reviewHref }>
									{ periodRange }
								</Link>
								<Text size="sm" c="dimmed">
									{ periodWorkflowLabel(current_summary.workflow_status, t) }
								</Text>
							</Group>
							{ current_summary.finalized_at
								? (
									<Text size="sm" c="dimmed">
										{ t("views.pay_periods.index.summary.finalized_on", {
											date: formatter.datetime.dateShort(current_summary.finalized_at),
										}) }
									</Text>
								)
								: (
									<Text size="sm" c="dimmed">
										{ t("views.pay_periods.index.summary.due_in_days", { count: dueInDays }) }
									</Text>
								) }
							{ (can_finalize || can_export) && (
								<Group gap="md" wrap="wrap">
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
						</Stack>

						<Group gap="md" wrap="wrap">
							<Card
								component={ Link }
								href={ pendingHref }
								withBorder
								padding="md"
								style={ { minWidth: 140, textDecoration: "none", color: "inherit" } }
							>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.pay_periods.index.summary.pending") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ current_summary.pending_count }
								</Text>
							</Card>
							<Card
								component={ Link }
								href={ flaggedHref }
								withBorder
								padding="md"
								style={ { minWidth: 140, textDecoration: "none", color: "inherit" } }
							>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.pay_periods.index.summary.flagged") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ current_summary.flagged_count }
								</Text>
							</Card>
							<Card
								component={ Link }
								href={ reviewHref }
								withBorder
								padding="md"
								style={ { minWidth: 140, textDecoration: "none", color: "inherit" } }
							>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.pay_periods.index.summary.overtime") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ t("views.timesheets.index.summary_hours", { count: current_summary.overtime_hours }) }
								</Text>
							</Card>
							<Card
								component={ Link }
								href={ approvedHref }
								withBorder
								padding="md"
								style={ { minWidth: 160, textDecoration: "none", color: "inherit" } }
							>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.pay_periods.index.summary.approved_label") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ t("views.pay_periods.index.summary.approved", {
										approved: current_summary.approved_count,
										total: current_summary.total_count,
									}) }
								</Text>
							</Card>
						</Group>
					</Stack>

					<Stack gap="sm">
						<Title order={ 3 }>
							{ t("views.pay_periods.index.period_archive") }
						</Title>
						<PayPeriodsTable
							periods={ periods }
							currentPeriodId={ payPeriodId }
						/>
					</Stack>
				</Stack>
			</Section>
		</Page>
	)
}
