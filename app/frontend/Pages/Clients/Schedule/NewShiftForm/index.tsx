import { DateTimeInput, Form } from '@/Components/Form'
import { FormEmployeesDropdown } from '@/Features/Dropdowns'
import { Routes } from '@/lib'
import dayjs from 'dayjs'
import { type PartialDeep } from 'type-fest'

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

	return (
		<Form
			model="calendar_event" to={ Routes.apiCalendarEvents() }
			data={ initialData }
		>
			<FormEmployeesDropdown />
			<DateTimeInput
				label="Start"
				name="starts_at"
			/>
			<DateTimeInput
				label="End"
				name="ends_at"
			/>

		</Form>
	)
}

export default NewShiftForm
