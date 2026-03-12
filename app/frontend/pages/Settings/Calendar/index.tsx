import { Box, Divider, Grid, Information, Label, Stack, Text } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Select, Switch } from "@/components/Inputs"
import { Routes, withLayout } from "@/lib"

import ShiftTitleFormatInput from "./ShiftTitleFormatInput"

interface CalendarSettingsProps {
	settings: Schema.Setting
}

const splitEventsName = "settings.calendar_split_events_show_original_times"

const CalendarSettings = ({ settings }: CalendarSettingsProps) => {
	return (
		<Box>
			<Form
				action={ Routes.settings() }
				method="patch"
				initialData={ { settings } }
			>
				<Grid>
					<Grid.Col span={ 12 }>
						<Stack gap="xs">
							<Text size="sm" fw={ 500 }>Calendar Event Display Strategies</Text>
							<Text size="sm">
								<strong>Split</strong> — Multi-day events are shown as one block per day. A 3-day event appears as three separate blocks (Mon, Tue, Wed). Best if you want to see each day's slice clearly.
							</Text>
							<Text size="sm">
								<strong>Stack</strong> — Multi-day events within a week appear as a single bar across those days. Single-day events appear as a small label or dot in their start column. Good balance of detail and space.
							</Text>
							<Text size="sm">
								<strong>Span</strong> — Like Stack, but events are only broken at week boundaries. Within a week, each event is one bar across the days it covers; it splits into a new bar only when it continues into the next week.
							</Text>
							<Text size="sm">
								In the Day and Week views, events are always shown in a time grid: each column is a day, time runs from top to bottom, and overlapping events sit side by side. This setting only changes how events are drawn in the Month view.
							</Text>
						</Stack>
					</Grid.Col>

					<Grid.Col span={ { lg: 4, md: 6, xs: 12 } }>
						<Select name="settings.calendar_layout_style" label="Strategy" options={ [
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
						<Divider />
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
