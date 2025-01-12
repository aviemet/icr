import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const ShiftTemplateTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="name">Name</Table.HeadCell>
					<Table.HeadCell sort="client">Client</Table.HeadCell>
					<Table.HeadCell sort="created_by">Created_by</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (shift_template: Schema.ShiftTemplatesIndex) => (
					<Table.Row key={ shift_template.id }>
						<Table.Cell>
							<Link href={ Routes.shiftTemplate(shift_template.id) }>{ shift_template.name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.shiftTemplate(shift_template.id) }>{ shift_template.client }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.shiftTemplate(shift_template.id) }>{ shift_template.created_by }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editShiftTemplate(shift_template.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default ShiftTemplateTable
