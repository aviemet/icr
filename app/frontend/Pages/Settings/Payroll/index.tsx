import { Grid } from "@/Components"
import { Form, Submit } from "@/Components/Form"
import { Routes, withLayout } from "@/lib"
import Overtime from "./FormInputs/Overtime"
import Payroll from "./FormInputs/Payroll"
import ShiftTypes from "./FormInputs/ShiftTypes"

export type PayrollSettingsFormData = {
	settings: Schema.Setting
}

export interface CalendarSettingsProps {
	settings: Schema.Setting
	shift_types: Schema.Category[]
}

const CalendarSettings = ({ settings, shift_types }: CalendarSettingsProps) => {
	return (
		<Form<PayrollSettingsFormData>
			to={ Routes.settings() }
			model="settings"
			method="patch"
			data={ { settings } }
			remember={ false }
		>
			<Grid>
				<Overtime settings={ settings } shift_types={ shift_types } />
				<Payroll settings={ settings } shift_types={ shift_types } />
				<ShiftTypes shift_types={ shift_types } />

				<Grid.Col>
					<Submit>Update Settings</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default withLayout(CalendarSettings, "settings")
