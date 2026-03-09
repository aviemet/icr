import React from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import NumberInput, { type NumberInputProps } from "@/components/Inputs/NumberInput"

import InputWrapper from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."


interface FormNumberInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<NumberInputProps, InputConflicts>,
	BaseFormInputProps<number, TForm> {
	ref?: React.Ref<HTMLInputElement>
}

function FormInput<TForm extends NestedObject = NestedObject>({
	name,
	model,
	onChange,
	onBlur,
	onFocus,
	id,
	required,
	field = true,
	wrapperProps,
	errorKey,
	defaultValue,
	clearErrorsOnChange,
	ref,
	...props
}: FormNumberInputProps<TForm>) {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<number, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (val: string | number) => {
		const v = Number(val)
		setValue(v)

		onChange?.(v, form)
	}

	return (
		<InputWrapper
			type="number"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<NumberInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value as number }
				onChange={ handleChange }
				onBlur={ () => onBlur?.(value, form) }
				onFocus={ () => onFocus?.(value, form) }
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
}

export default FormInput
