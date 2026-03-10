import { useInertiaInput, type NestedObject } from "use-inertia-form"

import { Checkbox, type CheckboxProps } from "@/components/Inputs/Checkbox"

import { type InputConflicts, type BaseFormInputProps } from ".."
import { CheckboxGroup } from "./Group"
import { InputWrapper } from "../../components/InputWrapper"

export interface FormCheckboxProps<TForm extends NestedObject>
	extends
	Omit<CheckboxProps, InputConflicts>,
	BaseFormInputProps<boolean, TForm> {}

function CheckboxInput <TForm extends NestedObject>(
	{
		name,
		onChange,
		onBlur,
		onFocus,
		id,
		required,
		className,
		model,
		field = true,
		style,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	}: FormCheckboxProps<TForm>,
) {
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

	const handleBlur = () => {
		onBlur?.(value, form)
	}

	return (
		<InputWrapper
			type="checkbox"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<Checkbox
				id={ id || inputId }
				className={ className }
				name={ inputName }
				value={ name }
				checked={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ e => onFocus?.(e.target.checked, form) }
				error={ error }
				style={ [{ padding: "14px 10px" }, style] }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
}

CheckboxInput.Group = CheckboxGroup

export { CheckboxInput }
