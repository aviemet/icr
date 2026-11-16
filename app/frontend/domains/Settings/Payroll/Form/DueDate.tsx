import { Grid } from "@/components"
import { useFormField } from "@/components/Form"
import { NumberInput, Select } from "@/components/Inputs"

const RULE_TYPES = [
	{ label: "Days after period ends", value: "days_after_period_end" },
	{ label: "Day of week after period ends", value: "day_of_week_after_period_end" },
	{ label: "Day of the month", value: "day_of_month" },
] as const

const WEEKDAY_OPTIONS = [
	{ label: "Monday", value: "monday" },
	{ label: "Tuesday", value: "tuesday" },
	{ label: "Wednesday", value: "wednesday" },
	{ label: "Thursday", value: "thursday" },
	{ label: "Friday", value: "friday" },
	{ label: "Saturday", value: "saturday" },
	{ label: "Sunday", value: "sunday" },
]

const DAY_OF_MONTH_OPTIONS = [
	{ label: "1st", value: "1" },
	{ label: "5th", value: "5" },
	{ label: "10th", value: "10" },
	{ label: "15th", value: "15" },
	{ label: "20th", value: "20" },
	{ label: "25th", value: "25" },
	{ label: "Last", value: "-1" },
]

export function DueDate() {
	const [ruleType] = useFormField("settings.payroll_due_date_rule_type")

	return (
		<>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<Select
					name="settings.payroll_due_date_rule_type"
					label="When payroll is due"
					options={ [...RULE_TYPES] }
				/>
			</Grid.Col>

			{ ruleType === "days_after_period_end" && (
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<NumberInput
						name="settings.payroll_due_date_days"
						label="Days after period ends"
						min={ 0 }
						max={ 31 }
					/>
				</Grid.Col>
			) }

			{ ruleType === "day_of_week_after_period_end" && (
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name="settings.payroll_due_date_day_of_week"
						label="Day of week"
						options={ WEEKDAY_OPTIONS }
					/>
				</Grid.Col>
			) }

			{ ruleType === "day_of_month" && (
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name="settings.payroll_due_date_day_of_month"
						label="Day of the month"
						options={ DAY_OF_MONTH_OPTIONS }
					/>
				</Grid.Col>
			) }
		</>
	)
}
