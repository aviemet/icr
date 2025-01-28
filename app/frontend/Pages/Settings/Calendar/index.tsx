import { Box, Button, Grid } from "@/Components"
import { Form, Submit, TextInput } from "@/Components/Form"
import { Routes, withLayout } from "@/lib"
import ShiftTypes from "./ShiftTypes"

export type CalendarSettingsFormData = {
	setting: Schema.Setting
}

interface CalendarSettingsProps {
	settings: Schema.Setting
	shift_types: Schema.Category[]
}

const CalendarSettings = ({ settings, shift_types }: CalendarSettingsProps) => {


	return (
		<Form<CalendarSettingsFormData>
			to={ Routes.settings() }
			model="setting"
			method="patch"
			data={ { setting: settings } }
			remember={ false }
		>
			<Grid>
				<Grid.Col>
					<TextInput
						label="Overtime Hours"
						name="overtime_hours"
					/>
				</Grid.Col>

				<Grid.Col>
					<ShiftTypes shift_types={ shift_types } />
				</Grid.Col>

				<Grid.Col>
					<Submit>Update Settings</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default withLayout(CalendarSettings, "settings")
