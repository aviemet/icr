import { ActionIcon, Badge, Button, Container, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { CheckIcon, CrossIcon } from "@/components/Icons"

import { WeeklyTimesheet } from "./WeeklyTimesheet"

interface TimesheetShowProps {
	employeeName: string
	companionName: string
	payPeriod: {
		startDate: string
		endDate: string
	}
	status: "draft" | "submitted" | "approved" | "rejected"
}

const mockData: TimesheetShowProps = {
	employeeName: "Andrew Cook",
	companionName: "Daryl Hochheiser",
	payPeriod: {
		startDate: "2024-03-01",
		endDate: "2024-03-15",
	},
	status: "submitted",
}

export default function TimesheetShow() {
	const { t } = useTranslation()

	return (
		<Container size="xl">
			<Stack gap="md">
				<Group justify="space-between">
					<Stack gap={ 0 }>
						<Title order={ 2 }>{ t("views.timesheets.show.title") }</Title>
						<Text c="dimmed">
							{ new Date(mockData.payPeriod.startDate).toLocaleDateString() } -{ " " }
							{ new Date(mockData.payPeriod.endDate).toLocaleDateString() }
						</Text>
					</Stack>
					<Group>
						<Button variant="outline" color="red" leftSection={ <CrossIcon size={ 16 } /> }>
							{ t("views.timesheets.show.reject") }
						</Button>
						<Button color="green" leftSection={ <CheckIcon size={ 16 } /> }>
							{ t("views.timesheets.show.approve") }
						</Button>
					</Group>
				</Group>

				<Grid>
					<Grid.Col span={ 6 }>
						<Paper p="md" radius="sm" withBorder>
							<Stack gap="xs">
								<Text size="sm" c="dimmed">
									{ t("views.timesheets.show.employee") }
								</Text>
								<Text size="lg" fw={ 500 }>
									{ mockData.employeeName }
								</Text>
							</Stack>
						</Paper>
					</Grid.Col>
					<Grid.Col span={ 6 }>
						<Paper p="md" radius="sm" withBorder>
							<Stack gap="xs">
								<Text size="sm" c="dimmed">
									{ t("views.timesheets.show.companion") }
								</Text>
								<Text size="lg" fw={ 500 }>
									{ mockData.companionName }
								</Text>
							</Stack>
						</Paper>
					</Grid.Col>
				</Grid>

				<WeeklyTimesheet
					weekStart="2024-03-01"
					weekEnd="2024-03-07"
					title={ t("views.timesheets.show.week_one") }
				/>

				<WeeklyTimesheet
					weekStart="2024-03-08"
					weekEnd="2024-03-14"
					title={ t("views.timesheets.show.week_two") }
				/>
			</Stack>
		</Container>
	)
}
