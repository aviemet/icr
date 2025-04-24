import { Grid, Title } from "@/components"
import { NumberInput } from "@/components/Form"
import { rem } from "@/lib"

import { CalendarSettingsProps } from ".."

const Overtime = ({ settings, shift_types }: CalendarSettingsProps) => {
	return (
		<>
			<Grid.Col>
				<Title order={ 3 }>Overtime</Title>
			</Grid.Col>

			<Grid.Col>
				Hours worked over
				<NumberInput
					name="overtime_weekly_hours"
					size="xs"
					wrapperProps={ {
						inline: true,
						w: rem(50),
					} }
				/>
				in a week are considered overtime.
			</Grid.Col>

			<Grid.Col>
				Hours worked over
				<NumberInput
					name="overtime_daily_hours"
					size="xs"
					wrapperProps={ {
						inline: true,
						w: rem(50),
					} }
				/>
				in a day are considered overtime.
			</Grid.Col>

		</>
	)
}

export default Overtime
