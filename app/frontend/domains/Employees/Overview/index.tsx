import { useTranslation } from "react-i18next"

import { Avatar, Box, Link, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CalendarIcon, CheckIcon, UserGroupIcon, WarningTriangleIcon } from "@/components/Icons"
import { PendingTerminationBanner } from "@/domains/Employees/PendingTermination"
import { type RequirementFulfillmentsPayload } from "@/domains/Employees/Requirements/types"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
	RecordRow,
} from "@/features"
import { initials, Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

import * as classes from "./Overview.css"

interface EmployeeOverviewProps {
	employee: Schema.EmployeesShow
	requirementFulfillments?: RequirementFulfillmentsPayload
}

export function EmployeeOverview({
	employee,
	requirementFulfillments,
}: EmployeeOverviewProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const unmetRequirementsCount = requirementFulfillments?.unmet_count ?? 0
	const alertCount = employee.incomplete_trainings_count
		+ employee.expiring_credentials_count
		+ employee.expiring_clearances_count
		+ unmetRequirementsCount
	const alertTone = alertCount > 0 ? "alert" : "default"

	return (
		<Box className={ classes.board }>
			<PendingTerminationBanner employee={ employee } canCancel={ canUpdate } />

			<Box className={ classes.tileRow }>
				<MetricTile
					title={ t("views.employees.show.overview.assignments") }
					icon={ <UserGroupIcon size={ 16 } /> }
				>
					<Box className={ classes.teamList }>
						{ employee.primary_manager
							? (
								<Box className={ classes.teamRow }>
									<Avatar radius="xl" size={ 32 } color="brand">
										{ initials(employee.primary_manager.person.name) ?? "?" }
									</Avatar>
									<Box className={ classes.teamMeta }>
										<Text size="sm" fw={ 600 }>{ employee.primary_manager.person.name }</Text>
										<span className={ classes.teamRole }>
											{ t("views.employees.show.overview.manager") }
										</span>
									</Box>
								</Box>
							)
							: (
								<Text size="sm" c="dimmed">{ t("views.employees.show.overview.none") }</Text>
							) }
						<MetricLine
							label={ t("views.employees.show.overview.assigned_clients") }
							value={ <CountChip value={ employee.assigned_clients_count } /> }
						/>
					</Box>
				</MetricTile>

				<MetricTile
					title={ t("views.employees.show.overview.alerts") }
					tone={ alertTone }
					icon={ <WarningTriangleIcon size={ 16 } /> }
				>
					<MetricLine
						label={ t("views.employees.show.overview.incomplete_trainings") }
						value={ (
							<CountChip
								value={ employee.incomplete_trainings_count }
								alert={ employee.incomplete_trainings_count > 0 }
							/>
						) }
					/>
					<MetricLine
						label={ t("views.employees.show.overview.unmet_requirements") }
						value={ (
							<CountChip
								value={ unmetRequirementsCount }
								alert={ unmetRequirementsCount > 0 }
							/>
						) }
					/>
					<MetricLine
						label={ t("views.employees.show.overview.expiring_credentials") }
						value={ (
							<CountChip
								value={ employee.expiring_credentials_count }
								alert={ employee.expiring_credentials_count > 0 }
							/>
						) }
					/>
					<MetricLine
						label={ t("views.employees.show.overview.expiring_clearances") }
						value={ (
							<CountChip
								value={ employee.expiring_clearances_count }
								alert={ employee.expiring_clearances_count > 0 }
							/>
						) }
					/>
					<MetricLine
						label={ t("views.employees.show.overview.emergency_contacts") }
						value={ <CountChip value={ employee.emergency_contacts_count } /> }
					/>
				</MetricTile>

				<MetricTile
					title={ t("views.employees.show.overview.quick_links") }
					icon={ <CalendarIcon size={ 16 } /> }
				>
					<BoardActionGrid>
						<BoardActionTile
							href={ `${Routes.employee(employee.slug)}?tab=profile` }
							title={ t("views.employees.show.tabs.profile") }
							hint="Demographics and employment"
						/>
						<BoardActionTile
							href={ `${Routes.employee(employee.slug)}?tab=credentials` }
							title={ t("views.employees.show.tabs.credentials") }
							hint="IDs and clearances"
						/>
						<BoardActionTile
							href={ `${Routes.employee(employee.slug)}?tab=trainings` }
							title={ t("views.employees.show.tabs.trainings") }
							hint="Completion status"
						/>
						<BoardActionTile
							href={ `${Routes.employee(employee.slug)}?tab=requirements` }
							title={ t("views.employees.show.tabs.requirements") }
							hint="Fulfillment status"
						/>
						{ employee.current_pay_period_id && (
							<BoardActionTile
								href={ Routes.periodEmployeeReview(employee.current_pay_period_id, employee.id) }
								title={ t("views.employees.show.overview.payroll_review") }
								hint="Current period"
							/>
						) }
						{ canUpdate && (
							<BoardActionTile
								href={ Routes.statusEmployee(employee.slug) }
								title={ t("views.employees.show.change_status") }
								hint="Employment transitions"
							/>
						) }
						<BoardActionTile
							href={ Routes.scheduleEmployee(employee.slug) }
							title="Schedule"
							hint="Open calendar"
						/>

					</BoardActionGrid>
				</MetricTile>
			</Box>

			{ employee.interviews.length > 0 && (
				<MetricTile
					title={ t("views.employees.show.overview.recent_interviews") }
					icon={ <CheckIcon size={ 16 } /> }
				>
					<Box className={ classes.interviewList }>
						{ employee.interviews.slice(0, 5).map(interview => (
							<RecordRow
								key={ interview.id }
								title={ interview.scheduled_at
									? <DateTimeFormatter>{ interview.scheduled_at }</DateTimeFormatter>
									: "-" }
								actions={ (
									<Link href={ Routes.interview(interview.id) }>
										{ t("views.employees.show.overview.view_interview") }
									</Link>
								) }
							/>
						)) }
					</Box>
				</MetricTile>
			) }
		</Box>
	)
}
