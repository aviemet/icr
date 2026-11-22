import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { AppearanceSettings } from "@/domains/Settings/User/Appearance"
import { FormBand, FormBandStack } from "@/features"
import { withLayout } from "@/lib"

import { SettingsPageHeader } from "../SettingsPageHeader"

const UserSettings = () => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title={ t("views.settings.user.title") }
				description={ t("views.settings.user.description") }
			/>

			<FormBandStack>
				<FormBand
					title={ t("views.settings.user.appearance_band_title") }
					description={ t("views.settings.user.appearance_band_description") }
				>
					<AppearanceSettings />
				</FormBand>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(UserSettings, "settings")
