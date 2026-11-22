import { Box, Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Ihss } from "@/domains/Settings/Payroll/Form/Ihss"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

export interface PayrollIhssSettingsProps {
	settings: Schema.Setting
}

const PayrollIhssSettings = ({ settings }: PayrollIhssSettingsProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="IHSS"
				description="Co-employment and how IHSS hours are assigned for overtime and tracking."
			/>

			<Form
				action={ Routes.settingsPayrollIhss() }
				method="patch"
				initialData={ { settings } }
			>
				<FormBandStack>
					<FormBand
						title="Co-employment and assignment"
						description="These settings change how payroll classifies IHSS hours and calculates overtime."
					>
						<Grid>
							<Ihss />
						</Grid>
					</FormBand>

					<Submit>Update settings</Submit>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(PayrollIhssSettings, "settings")
