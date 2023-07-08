import React from 'react'
import { Dropdown } from '@/Components/Form'
import { AsyncDropdownProps } from '../Inputs/Dropdown'
import { getEmployeesAsOptions } from '@/queries'

interface EmployeesDropdown extends Omit<AsyncDropdownProps<Schema.EmployeesOptions>, 'name'|'data'> {
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
		<Dropdown
			label={ label }
			name={ name }
			data={ data?.map(employee => ({ label: employee.name, value: employee.id })) }
			{ ...props }
		/>
	)
}

export default EmployeesDropdown
