import { Title, Page, Section } from "@/components"
import HouseholdsForm from "@/features/Households/Form"
import { Routes } from "@/lib"

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
					method="put"
					to={ Routes.household(household.slug) }
					household={ household }
				/>
			</Section>
		</Page>
	)
}

export default EditHousehold
