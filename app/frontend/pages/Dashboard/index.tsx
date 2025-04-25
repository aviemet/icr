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
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./index.css"

const Dashboard = () => {
	const { t } = useTranslation()
	const { settings, auth: { user } } = usePageProps()

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
									<Text size="xl" fw={ 700 }>{ t("views.dashboard.clients.active_count", { count: 24 }) }</Text>
									<Text color="dimmed">{ t("views.dashboard.clients.pending_count", { count: 3 }) }</Text>
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
									<Text size="xl" fw={ 700 }>{ t("views.dashboard.team.member_count", { count: 12 }) }</Text>
									<Text color="dimmed">{ t("views.dashboard.team.on_leave", { count: 2 }) }</Text>
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
									<Text>{ t("views.dashboard.schedule.events.team_meeting") }</Text>
									<Text>{ t("views.dashboard.schedule.events.client_checkin") }</Text>
									<Text>{ t("views.dashboard.schedule.events.training") }</Text>
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
									<Text>{ t("views.dashboard.activity.updates.new_client") }</Text>
									<Text>{ t("views.dashboard.activity.updates.milestone") }</Text>
									<Text>{ t("views.dashboard.activity.updates.new_employee") }</Text>
									<Text>{ t("views.dashboard.activity.updates.policies") }</Text>
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
									<Text size="xl" fw={ 700 }>{ t("views.dashboard.time.total_hours", { count: 168 }) }</Text>
									<Text color="dimmed">{ t("views.dashboard.time.total_hours_week") }</Text>
									<Text color="blue">{ t("views.dashboard.time.pending_timesheets", { count: 15 }) }</Text>
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

export default Dashboard
