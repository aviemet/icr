import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { NumberInput, Select } from "@/components/Inputs"
import { FormBand } from "@/features"

const WEEKDAY_OPTIONS = [
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
] as const

export function Overtime() {
	const { t } = useTranslation()
	const weekdayOptions = WEEKDAY_OPTIONS.map(day => ({
		value: day,
		label: t(`views.settings.weekdays.${day}`),
	}))

	return (
		<>
			<FormBand
				title={ t("views.settings.payroll.overtime.standard_band_title") }
				description={ t("views.settings.payroll.overtime.standard_band_description") }
			>
				<Grid>
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

					<Grid.Col span={ { xs: 12, sm: 6 } }>
						<NumberInput
							name="settings.overtime_daily_double_time_hours"
							label={ t("views.settings.payroll.overtime.double_time_label") }
							description={ t("views.settings.payroll.overtime.double_time_description") }
							min={ 0 }
							max={ 24 }
						/>
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6 } }>
						<NumberInput
							name="settings.overtime_seventh_day_double_time_hours"
							label={ t("views.settings.payroll.overtime.seventh_day_double_time_label") }
							description={ t("views.settings.payroll.overtime.seventh_day_double_time_description") }
							min={ 0 }
							max={ 24 }
						/>
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6 } }>
						<Select
							name="settings.overtime_workweek_start"
							label={ t("views.settings.payroll.overtime.workweek_start_label") }
							description={ t("views.settings.payroll.overtime.workweek_start_description") }
							options={ weekdayOptions }
						/>
					</Grid.Col>
				</Grid>
			</FormBand>

			<FormBand
				title={ t("views.settings.payroll.overtime.personal_attendant_band_title") }
				description={ t("views.settings.payroll.overtime.personal_attendant_band_description") }
			>
				<Grid>
					<Grid.Col span={ { xs: 12, sm: 6 } }>
						<NumberInput
							name="settings.overtime_personal_attendant_daily_hours"
							label={ t("views.settings.payroll.overtime.personal_attendant_daily_label") }
							description={ t("views.settings.payroll.overtime.personal_attendant_daily_description") }
							min={ 0 }
							max={ 24 }
						/>
					</Grid.Col>

					<Grid.Col span={ { xs: 12, sm: 6 } }>
						<NumberInput
							name="settings.overtime_personal_attendant_weekly_hours"
							label={ t("views.settings.payroll.overtime.personal_attendant_weekly_label") }
							description={ t("views.settings.payroll.overtime.personal_attendant_weekly_description") }
							min={ 0 }
							max={ 168 }
						/>
					</Grid.Col>
				</Grid>
			</FormBand>
		</>
	)
}
