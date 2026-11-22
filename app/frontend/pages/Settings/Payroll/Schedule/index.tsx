import { useTranslation } from "react-i18next"

import { Box, Grid } from "@/components"
import { Form } from "@/components/Form"
import { DueDate } from "@/domains/Settings/Payroll/Form/DueDate"
import { Payroll } from "@/domains/Settings/Payroll/Form/Payroll"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

export interface PayrollScheduleSettingsProps {
	settings: Schema.Setting
}

const PayrollScheduleSettings = ({ settings }: PayrollScheduleSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Form
				action={ Routes.settingsPayrollSchedule() }
				method="patch"
				initialData={ { settings } }
			>
				<SettingsPageHeader
					title={ t("views.settings.payroll.schedule.title") }
					description={ t("views.settings.payroll.schedule.description") }
					actions={ <SettingsSaveButton /> }
				/>

				<FormBandStack>
					<FormBand
						title={ t("views.settings.payroll.schedule.period_band_title") }
						description={ t("views.settings.payroll.schedule.period_band_description") }
					>
						<Grid>
							<Payroll />
						</Grid>
					</FormBand>

					<FormBand
						title={ t("views.settings.payroll.schedule.due_date_band_title") }
						description={ t("views.settings.payroll.schedule.due_date_band_description") }
					>
						<Grid>
							<DueDate />
						</Grid>
					</FormBand>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(PayrollScheduleSettings, "settings")
