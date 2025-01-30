import { Routes } from "@/lib"
import { IndexPageTemplate } from "@/Features"
import { NewIcon } from "@/Components/Icons"
import HouseholdsTable from "@/Features/Households/Table"

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
			<HouseholdsTable />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
