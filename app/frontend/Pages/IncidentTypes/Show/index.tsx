import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IncidentTypeForm from '../Form'

interface NewIncidentTypeProps {
	incident_type: Schema.IncidentTypesFormData
}

const NewIncidentType = ({ ...data }: NewIncidentTypeProps) => {
	const title = 'New Incident Type'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Incident Types', href: Routes.incidentTypes() },
			{ title: 'New Incident Type' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<IncidentTypeForm
					to={ Routes.incidentTypes() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewIncidentType
