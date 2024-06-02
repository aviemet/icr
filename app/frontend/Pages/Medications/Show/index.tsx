import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import MedicationForm from '../Form'

interface NewMedicationProps {
	medication: Schema.MedicationsFormData
}

const NewMedication = ({ ...data }: NewMedicationProps) => {
	const title = 'New Medication'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Medications', href: Routes.medications() },
			{ title: 'New Medication' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<MedicationForm
					to={ Routes.medications() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewMedication
