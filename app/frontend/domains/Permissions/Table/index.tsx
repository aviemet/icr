import { Table } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

export function PermissionTable(props: TableProps) {
	return (
		<Table { ...props }>
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
