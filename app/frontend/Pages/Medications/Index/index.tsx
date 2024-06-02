import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import MedicationsTable from '../Table'

interface MedicationIndexProps {
	medications: Schema.MedicationsIndex[]
	pagination: Schema.Pagination
}

const MedicationsIndex = ({ medications, pagination }: MedicationIndexProps) => {
	return (
		<IndexPageTemplate
			title="Medications"
			model="medications"
			rows={ medications }
			pagination={ pagination }
			deleteRoute={ Routes.medications() }
			menuOptions={ [
				{ label: 'New Medication', href: Routes.newMedication(), icon: <NewIcon /> },
			] }
		>
			<MedicationsTable />
		</IndexPageTemplate>
	)
}

export default MedicationsIndex
