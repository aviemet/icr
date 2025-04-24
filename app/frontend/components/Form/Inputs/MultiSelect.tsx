import { type ComboboxData } from "@mantine/core"
import { forwardRef, type ForwardedRef } from "react"
import { NestedObject, UseFormProps, useInertiaInput } from "use-inertia-form"

import MultiSelect, { type MultiSelectInputProps } from "@/components/Inputs/MultiSelect"
import { exclude, isUnset, coerceArray } from "@/lib"

import InputWrapper from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."

type OmittedDropdownTypes = InputConflicts | "onDropdownOpen" | "onDropdownClose" | "onOptionSubmit" | "onClear"
export interface FormMultiSelectProps<TForm extends NestedObject = NestedObject>
	extends Omit<MultiSelectInputProps, OmittedDropdownTypes>,
	Omit<BaseFormInputProps<string[], TForm>, "onChange" | "onBlur" | "onFocus"> {

	value?: string[]
	onChange?: (values: string[], options: ComboboxData, form: UseFormProps<TForm>) => void
	onBlur?: (values: string[], options: ComboboxData, form: UseFormProps<TForm>) => void
	onFocus?: (values: string[], options: ComboboxData, form: UseFormProps<TForm>) => void
	onClear?: (options: ComboboxData, form: UseFormProps<TForm>) => void
	onDropdownOpen?: (options: ComboboxData, form: UseFormProps<TForm>) => void
	onDropdownClose?: (options: ComboboxData, form: UseFormProps<TForm>) => void
	onOptionSubmit?: (values: string[], options: ComboboxData, form: UseFormProps<TForm>) => void
}

const MultiSelectComponent = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
		options = [],
		label,
		required,
		id,
		name,
		model,
		field = true,
		onBlur,
		onChange,
		onFocus,
		onClear,
		onDropdownOpen,
		onDropdownClose,
		onOptionSubmit,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	}: FormMultiSelectProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string[], TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (values: string[]) => {
		setValue(values)

		onChange?.(values, options || [], form)
	}

	const handleBlur = () => {
		onBlur?.(value, options || [], form)
	}

	const handleFocus = () => {
		onFocus?.(value, options || [], form)
	}

	const handleClear = () => {
		onClear?.(value, form)
	}

	const handleDropdownOpen = () => {
		onDropdownOpen?.(options || [], form)
	}

	const handleDropdownClose = () => {
		onDropdownClose?.(options || [], form)
	}

	const handleOptionSubmit = () => {
		onOptionSubmit?.(value, options || [], form)
	}

	return (
		<InputWrapper
			type="select"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			<MultiSelect
				ref={ ref }
				// Add "search" suffix to prevent password managers trying to autofill dropdowns
				id={ `${id || inputId}-search` }
				autoComplete="off"
				name={ inputName }
				label={ label }
				value={ isUnset(value) ? [] : coerceArray(value) }
				error={ error }
				options={ options }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ handleFocus }
				onClear={ handleClear }
				onDropdownOpen={ handleDropdownOpen }
				onDropdownClose={ handleDropdownClose }
				onOptionSubmit={ handleOptionSubmit }
				wrapper={ false }
				{ ...exclude(props, "value") }
			/>
		</InputWrapper>
	)
})

export default MultiSelectComponent
