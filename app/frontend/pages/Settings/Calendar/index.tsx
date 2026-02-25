import { Box, Grid, Information, Label } from "@/components"
import { Form, Submit, Switch } from "@/components/Form"
import { Select } from "@/components/Form/Inputs"
import { Routes, withLayout } from "@/lib"

import ShiftTitleFormatInput from "./ShiftTitleFormatInput"

export type CalendarSettingsFormData = {
	settings: Schema.Setting
}

interface CalendarSettingsProps {
	settings: Schema.Setting
}

const splitEventsName = "calendar_split_events_show_original_times"

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
						<Select name="calendar_layout_style" label="Event Display Strategy" options={ [
							{ label: "Split", value: "split" },
							{ label: "Stack", value: "stack" },
							{ label: "Span", value: "span" },
						] } />
					</Grid.Col>

					<Grid.Col span={ { lg: 4, md: 6, xs: 12 } }>
						<Box
							display="flex"
							style={ { alignItems: "center", gap: "0.25rem" } }
						>
							<Label htmlFor={ splitEventsName }>Show the full times for split events</Label>
							<Information position="top">How to display the times in a multi-day event when it's been visually split</Information>
						</Box>
						<Switch
							id={ splitEventsName }
							name={ splitEventsName }
							wrapperProps={ { style: { display: "inline-block" } } }
						/>
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
