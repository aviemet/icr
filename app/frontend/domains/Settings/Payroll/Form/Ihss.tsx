import { useTranslation } from "react-i18next"

import { Grid, Text } from "@/components"
import { Select, Switch } from "@/components/Inputs"

export function Ihss() {
	const { t } = useTranslation()

	const assignmentModeOptions = [
		{ value: "shift", label: t("views.settings.payroll.ihss.assignment_mode_shift") },
		{ value: "period", label: t("views.settings.payroll.ihss.assignment_mode_period") },
	]

	return (
		<>
			<Grid.Col span={ 12 }>
				<Switch
					name="settings.ihss_co_employer"
					label={ t("views.settings.payroll.ihss.co_employer_label") }
					description={ t("views.settings.payroll.ihss.co_employer_description") }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 8 } }>
				<Select
					name="settings.ihss_assignment_mode"
					label={ t("views.settings.payroll.ihss.assignment_mode_label") }
					description={ t("views.settings.payroll.ihss.assignment_mode_description") }
					options={ assignmentModeOptions }
					searchable={ false }
					clearable={ false }
				/>
			</Grid.Col>
			<Grid.Col span={ 12 }>
				<Text size="sm" c="dimmed">
					{ t("views.settings.payroll.ihss.authorized_hours_note") }
				</Text>
			</Grid.Col>
		</>
	)
}
