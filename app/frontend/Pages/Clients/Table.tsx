import * as React from 'react'
import { Routes } from '@/lib'
import {
	Link,
	Table,
} from '@/Components'
import { EditButton } from '@/Components/Button'

const ClientsTable = ({ clients }: { clients: Schema.Client[] }) => {
	return (
		<Table.TableProvider
			rows={ clients }
			model="client"
		>
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.Cell sort="first_name">First Name</Table.Cell>
						<Table.Cell sort="last_name">Last Name</Table.Cell>
						<Table.Cell className="actions">Actions</Table.Cell>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					<Table.RowIterator render={ (client: Schema.Client) => (
						<Table.Row key={ client.id }>
							<Table.Cell>
								<Link href={ Routes.client(client.id) }>{ client.person.first_name }</Link>
							</Table.Cell>
							<Table.Cell>
								<Link href={ Routes.client(client.id) }>{ client.person.last_name }</Link>
							</Table.Cell>
							<Table.Cell>
								<EditButton href={ Routes.editClient(client.id) } />
							</Table.Cell>
						</Table.Row>
					) } />
				</Table.Body>
			</Table>
		</Table.TableProvider>
	)
}

export default ClientsTable