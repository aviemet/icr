import clsx from "clsx"
import { useTranslation } from "react-i18next"

import { Link, Section, Text, Title } from "@/components"
import { CalendarIcon, ClockIcon, HomeIcon, PeopleIcon } from "@/components/Icons"
import { MetricTile } from "@/features"
import { formatter, Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Board.css"

interface DashboardBoardProps {
	dashboard: Schema.DashboardStats
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

export function DashboardBoard({ dashboard }: DashboardBoardProps) {
	const { t } = useTranslation()
	const { settings, auth: { user } } = usePageProps()
	const hoursLabel = formatter.number.decimal(dashboard.week_tracked_hours, 1)
	const timeTone = dashboard.pending_timesheet_count > 0 ? "alert" : "default"

	return (
		<div className={ classes.viewport }>
			<div className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<div className={ classes.identity }>
						<Title order={ 2 }>
							{ user?.person?.name || settings.company_name }
						</Title>
						<span className={ classes.subtitle }>
							{ t("views.dashboard.command_center", { company: settings.company_name }) }
						</span>
					</div>
				</Section>

				<div className={ classes.tileRow }>
					<MetricTile
						title={ t("views.dashboard.clients.title") }
						icon={ <HomeIcon size={ 16 } /> }
					>
						<div className={ classes.metricValue }>
							{ dashboard.active_client_count }
						</div>
						<Text size="sm" c="dimmed">
							{ t("views.dashboard.clients.active_count", { count: dashboard.active_client_count }) }
						</Text>
						<MetricLine
							label={ t("views.dashboard.clients.inactive_count", { count: dashboard.inactive_client_count }) }
							value={ <CountChip value={ dashboard.inactive_client_count } /> }
						/>
						<div className={ classes.actionGrid }>
							<Link href={ Routes.clients() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.clients.view_all") }</span>
								<span className={ classes.actionHint }>Open client list</span>
							</Link>
							<Link href={ Routes.newClient() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.clients.add_new") }</span>
								<span className={ classes.actionHint }>Create a client</span>
							</Link>
						</div>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.team.title") }
						icon={ <PeopleIcon size={ 16 } /> }
					>
						<div className={ classes.metricValue }>
							{ dashboard.active_team_count }
						</div>
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
						<div className={ classes.actionGrid }>
							<Link href={ Routes.employees() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.team.view_all") }</span>
								<span className={ classes.actionHint }>Open employee list</span>
							</Link>
							<Link href={ Routes.newEmployee() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.team.add_new") }</span>
								<span className={ classes.actionHint }>Start onboarding</span>
							</Link>
						</div>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.time.title") }
						tone={ timeTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<div className={ classes.metricValue }>
							{ hoursLabel }
						</div>
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
						<div className={ classes.actionGrid }>
							<Link href={ Routes.payrollPeriods() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.time.view") }</span>
								<span className={ classes.actionHint }>Payroll periods</span>
							</Link>
						</div>
					</MetricTile>
				</div>

				<div className={ classes.secondaryRow }>
					<MetricTile
						title={ t("views.dashboard.schedule.title") }
						icon={ <CalendarIcon size={ 16 } /> }
					>
						<div className={ classes.list }>
							{ dashboard.upcoming_events.length === 0
								? (
									<Text size="sm" c="dimmed">{ t("views.dashboard.schedule.empty") }</Text>
								)
								: (
									dashboard.upcoming_events.map((event) => (
										<div key={ event.id } className={ classes.listItem }>
											<span>{ event.name }</span>
											<span className={ classes.listMeta }>
												{ formatter.datetime.timeShort(event.starts_at) }
											</span>
										</div>
									))
								) }
						</div>
						<div className={ classes.actionGrid }>
							<Link href={ Routes.payrollPeriods() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.schedule.view") }</span>
								<span className={ classes.actionHint }>Open schedule</span>
							</Link>
							<Link href={ Routes.newTimesheet() } className={ classes.actionTile }>
								<span className={ classes.actionTitle }>{ t("views.dashboard.schedule.add") }</span>
								<span className={ classes.actionHint }>New timesheet entry</span>
							</Link>
						</div>
					</MetricTile>

					<MetricTile
						title={ t("views.dashboard.activity.title") }
						icon={ <PeopleIcon size={ 16 } /> }
					>
						<div className={ classes.list }>
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
											<div key={ `${item.kind}-${item.id}` } className={ classes.listItem }>
												<span>{ text }</span>
											</div>
										)
									})
								) }
						</div>
					</MetricTile>
				</div>
			</div>
		</div>
	)
}
