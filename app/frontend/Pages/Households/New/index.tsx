import { Title, Page, Section } from "@/Components"
import HouseholdForm from "@/Features/Households/Form"
import { Routes } from "@/lib"

interface INewHouseholdProps {
	household: Schema.HouseholdsFormData
}

const NewHousehold = ({ ...data }: INewHouseholdProps) => {
	const title = "New Household"

	return (
		<Page title={ title }>

			<Section>
				<Title>{ title }</Title>

				<HouseholdForm
					to={ Routes.households() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewHousehold
