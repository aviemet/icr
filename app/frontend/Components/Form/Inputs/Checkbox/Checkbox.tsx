import { useInertiaInput, type NestedObject } from "use-inertia-form"
import CheckboxInput, { type CheckboxProps } from "@/Components/Inputs/Checkbox"
import FormCheckboxGroup from "./Group"
import { type InputConflicts, type BaseFormInputProps } from ".."
import InputWrapper from "../../Components/InputWrapper"

export interface FormCheckboxProps<TForm extends NestedObject>
	extends
	Omit<CheckboxProps, InputConflicts>,
	BaseFormInputProps<boolean, TForm> {}

const FormCheckboxComponent = <TForm extends NestedObject>(
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
			<CheckboxInput
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

FormCheckboxComponent.Group = FormCheckboxGroup

export default FormCheckboxComponent
