import React, { useCallback } from "react"
import { useForm } from "use-inertia-form"

import { Checkbox } from "@/components/Inputs"
import { useCheckboxState } from "@/lib/hooks"

import { tableRows, type JobTitleFormData, type Permissions } from "./formData"


interface ColumnToggleProps {
	permission: keyof Permissions
}

const ColumnToggle = ({ permission }: ColumnToggleProps) => {
	const { data, setData, getData } = useForm<JobTitleFormData>()
	// const checkboxRef = useRef<HTMLInputElement>(null)

	const columnProperties = useCallback(() => {
		return tableRows.reduce(({ length, selected }, row) => {
			if(row.permissions.includes(permission)) {
				length++
				if(getData(`person_group.permissions.${row.model}.${permission}`)) {
					selected++
				}
			}
			return { length, selected }
		}, { length: 0, selected: 0 })
	}, [])

	const { length, selected } = columnProperties()
	const { allChecked, indeterminate } = useCheckboxState(length, selected)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		tableRows.forEach(row => {
			if(row.permissions.includes(permission)) {
				setData(`person_group.permissions.${row.model}.${permission}`, e.target.checked)
			}
		})
	}

	return (
		<Checkbox
			// ref={ checkboxRef }
			onChange={ handleChange }
			checked={ allChecked }
			indeterminate={ indeterminate }
			mr={ 6 }
		/>
	)
}

export default ColumnToggle
