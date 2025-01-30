import { forwardRef, type ForwardedRef } from "react"
import TextInput, { type TextInputProps } from "@/Components/Inputs/TextInput"
import { useInertiaInput, type NestedObject } from "use-inertia-form"
import { type InputConflicts, type BaseFormInputProps } from "."
import InputWrapper from "../Components/InputWrapper"

interface FormTextInputProps<TForm extends NestedObject>
	extends
	Omit<TextInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const TextFormInput = forwardRef(<TForm extends NestedObject>(
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
	}: FormTextInputProps<TForm>,
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

		onBlur?.(value, form)
	}

	return (
		<InputWrapper
			type="text"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<TextInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ e => onFocus?.(e.target.value, form) }
				error={ errorKey ? form.getError(errorKey) : error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default TextFormInput
