import { router } from "@inertiajs/react"
import { useModals } from "@mantine/modals"
import { useTranslation } from "react-i18next"

import {
	Avatar,
	Badge,
	Box,
	Button,
	Group,
	Link,
	Modal,
	Section,
	Stack,
	Text,
	Title,
} from "@/components"
import { ClockIcon, PlusIcon, PreviousIcon } from "@/components/Icons"
import { finalApproveWithWarning } from "@/domains/PayPeriods/finalApproveWithWarning"
import { MetricTile, MetricValue } from "@/features"
import { formatter, Routes } from "@/lib"

import { AddShiftForm } from "./AddShiftForm"
import * as classes from "./Board.css"
import { ReviewTable } from "./ReviewTable"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface UnreviewedShiftRow {
	id: string
	starts_at?: string
	client_names: string[]
}

export interface EmployeeReviewBoardProps {
	employee: Schema.EmployeesIndex
	payPeriodId: string
	periodDates: [Date, Date]
	finalized: boolean
	canApprove: boolean
	timesheet: Schema.TimesheetsShow | null
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons: Record<string, string[]>
	shiftOtHours: Record<string, number>
	employeeHours: EmployeeHoursMap
	unreviewedShifts?: UnreviewedShiftRow[]
}

export function EmployeeReviewBoard({
	employee,
	payPeriodId,
	periodDates,
	finalized,
	canApprove,
	timesheet,
	shifts,
	shiftExceptionReasons,
	shiftOtHours,
	employeeHours,
	unreviewedShifts = [],
}: EmployeeReviewBoardProps) {
	const { t } = useTranslation()
	const modals = useModals()
	const [periodStart, periodEnd] = periodDates
	const periodRange =
		periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const regularHours = employeeHours.regular_hours ?? 0
	const otHours = employeeHours.ot_hours ?? 0
	const totalHours = regularHours + otHours
	const isApproved = Boolean(timesheet?.approved_at)
	const noValue = t("views.timesheets.index.no_value")
	const employeeName = employee.full_name ?? employee.name ?? "-"

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Group gap="md" align="center" wrap="wrap">
						<Avatar
							src={ undefined }
							radius="xl"
							size="lg"
							color={ employee.color ?? "gray" }
						>
							{ employeeName.slice(0, 2).toUpperCase() }
						</Avatar>
						<Box className={ classes.identity }>
							<Group gap="sm" wrap="wrap" align="center">
								<Title order={ 2 }>{ employeeName }</Title>
								<Badge variant="light" color={ isApproved ? "green" : "yellow" }>
									{ isApproved
										? t("views.timesheets.employee_review.status_approved")
										: t("views.timesheets.employee_review.status_pending") }
								</Badge>
							</Group>
							{ periodRange && (
								<span className={ classes.subtitle }>{ periodRange }</span>
							) }
						</Box>
					</Group>
					<Group gap="sm" wrap="wrap">
						{ canApprove && timesheet && !isApproved && (
							<Button
								variant="filled"
								onClick={ () => finalApproveWithWarning({
									modals,
									timesheetId: timesheet.id,
									unreviewedShifts,
									title: t("views.pay_periods.show.approve_with_gaps_title"),
									confirmLabel: t("views.pay_periods.show.approve_with_gaps_confirm"),
									cancelLabel: t("views.pay_periods.show.approve_with_gaps_cancel"),
									buildBody: (gapShifts) => (
										<Stack gap="xs">
											<Text size="sm">{ t("views.pay_periods.show.approve_with_gaps_body") }</Text>
											{ gapShifts.map(shift => (
												<Text key={ shift.id } size="sm" c="dimmed">
													{ t("views.pay_periods.show.unreviewed_shift_line", {
														client: shift.client_names.join(", ") || noValue,
														when: shift.starts_at
															? formatter.datetime.dateShort(shift.starts_at)
															: noValue,
													}) }
												</Text>
											)) }
										</Stack>
									),
								}) }
							>
								{ t("views.timesheets.employee_review.approve") }
							</Button>
						) }
						{ canApprove && timesheet && isApproved && (
							<Button
								variant="default"
								onClick={ () => router.post(Routes.unapproveTimesheet(timesheet.id)) }
							>
								{ t("views.timesheets.employee_review.unapprove") }
							</Button>
						) }
						{ !finalized && (
							<Modal
								title={ t("views.timesheets.employee_review.add_shift") }
								styles={ { content: { overflow: "visible" } } }
								trigger={ (
									<Button
										variant="light"
										leftSection={ <PlusIcon size={ 16 } /> }
									>
										{ t("views.timesheets.employee_review.add_shift") }
									</Button>
								) }
							>
								<AddShiftForm
									employeeId={ employee.id }
									payPeriodId={ payPeriodId }
									periodDates={ periodDates }
								/>
							</Modal>
						) }
					</Group>
				</Section>

				<Box className={ classes.metricStrip }>
					<MetricTile
						title={ t("views.timesheets.employee_review.regular_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(regularHours, 2) } hrs
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.ot_hours") }
						tone={ otHours > 0 ? "alert" : "default" }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(otHours, 2) } hrs
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.pto_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>{ noValue }</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.total") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(totalHours, 2) } hrs
						</MetricValue>
					</MetricTile>
				</Box>

				<Section variant="panel" className={ classes.panel }>
					<ReviewTable
						shifts={ shifts }
						shiftExceptionReasons={ shiftExceptionReasons }
						shiftOtHours={ shiftOtHours }
						regularHours={ regularHours }
						otHours={ otHours }
						canEditTimes={ !finalized }
						employeeId={ employee.id }
						employeeSlug={ employee.slug }
						payPeriodId={ payPeriodId }
					/>
				</Section>

				<Group>
					<Link
						as="button"
						href={ Routes.period(payPeriodId) }
						variant="default"
						leftSection={ <PreviousIcon size={ 16 } /> }
					>
						{ t("views.timesheets.employee_review.back") }
					</Link>
				</Group>
			</Box>
		</Box>
	)
}
