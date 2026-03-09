import React from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import SwatchInput, { type SwatchInputProps } from "@/components/Inputs/SwatchInput"

import InputWrapper from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

interface FormSwatchInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<SwatchInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {
	ref?: React.Ref<HTMLInputElement>
}

function SwatchFormInput<TForm extends NestedObject = NestedObject>({
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
}: FormSwatchInputProps<TForm>) {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (color: string) => {
		setValue(color)

		onChange?.(color, form)
	}

	return (
		<InputWrapper
			type="text"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<SwatchInput
				ref={ ref }
				initialValue={ value }
				value={ value }
				onChange={ handleChange }
				onFocus={ e => onFocus?.(e.target.value, form) }
				name={ inputName }
				id={ inputId }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
}

export default SwatchFormInput
