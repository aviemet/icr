import { useTranslation } from "react-i18next"

import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Card,
	Container,
	Group,
	Page,
	Section,
	Stack,
	Tabs,
	Text,
	Title,
} from "@/components"
import { DotsIcon, DownArrowIcon, PreviousIcon } from "@/components/Icons"
import { formatter, Routes } from "@/lib"

import ReviewTable from "./ReviewTable"

interface EmployeeHoursMap {
	regular_hours?: number
	ot_hours?: number
}

interface TimesheetsEmployeeReviewProps {
	employee: Schema.EmployeesIndex
	period_dates: [string, string]
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
					<Stack gap="lg">
						<Group justify="flex-end" wrap="wrap" gap="xs">
							<Button variant="filled">{ t("views.timesheets.employee_review.approve") }</Button>
							<Button variant="default">
								{ t("views.timesheets.employee_review.request_changes") }
							</Button>
							<ActionIcon variant="default" size="lg">
								<DotsIcon size={ 18 } />
							</ActionIcon>
							<ActionIcon variant="default" size="lg">
								<DownArrowIcon size={ 18 } />
							</ActionIcon>
						</Group>

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

						<Tabs defaultValue="date">
							<Tabs.List>
								<Tabs.Tab value="date">{ t("views.timesheets.employee_review.tab_date") }</Tabs.Tab>
								<Tabs.Tab value="day">{ t("views.timesheets.employee_review.tab_day") }</Tabs.Tab>
							</Tabs.List>

							<Tabs.Panel value="date">
								<ReviewTable
									shifts={ shifts }
									regularHours={ regularHours }
									otHours={ otHours }
								/>
							</Tabs.Panel>
							<Tabs.Panel value="day">
								<Text size="sm" c="dimmed">
									{ t("views.timesheets.employee_review.tab_day") }
								</Text>
							</Tabs.Panel>
						</Tabs>

						<Group>
							<Button
								component="a"
								href={ Routes.timesheets() }
								variant="default"
								leftSection={ <PreviousIcon size={ 16 } /> }
							>
								{ t("views.timesheets.employee_review.back") }
							</Button>
						</Group>
					</Stack>
				</Container>
			</Section>
		</Page>
	)
}
