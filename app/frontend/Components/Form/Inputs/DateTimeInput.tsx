import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import DateTimeInput, { type DateTimeProps } from "@/Components/Inputs/DateTimeInput"
import { isUnset } from "@/lib"

import InputWrapper from "../Components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

interface DateTimeFormProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<DateTimeProps, InputConflicts>,
	BaseFormInputProps<Date | "", TForm> {}

const DateTime = forwardRef(<TForm extends NestedObject = NestedObject>({
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
}: DateTimeFormProps<TForm>,
	ref: ForwardedRef<HTMLButtonElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<Date | "", TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (date: Date | null) => {
		const dateWithValidEmptyType = isUnset(date) ? "" : date

		setValue(dateWithValidEmptyType)

		onChange?.(dateWithValidEmptyType, form)
	}

	const handleBlur = () => {
		onBlur?.(value, form)
	}

	const handleFocus = () => {
		onFocus?.(value, form)
	}

	return (
		<InputWrapper
			type="date"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<DateTimeInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value === "" ? undefined : value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ handleFocus }
				required={ required }
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default DateTime
