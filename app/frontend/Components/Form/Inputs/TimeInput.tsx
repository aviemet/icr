import { forwardRef, type ForwardedRef } from "react"
import TimeInput, { type TimeInputProps } from "@/Components/Inputs/TimeInput"
import { useInertiaInput, type NestedObject } from "use-inertia-form"
import { type InputConflicts, type BaseFormInputProps } from "."
import InputWrapper from "../Components/InputWrapper"

interface FormTimeInputProps<TForm extends NestedObject>
	extends
	Omit<TimeInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const TimeFormInput = forwardRef(<TForm extends NestedObject>(
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
	}: FormTimeInputProps<TForm>,
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
			<TimeInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value }
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

export default TimeFormInput
