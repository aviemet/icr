import { useTranslation } from "react-i18next"

import { Box, Button, Group, Link } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { RequirementTable } from "@/domains/Settings/Requirements/Table"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface RequirementIndexProps {
	requirements: Schema.RequirementRequirementsIndex[]
	pagination: Schema.Pagination
}

const RequirementsIndex = ({ requirements }: RequirementIndexProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title={ t("views.requirements.index.title") }
				description="Define training requirements by company or job title."
				actions={ (
					<Group gap="xs">
						<Button
							component={ Link }
							href={ Routes.settingsRequirementTypes() }
							variant="light"
						>
							{ t("views.requirements.index.types") }
						</Button>
						<Button
							component={ Link }
							href={ Routes.newSettingsRequirement() }
							leftSection={ <PlusIcon size={ 16 } /> }
						>
							{ t("views.requirements.index.new") }
						</Button>
					</Group>
				) }
			/>
			<RequirementTable records={ requirements } model="requirements" />
		</Box>
	)
}

export default withLayout(RequirementsIndex, "settings")
