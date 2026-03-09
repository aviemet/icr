import { NumberInput, type NumberInputProps } from "@mantine/core"
import React from "react"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { withInjectedProps, type BaseInputProps } from "."

export interface CurrencyInputProps
	extends
	NumberInputProps,
	BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	symbol?: string | React.ReactNode
}

const NumberInputComponent = ({
	label,
	name,
	required = false,
	id,
	pattern,
	symbol = "$",
	wrapper,
	wrapperProps,
	disableAutofill = true,
	ref,
	...props
}: CurrencyInputProps) => {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<NumberInput
				id={ inputId }
				required={ required }
				ref={ ref }
				name={ name }
				leftSection={ symbol }
				hideControls
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}

export default NumberInputComponent
