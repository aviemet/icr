import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import MedicationsForm from "../Form"

interface EditMedicationProps {
	medication: Schema.MedicationsEdit
}

const EditMedication = ({ medication }: EditMedicationProps) => {
	const title = "Edit Medication"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Medications", href: Routes.medications() },
			{ title: Medication, href: Routes.medication(medication.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<MedicationsForm
					method='put'
					to={ Routes.medication() }
					medication={ medication }
				/>
			</Section>
		</Page>
	)
}

export default EditMedication
