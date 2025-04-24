import React, { forwardRef, useState } from "react"
import { InputProps } from "react-html-props"

import HiddenInput from "./HiddenInput"
import SwatchPicker from "../SwatchPicker"
import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { type BaseInputProps } from "."


export interface SwatchInputProps
	extends
	Omit<InputProps, "onChange">,
	Omit<BaseInputProps, "disableAutofill"> {
	label?: React.ReactNode
	initialValue?: string
	onChange?: (color: string) => void
	wrapperProps?: Record<string, any>
}

const SwatchInput = forwardRef<HTMLInputElement, SwatchInputProps>((
	{ label, id, name, required, initialValue, onChange, wrapper, wrapperProps, ...props },
	ref,
) => {
	const [color, setColor] = useState(initialValue || "")

	const handleChange = (color: string) => {
		setColor(color)

		onChange?.(color)
	}

	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<HiddenInput value={ color } id={ inputId } name={ name } { ...props } ref={ ref } />
			<SwatchPicker value={ color } onChange={ handleChange } />
		</InputWrapper>
	)
})

export default SwatchInput
