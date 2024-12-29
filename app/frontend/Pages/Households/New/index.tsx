import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import HouseholdForm from '../Form'

interface INewHouseholdProps {
	household: Schema.HouseholdsFormData
}

const NewHousehold = ({ ...data }: INewHouseholdProps) => {
	const title = 'New Household'

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<HouseholdForm
					to={ Routes.households() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewHousehold
