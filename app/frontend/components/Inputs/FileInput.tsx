import { Input } from "@mantine/core"
import React from "react"

import { useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type BaseInputProps } from "."

export interface FileInputProps extends Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLInputElement>
	label?: string
	id?: string
	accept?: string
	error?: string
}

export function FileInput({
	label,
	name,
	required = false,
	id,
	accept,
	wrapper,
	error,
	ref,
}: FileInputProps) {
	const fieldError = useFormFieldError(name)
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<Input
				ref={ ref }
				component="input"
				type="file"
				id={ inputId }
				name={ name }
				accept={ accept }
				required={ required }
				error={ error ?? fieldError }
			/>
		</InputWrapper>
	)
}
