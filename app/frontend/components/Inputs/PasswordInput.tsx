import { PasswordInput, type PasswordInputProps as MantinePasswordInputProps } from "@mantine/core"
import React, { forwardRef } from "react"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { type BaseInputProps } from "."


export interface PasswordInputProps
	extends
	MantinePasswordInputProps,
	Omit<BaseInputProps, "disableAutofill"> {}

const PasswordInputComponent = forwardRef<HTMLInputElement, PasswordInputProps>((
	{ label, name, required = false, id, wrapper, wrapperProps, ...props },
	ref,
) => {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<PasswordInput
				id={ inputId }
				required={ required }
				ref={ ref }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default PasswordInputComponent
