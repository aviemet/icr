import { Grid, Title } from "@/Components"
import { NumberInput } from "@/Components/Form"
import { CalendarSettingsProps } from ".."
import { rem } from "@/lib"

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

			<Grid.Col>
				<Title order={ 3 }>Overtime Exemptions</Title>
			</Grid.Col>

			<Grid.Col>
				

			</Grid.Col>
		</>
	)
}

export default Overtime
