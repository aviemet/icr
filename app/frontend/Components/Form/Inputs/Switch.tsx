import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import SwitchInput, { type SwitchProps } from "@/Components/Inputs/Switch"

import InputWrapper from "../Components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

interface FormSwitchProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<SwitchProps, InputConflicts>,
	BaseFormInputProps<boolean, TForm> {}

const FormSwitchComponent = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
		name,
		onChange,
		onBlur,
		onFocus,
		id,
		required,
		model,
		field = true,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	}: FormSwitchProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<boolean, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.checked)
		onChange?.(e.target.checked, form)
	}

	const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.checked)
		if(onBlur) onBlur(e.target.checked, form)
	}

	return (
		<InputWrapper
			type="checkbox"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<SwitchInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				defaultChecked={ Boolean(value) }
				checked={ value }
				value={ name }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ e => onFocus?.(e.target.checked, form) }
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default FormSwitchComponent
