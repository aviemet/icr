import clsx from "clsx"
import { forwardRef, type ForwardedRef } from "react"
import { useInertiaInput, type NestedObject } from "use-inertia-form"

import TextareaInput, { type TextareaProps } from "@/components/Inputs/Textarea"

import InputWrapper from "../components/InputWrapper"

import { InputConflicts, type BaseFormInputProps } from "."


interface FormTextareaProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<TextareaProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const Textarea = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
		label,
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
	}: FormTextareaProps<TForm>,
	ref: ForwardedRef<HTMLTextAreaElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value)
		onChange?.(e.target.value, form)
	}
	const handleBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if(onBlur) onBlur(e.target.value, form)
	}

	return (
		<InputWrapper
			type="textarea"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<>
				{ label && <label className={ clsx({ required }) } htmlFor={ id || inputId }>
					{ label }
				</label> }
				<TextareaInput
					ref={ ref }
					id={ id || inputId }
					name={ inputName }
					onChange={ handleChange }
					onBlur={ handleBlur }
					onFocus={ e => onFocus?.(e.target.value, form) }
					value={ value }
					required={ required }
					error={ errorKey ? form.getError(errorKey) : error }
					wrapper={ false }
					{ ...props }
				>
				</TextareaInput>
			</>
		</InputWrapper>
	)
})

export default Textarea
