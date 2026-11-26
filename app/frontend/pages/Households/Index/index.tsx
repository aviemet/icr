import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { HouseholdTable } from "@/domains/Households/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

interface HouseholdIndexProps {
	households: Schema.HouseholdsIndex[]
	pagination: Schema.Pagination
}

const HouseholdsIndex = ({ households, pagination }: HouseholdIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.households.index.title") }
			model="households"
			pagination={ pagination }
			deleteRoute={ Routes.households() }
			dense
			actions={ [
				{
					label: t("views.households.index.new"),
					href: Routes.newHousehold(),
					icon: <NewIcon />,
				},
			] }
		>
			<HouseholdTable records={ households } model="households" />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
