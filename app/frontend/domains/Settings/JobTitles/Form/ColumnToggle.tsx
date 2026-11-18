import React, { useCallback } from "react"

import { useFormField, useFormFieldContext } from "@/components/Form"
import { Checkbox } from "@/components/Inputs"
import { useCheckboxState } from "@/lib/hooks"

import { tableRows, type Permissions } from "./formData"
import * as classes from "./PermissionsSection.css"

export interface ColumnToggleProps {
	permission: keyof Permissions
	label: string
}

export function ColumnToggle({ permission, label }: ColumnToggleProps) {
	const { getValue, setValue } = useFormFieldContext()
	const [isAdmin] = useFormField("permissions.admin")

	const columnProperties = useCallback(() => {
		return tableRows.reduce(({ length, selected }, row) => {
			if(row.permissions.includes(permission)) {
				length++
				if(getValue(`permissions.${row.model}.${permission}`)) {
					selected++
				}
			}
			return { length, selected }
		}, { length: 0, selected: 0 })
	}, [getValue, permission])

	const { length, selected } = columnProperties()
	const { allChecked, indeterminate } = useCheckboxState(length, selected)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		tableRows.forEach(row => {
			if(row.permissions.includes(permission)) {
				setValue(`permissions.${row.model}.${permission}`, e.target.checked)
			}
		})
	}

	return (
		<span className={ classes.columnHeader }>
			<Checkbox
				onChange={ handleChange }
				checked={ allChecked }
				indeterminate={ indeterminate }
				disabled={ Boolean(isAdmin) }
				aria-label={ `Toggle ${label} for all record types` }
			/>
			{ label }
		</span>
	)
}
