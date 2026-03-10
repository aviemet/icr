import {
	TextInput as MantineTextInput,
	type TextInputProps as MantineTextInputProps,
} from "@mantine/core"
import React from "react"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"
import { CrossIcon } from "../Icons"

import { withInjectedProps, type BaseInputProps } from "."

export interface TextInputProps extends MantineTextInputProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	clearable?: boolean
}

export function TextInput({
	name,
	label,
	required = false,
	id,
	wrapper,
	wrapperProps,
	clearable = false,
	value,
	onChange,
	readOnly,
	disableAutofill = true,
	ref,
	...props
}: TextInputProps) {
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

	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantineTextInput
				ref={ ref }
				name={ name }
				id={ inputId }
				{ ...(value !== undefined && { value }) }
				onChange={ handleChange }
				required={ required }
				rightSection={ !readOnly && clearable && value !== "" && value !== undefined && <CrossIcon onClick={ handleClear } /> }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
