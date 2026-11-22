import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { Form, Submit } from "@/components/Form"
import { NotificationsForm } from "@/domains/Settings/Notifications/Form"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../SettingsPageHeader"

export interface NotificationsSettingsProps {
	settings: Schema.Setting
}

const NotificationsSettings = ({ settings }: NotificationsSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title={ t("views.settings.notifications.title") }
				description={ t("views.settings.notifications.description") }
			/>

			<Form
				action={ Routes.settingsNotifications() }
				method="patch"
				initialData={ { settings } }
			>
				<FormBandStack>
					<FormBand
						title={ t("views.settings.notifications.email_band_title") }
						description={ t("views.settings.notifications.email_band_description") }
					>
						<NotificationsForm />
					</FormBand>

					<Submit>{ t("views.settings.notifications.submit") }</Submit>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(NotificationsSettings, "settings")
