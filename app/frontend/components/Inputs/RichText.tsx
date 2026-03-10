import React from "react"

import { RichTextEditor, type RichTextEditorProps } from "../RichTextEditor"
import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type BaseInputProps } from "."

export interface RichTextInputProps
	extends
	RichTextEditorProps,
	Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLDivElement>
	label?: React.ReactNode
	value: string
	required?: boolean
	id?: string
	name?: string
}

export function RichText({
	label,
	name,
	required = false,
	id,
	value,
	wrapper,
	ref,
	...props
}: RichTextInputProps) {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<RichTextEditor ref={ ref } id={ inputId } { ...props }>
				{ value }
			</RichTextEditor>
		</InputWrapper>
	)
}
