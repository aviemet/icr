import cx from "clsx"

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
	const { settings, auth: { user } } = usePageProps()

	return (
		<Section>
			<Stack gap="xl">
				<Group justify="space-between" align="flex-end">
					<div>
						<Title order={ 1 }>Welcome back, { user?.person?.name }</Title>
						<Text size="lg" color="dimmed">{ settings.company_name } Command Center</Text>
					</div>
					<Group>
						<Button
							component={ Link }
							href={ Routes.newClient() }
							variant="filled"
							leftSection={ <PlusIcon /> }
						>
							New Client
						</Button>
						<Button
							component={ Link }
							href={ Routes.newEmployee() }
							variant="filled"
							leftSection={ <PlusIcon /> }
						>
							New Employee
						</Button>
					</Group>
				</Group>

				<Grid>
					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<HomeIcon size={ 24 } />
									<Title order={ 3 }>Clients Overview</Title>
								</Group>
							</Card.Section>
							<Stack gap="md" p="md">
								<div>
									<Text size="xl" fw={ 700 }>24 Active Clients</Text>
									<Text color="dimmed">3 pending proposals</Text>
								</div>
								<Group>
									<Link href={ Routes.clients() }>View All Clients</Link>
									<Link href={ Routes.newClient() }>Add New Client</Link>
								</Group>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<PeopleIcon size={ 24 } />
									<Title order={ 3 }>Team Overview</Title>
								</Group>
							</Card.Section>
							<Stack gap="md" p="md">
								<Box>
									<Text size="xl" fw={ 700 }>12 Team Members</Text>
									<Text color="dimmed">2 on leave</Text>
								</Box>
								<Group>
									<Link href={ Routes.employees() }>View All Employees</Link>
									<Link href={ Routes.newEmployee() }>Add New Employee</Link>
								</Group>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<CalendarIcon size={ 24 } />
									<Title order={ 3 }>Today's Schedule</Title>
								</Group>
							</Card.Section>
							<Stack gap="xs" p="md">
								<Text size="lg" fw={ 600 }>Upcoming Appointments</Text>
								<Stack gap="xs">
									<Text>9:00 AM - Team Meeting</Text>
									<Text>11:30 AM - Client Check-in</Text>
									<Text>2:00 PM - Employee Training</Text>
								</Stack>
								<Group mt="md">
									<Link href={ Routes.timesheets() }>View Schedule</Link>
									<Link href={ Routes.newTimesheet() }>Add Event</Link>
								</Group>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<PeopleIcon size={ 24 } />
									<Title order={ 3 }>Recent Activity</Title>
								</Group>
							</Card.Section>
							<Stack gap="xs" p="md">
								<Text size="lg" fw={ 600 }>Latest Updates</Text>
								<Stack gap="xs">
									<Text>New client onboarded - Acme Corp</Text>
									<Text>Project milestone completed - Tech Solutions</Text>
									<Text>New employee joined - Sarah Smith</Text>
									<Text>Updated company policies</Text>
								</Stack>
							</Stack>
						</Card>
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<Card className={ cx(classes.card) }>
							<Card.Section p="md">
								<Group>
									<ClockIcon size={ 24 } />
									<Title order={ 3 }>Time Tracking</Title>
								</Group>
							</Card.Section>
							<Stack gap="md" p="md">
								<div>
									<Text size="xl" fw={ 700 }>168 Hours</Text>
									<Text color="dimmed">Total hours tracked this week</Text>
									<Text color="blue">15 timesheets pending approval</Text>
								</div>
								<Link href={ Routes.timesheets() }>View Timesheets</Link>
							</Stack>
						</Card>
					</Grid.Col>
				</Grid>
			</Stack>
		</Section>
	)
}

export default Dashboard
