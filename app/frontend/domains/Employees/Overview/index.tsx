import { useTranslation } from "react-i18next"

import {
	Box,
	Group,
	Link,
	ScheduleButton,
	Section,
	Stack,
	Text,
	Title,
	Badge,
} from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { Routes } from "@/lib"

interface EmployeeOverviewProps {
	employee: Schema.EmployeesShow
}

export function EmployeeOverview({ employee }: EmployeeOverviewProps) {
	const { t } = useTranslation()
	const statusLabel = employee.status
		? t(`views.employees.table.statuses.${employee.status}`, { defaultValue: employee.status })
		: "-"

	return (
		<Stack gap="lg">
			<Group justify="space-between" align="flex-start">
				<Stack gap={ 4 }>
					<Group gap="sm" align="center">
						<Title order={ 3 }>{ employee.person.name }</Title>
						<Badge>{ statusLabel }</Badge>
					</Group>
					<Text size="sm" c="dimmed">
						{ t("views.employees.show.overview.employee_number") }: { employee.number || "-" }
					</Text>
					{ employee.job_title && (
						<Text size="sm" c="dimmed">
							{ t("views.employees.show.overview.job_title") }: { String(employee.job_title.name) }
						</Text>
					) }
					{ employee.active_at && (
						<Text size="sm" c="dimmed">
							{ t("views.employees.show.overview.hire_date") }:{ " " }
							<DateTimeFormatter>{ employee.active_at }</DateTimeFormatter>
						</Text>
					) }
				</Stack>
				<Group>
					<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } />
					<Link href={ Routes.statusEmployee(employee.slug) } as="button" buttonProps={ { variant: "light" } }>
						{ t("views.employees.show.change_status") }
					</Link>
				</Group>
			</Group>

			<Group grow align="stretch">
				<Section>
					<Title order={ 4 } mb="sm">{ t("views.employees.show.overview.assignments") }</Title>
					<Stack gap={ 4 }>
						<Text size="sm">
							{ t("views.employees.show.overview.manager") }:{ " " }
							{ employee.primary_manager?.person?.name || t("views.employees.show.overview.none") }
						</Text>
						<Text size="sm">
							{ t("views.employees.show.overview.assigned_clients") }: { employee.assigned_clients_count }
						</Text>
					</Stack>
				</Section>

				<Section>
					<Title order={ 4 } mb="sm">{ t("views.employees.show.overview.alerts") }</Title>
					<Stack gap={ 4 }>
						<Text size="sm">
							{ t("views.employees.show.overview.incomplete_trainings") }: { employee.incomplete_trainings_count }
						</Text>
						<Text size="sm">
							{ t("views.employees.show.overview.expiring_credentials") }: { employee.expiring_credentials_count }
						</Text>
						<Text size="sm">
							{ t("views.employees.show.overview.expiring_clearances") }: { employee.expiring_clearances_count }
						</Text>
						<Text size="sm">
							{ t("views.employees.show.overview.emergency_contacts") }: { employee.emergency_contacts_count }
						</Text>
					</Stack>
				</Section>

				<Section>
					<Title order={ 4 } mb="sm">{ t("views.employees.show.overview.quick_links") }</Title>
					<Stack gap={ 4 }>
						<Box><Link href={ `${Routes.employee(employee.slug)}?tab=profile` }>{ t("views.employees.show.tabs.profile") }</Link></Box>
						<Box><Link href={ `${Routes.employee(employee.slug)}?tab=credentials` }>{ t("views.employees.show.tabs.credentials") }</Link></Box>
						<Box><Link href={ `${Routes.employee(employee.slug)}?tab=trainings` }>{ t("views.employees.show.tabs.trainings") }</Link></Box>
						{ employee.current_pay_period_id && (
							<Box>
								<Link href={ Routes.periodEmployeeReview(employee.current_pay_period_id, employee.id) }>
									{ t("views.employees.show.overview.payroll_review") }
								</Link>
							</Box>
						) }
					</Stack>
				</Section>
			</Group>

			{ employee.interviews.length > 0 && (
				<Section>
					<Title order={ 4 } mb="sm">{ t("views.employees.show.overview.recent_interviews") }</Title>
					<Stack gap="xs">
						{ employee.interviews.slice(0, 5).map(interview => (
							<Group key={ interview.id } justify="space-between">
								<Text size="sm">
									{ interview.scheduled_at
										? <DateTimeFormatter>{ interview.scheduled_at }</DateTimeFormatter>
										: "-" }
								</Text>
								<Link href={ Routes.interview(interview.id) }>
									{ t("views.employees.show.overview.view_interview") }
								</Link>
							</Group>
						)) }
					</Stack>
				</Section>
			) }
		</Stack>
	)
}
