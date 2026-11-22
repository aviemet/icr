import { useTranslation } from "react-i18next"

import { Box, Group, Text } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface ShowRequirementTypeProps {
	requirement_type: Schema.RequirementTypesShow
}

const ShowRequirementType = ({ requirement_type }: ShowRequirementTypeProps) => {
	const { t } = useTranslation()
	const title = requirement_type.name || t("views.requirement_types.show.title")

	return (
		<Box>
			<SettingsPageHeader
				title={ title }
				description={ t("views.requirement_types.show.title") }
				actions={ (
					<Group gap="xs">
						<EditButton href={ Routes.editSettingsRequirementType(requirement_type.id) } label={ title } />
						<DeleteButton href={ Routes.settingsRequirementType(requirement_type.id) } label={ title } />
					</Group>
				) }
			/>
			<FormBandStack>
				<FormBand title={ t("views.requirement_types.show.title") }>
					<Text size="sm">
						{ t("views.requirement_types.show.description") }: { requirement_type.description || "-" }
					</Text>
				</FormBand>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(ShowRequirementType, "settings")
