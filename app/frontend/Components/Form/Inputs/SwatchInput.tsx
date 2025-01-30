import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"
import SwatchInput, { type SwatchInputProps } from "@/Components/Inputs/SwatchInput"
import { type InputConflicts, type BaseFormInputProps } from "."
import InputWrapper from "../Components/InputWrapper"

interface FormSwatchInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<SwatchInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {
}

const SwatchFormInput = forwardRef(<TForm extends NestedObject = NestedObject>(
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
	}: FormSwatchInputProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
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
})

export default SwatchFormInput
