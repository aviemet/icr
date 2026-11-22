import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { RequirementTypeForm } from "@/domains/Settings/RequirementTypes/Form"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface EditRequirementTypeProps {
	requirement_type: Schema.RequirementTypesEdit
}

const EditRequirementType = ({ requirement_type }: EditRequirementTypeProps) => {
	const { t } = useTranslation()
	const title = t("views.requirement_types.edit.title")

	return (
		<Box>
			<SettingsPageHeader
				title={ title }
				description={ requirement_type.name || title }
			/>
			<RequirementTypeForm
				method="put"
				to={ Routes.settingsRequirementType(requirement_type.id) }
				requirementType={ requirement_type }
			/>
		</Box>
	)
}

export default withLayout(EditRequirementType, "settings")
