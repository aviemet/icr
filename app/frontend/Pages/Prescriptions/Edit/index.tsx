import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import PrescriptionsForm from '../Form'

interface EditPrescriptionProps {
	prescription: Schema.PrescriptionsEdit
}

const EditPrescription = ({ prescription }: EditPrescriptionProps) => {
	const title = 'Edit Prescription'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Prescriptions', href: Routes.prescriptions() },
			{ title: Prescription, href: Routes.prescription(prescription.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<PrescriptionsForm
					method='put'
					to={ Routes.prescription() }
					prescription={ prescription }
				/>
			</Section>
		</Page>
	)
}

export default EditPrescription
