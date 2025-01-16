import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import MedicationForm from "../Form"

interface INewMedicationProps {
	medication: Schema.MedicationsFormData
}

const NewMedication = ({ ...data }: INewMedicationProps) => {
	const title = "New Medication"

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<MedicationForm
					to={ Routes.medications() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewMedication
