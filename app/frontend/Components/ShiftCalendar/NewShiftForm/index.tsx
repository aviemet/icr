import React, { useCallback, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { Form, Autocomplete, DateTime, Submit, FormConsumer } from '@/Components/Form'
import { Routes } from '@/lib'
import { Box } from '@/Components'
import Repeats from './Repeats'
import EmployeesDropdown from '@/Components/Form/Dropdowns/EmployeesDropdown'
import { useBooleanToggle } from '@/lib/hooks'
import SwitchInput from '@/Components/Inputs/Switch'

type TFormData = {
	shift: Schema.ShiftsFormData & {
		is_recurring: boolean
	}
}

interface INewShiftFormProps {
	start?: Date
	end?: Date
	client?: Schema.Client
	employee?: Schema.Employee
	onSubmit?: () => void
}

const NewShiftForm: React.FC<INewShiftFormProps> = ({ client, employee, start, end }) => {
	const [showRecurring, toggleShowRecurring] = useBooleanToggle(false)

	const defaultData: TFormData = {
		shift: {
			starts_at: start || '',
			ends_at: end || '',
			employee_id: undefined,
			title: '',
			recurring_pattern: {
				recurring_type: 1,
				offset: 1,
				max_occurrences: '',
				end_date: '',
				day_of_week: '',
				week_of_month: '',
				day_of_month: '',
				month_of_year: '',
			},
		},
	}

	return (
		<Form model="shift" to={ Routes.shifts() } data={ defaultData } remember={ false }>

			{ /* <FormConsumer>{ ({ data }) => { console.log({ data }); return <></> } }</FormConsumer> */ }
			{ client && <EmployeesDropdown /> }
			{ /* employee && <ClientsDropdown /> */ }

			{ /* Start */ }
			<DateTime
				name="starts_at"
				label="Start"
				dropdownType="modal"
			/>

			{ /* End */ }
			<DateTime
				name="ends_at"
				label="End"
				dropdownType="modal"
			/>

			{ /* Repeats */ }
			<SwitchInput checked={ showRecurring } onChange={ () => toggleShowRecurring() } label="Repeat" />
			{ showRecurring && <Repeats date={ start } /> }

			<Submit>Save Shift</Submit>
		</Form>
	)
}

export default NewShiftForm
