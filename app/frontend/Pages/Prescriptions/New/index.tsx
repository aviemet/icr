import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import PrescriptionForm from '../Form'

interface INewPrescriptionProps {
	prescription: Schema.PrescriptionsFormData
}

const NewPrescription = ({ ...data }: INewPrescriptionProps) => {
	const title = 'New Prescription'

	return (
		<Page title={ title }>

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
