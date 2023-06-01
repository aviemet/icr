import * as React from 'react'
import { Routes } from '@/lib'
import {
	Link,
	Table,
} from '@/Components'
import { EditButton } from '@/Components/Button'

const EmployeesTable = ({ employees }: { employees: Schema.Employee[] }) => {
	return (
		<Table.TableProvider model="employee" rows={ employees }>
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.Cell sort="first_name">First Name</Table.Cell>
						<Table.Cell sort="last_name">Last Name</Table.Cell>
						<Table.Cell className="actions">Actions</Table.Cell>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.RowIterator render={ (employee: Schema.Employee) => (
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
		</Table.TableProvider>
	)
}

export default EmployeesTable