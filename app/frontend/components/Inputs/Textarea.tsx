import {
	Textarea as MantineTextarea,
	type TextareaProps as MantineTextareaProps,
} from "@mantine/core"
import React from "react"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { withInjectedProps, type BaseInputProps } from "."


export interface TextareaProps extends MantineTextareaProps, BaseInputProps {
	ref?: React.Ref<HTMLTextAreaElement>
}

export function Textarea({
	label,
	name,
	required = false,
	id,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	ref,
	...props
}: TextareaProps) {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantineTextarea
				ref={ ref }
				id={ inputId }
				name={ name }
				required={ required }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			>
			</MantineTextarea>
		</InputWrapper>
	)
}
