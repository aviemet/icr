import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { useFormField } from "@/components/Form"
import { NumberInput, Select } from "@/components/Inputs"

export function DueDate() {
	const { t } = useTranslation()
	const [ruleType] = useFormField("settings.payroll_due_date_rule_type")

	const ruleTypes = [
		{ label: t("views.settings.payroll.schedule.due_rule_days_after"), value: "days_after_period_end" },
		{ label: t("views.settings.payroll.schedule.due_rule_weekday_after"), value: "day_of_week_after_period_end" },
		{ label: t("views.settings.payroll.schedule.due_rule_day_of_month"), value: "day_of_month" },
	]

	const weekdayOptions = [
		{ label: t("views.settings.weekdays.monday"), value: "monday" },
		{ label: t("views.settings.weekdays.tuesday"), value: "tuesday" },
		{ label: t("views.settings.weekdays.wednesday"), value: "wednesday" },
		{ label: t("views.settings.weekdays.thursday"), value: "thursday" },
		{ label: t("views.settings.weekdays.friday"), value: "friday" },
		{ label: t("views.settings.weekdays.saturday"), value: "saturday" },
		{ label: t("views.settings.weekdays.sunday"), value: "sunday" },
	]

	const dayOfMonthOptions = [
		{ label: t("views.settings.payroll.schedule.due_day_of_month_1"), value: "1" },
		{ label: t("views.settings.payroll.schedule.due_day_of_month_5"), value: "5" },
		{ label: t("views.settings.payroll.schedule.due_day_of_month_10"), value: "10" },
		{ label: t("views.settings.payroll.schedule.due_day_of_month_15"), value: "15" },
		{ label: t("views.settings.payroll.schedule.due_day_of_month_20"), value: "20" },
		{ label: t("views.settings.payroll.schedule.due_day_of_month_25"), value: "25" },
		{ label: t("views.settings.payroll.schedule.due_day_of_month_last"), value: "-1" },
	]

	return (
		<>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<Select
					name="settings.payroll_due_date_rule_type"
					label={ t("views.settings.payroll.schedule.due_rule_label") }
					options={ ruleTypes }
				/>
			</Grid.Col>

			{ ruleType === "days_after_period_end" && (
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<NumberInput
						name="settings.payroll_due_date_days"
						label={ t("views.settings.payroll.schedule.due_days_label") }
						min={ 0 }
						max={ 31 }
					/>
				</Grid.Col>
			) }

			{ ruleType === "day_of_week_after_period_end" && (
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name="settings.payroll_due_date_day_of_week"
						label={ t("views.settings.payroll.schedule.due_weekday_label") }
						options={ weekdayOptions }
					/>
				</Grid.Col>
			) }

			{ ruleType === "day_of_month" && (
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name="settings.payroll_due_date_day_of_month"
						label={ t("views.settings.payroll.schedule.due_day_of_month_label") }
						options={ dayOfMonthOptions }
					/>
				</Grid.Col>
			) }
		</>
	)
}
