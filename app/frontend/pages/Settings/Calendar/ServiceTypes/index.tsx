import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { ServiceTypes } from "@/domains/Settings/Calendar/ServiceTypes"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { withLayout } from "@/lib"

export interface CalendarServiceTypesSettingsProps {
	service_types: Schema.ServiceType[]
}

const CalendarServiceTypesSettings = ({ service_types }: CalendarServiceTypesSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title={ t("views.settings.calendar.service_types_title") }
				description={ t("views.settings.calendar.service_types_description") }
			/>
			<ServiceTypes service_types={ service_types } />
		</Box>
	)
}

export default withLayout(CalendarServiceTypesSettings, "settings")
