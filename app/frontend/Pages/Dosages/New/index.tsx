import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import DosageForm from '../Form'

interface INewDosageProps {
	dosage: Schema.DosagesFormData
}

const NewDosage = ({ ...data }: INewDosageProps) => {
	const title = 'New Dosage'

	return (
		<Page title={ title }>

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
