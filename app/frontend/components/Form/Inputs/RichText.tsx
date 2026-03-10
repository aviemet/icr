import clsx from "clsx"
import React from "react"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import { RichText as BaseRichText, type RichTextInputProps } from "@/components/Inputs/RichText"

import { FieldProps } from "../components/Field"
import { InputWrapper } from "../components/InputWrapper"

import { type InputConflicts, type BaseFormInputProps } from "."


export interface FormRichTextInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<RichTextInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {
	ref?: React.Ref<HTMLDivElement>
	wrapperProps?: Omit<FieldProps, "children">
}

export function RichText<TForm extends NestedObject = NestedObject>({
	label,
	name,
	required = false,
	id,
	onChange,
	onBlur,
	onFocus,
	model,
	field = true,
	wrapperProps,
	errorKey,
	defaultValue,
	clearErrorsOnChange,
	ref,
	...props
}: FormRichTextInputProps<TForm>) {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (v: string) => {
		setValue(v)
		onChange?.(v, form)
	}

	const handleBlur = () => {
		onBlur?.(value, form )
	}

	return (
		<InputWrapper
			type="textarea"
			wrapped={ props.hidden !== true && field }
			required={ required }
			errors={ !!error }
			{ ...wrapperProps }
		>
			{ label && <label className={ clsx({ required }) } htmlFor={ id || inputId }>
				{ label }
			</label> }
			<BaseRichText
				ref={ ref }
				id={ id }
				name={ inputName }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onFocus={ () => onFocus?.(value, form ) }
				value={ value }
				wrapper={ false }
				{ ...props }
			/>
		</InputWrapper>
	)
}
