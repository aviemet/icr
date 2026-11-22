import { ComboboxItem } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { Select } from "@/components/Inputs"
import { rem } from "@/lib"
import { type PayrollPeriodType } from "@/types/PayrollPeriodType"

function DayOfWeekSelect() {
	const { t } = useTranslation()

	return (
		<Select
			name="settings.payroll_period_day"
			options={ [
				{ label: t("views.settings.weekdays.monday"), value: "monday" },
				{ label: t("views.settings.weekdays.tuesday"), value: "tuesday" },
				{ label: t("views.settings.weekdays.wednesday"), value: "wednesday" },
				{ label: t("views.settings.weekdays.thursday"), value: "thursday" },
				{ label: t("views.settings.weekdays.friday"), value: "friday" },
				{ label: t("views.settings.weekdays.saturday"), value: "saturday" },
				{ label: t("views.settings.weekdays.sunday"), value: "sunday" },
			] }
			wrapperProps={ {
				style: { display: "inline-block", width: rem(150) },
			} }
		/>
	)
}

function DateSelect() {
	const { t } = useTranslation()
	const options: ComboboxItem[] = [
		{ label: t("views.settings.payroll.schedule.day_of_month_1"), value: "1" },
		{ label: t("views.settings.payroll.schedule.day_of_month_5"), value: "5" },
		{ label: t("views.settings.payroll.schedule.day_of_month_15"), value: "15" },
		{ label: t("views.settings.payroll.schedule.day_of_month_20"), value: "20" },
		{ label: t("views.settings.payroll.schedule.day_of_month_last"), value: "-1" },
	]

	return (
		<Select
			name="settings.payroll_period_date"
			options={ options }
			wrapperProps={ {
				style: { display: "inline-block", width: rem(85) },
			} }
		/>
	)
}

interface PayrollPeriodOptionsProps {
	payroll_period_type: PayrollPeriodType
}

export function PayrollPeriodOptions({ payroll_period_type }: PayrollPeriodOptionsProps) {
	const { t } = useTranslation()

	switch(payroll_period_type) {
		case "bi_weekly":
			return (
				<Box>
					{ t("views.settings.payroll.schedule.period_start_bi_weekly_prefix") }
					{ " " }
					<DayOfWeekSelect />
				</Box>
			)
		case "weekly":
			return (
				<Box>
					{ t("views.settings.payroll.schedule.period_start_weekly_prefix") }
					{ " " }
					<DayOfWeekSelect />
				</Box>
			)
		case "semi_monthly":
			return <Box>{ t("views.settings.payroll.schedule.period_start_semi_monthly") }</Box>
		case "monthly":
			return (
				<Box>
					{ t("views.settings.payroll.schedule.period_start_monthly_prefix") }
					{ " " }
					<DateSelect />
					{ " " }
					{ t("views.settings.payroll.schedule.period_start_monthly_suffix") }
				</Box>
			)
	}
}
