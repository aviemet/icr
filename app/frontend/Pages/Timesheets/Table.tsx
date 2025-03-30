import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"
import { Routes } from "@/lib"

const TimesheetTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (timesheet: Schema.TimesheetsIndex) => (
					<Table.Row key={ timesheet.id }>
						<Table.Cell>
							<EditButton href={ Routes.editTimesheet(timesheet.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default TimesheetTable
