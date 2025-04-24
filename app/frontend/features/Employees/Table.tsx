import { Table, Link, Group, DateTimeFormatter } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

const EmployeeTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="people.first_name">First Name</Table.HeadCell>
					<Table.HeadCell sort="people.last_name">Last Name</Table.HeadCell>
					<Table.HeadCell sort="active_at">Hire Date</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>

			<Table.Body>
				<Table.RowIterator render={ (employee: Schema.EmployeesIndex) => (
					<Table.Row key={ employee.id }>
						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.person.first_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.person.last_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<DateTimeFormatter
								format="dateShort"
								tooltipFormats={ [ "fromNow"] }
							>
								{ employee.active_at }
							</DateTimeFormatter>
						</Table.Cell>

						<Table.Cell>
							<Group wrap="nowrap" gap="xs">
								<EditButton href={ Routes.editEmployee(employee.slug) } />
								<ScheduleButton href={ Routes.scheduleEmployee(employee.slug) } />
							</Group>
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default EmployeeTable
