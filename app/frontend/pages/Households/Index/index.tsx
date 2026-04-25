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
			pagination={ pagination }
			deleteRoute={ Routes.households() }
			menuOptions={ [
				{ label: "New Household", href: Routes.newHousehold(), icon: <NewIcon /> },
			] }
		>
			<HouseholdTable records={ households } pagination={ pagination } model="households" />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
