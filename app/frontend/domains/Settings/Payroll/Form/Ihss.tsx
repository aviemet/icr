import { Grid, Text } from "@/components"
import { Select, Switch } from "@/components/Inputs"

const ASSIGNMENT_MODE_OPTIONS = [
	{ value: "shift", label: "Assign by shift" },
	{ value: "period", label: "Assign by period" },
]

export function Ihss() {
	return (
		<>
			<Grid.Col span={ 12 }>
				<Switch
					name="settings.ihss_co_employer"
					label="Treat IHSS as a co-employer"
					description="When on, all hours count toward overtime. When off, only non-IHSS hours count toward overtime."
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 8 } }>
				<Select
					name="settings.ihss_assignment_mode"
					label="How to assign IHSS hours"
					description="Shift mode marks each shift in payroll. Period mode assigns hours once per employee and client for the pay period."
					options={ ASSIGNMENT_MODE_OPTIONS }
					searchable={ false }
					clearable={ false }
				/>
			</Grid.Col>
			<Grid.Col span={ 12 }>
				<Text size="sm" c="dimmed">
					Authorized hours stay on each client profile. Payroll shows IHSS hours used in the period next to that budget.
				</Text>
			</Grid.Col>
		</>
	)
}
