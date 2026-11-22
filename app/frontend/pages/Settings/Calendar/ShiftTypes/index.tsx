import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { ShiftTypes } from "@/domains/Settings/Calendar/ShiftTypes"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { withLayout } from "@/lib"

export interface CalendarShiftTypesSettingsProps {
	shift_types: Schema.Category[]
}

const CalendarShiftTypesSettings = ({ shift_types }: CalendarShiftTypesSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title={ t("views.settings.calendar.shift_types_title") }
				description={ t("views.settings.calendar.shift_types_description") }
			/>
			<ShiftTypes shift_types={ shift_types } />
		</Box>
	)
}

export default withLayout(CalendarShiftTypesSettings, "settings")
