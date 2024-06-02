import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import DosagesForm from '../Form'

interface EditDosageProps {
	dosage: Schema.DosagesEdit
}

const EditDosage = ({ dosage }: EditDosageProps) => {
	const title = 'Edit Dosage'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Dosages', href: Routes.dosages() },
			{ title: Dosage, href: Routes.dosage(dosage.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<DosagesForm
					method='put'
					to={ Routes.dosage() }
					dosage={ dosage }
				/>
			</Section>
		</Page>
	)
}

export default EditDosage
