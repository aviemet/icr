import { Grid } from '@/Components'
import { DateTimeInput, Form, Submit } from '@/Components/Form'
import { FormEmployeesDropdown } from '@/Features/Dropdowns'
import { Routes } from '@/lib'
import dayjs from 'dayjs'
import { type PartialDeep } from 'type-fest'
import { type UseFormProps } from 'use-inertia-form'

interface NewClientShiftFormProps {
	selectedDate: Date
}

type NewShiftData = {
	calendar_event: PartialDeep<Schema.CalendarEventsFormData>
}

const NewShiftForm = ({ selectedDate }: NewClientShiftFormProps) => {
	const initialData: NewShiftData = {
		calendar_event: {
			starts_at: selectedDate,
			ends_at: dayjs(selectedDate).add(8, 'hours').toDate(),
			shift: {
				employee_id: '',
			},
		},
	}

	const handleSuccess = (form: UseFormProps<NewShiftData>) => {
		console.log({ success: form })
	}

	const handleError = (form: UseFormProps<NewShiftData>) => {
		console.log({ error: form })
	}

	return (
		<Form
			model="calendar_event"
			async
			onSuccess={ handleSuccess }
			onError={ handleError }
			to={ Routes.apiCalendarEvents() }
			data={ initialData }
		>
			<Grid>
				<Grid.Col>
					<FormEmployeesDropdown />
				</Grid.Col>

				<Grid.Col>
					<DateTimeInput
						label="Start"
						name="starts_at"
					/>
				</Grid.Col>

				<Grid.Col>
					<DateTimeInput
						label="End"
						name="ends_at"
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Save Shift</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default NewShiftForm
