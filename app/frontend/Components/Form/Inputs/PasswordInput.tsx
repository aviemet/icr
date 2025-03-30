import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import PasswordInput, { type PasswordInputProps } from "@/Components/Inputs/PasswordInput"

import InputWrapper from "../Components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."


interface FormPasswordInputProps<TForm extends NestedObject>
	extends
	Omit<PasswordInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const FormInput = forwardRef(<TForm extends NestedObject>(
	{
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
		...props
	}: FormPasswordInputProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setValue(value)

		onChange?.(value, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		const value = e.target.value
		setValue(value)

		if(onBlur) onBlur(value, form)
	}

	return (
		<InputWrapper
			type="password"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<PasswordInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ e => onFocus?.(e.target.value, form) }
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default FormInput
