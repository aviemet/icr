import { Grid } from "@/components"
import { useFormField } from "@/components/Form"
import { Select } from "@/components/Inputs"
import { type PayrollPeriodType } from "@/types/PayrollPeriodType"

import { type PayrollSettingsProps } from ".."
import PayrollPeriodOptions from "./PayrollPeriodOptions"

const PAYROLL_PERIOD_VALUES: readonly string[] = ["weekly", "bi_weekly", "semi_monthly", "monthly"]

function isPayrollPeriodType(value: unknown): value is PayrollPeriodType {
	return typeof value === "string" && PAYROLL_PERIOD_VALUES.includes(value)
}

const DEFAULT_PAYROLL_PERIOD: PayrollPeriodType = "bi_weekly"

const Payroll = ({ settings, shift_types }: PayrollSettingsProps) => {
	const [payrollPeriod] = useFormField("settings.payroll_period_type")

	return (
		<>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<Select
					name="settings.payroll_period_type"
					label="Period interval for payroll processing"
					options={ [
						{ label: "Every 2 weeks", value: "bi_weekly" },
						{ label: "Semi Monthly", value: "semi_monthly" },
						{ label: "Monthly", value: "monthly" },
						{ label: "Weekly", value: "weekly" },
					] }
				/>
			</Grid.Col>

			<Grid.Col>
				<PayrollPeriodOptions payroll_period_type={ isPayrollPeriodType(payrollPeriod) ? payrollPeriod : DEFAULT_PAYROLL_PERIOD } />
			</Grid.Col>
		</>
	)
}

export default Payroll

