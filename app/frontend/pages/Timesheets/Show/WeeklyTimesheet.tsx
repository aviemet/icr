import { Paper, Stack, Table, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"

interface WeeklyTimesheetProps {
	weekStart: string
	weekEnd: string
	title: string
}

interface ShiftEntry {
	date: string
	shiftType: "regular" | "overnight"
	startTime: string
	endTime: string
	hours: number
	overtime?: number
	vacation?: number
	sick?: number
}

const mockShifts: ShiftEntry[] = [
	{
		date: "2024-03-01",
		shiftType: "regular",
		startTime: "16:30",
		endTime: "22:00",
		hours: 5.5,
	},
	{
		date: "2024-03-03",
		shiftType: "regular",
		startTime: "16:30",
		endTime: "22:20",
		hours: 5.83,
		overtime: 0.33,
	},
]

export function WeeklyTimesheet({ weekStart, weekEnd, title }: WeeklyTimesheetProps) {
	const { t } = useTranslation()

	return (
		<Paper p="md" radius="sm" withBorder>
			<Stack gap="md">
				<Title order={ 3 }>{ title }</Title>

				<Table>
					<thead>
						<tr>
							<th>{ t("views.timesheets.weekly.date") }</th>
							<th>{ t("views.timesheets.weekly.shift") }</th>
							<th>{ t("views.timesheets.weekly.hours") }</th>
							<th>{ t("views.timesheets.weekly.overtime") }</th>
							<th>{ t("views.timesheets.weekly.vacation") }</th>
							<th>{ t("views.timesheets.weekly.sick") }</th>
						</tr>
					</thead>
					<tbody>
						{ mockShifts.map((shift) => (
							<tr key={ shift.date + shift.startTime }>
								<td>
									<Text size="sm">
										{ new Date(shift.date).toLocaleDateString() }
									</Text>
								</td>
								<td>
									<Text size="sm">
										{ shift.startTime } - { shift.endTime }
									</Text>
								</td>
								<td>
									<Text size="sm">{ shift.hours.toFixed(2) }</Text>
								</td>
								<td>
									<Text size="sm">{ shift.overtime?.toFixed(2) || "-" }</Text>
								</td>
								<td>
									<Text size="sm">{ shift.vacation?.toFixed(2) || "-" }</Text>
								</td>
								<td>
									<Text size="sm">{ shift.sick?.toFixed(2) || "-" }</Text>
								</td>
							</tr>
						)) }
					</tbody>
					<tfoot>
						<tr>
							<td colSpan={ 2 }>
								<Text fw={ 500 }>{ t("views.timesheets.weekly.total") }</Text>
							</td>
							<td>
								<Text fw={ 500 }>
									{ mockShifts.reduce((sum, shift) => sum + shift.hours, 0).toFixed(2) }
								</Text>
							</td>
							<td>
								<Text fw={ 500 }>
									{ mockShifts.reduce((sum, shift) => sum + (shift.overtime || 0), 0).toFixed(2) }
								</Text>
							</td>
							<td>
								<Text fw={ 500 }>
									{ mockShifts.reduce((sum, shift) => sum + (shift.vacation || 0), 0).toFixed(2) }
								</Text>
							</td>
							<td>
								<Text fw={ 500 }>
									{ mockShifts.reduce((sum, shift) => sum + (shift.sick || 0), 0).toFixed(2) }
								</Text>
							</td>
						</tr>
					</tfoot>
				</Table>
			</Stack>
		</Paper>
	)
}
