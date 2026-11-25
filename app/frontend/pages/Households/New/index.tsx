import { useTranslation } from "react-i18next"

import { HouseholdForm } from "@/domains/Households/Form"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface NewHouseholdProps {
	household: Schema.HouseholdsFormData
}

const NewHousehold = ({ household }: NewHouseholdProps) => {
	const { t } = useTranslation()
	const title = t("views.households.new.title")

	return (
		<RecordFormPage
			title={ title }
			description={ t("views.households.new.description") }
			breadcrumbs={ [
				{ title: t("views.households.index.title"), href: Routes.households() },
				{ title: "New" },
			] }
		>
			<HouseholdForm
				to={ Routes.households() }
				household={ household }
			/>
		</RecordFormPage>
	)
}

export default NewHousehold
