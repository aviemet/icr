import { Box } from "@/components"
import { ShiftTypes } from "@/domains/Settings/Calendar/ShiftTypes"
import { withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

export interface CalendarShiftTypesSettingsProps {
	shift_types: Schema.Category[]
}

const CalendarShiftTypesSettings = ({ shift_types }: CalendarShiftTypesSettingsProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="Shift Types"
				description="Categories for shifts used in scheduling and overtime exemption rules."
			/>
			<ShiftTypes shift_types={ shift_types } />
		</Box>
	)
}

export default withLayout(CalendarShiftTypesSettings, "settings")
