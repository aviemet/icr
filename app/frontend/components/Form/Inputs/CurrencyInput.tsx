import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import CurrencyInput, { type CurrencyInputProps } from "@/components/Inputs/CurrencyInput"
import { useCurrency } from "@/lib/hooks"
import { type Money } from "@/types"

import InputWrapper from "../components/InputWrapper"

import { InputConflicts, type BaseFormInputProps } from "."

interface INumberInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<CurrencyInputProps, InputConflicts>,
	BaseFormInputProps<number, TForm> {

}

const FormInput = forwardRef(<TForm extends NestedObject = NestedObject>(
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
	} : INumberInputProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<number | Money, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const [amount, formatter] = useCurrency({
		amount: value,
	})

	const handleChange = (value: string | number) => {
		const numberValue = Number(value)
		setValue(numberValue)

		onChange?.(numberValue, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		const value = Number(e.target.value)
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
			<CurrencyInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				value={ formatter.format(amount) }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ e => onFocus?.(Number(e.target.value), form) }
				error={ error }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default FormInput
