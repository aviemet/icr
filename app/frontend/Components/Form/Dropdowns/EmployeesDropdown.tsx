import React from 'react'
import { SearchableDropdown } from '@/Components/Form'
import { AsyncSearchableDropdownProps } from '../Inputs/SearchableDropdown'
import { getEmployeesAsOptions } from '@/queries'

interface EmployeesDropdown extends Omit<AsyncSearchableDropdownProps<Schema.EmployeesOptions>, 'name'> {
	name?: string
}

const EmployeesDropdown = ({
	label = 'Employee',
	name = 'employee_id',
	filter,
	...props
}: EmployeesDropdown) => {
	const { data } = getEmployeesAsOptions({
		select: filter ? data => data.filter(filter) : undefined,
	})

	return (
		<SearchableDropdown
			label={ label }
			name={ name }
			options={ data }
			{ ...props }
		/>
	)
}

export default EmployeesDropdown
