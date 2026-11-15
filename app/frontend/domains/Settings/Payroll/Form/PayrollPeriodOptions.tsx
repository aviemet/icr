import { ComboboxItem } from "@mantine/core"

import { Box } from "@/components"
import { Select } from "@/components/Inputs"
import { rem } from "@/lib"
import { type PayrollPeriodType } from "@/types/PayrollPeriodType"

const DayOfWeekSelect = () => (
	<Select
		name="settings.payroll_period_day"
		options={ [
			{ label: "Monday", value: "monday" },
			{ label: "Tuesday", value: "tuesday" },
			{ label: "Wednesday", value: "wednesday" },
			{ label: "Thursday", value: "thursday" },
			{ label: "Friday", value: "friday" },
			{ label: "Saturday", value: "saturday" },
			{ label: "Sunday", value: "sunday" },
		] }
		wrapperProps={ {
			style: { display: "inline-block", width: rem(150) },
		} }
	/>
)

const DateSelect = () => {
	const options: ComboboxItem[] = [
		{ label: "1st", value: "1" },
		{ label: "5th", value: "5" },
		{ label: "15th", value: "15" },
		{ label: "20th", value: "20" },
		{ label: "Last", value: "-1" },
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
	switch(payroll_period_type) {
		case "bi_weekly":
			return <Box>Pay periods start every other <DayOfWeekSelect /></Box>
		case "weekly":
			return <Box>Pay periods start every <DayOfWeekSelect /></Box>
		case "semi_monthly":
			return <Box>Pay periods start on the 1st and the 16th of each month (1st–15th and 16th–last).</Box>
		case "monthly":
			return <Box>Pay periods start on the <DateSelect /> of the month</Box>
	}
}

