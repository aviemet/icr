import React from 'react'
import CheckboxGroup, { type InputCheckboxGroupProps } from '@/Components/Inputs/Checkbox/Group'
import { useInertiaInput } from 'use-inertia-form'
import { Checkbox } from '@/Components/Inputs'

type CheckboxInputOption = {
	value: string
	label: string
}

export interface FormCheckboxGroupProps extends Omit<InputCheckboxGroupProps, 'children'> {
	name: string
	model?: string
	options: CheckboxInputOption[]
}

const FormCheckboxGroup = ({
	name,
	model,
	options,
}: FormCheckboxGroupProps) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string[]>({ name, model })

	return (
		<CheckboxGroup
			name={ inputName }
			value={ value }
			onChange={ setValue }
		>
			{ options.map(option => <Checkbox key={ option.value } value={ option.value } label={ option.label } />) }
		</CheckboxGroup>
	)
}

export default FormCheckboxGroup
