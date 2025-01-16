import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import DoctorForm from "../Form"

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
