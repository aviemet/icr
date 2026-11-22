import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { RequirementForm } from "@/domains/Settings/Requirements/Form"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

type NamedOption = {
	id: string
	name?: string | null
}

interface EditRequirementProps {
	requirement: Schema.RequirementRequirementsEdit
	requirement_type_options?: Schema.RequirementTypesOptions[]
	job_title_options?: Schema.EmployeeJobTitlesOptions[]
	client_options?: NamedOption[]
	training_options?: Schema.EmployeeTrainingsOptions[]
	credential_type_options?: NamedOption[]
}

const EditRequirement = ({
	requirement,
	requirement_type_options = [],
	job_title_options = [],
	client_options = [],
	training_options = [],
	credential_type_options = [],
}: EditRequirementProps) => {
	const { t } = useTranslation()
	const title = t("views.requirements.edit.title")

	return (
		<Box>
			<SettingsPageHeader
				title={ title }
				description={ requirement.name || title }
			/>
			<RequirementForm
				method="put"
				to={ Routes.settingsRequirement(requirement.id) }
				requirement={ requirement }
				requirementTypeOptions={ requirement_type_options }
				jobTitleOptions={ job_title_options }
				clientOptions={ client_options }
				trainingOptions={ training_options }
				credentialTypeOptions={ credential_type_options }
			/>
		</Box>
	)
}

export default withLayout(EditRequirement, "settings")
