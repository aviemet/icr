import { Grid, Title } from "@/Components"
import { Select } from "@/Components/Form"
import { useForm } from "use-inertia-form"
import { type PayrollSettingsFormData, type CalendarSettingsProps } from ".."
import PayrollPeriodOptions from "./PayrollPeriodOptions"

const Payroll = ({ settings, shift_types }: CalendarSettingsProps) => {
	const { getData } = useForm<PayrollSettingsFormData>()

	const payrollPeriod = getData("settings.payroll_period_type")
	return (
		<>
			<Grid.Col>
				<Title order={ 3 }>Payroll</Title>
			</Grid.Col>

			<Grid.Col  span={ { xs: 12, sm: 6 } }>
				<Select
					name="payroll_period_type"
					label="Period interval for payroll processing"
					defaultValue="biweekly"
					options={ [
						{ label: "Every 2 weeks", value: "bi_weekly" },
						{ label: "Semi Monthly", value: "semi_monthly" },
						{ label: "Monthly", value: "monthly" },
						{ label: "Weekly", value: "weekly" },
					] }
				/>
			</Grid.Col>

			<Grid.Col>
				<PayrollPeriodOptions payroll_period_type={ payrollPeriod } />
			</Grid.Col>
		</>
	)
}

export default Payroll

