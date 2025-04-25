import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"
import { Routes } from "@/lib"

const PermissionTable = (props: TableProps) => {
	return (
		<Table { ...props}>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (permission: Schema.PermissionsIndex) => (
					<Table.Row key={ permission.id }>
						<Table.Cell>
							<EditButton href={ Routes.editPermission(permission.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default PermissionTable
