import { Box, Grid, Paper, Stack, Text, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Routes, withLayout } from "@/lib"

import Overtime from "./FormInputs/Overtime"
import OvertimeExemptions from "./FormInputs/OvertimeExemptions"
import Payroll from "./FormInputs/Payroll"
import ShiftTypes from "./FormInputs/ShiftTypes"

export type PayrollSettingsFormData = {
	settings: Schema.Setting
}

export interface PayrollSettingsProps {
	settings: Schema.Setting
	shift_types: Schema.Category[]
}

const PayrollSettings = ({ settings, shift_types }: PayrollSettingsProps) => {
	return (
		<Box>
			<Stack gap="xl">
				<Form<PayrollSettingsFormData>
					to={ Routes.settingsPayroll() }
					model="settings"
					method="patch"
					data={ { settings } }
					remember={ false }
				>
					<Stack gap="xl">
						<Paper p="lg" withBorder>
							<Stack gap="md">
								<Title order={ 4 }>Pay period</Title>
								<Text size="sm" c="dimmed">
									Define when each pay period starts and how often payroll runs.
								</Text>
								<Grid>
									<Payroll settings={ settings } shift_types={ shift_types } />
								</Grid>
							</Stack>
						</Paper>

						<Paper p="lg" withBorder>
							<Stack gap="md">
								<Title order={ 4 }>Overtime thresholds</Title>
								<Text size="sm" c="dimmed">
									Hours above these counts in a week or day are paid as overtime.
								</Text>
								<Grid>
									<Overtime settings={ settings } shift_types={ shift_types } />
								</Grid>
							</Stack>
						</Paper>

						<Submit>Update settings</Submit>
					</Stack>
				</Form>

				<Paper p="lg" withBorder>
					<Stack gap="md">
						<Title order={ 4 }>Overtime exemptions</Title>
						<Text size="sm" c="dimmed">
							Shifts that match these rules are excluded from overtime calculation.
						</Text>
						<OvertimeExemptions />
					</Stack>
				</Paper>

				<Paper p="lg" withBorder>
					<Stack gap="md">
						<Title order={ 4 }>Shift types</Title>
						<Text size="sm" c="dimmed">
							Categories for shifts; used in scheduling and overtime exemption rules.
						</Text>
						<ShiftTypes shift_types={ shift_types } />
					</Stack>
				</Paper>
			</Stack>
		</Box>
	)
}

export default withLayout(PayrollSettings, "settings")
