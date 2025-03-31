import React, { useCallback } from "react"
import { NestedFields, useForm } from "use-inertia-form"

import { Table } from "@/Components"
import { Switch } from "@/Components/Form"
import { Checkbox } from "@/Components/Inputs"
import { useCheckboxState } from "@/lib/hooks"

import { type JobTitleFormData } from "./formData"

interface SwitchRowProps {
	label: string
	model: string
	permissions: string[]
}

const SwitchRow = ({ label, model, permissions }: SwitchRowProps) => {
	const { data, setData, getData } = useForm<JobTitleFormData>()

	const isCompanyAdmin = false

	const columnProperties = useCallback(() => {
		return permissions.reduce(({ length, selected }, permission) => {
			length++
			if(getData(`person_group.permissions.${model}.${permission}`)) {
				selected++
			}
			return { length, selected }
		}, { length: 0, selected: 0 })
	}, [])

	const { length, selected } = columnProperties()
	const { allChecked, indeterminate } = useCheckboxState(length, selected)

	const setRow = useCallback((model: string, checked: boolean) => {
		permissions.forEach(permission => {
			setData(`${model}.${permission}`, checked)
		})
	}, [])

	let checked = {}

	return (
		<NestedFields model={ model }>
			<Table.Row>
				<Table.Cell>
					<Checkbox
						onChange={ e => setRow(`person_group.permissions.${model}`, e.target.checked) }
						checked={ allChecked }
						indeterminate={ indeterminate }
						disabled={ isCompanyAdmin }
					/>
				</Table.Cell>
				<Table.Cell>{ label }</Table.Cell>
				{ permissions.map(permission => (
					<Table.Cell key={ `${model}_${permission}` }>
						<Switch
							name={ permission }
							field={ false }
							disabled={ isCompanyAdmin }
							{ ...checked }
						/>
					</Table.Cell>
				)) }
			</Table.Row>
		</NestedFields>
	)
}

export default SwitchRow


