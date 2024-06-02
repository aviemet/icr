import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IncidentTypesForm from '../Form'

interface EditIncidentTypeProps {
	incident_type: Schema.IncidentTypesEdit
}

const EditIncidentType = ({ incident_type }: EditIncidentTypeProps) => {
	const title = 'Edit Incident Type'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Incident Types', href: Routes.incidentTypes() },
			{ title: IncidentType, href: Routes.incidentType(incident_type.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<IncidentTypesForm
					method='put'
					to={ Routes.incidentType() }
					incident_type={ incident_type }
				/>
			</Section>
		</Page>
	)
}

export default EditIncidentType
