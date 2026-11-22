import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { RequirementTypeForm } from "@/domains/Settings/RequirementTypes/Form"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface NewRequirementTypeProps {
	requirement_type: Schema.RequirementTypesFormData
}

const NewRequirementType = ({ requirement_type }: NewRequirementTypeProps) => {
	const { t } = useTranslation()
	const title = t("views.requirement_types.new.title")

	return (
		<Box>
			<SettingsPageHeader
				title={ title }
				description="Add a category for grouping requirements."
			/>
			<RequirementTypeForm
				to={ Routes.settingsRequirementTypes() }
				requirementType={ requirement_type }
			/>
		</Box>
	)
}

export default withLayout(NewRequirementType, "settings")
