import { PasswordInput as MantinePasswordInput, type PasswordInputProps as MantinePasswordInputProps } from "@mantine/core"
import React from "react"

import { useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type BaseInputProps } from "."


export interface PasswordInputProps
	extends
	MantinePasswordInputProps,
	Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLInputElement>
}

export function PasswordInput({
	label,
	name,
	required = false,
	id,
	wrapper,
	wrapperProps,
	error,
	ref,
	...props
}: PasswordInputProps) {
	const fieldError = useFormFieldError(name)
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantinePasswordInput
				id={ inputId }
				name={ name }
				required={ required }
				error={ error ?? fieldError }
				ref={ ref }
				{ ...props }
			/>
		</InputWrapper>
	)
}
