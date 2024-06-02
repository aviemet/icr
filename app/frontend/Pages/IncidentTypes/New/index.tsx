import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IncidentTypeForm from '../Form'

interface INewIncidentTypeProps {
	incident_type: Schema.IncidentTypesFormData
}

const NewIncidentType = ({ ...data }: INewIncidentTypeProps) => {
	const title = 'New Incident Type'

	return (
		<Page title={ title }>

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
