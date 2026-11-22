import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { NumberInput } from "@/components/Inputs"

export function Overtime() {
	const { t } = useTranslation()

	return (
		<>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<NumberInput
					name="settings.overtime_weekly_hours"
					label={ t("views.settings.payroll.overtime.weekly_label") }
					description={ t("views.settings.payroll.overtime.weekly_description") }
					min={ 0 }
					max={ 168 }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<NumberInput
					name="settings.overtime_daily_hours"
					label={ t("views.settings.payroll.overtime.daily_label") }
					description={ t("views.settings.payroll.overtime.daily_description") }
					min={ 0 }
					max={ 24 }
				/>
			</Grid.Col>
		</>
	)
}
