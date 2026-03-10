import React from "react"
import { useInertiaInput, type NestedObject } from "use-inertia-form"

import { TimeInput as BaseTimeInput, type TimeInputProps } from "@/components/Inputs/TimeInput"

import { InputWrapper } from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."


export interface FormTimeInputProps<TForm extends NestedObject>
	extends
	Omit<TimeInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {
	ref?: React.Ref<HTMLDivElement>
}

export function TimeInput<TForm extends NestedObject>({
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
}: FormTimeInputProps<TForm>) {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (nextValue: string) => {
		setValue(nextValue)
		onChange?.(nextValue, form)
	}

	const handleBlur = () => {
		onBlur?.(value, form)
	}

	return (
		<InputWrapper
			type="time"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<BaseTimeInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				required={ required }
				hoursInputLabel="Hours"
				minutesInputLabel="Minutes"
				amPmInputLabel="AM/PM"
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
}
