import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ClientsForm from '../Form'

interface EditClientProps {
	client: Schema.ClientsEdit
}

const EditClient = ({ client }: EditClientProps) => {
	const title = 'Edit Client'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Clients', href: Routes.clients() },
			{ title, href: Routes.client(client.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<ClientsForm
					method='put'
					to={ Routes.client(client.slug) }
					client={ client }
				/>
			</Section>
		</Page>
	)
}

export default EditClient
