import { useTranslation } from "react-i18next"

import { Box, Button, Link } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { RequirementTypeTable } from "@/domains/Settings/RequirementTypes/Table"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface RequirementTypeIndexProps {
	requirement_types: Schema.RequirementTypesIndex[]
	pagination: Schema.Pagination
}

const RequirementTypesIndex = ({ requirement_types }: RequirementTypeIndexProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title={ t("views.requirement_types.index.title") }
				description="Categories used when defining employee requirements."
				actions={ (
					<Button
						component={ Link }
						href={ Routes.newSettingsRequirementType() }
						leftSection={ <PlusIcon size={ 16 } /> }
					>
						{ t("views.requirement_types.index.new") }
					</Button>
				) }
			/>
			<RequirementTypeTable records={ requirement_types } model="requirement_types" />
		</Box>
	)
}

export default withLayout(RequirementTypesIndex, "settings")
