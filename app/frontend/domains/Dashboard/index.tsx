import { useTranslation } from "react-i18next"

import { Box, Section, Text, Title } from "@/components"
import { CalendarIcon, ClockIcon, HomeIcon, PeopleIcon } from "@/components/Icons"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
	MetricValue,
} from "@/features"
import { formatter, Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Board.css"

interface DashboardBoardProps {
	dashboard: Schema.DashboardStats
}

export function DashboardBoard({ dashboard }: DashboardBoardProps) {
	const { t } = useTranslation()
	const { settings, auth: { user } } = usePageProps()
	const hoursLabel = formatter.number.decimal(dashboard.week_tracked_hours, 1)
	const timeTone = dashboard.pending_timesheet_count > 0 ? "alert" : "default"

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
						<MetricValue>{ dashboard.active_client_count }</MetricValue>
						<Text size="sm" c="dimmed">
							{ t("views.dashboard.clients.active_count", { count: dashboard.active_client_count }) }
						</Text>
						<MetricLine
							label={ t("views.dashboard.clients.inactive_count", { count: dashboard.inactive_client_count }) }
							value={ <CountChip value={ dashboard.inactive_client_count } /> }
						/>
						<BoardActionGrid>
							<BoardActionTile
								href={ Routes.clients() }
								title={ t("views.dashboard.clients.view_all") }
								hint="Open client list"
							/>
							<BoardActionTile
								href={ Routes.newClient() }
								title={ t("views.dashboard.clients.add_new") }
								hint="Create a client"
							/>
						</BoardActionGrid>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.team.title") }
						icon={ <PeopleIcon size={ 16 } /> }
					>
						<MetricValue>{ dashboard.active_team_count }</MetricValue>
						<Text size="sm" c="dimmed">
							{ t("views.dashboard.team.member_count", { count: dashboard.active_team_count }) }
						</Text>
						<MetricLine
							label={ t("views.dashboard.team.hiring_pipeline", { count: dashboard.hiring_pipeline_count }) }
							value={ (
								<CountChip
									value={ dashboard.hiring_pipeline_count }
									alert={ dashboard.hiring_pipeline_count > 0 }
								/>
							) }
						/>
						<BoardActionGrid>
							<BoardActionTile
								href={ Routes.employees() }
								title={ t("views.dashboard.team.view_all") }
								hint="Open employee list"
							/>
							<BoardActionTile
								href={ Routes.newEmployee() }
								title={ t("views.dashboard.team.add_new") }
								hint="Start onboarding"
							/>
						</BoardActionGrid>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.time.title") }
						tone={ timeTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>{ hoursLabel }</MetricValue>
						<Text size="sm" c="dimmed">{ t("views.dashboard.time.total_hours_week") }</Text>
						<MetricLine
							label={ t("views.dashboard.time.pending_timesheets", { count: dashboard.pending_timesheet_count }) }
							value={ (
								<CountChip
									value={ dashboard.pending_timesheet_count }
									alert={ dashboard.pending_timesheet_count > 0 }
								/>
							) }
						/>
						<BoardActionGrid>
							<BoardActionTile
								href={ Routes.payrollPeriods() }
								title={ t("views.dashboard.time.view") }
								hint="Payroll periods"
							/>
						</BoardActionGrid>
					</MetricTile>
				</Box>

				<Box className={ classes.secondaryRow }>
					<MetricTile
						title={ t("views.dashboard.schedule.title") }
						icon={ <CalendarIcon size={ 16 } /> }
					>
						<Box className={ classes.list }>
							{ dashboard.upcoming_events.length === 0
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
