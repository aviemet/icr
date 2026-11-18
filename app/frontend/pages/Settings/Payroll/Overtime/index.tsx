import { useTranslation } from "react-i18next"

import { Box, Divider, Grid, Stack, Text, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Overtime } from "@/domains/Settings/Payroll/Form/Overtime"
import { OvertimeExemptions } from "@/domains/Settings/Payroll/Form/OvertimeExemptions"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

export interface PayrollOvertimeSettingsProps {
	settings: Schema.Setting
	shift_types: Schema.Category[]
	overtime_exemptions: Schema.OvertimeExemption[]
}

const PayrollOvertimeSettings = ({
	settings,
	shift_types,
	overtime_exemptions,
}: PayrollOvertimeSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<SettingsPageHeader
				title="Overtime"
				description="Set overtime thresholds and rules for shifts that should be excluded."
			/>

			<Stack gap="xl">
				<Form
					action={ Routes.settingsPayrollOvertime() }
					method="patch"
					initialData={ { settings } }
				>
					<Stack gap="md">
						<Title order={ 4 }>Thresholds</Title>
						<Text size="sm" c="dimmed">
							Hours above these counts in a week or day are paid as overtime.
						</Text>
						<Grid>
							<Overtime />
						</Grid>
						<Submit>Update settings</Submit>
					</Stack>
				</Form>

				<Divider />

				<Stack gap="md">
					<Title order={ 4 }>
						{ t("views.settings.payroll.overtime_exemptions.title") }
					</Title>
					<Text size="sm" c="dimmed">
						{ t("views.settings.payroll.overtime_exemptions.description") }
					</Text>
					<OvertimeExemptions
						overtime_exemptions={ overtime_exemptions }
						shift_types={ shift_types }
					/>
				</Stack>
			</Stack>
		</Box>
	)
}

export default withLayout(PayrollOvertimeSettings, "settings")
