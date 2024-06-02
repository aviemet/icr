import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import PrescriptionForm from '../Form'

interface NewPrescriptionProps {
	prescription: Schema.PrescriptionsFormData
}

const NewPrescription = ({ ...data }: NewPrescriptionProps) => {
	const title = 'New Prescription'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Prescriptions', href: Routes.prescriptions() },
			{ title: 'New Prescription' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<PrescriptionForm
					to={ Routes.prescriptions() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewPrescription
