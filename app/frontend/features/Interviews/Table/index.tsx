import { Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

export function EmployeeInterviewTable(props: TableProps) {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>

					<Table.HeadCell sort="scheduled_at">Scheduled_at</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (employee_interview: Schema.EmployeeInterviewsIndex) => {
					const id = employee_interview.id as string
					const scheduledAt = String(employee_interview.scheduled_at as string | number | Date)
					const notes = String(employee_interview.notes as string | number | Date)

					return (
						<Table.Row key={ id }>
							<Table.Cell>
								<Link href={ Routes.interview(id) }>{ scheduledAt }</Link>
							</Table.Cell>
							<Table.Cell>
								<Link href={ Routes.interview(id) }>{ notes }</Link>
							</Table.Cell>
							<Table.Cell>
								<EditButton href={ Routes.editInterview(id) } />
							</Table.Cell>
						</Table.Row>
					)
				} }
				/>
			</Table.Body>
		</Table>
	)
}
