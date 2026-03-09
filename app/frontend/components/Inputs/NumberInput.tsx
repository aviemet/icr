import { NumberInput, type NumberInputProps as MantineNumberInputProps } from "@mantine/core"
import React from "react"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { withInjectedProps, type BaseInputProps } from "."

export interface NumberInputProps extends MantineNumberInputProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
}

const NumberInputComponent = ({
	label,
	name,
	required = false,
	value,
	id,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	ref,
	...props
}: NumberInputProps) => {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<NumberInput
				ref={ ref }
				id={ inputId }
				value={ value }
				required={ required }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}

export default NumberInputComponent
