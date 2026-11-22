import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import {
	Avatar,
	Badge,
	Button,
	Card,
	Container,
	Group,
	Link,
	Modal,
	Page,
	Section,
	Stack,
	Text,
	Title,
} from "@/components"
import { PlusIcon, PreviousIcon } from "@/components/Icons"
import { AddShiftForm } from "@/domains/TimeSheets/AddShiftForm"
import { ReviewTable } from "@/domains/TimeSheets/ReviewTable"
import { formatter, Routes } from "@/lib"


interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface TimesheetsEmployeeReviewProps {
	employee: Schema.EmployeesIndex
	pay_period_id: string
	period_dates: [Date, Date]
	approval_window_open: boolean
	finalized: boolean
	can_approve: boolean
	timesheet: Schema.TimesheetsShow | null
	shifts: Schema.ShiftsReview[]
	shift_exception_reasons: Record<string, string[]>
	shift_ot_hours: Record<string, number>
	employee_hours: EmployeeHoursMap
}

export default function TimesheetsEmployeeReview({
	employee,
	pay_period_id,
	period_dates,
	finalized,
	can_approve,
	timesheet,
	shifts,
	shift_exception_reasons = {},
	shift_ot_hours = {},
	employee_hours,
}: TimesheetsEmployeeReviewProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = period_dates
	const periodRange =
		periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const regularHours = employee_hours.regular_hours ?? 0
	const otHours = employee_hours.ot_hours ?? 0
	const totalHours = regularHours + otHours
	const isApproved = Boolean(timesheet?.approved_at)

	return (
		<Page
			title={ t("views.timesheets.employee_review.title") }
			breadcrumbs={ [
				{ title: t("views.pay_periods.index.title"), href: Routes.payrollPeriods() },
				{ title: t("views.pay_periods.show.title"), href: Routes.period(pay_period_id) },
				{ title: t("views.timesheets.employee_review.title") },
			] }
		>
			<Section>
				<Container size="xl">
					<Group gap="lg" justify="space-between" mb="xl" align="flex-start" wrap="wrap">
						<Group gap="md" align="center" wrap="wrap">
							<Avatar
								src={ undefined }
								radius="xl"
								size="lg"
								color={ employee.color ?? "gray" }
							>
								{ (employee.full_name ?? employee.name ?? "?").slice(0, 2).toUpperCase() }
							</Avatar>
							<Stack gap={ 4 }>
								<Group gap="sm" wrap="wrap" align="center">
									<Title order={ 2 }>{ employee.full_name ?? employee.name }</Title>
									<Badge variant="light" color={ isApproved ? "green" : "yellow" }>
										{ isApproved
											? t("views.timesheets.employee_review.status_approved")
											: t("views.timesheets.employee_review.status_pending") }
									</Badge>
									{ can_approve && timesheet && !isApproved && (
										<Button
											variant="filled"
											onClick={ () => router.post(Routes.approveTimesheet(timesheet.id)) }
										>
											{ t("views.timesheets.employee_review.approve") }
										</Button>
									) }
									{ can_approve && timesheet && isApproved && (
										<Button
											variant="default"
											onClick={ () => router.post(Routes.unapproveTimesheet(timesheet.id)) }
										>
											{ t("views.timesheets.employee_review.unapprove") }
										</Button>
									) }
								</Group>
								{ periodRange && (
									<Text size="sm" c="dimmed">
										{ periodRange }
									</Text>
								) }
							</Stack>
						</Group>

						<Group gap="md" wrap="wrap" align="flex-start">
							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.timesheets.employee_review.regular_hours") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ formatter.number.decimal(regularHours, 2) } hrs
								</Text>
							</Card>

							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.timesheets.employee_review.ot_hours") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ formatter.number.decimal(otHours, 2) } hrs
								</Text>
							</Card>

							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.timesheets.employee_review.pto_hours") }
								</Text>
								<Text fw={ 600 } size="lg">{ t("views.timesheets.index.no_value") }</Text>
							</Card>

							<Card withBorder padding="md" style={ { minWidth: 120 } }>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.timesheets.employee_review.sick_hours") }
								</Text>
								<Text fw={ 600 } size="lg">{ t("views.timesheets.index.no_value") }</Text>
							</Card>

							<Card withBorder padding="md" style={ { minWidth: 140 } }>
								<Text size="xs" tt="uppercase" c="dimmed">
									{ t("views.timesheets.employee_review.total") }
								</Text>
								<Text fw={ 600 } size="lg">
									{ formatter.number.decimal(totalHours, 2) } hrs
								</Text>
							</Card>
						</Group>
					</Group>

					{ !finalized && (
						<Group justify="flex-end" mb="md">
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
									payPeriodId={ pay_period_id }
									periodDates={ period_dates }
								/>
							</Modal>
						</Group>
					) }

					<ReviewTable
						shifts={ shifts }
						shiftExceptionReasons={ shift_exception_reasons }
						shiftOtHours={ shift_ot_hours }
						regularHours={ regularHours }
						otHours={ otHours }
						canEditTimes={ !finalized }
						employeeId={ employee.id }
						employeeSlug={ employee.slug }
						payPeriodId={ pay_period_id }
						mb="lg"
					/>

					<Group>
						<Link
							as="button"
							href={ Routes.period(pay_period_id) }
							variant="default"
							leftSection={ <PreviousIcon size={ 16 } /> }
						>
							{ t("views.timesheets.employee_review.back") }
						</Link>
					</Group>

				</Container>
			</Section>
		</Page>
	)
}
