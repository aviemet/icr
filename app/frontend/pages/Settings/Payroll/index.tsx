import { Divider, Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Routes, withLayout } from "@/lib"

import Overtime from "./FormInputs/Overtime"
import OvertimeExemptions from "./FormInputs/OvertimeExemptions"
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
		<>
			<Form<PayrollSettingsFormData>
				to={ Routes.settingsPayroll() }
				model="settings"
				method="patch"
				data={ { settings } }
				remember={ false }
			>
				<Grid>
					<Overtime settings={ settings } shift_types={ shift_types } />

					<Grid.Col><Divider /></Grid.Col>

					<Payroll settings={ settings } shift_types={ shift_types } />

					<Grid.Col mt="md">
						<Submit>Update Settings</Submit>
					</Grid.Col>

				</Grid>
			</Form>

			<Divider my="lg" />
			<OvertimeExemptions />

			<Divider my="lg" />
			<ShiftTypes shift_types={ shift_types } />
		</>
	)
}

export default withLayout(CalendarSettings, "settings")
