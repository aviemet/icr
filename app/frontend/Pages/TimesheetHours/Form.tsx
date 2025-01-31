import { Grid } from '@/Components'
import { Form, TextInput, Submit } from '@/Components/Form'
import { type HTTPVerb, type UseFormProps } from 'use-inertia-form'

type TimesheetHourFormData = {
	timesheet_hour: Schema.TimesheetHoursFormData
}

export interface TimesheetHourFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TimesheetHourFormData>) => boolean|void
	timesheet_hour: Schema.TimesheetHoursFormData
}

const TimesheetHourForm = ({ method = 'post', timesheet_hour, ...props }: TimesheetHourFormProps) => {
	return (
		<Form
			model="timesheet_hour"
			data={ { timesheet_hour } }
			method={ method }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<Submit>{ timesheet_hour.id ? 'Update' : 'Create' } TimesheetHour</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default TimesheetHourForm
