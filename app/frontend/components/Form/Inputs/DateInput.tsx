import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import { DateInput, type DateInputValue } from "@/components/Inputs"
import { type DateInputProps } from "@/components/Inputs/DateInput"
import { isUnset } from "@/lib"

import InputWrapper from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

interface FormDateInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<DateInputProps, InputConflicts>,
	BaseFormInputProps<Exclude<DateInputValue, undefined | null> | "", TForm> {}

const FormDateInput = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
		name,
		required,
		onChange,
		onBlur,
		onFocus,
		id,
		model,
		field = true,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	}: FormDateInputProps<TForm>,
	ref: ForwardedRef<HTMLButtonElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<
		Exclude<DateInputValue, undefined | null> | "",
		TForm
	>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (date: DateInputValue) => {
		const dateWithValidEmptyType = (isUnset(date) ? "" : date)

		setValue(dateWithValidEmptyType)

		onChange?.(dateWithValidEmptyType, form)
	}

	const handleBlur = () => {
		onBlur?.(value, form)
	}

	return (
		<InputWrapper
			type="date"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<DateInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ isUnset(value) ? undefined : value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				required={ required }
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default FormDateInput
