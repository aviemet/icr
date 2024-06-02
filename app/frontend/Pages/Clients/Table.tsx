import React from 'react'
import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const ClientTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					
					<Table.HeadCell sort="active_at">Active_at</Table.HeadCell>
					<Table.HeadCell sort="inactive_at">Inactive_at</Table.HeadCell>
					<Table.HeadCell sort="number">Number</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (client: Schema.ClientsIndex) => (
					<Table.Row key={ client.id }>
						
						<Table.Cell>
							<Link href={ Routes.client(client.id) }>{ client.active_at }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.client(client.id) }>{ client.inactive_at }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.client(client.id) }>{ client.number }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editClient(client.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default ClientTable
