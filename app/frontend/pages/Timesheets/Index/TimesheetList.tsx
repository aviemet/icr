import { ActionIcon, Badge, Group, Paper, Stack, Table, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { EditIcon, ViewIcon } from "@/components/Icons"

interface TimesheetEntry {
	id: string
	periodStart: string
	periodEnd: string
	status: "draft" | "submitted" | "approved" | "rejected"
	totalHours: number
	regularHours: number
	overtimeHours: number
}

const mockData: TimesheetEntry[] = [
	{
		id: "1",
		periodStart: "2024-03-01",
		periodEnd: "2024-03-15",
		status: "approved",
		totalHours: 27.83,
		regularHours: 25.33,
		overtimeHours: 2.50,
	},
	{
		id: "2",
		periodStart: "2024-02-16",
		periodEnd: "2024-02-29",
		status: "submitted",
		totalHours: 35.00,
		regularHours: 32.00,
		overtimeHours: 3.00,
	},
]

function StatusBadge({ status }: { status: TimesheetEntry["status"] }) {
	const { t } = useTranslation()

	const colors: Record<TimesheetEntry["status"], string> = {
		draft: "gray",
		submitted: "yellow",
		approved: "green",
		rejected: "red",
	}

	return (
		<Badge color={ colors[status] }>
			{ t(`views.timesheets.status.${status}`) }
		</Badge>
	)
}

export function TimesheetList() {
	const { t } = useTranslation()

	return (
		<Table>
			<thead>
				<tr>
					<th>{ t("views.timesheets.list.period") }</th>
					<th>{ t("views.timesheets.list.status") }</th>
					<th>{ t("views.timesheets.list.total_hours") }</th>
					<th>{ t("views.timesheets.list.regular_hours") }</th>
					<th>{ t("views.timesheets.list.overtime_hours") }</th>
					<th>{ t("views.timesheets.list.actions") }</th>
				</tr>
			</thead>
			<tbody>
				{ mockData.map((entry) => (
					<tr key={ entry.id }>
						<td>
							<Text size="sm">
								{ new Date(entry.periodStart).toLocaleDateString() } -{ " " }
								{ new Date(entry.periodEnd).toLocaleDateString() }
							</Text>
						</td>
						<td>
							<StatusBadge status={ entry.status } />
						</td>
						<td>
							<Text size="sm">{ entry.totalHours.toFixed(2) }</Text>
						</td>
						<td>
							<Text size="sm">{ entry.regularHours.toFixed(2) }</Text>
						</td>
						<td>
							<Text size="sm">{ entry.overtimeHours.toFixed(2) }</Text>
						</td>
						<td>
							<Group gap="xs">
								<ActionIcon color="blue" variant="subtle">
									<ViewIcon size={ 16 } />
								</ActionIcon>
								<ActionIcon color="blue" variant="subtle">
									<EditIcon size={ 16 } />
								</ActionIcon>
							</Group>
						</td>
					</tr>
				)) }
			</tbody>
		</Table>
	)
}
