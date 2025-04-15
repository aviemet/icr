import { ComboboxItem } from "@mantine/core"

import { Box } from "@/Components"
import { Select } from "@/Components/Form"
import { rem } from "@/lib"
import { type PayrollPeriodType } from "@/types/PayrollPeriodType"

const DayOfWeekSelect = () => <Select
	name="payroll_period_day"
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
		inline: true,
		w: rem(150),
	} }
/>

interface DateSelectProps {
	name?: string
	period?: "first" | "last"
}

const DateSelect = ({
	name = "payroll_period_date",
	period,
}: DateSelectProps) => {
	const firstOptions = [
		{ label: "1st", value: "1" },
		{ label: "5th", value: "5" },
	]

	const lastOptions = [
		{ label: "15th", value: "15" },
		{ label: "20th", value: "20" },
		{ label: "Last", value: "-1" },
	]

	let options: ComboboxItem[]
	switch(period) {
		case "first":
			options = firstOptions
			break
		case "last":
			options = lastOptions
			break
		default:
			options = [...firstOptions, ...lastOptions]
	}

	return <Select
		name={ name }
		options={ options }
		wrapperProps={ {
			inline: true,
			w: rem(85),
		} }
	/>
}

interface PayrollPeriodOptionsProps {
	payroll_period_type: PayrollPeriodType
}

const PayrollPeriodOptions = ({ payroll_period_type }: PayrollPeriodOptionsProps) => {
	switch(payroll_period_type) {
		case "bi_weekly":
			return <Box>Payroll is processed every other <DayOfWeekSelect /></Box>
		case "weekly":
			return <Box>Payroll is processed every <DayOfWeekSelect /></Box>
		case "semi_monthly":
			return <Box>Payroll is processed on the <DateSelect period="first" /> and <DateSelect name="payroll_period_date_2" period="last" /> of the month</Box>
		case "monthly":
			return <Box>Payroll is processed on the <DateSelect /> of the month</Box>
	}
}

export default PayrollPeriodOptions
