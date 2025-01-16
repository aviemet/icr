import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import DoctorsForm from "../Form"

interface EditDoctorProps {
	doctor: Schema.DoctorsEdit
}

const EditDoctor = ({ doctor }: EditDoctorProps) => {
	const title = "Edit Doctor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Doctors", href: Routes.doctors() },
			{ title: Doctor, href: Routes.doctor(doctor.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<DoctorsForm
					method='put'
					to={ Routes.doctor() }
					doctor={ doctor }
				/>
			</Section>
		</Page>
	)
}

export default EditDoctor
