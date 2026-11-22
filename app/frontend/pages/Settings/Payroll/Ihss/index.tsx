import { useTranslation } from "react-i18next"

import { Box, Grid } from "@/components"
import { Form } from "@/components/Form"
import { Ihss } from "@/domains/Settings/Payroll/Form/Ihss"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

export interface PayrollIhssSettingsProps {
	settings: Schema.Setting
}

const PayrollIhssSettings = ({ settings }: PayrollIhssSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Form
				action={ Routes.settingsPayrollIhss() }
				method="patch"
				initialData={ { settings } }
			>
				<SettingsPageHeader
					title={ t("views.settings.payroll.ihss.title") }
					description={ t("views.settings.payroll.ihss.description") }
					actions={ <SettingsSaveButton /> }
				/>

				<FormBandStack>
					<FormBand
						title={ t("views.settings.payroll.ihss.band_title") }
						description={ t("views.settings.payroll.ihss.band_description") }
					>
						<Grid>
							<Ihss />
						</Grid>
					</FormBand>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(PayrollIhssSettings, "settings")
