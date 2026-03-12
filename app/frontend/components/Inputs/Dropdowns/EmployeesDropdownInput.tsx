import { isEmpty } from "lodash-es"
import React from "react"

import { Select } from "@/components/Inputs"
import { useGetEmployeesAsOptions } from "@/queries"

import { type AsyncDropdown } from "."

interface ItemsDropdownProps extends Omit<AsyncDropdown<Schema.EmployeesOptions>, "name"> {
	ref?: React.Ref<HTMLInputElement>
	name?: string
}

export function EmployeesDropdown({
	label = "Employee",
	name = "employee_id",
	initialData,
	value,
	ref,
	...props
}: ItemsDropdownProps) {
	const { data, isStale, refetch } = useGetEmployeesAsOptions({
		enabled: value !== undefined,
		initialData,
	})

	return <Select
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(employee => ({
				label: employee.person.name,
				value: employee.id,
			}))
		}
		onDropdownOpen={ () => {
			if(isEmpty(data) || isStale) refetch()
		} }
		searchable
		clearable
		value={ value }
		{ ...props }
	/>
}
