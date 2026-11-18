import { NewIcon } from "@/components/Icons"
import { HouseholdTable } from "@/domains/Households/Table"
import { IndexPageTemplate } from "@/features"
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
			actions={ [
				{ label: "New Household", href: Routes.newHousehold(), icon: <NewIcon /> },
			] }
		>
			<HouseholdTable records={ households } model="households" />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
