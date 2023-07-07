import React, { useCallback, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { Form, Autocomplete, DateTime, Submit, FormConsumer } from '@/Components/Form'
import { Routes } from '@/lib'
import { Box } from '@/Components'
import Repeats from './Repeats'
import EmployeesDropdown from '@/Components/Form/Dropdowns/EmployeesDropdown'

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

	const defaultData: TFormData = {
		shift: {
			starts_at: start || '',
			ends_at: end || '',
			employee_id: undefined,
			is_recurring: false,
		},
	}

	return (
		<Form model="shift" to={ Routes.shifts() } data={ defaultData } remember={ false }>

			<FormConsumer>{ ({ data }) => { console.log({ data }); return <></> } }</FormConsumer>
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
			<Repeats />

			<Submit>Save Shift</Submit>
		</Form>
	)
}

export default NewShiftForm
