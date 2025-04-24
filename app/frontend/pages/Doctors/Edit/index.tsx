import { Title, Page, Section } from "@/components"
import DoctorsForm from "@/features/Doctors/Form"
import { Routes } from "@/lib"

interface EditDoctorProps {
	doctor: Schema.DoctorsEdit
}

const EditDoctor = ({ doctor }: EditDoctorProps) => {
	const title = "Edit Doctor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Doctors", href: Routes.doctors() },
			{ title: title, href: Routes.doctor(doctor.id) },
			{ title },
		] }>
			<Section>
				<Title>{ title }</Title>

				<DoctorsForm
					method="put"
					to={ Routes.doctor(doctor.slug) }
					doctor={ doctor }
				/>
			</Section>
		</Page>
	)
}

export default EditDoctor
