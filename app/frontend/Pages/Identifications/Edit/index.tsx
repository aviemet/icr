import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IdentificationsForm from '../Form'

interface EditIdentificationProps {
	identification: Schema.IdentificationsEdit
}

const EditIdentification = ({ identification }: EditIdentificationProps) => {
	const title = 'Edit Identification'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Identifications', href: Routes.identifications() },
			{ title: Identification, href: Routes.identification(identification.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<IdentificationsForm
					method='put'
					to={ Routes.identification() }
					identification={ identification }
				/>
			</Section>
		</Page>
	)
}

export default EditIdentification
