import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const EmployeeInterviewTable = (props: TableProps) => {
	return (
		<Table { ...props}>
			<Table.Head>
				<Table.Row>
					
					<Table.HeadCell sort="scheduled_at">Scheduled_at</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (employee_interview: Schema.EmployeeInterviewsIndex) => (
					<Table.Row key={ employee_interview.id }>
						
						<Table.Cell>
							<Link href={ Routes.employeeInterview(employee_interview.id) }>{ employee_interview.scheduled_at }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.employeeInterview(employee_interview.id) }>{ employee_interview.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editEmployeeInterview(employee_interview.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default EmployeeInterviewTable
