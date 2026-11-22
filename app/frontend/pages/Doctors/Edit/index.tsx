import { Title, Page, Section } from "@/components"
import { DoctorForm } from "@/domains/Doctors/Form"
import { Routes } from "@/lib"

interface EditDoctorProps {
	doctor: Schema.DoctorsEdit
}

const EditDoctor = ({ doctor }: EditDoctorProps) => {
	const title = "Edit Doctor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Doctors", href: Routes.doctors() },
			{ title: doctor.person?.name || doctor.name, href: Routes.doctor(doctor.slug) },
			{ title },
		] }>

			<Section>
				<Title>{ title }</Title>

				<DoctorForm
					method="put"
					to={ Routes.doctor(doctor.slug) }
					doctor={ doctor }
				/>
			</Section>
		</Page>
	)
}

export default EditDoctor
