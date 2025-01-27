import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import DoctorForm from '../Form'

interface INewDoctorProps {
	doctor: Schema.DoctorsFormData
}

const NewDoctor = ({ ...data }: INewDoctorProps) => {
	const title = 'New Doctor'

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<DoctorForm
					to={ Routes.doctors() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewDoctor
