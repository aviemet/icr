import { Box, Button, Grid, Label } from "@/Components"
import { Form, Submit, TextInput, Select, NumberInput, DateInput } from "@/Components/Form"
import { Routes, withLayout } from "@/lib"
import { useState } from "react"
import ShiftTypes from "./ShiftTypes"

export type CalendarSettingsFormData = {
	setting: Schema.Setting & {
		payroll_period_type: "week" | "month"
		payroll_frequency: number
		payroll_start_date?: Date
	}
}

interface CalendarSettingsProps {
	settings: Schema.Setting
	shift_types: Schema.Category[]
}

const CalendarSettings = ({ settings, shift_types }: CalendarSettingsProps) => {
	const [periodType, setPeriodType] = useState(settings.payroll_period_type || "month")

	return (
		<Form<CalendarSettingsFormData>
			to={ Routes.settings() }
			model="setting"
			method="patch"
			data={ { setting: settings } }
			remember={ false }
		>
			<Grid>
				<Grid.Col span={ 10 }>
					<Label htmlFor="setting_overtime_hours">Threshold of weekly hours before overtime is applied</Label>
				</Grid.Col>
				<Grid.Col span={ 2 }>
					<TextInput name="overtime_hours" />
				</Grid.Col>

				Every 2 weeks<br />
				1st and 15th of the month

				<Grid.Col span={ 12 }>
					<Box mb="md">
						<Label>When does payroll get processed?</Label>
					</Box>
					<Grid>
						<Grid.Col span={ 1 }>
							Every
						</Grid.Col>
						<Grid.Col span={ 2 }>
							<NumberInput
								name="payroll_frequency"
								min={ 1 }
								max={ periodType === "week" ? 4 : 2 }
								defaultValue={ 1 }
							/>
						</Grid.Col>
						<Grid.Col span={ 4 }>
							<Select
								label="Period Type"
								name="payroll_period_type"
								value={ periodType }
								onChange={ (value) => setPeriodType(value as "week" | "month") }
								data={ [
									{ value: "week", label: "Week" },
									{ value: "month", label: "Month" },
								] }
							/>
						</Grid.Col>
						{ periodType === "week" && (
							<Grid.Col span={ 4 }>
								<DateInput
									label="Period Start Date"
									name="payroll_start_date"
									placeholder="Select start date"
								/>
							</Grid.Col>
						) }
					</Grid>
				</Grid.Col>

				<Grid.Col>
					<ShiftTypes shift_types={ shift_types } />
				</Grid.Col>

				<Grid.Col>
					<Submit>Update Settings</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default withLayout(CalendarSettings, "settings")
