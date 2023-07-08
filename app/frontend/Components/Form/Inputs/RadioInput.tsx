import React from 'react'
import { RadioInput } from '@/Components/Inputs'
import { type IRadioInputProps } from '@/Components/Inputs/RadioInput'
import { IFormInputProps } from '.'
import { useInertiaInput } from 'use-inertia-form'

interface IRadioFormInputProps extends Omit<IRadioInputProps, 'onBlur'|'onChange'|'name'>, IFormInputProps<string> {}

const FormRadioInput = ({
	id,
	name,
	model,
	onChange,
	onBlur,
	errorKey,
	...props
}: IRadioFormInputProps) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string>({ name, model })

	const handleChange = (choice: string) => {
		setValue(choice)

		if(onChange) onChange(choice, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		if(onBlur) onBlur(value, form)
	}

	return (
		<RadioInput
			id={ id || inputId }
			name={ inputName }
			value={ value }
			onChange={ handleChange }
			onBlur={ handleBlur }
			error={ errorKey ? form.getError(errorKey) : error }
			{ ...props }
		/>
	)
}

export default FormRadioInput
