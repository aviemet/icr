import { isEmpty } from "es-toolkit/compat"
import React from "react"

import { Select } from "@/components/Inputs"
import { useGetDepartmentsAsOptions } from "@/queries/departments"

import { type AsyncDropdown } from "."

export interface DepartmentsDropdownProps extends Omit<AsyncDropdown<Schema.EmployeeDepartmentsOptions>, "name"> {
	name?: string
}

export function DepartmentsDropdown({
	label = "Department",
	name = "department_id",
	initialData,
	...props
}: DepartmentsDropdownProps) {
	const { data, isStale, refetch } = useGetDepartmentsAsOptions({
		initialData,
	})

	return (
		<Select
			label={ label }
			name={ name }
			options={ data === undefined
				? []
				: data.map(department => ({
					label: department.name,
					value: department.id,
				})) }
			onDropdownOpen={ () => {
				if(isEmpty(data) || isStale) refetch()
			} }
			searchable
			clearable
			{ ...props }
		/>
	)
}
