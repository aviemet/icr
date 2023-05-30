import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ClientsForm from '../Form'

interface IEditClientProps {
	client: Schema.Client
}

const EditClient = ({ client }: IEditClientProps) => {
	const title = 'Edit Client'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Clients', href: Routes.clients() },
			{ title: client.name, href: Routes.client(client.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<ClientsForm
					method='put'
					client={ client }
				/>
			</Section>
		</Page>
	)
}

export default EditClient
