import React from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import SegmentedControl, { type SegmentedControlProps } from "@/components/Inputs/SegmentedControl"

import { type FieldProps } from "../components/Field"
import InputWrapper from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

interface FormSegmentedControlProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<SegmentedControlProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {
	ref?: React.Ref<HTMLDivElement>
	wrapperProps?: Omit<FieldProps, "children">
}

function FormSegmentedControl<TForm extends NestedObject = NestedObject>({
	options,
	name,
	id,
	model,
	onChange,
	onBlur,
	onFocus,
	required,
	field = true,
	wrapperProps,
	errorKey,
	defaultValue,
	clearErrorsOnChange,
	ref,
	...props
}: FormSegmentedControlProps<TForm>) {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (v: string) => {
		setValue(v)

		onChange?.(v, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		onBlur?.(value, form)
	}

	const handleFocus = (e: React.FocusEvent<HTMLDivElement, Element>) => {
		onFocus?.(value, form)
	}

	return (
		<InputWrapper
			type="radio"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<SegmentedControl
				ref={ ref }
				options={ options }
				id={ id || inputId }
				name={ inputName }
				value={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ handleFocus }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
}

export default FormSegmentedControl
