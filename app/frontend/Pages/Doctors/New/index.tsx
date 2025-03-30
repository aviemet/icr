import { Title, Page, Section } from "@/Components"
import DoctorForm from "@/Features/Doctors/Form"
import { Routes } from "@/lib"

interface INewDoctorProps {
	doctor: Schema.DoctorsFormData
}

const NewDoctor = ({ ...data }: INewDoctorProps) => {
	const title = "New Doctor"

	return (
		<Page title={ title }>

			<Section>
				<Title>{ title }</Title>

				<DoctorForm
					to={ Routes.doctors() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewDoctor
