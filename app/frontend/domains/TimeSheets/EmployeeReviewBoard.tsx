import { router } from "@inertiajs/react"
import { useModals } from "@mantine/modals"
import { useState } from "react"
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
import {
	applyIhssToggleToShifts,
	type IhssToggleDelta,
	mergeShiftOtHours,
} from "./ihssToggle"
import { ReviewTable } from "./ReviewTable"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
	ihss_hours?: number
	company_hours?: number
	pto_hours?: number
	sick_hours?: number
	holiday_hours?: number
}

interface UnreviewedShiftRow {
	id: string
	starts_at?: string
	client_names: string[]
}

export interface EmployeeReviewBoardProps {
	employee: Schema.EmployeesIndex
	payPeriodId: string
	payPeriodSlug: string
	periodDates: [Date, Date]
	finalized: boolean
	canApprove: boolean
	timesheet: Schema.TimesheetsShow | null
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons: Record<string, string[]>
	shiftOtHours: Record<string, number>
	employeeHours: EmployeeHoursMap
	unreviewedShifts?: UnreviewedShiftRow[]
	ihssAssignmentMode?: string
	canEditIhss?: boolean
}

export function EmployeeReviewBoard({
	employee,
	payPeriodId,
	payPeriodSlug,
	periodDates,
	finalized,
	canApprove,
	timesheet,
	shifts,
	shiftExceptionReasons,
	shiftOtHours,
	employeeHours,
	unreviewedShifts = [],
	ihssAssignmentMode = "shift",
	canEditIhss = false,
}: EmployeeReviewBoardProps) {
	const { t } = useTranslation()
	const modals = useModals()
	const [periodStart, periodEnd] = periodDates
	const periodRange =
		periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const [reviewShifts, setReviewShifts] = useState(shifts)
	const [reviewShiftOtHours, setReviewShiftOtHours] = useState(shiftOtHours)
	const [reviewEmployeeHours, setReviewEmployeeHours] = useState(employeeHours)
	const [prevShifts, setPrevShifts] = useState(shifts)
	const [prevShiftOtHours, setPrevShiftOtHours] = useState(shiftOtHours)
	const [prevEmployeeHours, setPrevEmployeeHours] = useState(employeeHours)

	if(
		shifts !== prevShifts ||
		shiftOtHours !== prevShiftOtHours ||
		employeeHours !== prevEmployeeHours
	) {
		setPrevShifts(shifts)
		setPrevShiftOtHours(shiftOtHours)
		setPrevEmployeeHours(employeeHours)
		setReviewShifts(shifts)
		setReviewShiftOtHours(shiftOtHours)
		setReviewEmployeeHours(employeeHours)
	}

	const regularHours = reviewEmployeeHours.regular_hours ?? 0
	const otHours = reviewEmployeeHours.ot_hours ?? 0
	const ihssHours = reviewEmployeeHours.ihss_hours ?? 0
	const companyHours = reviewEmployeeHours.company_hours ?? 0
	const ptoHours = reviewEmployeeHours.pto_hours ?? 0
	const sickHours = reviewEmployeeHours.sick_hours ?? 0
	const holidayHours = reviewEmployeeHours.holiday_hours ?? 0
	const totalHours = ihssHours + companyHours + ptoHours + sickHours + holidayHours
	const showIhssToggle = canEditIhss && ihssAssignmentMode === "shift"
	const isApproved = Boolean(timesheet?.approved_at)
	const noValue = t("views.timesheets.index.no_value")
	const employeeName = employee.full_name ?? employee.name ?? "-"

	const handleIhssToggle = (delta: IhssToggleDelta) => {
		setReviewShifts(current => applyIhssToggleToShifts(current, delta))
		setReviewShiftOtHours(current => mergeShiftOtHours(current, delta.shift_ot_hours))
		if(delta.employee_hours) {
			setReviewEmployeeHours(current => ({ ...current, ...delta.employee_hours }))
		}
	}

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
									employeeSlug={ employee.slug }
									payPeriodId={ payPeriodId }
									payPeriodSlug={ payPeriodSlug }
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
						title={ t("views.timesheets.employee_review.ihss_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(ihssHours, 2) } hrs
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.company_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(companyHours, 2) } hrs
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.pto_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(ptoHours, 2) } hrs
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.sick_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(sickHours, 2) } hrs
						</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.timesheets.employee_review.holiday_hours") }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>
							{ formatter.number.decimal(holidayHours, 2) } hrs
						</MetricValue>
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
						shifts={ reviewShifts }
						shiftExceptionReasons={ shiftExceptionReasons }
						shiftOtHours={ reviewShiftOtHours }
						regularHours={ regularHours }
						otHours={ otHours }
						ihssHours={ ihssHours }
						ptoHours={ ptoHours }
						sickHours={ sickHours }
						holidayHours={ holidayHours }
						canEditTimes={ !finalized }
						employeeId={ employee.id }
						employeeSlug={ employee.slug }
						payPeriodId={ payPeriodId }
						payPeriodSlug={ payPeriodSlug }
						showIhss={ showIhssToggle }
						canEditIhss={ showIhssToggle }
						onIhssToggle={ handleIhssToggle }
					/>
				</Section>

				<Group>
					<Link
						as="button"
						href={ Routes.period(payPeriodSlug) }
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
