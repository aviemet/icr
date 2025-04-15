import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import AutocompleteInput, { type AutocompleteProps } from "@/Components/Inputs/AutocompleteInput"

import InputWrapper from "../Components/InputWrapper"

import { InputConflicts, type BaseFormInputProps } from "."


interface FormAutocompleteProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<AutocompleteProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {

	endpoint?: string
}

const FormAutocompleteComponent = forwardRef(<TForm extends NestedObject>(
	{
		name,
		model,
		onChange,
		onBlur,
		onFocus,
		id,
		required,
		field = true,
		endpoint,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	} : FormAutocompleteProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (parameter: string) => {
		setValue(parameter)
		onChange?.(parameter, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		if(onBlur) onBlur(value, form)
	}

	return (
		<InputWrapper
			type="text"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<AutocompleteInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				error={ errorKey ? form.getError(errorKey) : error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default FormAutocompleteComponent
