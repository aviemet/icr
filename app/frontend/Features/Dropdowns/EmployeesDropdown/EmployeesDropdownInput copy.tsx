import { forwardRef } from "react"
import { Select } from "@/Components/Inputs"
import { type AsyncDropdown } from ".."
import { useGetEmployeesAsOptions } from "@/queries"
import { isEmpty } from "lodash"

interface ItemsDropdownProps extends Omit<AsyncDropdown<Schema.EmployeesOptions>, 'name'> {
	name?: string
}

const EmployeesDropdownInput = forwardRef<HTMLInputElement, ItemsDropdownProps>(({
	label = 'Employee',
	name = 'employee_id',
	initialData,
	value,
	...props
},
ref
) => {
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
})

export default EmployeesDropdownInput