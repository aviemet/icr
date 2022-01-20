import React from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Table, Link } from 'components'
import { Routes } from 'lib'

const Index = ({ clients }) => {
	return (
		<>
			<Head title="Clients"></Head>
			<div>
				<h1>Clients</h1>
				<Link href={ Routes.new_client_path() } as="button">New Client</Link>
				<Table>
					<Table.Head>
						<Table.Row>
							<Table.Cell>First Name</Table.Cell>
							<Table.Cell>Last Name</Table.Cell>
						</Table.Row>
					</Table.Head>
					<Table.Body>
						{ clients.map(client =>(
							<Table.Row key={ client.id }>
								<Table.Cell>{ client.f_name }</Table.Cell>
								<Table.Cell>{ client.l_name }</Table.Cell>
							</Table.Row>
						)) }
					</Table.Body>
				</Table>
			</div>
		</>
	)
}

export default Index
