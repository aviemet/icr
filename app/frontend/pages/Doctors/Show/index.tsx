import { Title, Page, Section } from "@/components"
import DoctorForm from "@/features/Doctors/Form"
import { Routes } from "@/lib"

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
