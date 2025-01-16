import React, { forwardRef } from "react"
import { Textarea, type TextareaProps as MantineTextareaProps } from "@mantine/core"
import { withInjectedProps, type BaseInputProps } from "."
import Label from "./Label"
import InputWrapper from "./InputWrapper"

export interface TextareaProps extends MantineTextareaProps, BaseInputProps {}

const TextareaComponent = forwardRef<HTMLTextAreaElement, TextareaProps>((
	{
		label,
		name,
		required = false,
		id,
		wrapper,
		wrapperProps,
		disableAutofill = true,
		...props
	},
	ref,
) => {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<Textarea
				ref={ ref }
				id={ inputId }
				name={ name }
				required={ required }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			>
			</Textarea>
		</InputWrapper>
	)
})

export default TextareaComponent
