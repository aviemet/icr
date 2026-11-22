import { useTranslation } from "react-i18next"

import { Box, Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Overtime } from "@/domains/Settings/Payroll/Form/Overtime"
import { OvertimeExemptions } from "@/domains/Settings/Payroll/Form/OvertimeExemptions"
import { FormBand, FormBandStack } from "@/features"
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

			<FormBandStack>
				<Form
					action={ Routes.settingsPayrollOvertime() }
					method="patch"
					initialData={ { settings } }
				>
					<FormBandStack>
						<FormBand
							title="Thresholds"
							description="Hours above these counts in a week or day are paid as overtime."
						>
							<Grid>
								<Overtime />
							</Grid>
						</FormBand>

						<Submit>Update settings</Submit>
					</FormBandStack>
				</Form>

				<FormBand
					title={ t("views.settings.payroll.overtime_exemptions.title") }
					description={ t("views.settings.payroll.overtime_exemptions.description") }
				>
					<OvertimeExemptions
						overtime_exemptions={ overtime_exemptions }
						shift_types={ shift_types }
					/>
				</FormBand>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(PayrollOvertimeSettings, "settings")
