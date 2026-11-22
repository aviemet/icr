import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { Form } from "@/components/Form"
import { NotificationsForm } from "@/domains/Settings/Notifications/Form"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

export interface NotificationsSettingsProps {
	settings: Schema.Setting
}

const NotificationsSettings = ({ settings }: NotificationsSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Form
				action={ Routes.settingsNotifications() }
				method="patch"
				initialData={ { settings } }
			>
				<SettingsPageHeader
					title={ t("views.settings.notifications.title") }
					description={ t("views.settings.notifications.description") }
					actions={ <SettingsSaveButton /> }
				/>

				<FormBandStack>
					<FormBand
						title={ t("views.settings.notifications.email_band_title") }
						description={ t("views.settings.notifications.email_band_description") }
					>
						<NotificationsForm />
					</FormBand>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(NotificationsSettings, "settings")
