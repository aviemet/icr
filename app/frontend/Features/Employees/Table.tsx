import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const EmployeeTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="people.first_name">First Name</Table.HeadCell>
					<Table.HeadCell sort="people.last_name">Last Name</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (employee: Schema.EmployeesIndex) => (
					<Table.Row key={ employee.id }>
						<Table.Cell>
							<Link href={ Routes.employee(employee.id) }>{ employee.person.first_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.employee(employee.id) }>{ employee.person.last_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<EditButton href={ Routes.editEmployee(employee.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default EmployeeTable
