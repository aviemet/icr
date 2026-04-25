import React, { useCallback } from "react"

import { Table } from "@/components"
import { useFormFieldContext } from "@/components/Form"
import { Checkbox, Switch } from "@/components/Inputs"
import { useCheckboxState } from "@/lib/hooks"

export interface SwitchRowProps {
	label: string
	model: string
	permissions: string[]
}

export function SwitchRow({ label, model, permissions }: SwitchRowProps) {
	const { getValue, setValue } = useFormFieldContext()
	const isCompanyAdmin = false

	const columnProperties = useCallback(() => {
		return permissions.reduce(({ length, selected }, permission) => {
			length++
			if(getValue(`permissions.${model}.${permission}`)) {
				selected++
			}
			return { length, selected }
		}, { length: 0, selected: 0 })
	}, [getValue, model, permissions])

	const { length, selected } = columnProperties()
	const { allChecked, indeterminate } = useCheckboxState(length, selected)

	const setRow = useCallback((checked: boolean) => {
		permissions.forEach(permission => {
			setValue(`permissions.${model}.${permission}`, checked)
		})
	}, [permissions, setValue, model])

	return (
		<Table.Row>
			<Table.Cell>
				<Checkbox
					onChange={ (e) => setRow(e.target.checked) }
					checked={ allChecked }
					indeterminate={ indeterminate }
					disabled={ isCompanyAdmin }
				/>
			</Table.Cell>
			<Table.Cell>{ label }</Table.Cell>
			{ permissions.map(permission => (
				<Table.Cell key={ `${model}_${permission}` }>
					<Switch
						name={ `permissions.${model}.${permission}` }
						disabled={ isCompanyAdmin }
					/>
				</Table.Cell>
			)) }
		</Table.Row>
	)
}


