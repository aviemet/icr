import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import SegmentedControl, { type SegmentedControlProps } from "@/components/Inputs/SegmentedControl"

import InputWrapper from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

interface FormSegmentedControlProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<SegmentedControlProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const FormSegmentedControl = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
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
		...props
	}: FormSegmentedControlProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
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
})

export default FormSegmentedControl
