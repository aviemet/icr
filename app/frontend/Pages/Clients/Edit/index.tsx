import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ClientsForm from '../Form'

interface IEditClientProps {
	client: Schema.ClientsEdit
}

const EditClient = ({ client }: IEditClientProps) => {
	const title = 'Edit Client'

	return (
		<Page title={ title }>
			<Section>
				<Heading>{ title }</Heading>
				
				<ClientsForm
					method='put'
					to={ Routes.client() }
					client={ client }
				/>
			</Section>
		</Page>
	)
}

export default EditClient
