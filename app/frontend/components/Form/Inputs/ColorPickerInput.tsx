import React from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import {
	ColorPickerInput as BaseColorPickerInput,
	type ColorPickerInputProps,
} from "@/components/Inputs/ColorPickerInput"

import { InputWrapper } from "../components/InputWrapper"

import { type BaseFormInputProps, type InputConflicts } from "."

export interface FormColorPickerInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<ColorPickerInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {
	ref?: React.Ref<HTMLInputElement>
	id?: string
}

export function ColorPickerInput<TForm extends NestedObject = NestedObject>({
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
}: FormColorPickerInputProps<TForm>) {
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

	const handleFocus = () => {
		onFocus?.(value, form)
	}

	return (
		<InputWrapper
			type="text"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<BaseColorPickerInput
				ref={ ref }
				value={ value }
				onChange={ handleChange }
				onFocus={ handleFocus }
				name={ inputName }
				id={ inputId }
				wrapper={ false }
				required={ required }
				{ ...props }
			/>
		</InputWrapper>
	)
}
