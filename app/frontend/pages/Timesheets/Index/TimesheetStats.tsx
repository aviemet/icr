import { useTranslation } from "react-i18next"

import { Grid, Group, Paper, RingProgress, Stack, Text } from "@/components"

interface StatCardProps {
	title: string
	value: string | number
	subtitle?: string
	progress?: number
}

function StatCard({ title, value, subtitle, progress }: StatCardProps) {
	return (
		<Paper p="md" radius="sm" withBorder>
			<Group justify="space-between" align="flex-start">
				<Stack gap={ 0 }>
					<Text size="xs" color="dimmed" tt="uppercase">
						{ title }
					</Text>
					<Text size="xl" fw={ 700 }>
						{ value }
					</Text>
					{ subtitle && (
						<Text size="xs" color="dimmed">
							{ subtitle }
						</Text>
					) }
				</Stack>
				{ progress !== undefined && (
					<RingProgress
						size={ 80 }
						roundCaps
						thickness={ 8 }
						sections={ [{ value: progress, color: "blue" }] }
						label={
							<Text color="blue" fw={ 700 } ta="center" size="xs">
								{ progress }%
							</Text>
						}
					/>
				) }
			</Group>
		</Paper>
	)
}

export function TimesheetStats() {
	const { t } = useTranslation()

	return (
		<Grid>
			<Grid.Col span={ 3 }>
				<StatCard
					title={ t("views.timesheets.stats.total_hours") }
					value="27.83"
					subtitle={ t("views.timesheets.stats.this_period") }
				/>
			</Grid.Col>
			<Grid.Col span={ 3 }>
				<StatCard
					title={ t("views.timesheets.stats.regular_hours") }
					value="25.33"
					progress={ 91 }
				/>
			</Grid.Col>
			<Grid.Col span={ 3 }>
				<StatCard
					title={ t("views.timesheets.stats.overtime_hours") }
					value="2.50"
					progress={ 9 }
				/>
			</Grid.Col>
			<Grid.Col span={ 3 }>
				<StatCard
					title={ t("views.timesheets.stats.remaining_shifts") }
					value="3"
					subtitle={ t("views.timesheets.stats.this_week") }
				/>
			</Grid.Col>
		</Grid>
	)
}
