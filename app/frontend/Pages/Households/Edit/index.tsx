import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import HouseholdsForm from "../Form"

interface IEditHouseholdProps {
	household: Schema.HouseholdsEdit
}

const EditHousehold = ({ household }: IEditHouseholdProps) => {
	const title = "Edit Household"

	return (
		<Page title={ title }>
			<Section>
				<Heading>{ title }</Heading>

				<HouseholdsForm
					method='put'
					to={ Routes.household() }
					household={ household }
				/>
			</Section>
		</Page>
	)
}

export default EditHousehold
