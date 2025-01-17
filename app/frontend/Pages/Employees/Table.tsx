import { Routes } from "@/lib"
import { Table, Link, Group } from "@/Components"
import { EditButton, ScheduleButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const EmployeeTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="first_name">First Name</Table.HeadCell>
					<Table.HeadCell sort="last_name">Last Name</Table.HeadCell>
					<Table.HeadCell sort="number">Employee Number</Table.HeadCell>
					<Table.HeadCell>Job Title</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (employee: Schema.EmployeesIndex) => (
					<Table.Row key={ employee.id }>

						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.first_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.last_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee.number }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.employee(employee.slug) }>{ employee?.job_title?.name ?? "" }</Link>
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
