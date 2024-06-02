import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import IncidentTypesTable from '../Table'

interface IncidentTypeIndexProps {
	incident_types: Schema.IncidentTypesIndex[]
	pagination: Schema.Pagination
}

const IncidentTypesIndex = ({ incident_types, pagination }: IncidentTypeIndexProps) => {
	return (
		<IndexPageTemplate
			title="IncidentTypes"
			model="incident_types"
			rows={ incident_types }
			pagination={ pagination }
			deleteRoute={ Routes.incidentTypes() }
			menuOptions={ [
				{ label: 'New Incident Type', href: Routes.newIncidentType(), icon: <NewIcon /> },
			] }
		>
			<IncidentTypesTable />
		</IndexPageTemplate>
	)
}

export default IncidentTypesIndex
