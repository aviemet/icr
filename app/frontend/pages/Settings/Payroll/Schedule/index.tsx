import { Box, Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DueDate } from "@/domains/Settings/Payroll/Form/DueDate"
import { Payroll } from "@/domains/Settings/Payroll/Form/Payroll"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

export interface PayrollScheduleSettingsProps {
	settings: Schema.Setting
}

const PayrollScheduleSettings = ({ settings }: PayrollScheduleSettingsProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="Pay Schedule"
				description="Define when pay periods run and when payroll is due."
			/>

			<Form
				action={ Routes.settingsPayrollSchedule() }
				method="patch"
				initialData={ { settings } }
			>
				<FormBandStack>
					<FormBand
						title="Pay period"
						description="How often payroll runs and when each period starts."
					>
						<Grid>
							<Payroll />
						</Grid>
					</FormBand>

					<FormBand
						title="Due date"
						description="When timesheets must be ready after a pay period closes."
					>
						<Grid>
							<DueDate />
						</Grid>
					</FormBand>

					<Submit>Update settings</Submit>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(PayrollScheduleSettings, "settings")
