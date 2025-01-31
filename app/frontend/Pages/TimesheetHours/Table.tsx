import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const TimesheetHourTable = (props: TableProps) => {
	return (
		<Table { ...props}>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (timesheet_hour: Schema.TimesheetHoursIndex) => (
					<Table.Row key={ timesheet_hour.id }>
						<Table.Cell>
							<EditButton href={ Routes.editTimesheetHour(timesheet_hour.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default TimesheetHourTable
