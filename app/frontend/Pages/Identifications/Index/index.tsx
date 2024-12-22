import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import IdentificationsTable from '../Table'

interface IdentificationIndexProps {
	identifications: Schema.IdentificationsIndex[]
	pagination: Schema.Pagination
}

const IdentificationsIndex = ({ identifications, pagination }: IdentificationIndexProps) => {
	return (
		<IndexPageTemplate
			title="Identifications"
			model="identifications"
			rows={ identifications }
			pagination={ pagination }
			deleteRoute={ Routes.identifications() }
			menuOptions={ [
				{ label: 'New Identification', href: Routes.newIdentification(), icon: <NewIcon /> },
			] }
		>
			<IdentificationsTable />
		</IndexPageTemplate>
	)
}

export default IdentificationsIndex
