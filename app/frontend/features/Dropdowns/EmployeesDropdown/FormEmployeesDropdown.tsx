import { isEmpty } from "lodash-es"

import { Select } from "@/components/Form/Inputs"
import { useGetEmployeesAsOptions } from "@/queries"

import { type FormAsyncDropdown } from ".."

export interface ItemsDropdownProps extends Omit<FormAsyncDropdown<Schema.EmployeesOptions>, "name"> {
	name?: string
}

export function EmployeesDropdownInput({
	label = "Employee",
	name = "employee_id",
	initialData,
	value,
	...props
}: ItemsDropdownProps) {
	const { data, isStale, refetch } = useGetEmployeesAsOptions({
		enabled: true,
		initialData,
	})

	const options = data === undefined
		? []
		: data.map(employee => ({
			label: employee.person.name,
			value: employee.id,
		}))

	return <Select
		label={ label }
		name={ name }
		options={ options }
		comboboxProps={ { withinPortal: false } }
		onDropdownOpen={ () => {
			if(isEmpty(data) || isStale) refetch()
		} }
		searchable
		clearable
		value={ value }
		{ ...props }
	/>
}
