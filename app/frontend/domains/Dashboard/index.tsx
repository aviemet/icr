import { useTranslation } from "react-i18next"

import { Box, Link, Section, Text, Title } from "@/components"
import { CalendarIcon, ClockIcon, HomeIcon, PeopleIcon } from "@/components/Icons"
import { PendingTerminationsList } from "@/domains/Employees/PendingTermination"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
	MetricValue,
} from "@/features"
import { formatter, Routes } from "@/lib"
import { usePageProps, usePermissions } from "@/lib/hooks"

import * as classes from "./Board.css"

interface DashboardBoardProps {
	dashboard: Schema.DashboardStats
}

export function DashboardBoard({ dashboard }: DashboardBoardProps) {
	const { t } = useTranslation()
	const { settings, auth } = usePageProps()
	const { can } = usePermissions()
	const user = auth.user
	const hoursLabel = formatter.number.decimal(dashboard.week_tracked_hours, 1)
	const timeTone = dashboard.pending_timesheet_count > 0 ? "alert" : "default"
	const scheduleTone = dashboard.open_shift_count > 0 ? "alert" : "default"
	const canViewClients = can("clients", "index")
	const canCreateClients = can("clients", "create")
	const canViewEmployees = can("employees", "index")
	const canCreateEmployees = can("employees", "create")
	const canViewPayroll = can("timesheets", "index")
	const clientsHref = canViewClients ? Routes.clients() : undefined
	const employeesHref = canViewEmployees ? Routes.employees() : undefined
	const applicantsHref = canViewEmployees ? Routes.applicants() : undefined
	const payrollHref = canViewPayroll ? Routes.payrollPeriods() : undefined
	const firstOpenShiftClientSlug = dashboard.open_shifts.find((shift) => shift.client_slug)?.client_slug
	const openShiftHref = firstOpenShiftClientSlug
		? Routes.scheduleClient(firstOpenShiftClientSlug)
		: undefined
	const ownEmployeeHref = auth.own_employee_slug
		? Routes.employee(auth.own_employee_slug)
		: null
	const ownClientHref = auth.own_client_slug
		? Routes.client(auth.own_client_slug)
		: null

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Title order={ 2 }>
							{ user?.person?.name || settings.company_name }
						</Title>
						<span className={ classes.subtitle }>
							{ t("views.dashboard.command_center", { company: settings.company_name }) }
						</span>
					</Box>
				</Section>

				<Box className={ classes.tileRow }>
					<MetricTile
						title={ t("views.dashboard.clients.title") }
						icon={ <HomeIcon size={ 16 } /> }
					>
						<MetricValue
							label={ t("views.dashboard.clients.active_count") }
							href={ clientsHref }
						>
							{ dashboard.active_client_count }
						</MetricValue>
						<MetricLine
							label={ t("views.dashboard.clients.inactive_count") }
							value={ <CountChip value={ dashboard.inactive_client_count } /> }
							href={ clientsHref }
						/>
						<BoardActionGrid>
							{ canViewClients && (
								<BoardActionTile
									href={ Routes.clients() }
									title={ t("views.dashboard.clients.view_all") }
									hint="Open client list"
								/>
							) }
							{ canCreateClients && (
								<BoardActionTile
									href={ Routes.newClient() }
									title={ t("views.dashboard.clients.add_new") }
									hint="Create a client"
								/>
							) }
							{ ownClientHref && (
								<BoardActionTile
									href={ ownClientHref }
									title="My profile"
									hint="Open your client record"
								/>
							) }
						</BoardActionGrid>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.team.title") }
						icon={ <PeopleIcon size={ 16 } /> }
					>
						<MetricValue
							label={ t("views.dashboard.team.member_count") }
							href={ employeesHref }
						>
							{ dashboard.active_team_count }
						</MetricValue>
						<MetricLine
							label={ t("views.dashboard.team.hiring_pipeline") }
							value={ (
								<CountChip
									value={ dashboard.hiring_pipeline_count }
									alert={ dashboard.hiring_pipeline_count > 0 }
								/>
							) }
							href={ applicantsHref }
						/>
						<BoardActionGrid>
							{ canViewEmployees && (
								<BoardActionTile
									href={ Routes.employees() }
									title={ t("views.dashboard.team.view_all") }
									hint="Open employee list"
								/>
							) }
							{ canCreateEmployees && (
								<BoardActionTile
									href={ Routes.newEmployee() }
									title={ t("views.dashboard.team.add_new") }
									hint="Start onboarding"
								/>
							) }
							{ ownEmployeeHref && (
								<BoardActionTile
									href={ ownEmployeeHref }
									title="My profile"
									hint="Open your employee record"
								/>
							) }
						</BoardActionGrid>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.time.title") }
						tone={ timeTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue
							label={ t("views.dashboard.time.total_hours_week") }
							href={ payrollHref }
						>
							{ hoursLabel }
						</MetricValue>
						<MetricLine
							label={ t("views.dashboard.time.pending_timesheets") }
							value={ (
								<CountChip
									value={ dashboard.pending_timesheet_count }
									alert={ dashboard.pending_timesheet_count > 0 }
								/>
							) }
							href={ payrollHref }
						/>
						{ canViewPayroll && (
							<BoardActionGrid>
								<BoardActionTile
									href={ Routes.payrollPeriods() }
									title={ t("views.dashboard.time.view") }
									hint="Payroll periods"
								/>
							</BoardActionGrid>
						) }
					</MetricTile>
				</Box>

				{ dashboard.pending_terminations.length > 0 && (
					<PendingTerminationsList pendingTerminations={ dashboard.pending_terminations } />
				) }

				<Box className={ classes.secondaryRow }>
					<MetricTile
						title={ t("views.dashboard.schedule.title") }
						tone={ scheduleTone }
						icon={ <CalendarIcon size={ 16 } /> }
					>
						{ dashboard.open_shift_count > 0 && (
							<MetricLine
								label={ t("views.dashboard.schedule.open_shifts") }
								value={ (
									<CountChip
										value={ dashboard.open_shift_count }
										alert
									/>
								) }
								href={ openShiftHref }
							/>
						) }
						<Box className={ classes.list }>
							{ dashboard.open_shifts.length > 0
								? (
									dashboard.open_shifts.map((shift) => (
										<Box key={ shift.id } className={ classes.listItem }>
											{ shift.client_slug
												? (
													<Link href={ Routes.scheduleClient(shift.client_slug) }>
														{ shift.client_name }
													</Link>
												)
												: <span>{ shift.client_name }</span> }
											<span className={ classes.listMeta }>
												{ formatter.datetime.timeShort(shift.starts_at) }
											</span>
										</Box>
									))
								)
								: dashboard.upcoming_events.length === 0
									? (
										<Text size="sm" c="dimmed">{ t("views.dashboard.schedule.empty") }</Text>
									)
									: (
										dashboard.upcoming_events.map((event) => (
											<Box key={ event.id } className={ classes.listItem }>
												<span>{ event.name }</span>
												<span className={ classes.listMeta }>
													{ formatter.datetime.timeShort(event.starts_at) }
												</span>
											</Box>
										))
									) }
						</Box>
						{ canViewPayroll && (
							<BoardActionGrid>
								<BoardActionTile
									href={ Routes.payrollPeriods() }
									title={ t("views.dashboard.schedule.view") }
									hint="Open schedule"
								/>
								<BoardActionTile
									href={ Routes.newTimesheet() }
									title={ t("views.dashboard.schedule.add") }
									hint="New timesheet entry"
								/>
							</BoardActionGrid>
						) }
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.activity.title") }
						icon={ <PeopleIcon size={ 16 } /> }
					>
						<Box className={ classes.list }>
							{ dashboard.activity_items.length === 0
								? (
									<Text size="sm" c="dimmed">{ t("views.dashboard.activity.empty") }</Text>
								)
								: (
									dashboard.activity_items.map((item) => {
										const label = item.name || t("views.dashboard.activity.unnamed")
										const text = item.kind === "client"
											? t("views.dashboard.activity.item_client", { name: label })
											: t("views.dashboard.activity.item_employee", { name: label })
										return (
											<Box key={ `${item.kind}-${item.id}` } className={ classes.listItem }>
												<span>{ text }</span>
											</Box>
										)
									})
								) }
						</Box>
					</MetricTile>
				</Box>
			</Box>
		</Box>
	)
}
