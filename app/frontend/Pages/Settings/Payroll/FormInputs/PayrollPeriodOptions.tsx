import { type PayrollPeriodType } from "@/types/PayrollPeriodType"
import { Box } from "@/Components"
import { Select } from "@/Components/Form"

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
		w: 150,
	} }
/>

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
			return <Box>Payroll is processed on the 1st and 15th of the month</Box>
		case "monthly":
			return <Box>Payroll is processed on the 1st of the month</Box>
	}
}

export default PayrollPeriodOptions
