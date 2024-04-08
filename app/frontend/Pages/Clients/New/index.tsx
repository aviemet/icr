import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ClientForm from '../Form'

interface INewClientProps {
	client: Schema.ClientsFormData
}

const NewClient = ({ ...data }: INewClientProps) => {
	const title = 'New Client'

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<ClientForm
					to={ Routes.clients() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewClient
