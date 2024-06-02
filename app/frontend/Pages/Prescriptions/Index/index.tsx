import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import PrescriptionsTable from '../Table'

interface PrescriptionIndexProps {
	prescriptions: Schema.PrescriptionsIndex[]
	pagination: Schema.Pagination
}

const PrescriptionsIndex = ({ prescriptions, pagination }: PrescriptionIndexProps) => {
	return (
		<IndexPageTemplate
			title="Prescriptions"
			model="prescriptions"
			rows={ prescriptions }
			pagination={ pagination }
			deleteRoute={ Routes.prescriptions() }
			menuOptions={ [
				{ label: 'New Prescription', href: Routes.newPrescription(), icon: <NewIcon /> },
			] }
		>
			<PrescriptionsTable />
		</IndexPageTemplate>
	)
}

export default PrescriptionsIndex
