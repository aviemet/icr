import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { Form } from "@/components/Form"
import { Overtime } from "@/domains/Settings/Payroll/Form/Overtime"
import { OvertimeExemptions } from "@/domains/Settings/Payroll/Form/OvertimeExemptions"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

export interface PayrollOvertimeSettingsProps {
	settings: Schema.Setting
	shift_types: Schema.ServiceType[]
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
			<FormBandStack>
				<Form
					action={ Routes.settingsPayrollOvertime() }
					method="patch"
					initialData={ { settings } }
				>
					<SettingsPageHeader
						title={ t("views.settings.payroll.overtime.title") }
						description={ t("views.settings.payroll.overtime.description") }
						actions={ <SettingsSaveButton /> }
					/>

					<Overtime />
				</Form>

				<OvertimeExemptions
					overtime_exemptions={ overtime_exemptions }
					shift_types={ shift_types }
				/>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(PayrollOvertimeSettings, "settings")
