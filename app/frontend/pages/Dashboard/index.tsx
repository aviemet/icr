import cx from "clsx"
import { useTranslation } from "react-i18next"

import { Box, Button, Card, Grid, Group, Link, Section, Stack, Text, Title } from "@/components"
import {
	PlusIcon,
	HomeIcon,
	PeopleIcon,
	CalendarIcon,
	ClockIcon,
} from "@/components/Icons"
import { formatter, Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./index.css"

interface DashboardPageProps {
	dashboard: Schema.DashboardStats
}

export default function Dashboard({ dashboard }: DashboardPageProps) {
	const { t } = useTranslation()
	const { settings, auth: { user } } = usePageProps()
	const hoursLabel = formatter.number.decimal(dashboard.week_tracked_hours, 1)

	return (
		<Section>
			<Stack gap="xl">
				<Group justify="space-between" align="flex-end">
					<div>
						<Title order={ 1 }>{ t("views.dashboard.welcome", { name: user?.person?.name ?? "" }) }</Title>
						<Text size="lg" c="dimmed">{ t("views.dashboard.command_center", { company: settings.company_name }) }</Text>
					</div>
					<Group>
						<Button
							component={ Link }
							href={ Routes.newClient() }
							variant="filled"
							leftSection={ <PlusIcon /> }
						>
							{ t("views.dashboard.actions.new_client") }
						</Button>
						<Button
							component={ Link }
							href={ Routes.newEmployee() }
							variant="filled"
							leftSection={ <PlusIcon /> }
						>
							{ t("views.dashboard.actions.new_employee") }
						</Button>
					</Group>
				</Group>

				<Grid>
					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<HomeIcon size={ 24 } />
									<Title order={ 3 }>{ t("views.dashboard.clients.title") }</Title>
								</Group>
							</Card.Section>
							<Stack gap="md" p="md">
								<div>
									<Text size="xl" fw={ 700 }>{ t("views.dashboard.clients.active_count", { count: dashboard.active_client_count }) }</Text>
									<Text color="dimmed">{ t("views.dashboard.clients.inactive_count", { count: dashboard.inactive_client_count }) }</Text>
								</div>
								<Group>
									<Link href={ Routes.clients() }>{ t("views.dashboard.clients.view_all") }</Link>
									<Link href={ Routes.newClient() }>{ t("views.dashboard.clients.add_new") }</Link>
								</Group>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<PeopleIcon size={ 24 } />
									<Title order={ 3 }>{ t("views.dashboard.team.title") }</Title>
								</Group>
							</Card.Section>
							<Stack gap="md" p="md">
								<Box>
									<Text size="xl" fw={ 700 }>{ t("views.dashboard.team.member_count", { count: dashboard.active_team_count }) }</Text>
									<Text color="dimmed">{ t("views.dashboard.team.hiring_pipeline", { count: dashboard.hiring_pipeline_count }) }</Text>
								</Box>
								<Group>
									<Link href={ Routes.employees() }>{ t("views.dashboard.team.view_all") }</Link>
									<Link href={ Routes.newEmployee() }>{ t("views.dashboard.team.add_new") }</Link>
								</Group>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<CalendarIcon size={ 24 } />
									<Title order={ 3 }>{ t("views.dashboard.schedule.title") }</Title>
								</Group>
							</Card.Section>
							<Stack gap="xs" p="md">
								<Text size="lg" fw={ 600 }>{ t("views.dashboard.schedule.upcoming") }</Text>
								<Stack gap="xs">
									{ dashboard.upcoming_events.length === 0
										? (
											<Text c="dimmed">{ t("views.dashboard.schedule.empty") }</Text>
										)
										: (
											dashboard.upcoming_events.map((event) => (
												<Text key={ event.id }>
													{ formatter.datetime.timeShort(event.starts_at) }
													{ " - " }
													{ event.name }
												</Text>
											))
										) }
								</Stack>
								<Group mt="md">
									<Link href={ Routes.timesheets() }>{ t("views.dashboard.schedule.view") }</Link>
									<Link href={ Routes.newTimesheet() }>{ t("views.dashboard.schedule.add") }</Link>
								</Group>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<PeopleIcon size={ 24 } />
									<Title order={ 3 }>{ t("views.dashboard.activity.title") }</Title>
								</Group>
							</Card.Section>
							<Stack gap="xs" p="md">
								<Text size="lg" fw={ 600 }>{ t("views.dashboard.activity.latest") }</Text>
								<Stack gap="xs">
									{ dashboard.activity_items.length === 0
										? (
											<Text c="dimmed">{ t("views.dashboard.activity.empty") }</Text>
										)
										: (
											dashboard.activity_items.map((item) => {
												const label = item.name || t("views.dashboard.activity.unnamed")
												const text = item.kind === "client"
													? t("views.dashboard.activity.item_client", { name: label })
													: t("views.dashboard.activity.item_employee", { name: label })
												return <Text key={ `${item.kind}-${item.id}` }>{ text }</Text>
											})
										) }
								</Stack>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<ClockIcon size={ 24 } />
									<Title order={ 3 }>{ t("views.dashboard.time.title") }</Title>
								</Group>
							</Card.Section>
							<Stack gap="md" p="md">
								<div>
									<Text size="xl" fw={ 700 }>{ t("views.dashboard.time.total_hours", { hours: hoursLabel }) }</Text>
									<Text color="dimmed">{ t("views.dashboard.time.total_hours_week") }</Text>
									<Text color="blue">{ t("views.dashboard.time.pending_timesheets", { count: dashboard.pending_timesheet_count }) }</Text>
								</div>
								<Link href={ Routes.timesheets() }>{ t("views.dashboard.time.view") }</Link>
							</Stack>
						</Card>
					</Grid.Col>
				</Grid>
			</Stack>
		</Section>
	)
}
