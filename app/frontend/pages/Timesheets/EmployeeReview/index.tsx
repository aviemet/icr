import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import {
	Avatar,
	Box,
	Button,
	Card,
	Container,
	Group,
	Link,
	Page,
	Section,
	Stack,
	Text,
	Title,
} from "@/components"
import { PreviousIcon } from "@/components/Icons"
import { formatter, Routes } from "@/lib"

import ReviewTable from "./ReviewTable"

const APPROVAL_WINDOW_DAYS_BEFORE_END = 3

function approvalWindowOpen(periodEnd: Date) {
	const today = dayjs().startOf("day")
	const windowStart = dayjs(periodEnd).subtract(APPROVAL_WINDOW_DAYS_BEFORE_END, "day").startOf("day")
	return today.isSameOrAfter(windowStart)
}

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface TimesheetsEmployeeReviewProps {
	employee: Schema.EmployeesIndex
	period_dates: [Date, Date]
	timesheet: Schema.TimesheetsShow | null
	shifts: Schema.ShiftsReview[]
	employee_hours: EmployeeHoursMap
}

export default function TimesheetsEmployeeReview({
	employee,
	period_dates,
	shifts,
	employee_hours,
}: TimesheetsEmployeeReviewProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = period_dates
	const periodRange =
		periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const periodLabel =
		periodRange ? `${t("views.timesheets.employee_review.period_bi_weekly")}: ${periodRange}` : ""
	const regularHours = employee_hours.regular_hours ?? 0
	const otHours = employee_hours.ot_hours ?? 0
	const totalHours = regularHours + otHours
	const approvalWindow = approvalWindowOpen(periodEnd)

	return (
		<Page
			title={ t("views.timesheets.employee_review.title") }
			breadcrumbs={ [
				{ title: t("views.timesheets.index.title"), href: Routes.timesheets() },
				{ title: t("views.timesheets.employee_review.title") },
			] }
		>
			<Section>
				<Container size="xl">
					<Group gap="lg" justify="space-between" mb="xl">
						{ approvalWindow && (
							<Group justify="flex-end" wrap="wrap" gap="xs">
								<Button variant="filled">{ t("views.timesheets.employee_review.approve") }</Button>
							</Group>
						) }

						<Box>
							<Group gap="md" align="flex-start">
								<Avatar
									src={ undefined }
									radius="xl"
									size="lg"
									color={ employee.color ?? "gray" }
								>
									{ (employee.full_name ?? employee.name ?? "?").slice(0, 2).toUpperCase() }
								</Avatar>
								<Stack gap={ 4 }>
									<Title order={ 2 }>{ employee.full_name ?? employee.name }</Title>
									<Text size="sm" c="dimmed">
										{ periodLabel }
									</Text>
								</Stack>
							</Group>
						</Box>

						<Group gap="md" wrap="wrap">

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

					<ReviewTable
						shifts={ shifts }
						regularHours={ regularHours }
						otHours={ otHours }
						mb="lg"
					/>

					<Group>
						<Link
							as="button"
							href={ Routes.timesheets() }
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
