import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { HouseholdTable } from "@/features/Households/Table"
import { Routes } from "@/lib"

interface IHouseholdIndexProps {
	households: Schema.HouseholdsIndex[]
	pagination: Schema.Pagination
}

const HouseholdsIndex = ({ households, pagination }: IHouseholdIndexProps) => {
	return (
		<IndexPageTemplate
			title="Households"
			model="households"
			rows={ households }
			pagination={ pagination }
			deleteRoute={ Routes.households() }
			menuOptions={ [
				{ label: "New Household", href: Routes.newHousehold(), icon: <NewIcon /> },
			] }
		>
			<HouseholdTable />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
