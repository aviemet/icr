import { TextInput, type TextInputProps as MantineTextInputProps } from "@mantine/core"
import React, { forwardRef } from "react"

import { useFormInputName } from "./FormContext"
import { CrossIcon } from "../Icons"
import { withInjectedProps, type BaseInputProps } from "../Inputs"
import InputWrapper from "../Inputs/InputWrapper"
import Label from "../Inputs/Label"


export interface TextInputProps extends MantineTextInputProps, BaseInputProps {
	clearable?: boolean
}

const TextInputComponent = forwardRef<HTMLInputElement, TextInputProps>((
	{
		name,
		label,
		required = false,
		id,
		wrapper,
		wrapperProps,
		clearable = false,
		value = "",
		onChange,
		readOnly,
		disableAutofill = true,
		...props
	},
	ref,
) => {
	const inputName = useFormInputName(name)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e)
	}

	const handleClear = () => {
		const fakeEvent = {
			target: {
				value: "",
			},
		} as React.ChangeEvent<HTMLInputElement>
		handleChange(fakeEvent)
	}

	const inputId = id || inputName

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<TextInput
				ref={ ref }
				name={ inputName }
				id={ inputId }
				value={ value }
				onChange={ handleChange }
				required={ required }
				rightSection={ !readOnly && clearable && value !== "" && <CrossIcon onClick={ handleClear } /> }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
})

export default TextInputComponent
