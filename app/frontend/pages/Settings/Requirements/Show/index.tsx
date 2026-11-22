import { useTranslation } from "react-i18next"

import { Box, Group } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { RequirementShowDetails } from "@/domains/Settings/Requirements/Show"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface ShowRequirementProps {
	requirement: Schema.RequirementRequirementsShow
}

const ShowRequirement = ({ requirement }: ShowRequirementProps) => {
	const { t } = useTranslation()
	const title = requirement.name || t("views.requirements.show.title")

	return (
		<Box>
			<SettingsPageHeader
				title={ title }
				description={ requirement.scope_label }
				actions={ (
					<Group gap="xs">
						<EditButton href={ Routes.editSettingsRequirement(requirement.id) } label={ title } />
						<DeleteButton href={ Routes.settingsRequirement(requirement.id) } label={ title } />
					</Group>
				) }
			/>
			<RequirementShowDetails requirement={ requirement } />
		</Box>
	)
}

export default withLayout(ShowRequirement, "settings")
