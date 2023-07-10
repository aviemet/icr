import React from 'react'
import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type ITableProps } from '@/Components/Table/Table'

const ClientActivityTable = (props: ITableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.Cell sort="title">Title</Table.Cell>
					<Table.Cell sort="notes">Notes</Table.Cell>
					<Table.Cell className="actions">Actions</Table.Cell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (client_activity: Schema.ClientActivitiesIndex) => (
					<Table.Row key={ client_activity.id }>
						<Table.Cell>
							<Link href={ Routes.clientActivity(client_activity.id) }>{ client_activity.title }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.clientActivity(client_activity.id) }>{ client_activity.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editClientActivity(client_activity.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default ClientActivityTable
