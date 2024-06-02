import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import DosageForm from '../Form'

interface NewDosageProps {
	dosage: Schema.DosagesFormData
}

const NewDosage = ({ ...data }: NewDosageProps) => {
	const title = 'New Dosage'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Dosages', href: Routes.dosages() },
			{ title: 'New Dosage' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<DosageForm
					to={ Routes.dosages() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewDosage
