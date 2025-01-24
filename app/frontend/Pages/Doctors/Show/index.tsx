import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import DoctorForm from "@/Features/Doctors/Form"

interface NewDoctorProps {
	doctor: Schema.DoctorsFormData
}

const NewDoctor = ({ ...data }: NewDoctorProps) => {
	const title = "New Doctor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Doctors", href: Routes.doctors() },
			{ title: "New Doctor" },
		] }>

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
