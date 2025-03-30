import { NewIcon } from "@/Components/Icons"
import { IndexPageTemplate } from "@/Features"
import HouseholdsTable from "@/Features/Households/Table"
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
			<HouseholdsTable />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
