import { useTranslation } from "react-i18next"
import clsx from "clsx"

import { Avatar, Link, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CalendarIcon, CheckIcon, UserGroupIcon, WarningTriangleIcon } from "@/components/Icons"
import { MetricTile, RecordRow } from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Overview.css"

interface EmployeeOverviewProps {
	employee: Schema.EmployeesShow
}

function MetricLine({ label, value }: { label: string, value: React.ReactNode }) {
	return (
		<div className={ classes.metricLine }>
			<span className={ classes.metricLabel }>{ label }</span>
			<span>{ value }</span>
		</div>
	)
}

function CountChip({ value, alert = false }: { value: number, alert?: boolean }) {
	return (
		<span className={ clsx(classes.chip, alert && classes.chipAlert) }>
			{ value }
		</span>
	)
}

function personInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if(parts.length === 0) return "?"
	if(parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function EmployeeOverview({ employee }: EmployeeOverviewProps) {
	const { t } = useTranslation()
	const alertCount = employee.incomplete_trainings_count
		+ employee.expiring_credentials_count
		+ employee.expiring_clearances_count
	const alertTone = alertCount > 0 ? "alert" : "default"

	return (
		<div className={ classes.board }>
			<div className={ classes.tileRow }>
				<MetricTile
					title={ t("views.employees.show.overview.assignments") }
					icon={ <UserGroupIcon size={ 16 } /> }
				>
					<div className={ classes.teamList }>
						{ employee.primary_manager
							? (
								<div className={ classes.teamRow }>
									<Avatar radius="xl" size={ 32 } color="brand">
										{ personInitials(employee.primary_manager.person.name) }
									</Avatar>
									<div className={ classes.teamMeta }>
										<Text size="sm" fw={ 600 }>{ employee.primary_manager.person.name }</Text>
										<span className={ classes.teamRole }>
											{ t("views.employees.show.overview.manager") }
										</span>
									</div>
								</div>
							)
							: (
								<Text size="sm" c="dimmed">{ t("views.employees.show.overview.none") }</Text>
							) }
						<MetricLine
							label={ t("views.employees.show.overview.assigned_clients") }
							value={ <CountChip value={ employee.assigned_clients_count } /> }
						/>
					</div>
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
					<div className={ classes.actionGrid }>
						<Link href={ `${Routes.employee(employee.slug)}?tab=profile` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.employees.show.tabs.profile") }</span>
							<span className={ classes.actionHint }>Demographics and employment</span>
						</Link>
						<Link href={ `${Routes.employee(employee.slug)}?tab=credentials` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.employees.show.tabs.credentials") }</span>
							<span className={ classes.actionHint }>IDs and clearances</span>
						</Link>
						<Link href={ `${Routes.employee(employee.slug)}?tab=trainings` } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.employees.show.tabs.trainings") }</span>
							<span className={ classes.actionHint }>Completion status</span>
						</Link>
						{ employee.current_pay_period_id && (
							<Link
								href={ Routes.periodEmployeeReview(employee.current_pay_period_id, employee.id) }
								className={ classes.actionTile }
							>
								<span className={ classes.actionTitle }>
									{ t("views.employees.show.overview.payroll_review") }
								</span>
								<span className={ classes.actionHint }>Current period</span>
							</Link>
						) }
						<Link href={ Routes.statusEmployee(employee.slug) } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>{ t("views.employees.show.change_status") }</span>
							<span className={ classes.actionHint }>Employment transitions</span>
						</Link>
						<Link href={ Routes.scheduleEmployee(employee.slug) } className={ classes.actionTile }>
							<span className={ classes.actionTitle }>Schedule</span>
							<span className={ classes.actionHint }>Open calendar</span>
						</Link>
					</div>
				</MetricTile>
			</div>

			{ employee.interviews.length > 0 && (
				<MetricTile
					title={ t("views.employees.show.overview.recent_interviews") }
					icon={ <CheckIcon size={ 16 } /> }
				>
					<div className={ classes.interviewList }>
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
					</div>
				</MetricTile>
			) }
		</div>
	)
}
