import { useTranslation } from "react-i18next"

import { Box, Section, Title } from "@/components"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Board.css"

export function Chrome() {
	const { t } = useTranslation()
	const { settings, auth } = usePageProps()
	const user = auth.user

	return (
		<Section variant="panel" className={ classes.chrome }>
			<Box className={ classes.identity }>
				<Title order={ 2 }>
					{ user?.person?.name || settings.company_name }
				</Title>
				<span className={ classes.subtitle }>
					{ t("views.dashboard.command_center", { company: settings.company_name }) }
				</span>
			</Box>
		</Section>
	)
}
