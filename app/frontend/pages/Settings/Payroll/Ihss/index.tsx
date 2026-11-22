import { Box, Grid, Stack, Text, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Ihss } from "@/domains/Settings/Payroll/Form/Ihss"
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
				<Stack gap="md">
					<Title order={ 4 }>Co-employment and assignment</Title>
					<Text size="sm" c="dimmed">
						These settings change how payroll classifies IHSS hours and calculates overtime.
					</Text>
					<Grid>
						<Ihss />
					</Grid>
					<Submit>Update settings</Submit>
				</Stack>
			</Form>
		</Box>
	)
}

export default withLayout(PayrollIhssSettings, "settings")
