import { Grid } from "@/components"
import { NumberInput } from "@/components/Form"

import { type PayrollSettingsProps } from ".."

const Overtime = ({ settings, shift_types }: PayrollSettingsProps) => {
	return (
		<>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<NumberInput
					name="overtime_weekly_hours"
					label="Weekly threshold (hours)"
					description="Hours over this in a week are overtime"
					min={ 0 }
					max={ 168 }
				/>
			</Grid.Col>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<NumberInput
					name="overtime_daily_hours"
					label="Daily threshold (hours)"
					description="Hours over this in a day are overtime"
					min={ 0 }
					max={ 24 }
				/>
			</Grid.Col>
		</>
	)
}

export default Overtime
