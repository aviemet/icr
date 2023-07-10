import React, { useCallback } from 'react'
import { Dropdown } from '@/Components/Form'
import { AsyncDropdownProps } from '../Inputs/Dropdown'
import { getEmployeesAsOptions } from '@/queries'

interface EmployeesDropdown extends Omit<AsyncDropdownProps<Schema.EmployeesOptions>, 'name'|'data'> {
	name?: string
	group?: (datum: { label: string, value: string|number }) => { label: string, value: string|number, group: string}
}

const EmployeesDropdown = ({
	label = 'Employee',
	name = 'employee_id',
	filter,
	group,
	...props
}: EmployeesDropdown) => {
	const { data } = getEmployeesAsOptions({
		select: filter ? data => data.filter(filter) : undefined,
	})

	const mappedData = useCallback(() => {
		if(!data) return

		return data?.map(employee => {
			if(group) return group({ label: employee.name, value: employee.id })
			return { label: employee.name, value: employee.id }
		})
	}, [data])

	return (
		<Dropdown
			label={ label }
			name={ name }
			data={ mappedData() }
			{ ...props }
		/>
	)
}

export default EmployeesDropdown
