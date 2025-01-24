import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import HouseholdsForm from "@/Features/Households/Form"

interface IEditHouseholdProps {
	household: Schema.HouseholdsEdit
}

const EditHousehold = ({ household }: IEditHouseholdProps) => {
	const title = "Edit Household"

	return (
		<Page title={ title }>
			<Section>
				<Title>{ title }</Title>

				<HouseholdsForm
					method='put'
					to={ Routes.household(household.slug) }
					household={ household }
				/>
			</Section>
		</Page>
	)
}

export default EditHousehold
