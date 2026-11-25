import { useTranslation } from "react-i18next"

import { HouseholdForm } from "@/domains/Households/Form"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface EditHouseholdProps {
	household: Schema.HouseholdsEdit
}

const EditHousehold = ({ household }: EditHouseholdProps) => {
	const { t } = useTranslation()
	const title = t("views.households.edit.title")

	return (
		<RecordFormPage
			title={ title }
			description={ t("views.households.edit.description") }
			breadcrumbs={ [
				{ title: t("views.households.index.title"), href: Routes.households() },
				{ title: household.name, href: Routes.household(household.slug) },
				{ title: "Edit" },
			] }
		>
			<HouseholdForm
				to={ Routes.household(household.slug) }
				method="put"
				household={ household }
			/>
		</RecordFormPage>
	)
}

export default EditHousehold
