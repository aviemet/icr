import { Box, Divider, Grid, Stack, Text, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DueDate } from "@/domains/Settings/Payroll/Form/DueDate"
import { Payroll } from "@/domains/Settings/Payroll/Form/Payroll"
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
				<Stack gap="xl">
					<Stack gap="md">
						<Title order={ 4 }>Pay period</Title>
						<Text size="sm" c="dimmed">
							How often payroll runs and when each period starts.
						</Text>
						<Grid>
							<Payroll />
						</Grid>
					</Stack>

					<Divider />

					<Stack gap="md">
						<Title order={ 4 }>Due date</Title>
						<Text size="sm" c="dimmed">
							When timesheets must be ready after a pay period closes.
						</Text>
						<Grid>
							<DueDate />
						</Grid>
					</Stack>

					<Submit>Update settings</Submit>
				</Stack>
			</Form>
		</Box>
	)
}

export default withLayout(PayrollScheduleSettings, "settings")
