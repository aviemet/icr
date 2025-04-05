import { Box, Grid } from "@/Components"
import { Form, Submit, Switch } from "@/Components/Form"
import { Select } from "@/Components/Form/Inputs"
import { Routes, withLayout } from "@/lib"

import ShiftTitleFormatInput from "./ShiftTitleFormatInput"

export type CalendarSettingsFormData = {
	settings: Schema.Setting
}

interface CalendarSettingsProps {
	settings: Schema.Setting
}

const CalendarSettings = ({ settings }: CalendarSettingsProps) => {
	return (
		<Box>
			<Form<CalendarSettingsFormData>
				to={ Routes.settings() }
				model="settings"
				method="patch"
				data={ { settings } }
				remember={ false }
			>
				<Grid>
					<Grid.Col span={ { lg: 4, md: 6, xs: 12 } }>
						<Select name="calendar_layout_style" options={ [
							{ label: "Split", value: "split" },
							{ label: "Stack", value: "stack" },
							{ label: "Span", value: "span" },
						] } />
					</Grid.Col>

					<Grid.Col span={ { lg: 4, md: 6, xs: 12 } }>
						<Switch name="calendar_split_events_show_original_times" label="Show the full times for split events" />
					</Grid.Col>

					<Grid.Col>
						<ShiftTitleFormatInput settings={ settings } />
					</Grid.Col>

					<Grid.Col>
						<Submit>Update Settings</Submit>
					</Grid.Col>
				</Grid>
			</Form>
		</Box>
	)
}

export default withLayout(CalendarSettings, "settings")
