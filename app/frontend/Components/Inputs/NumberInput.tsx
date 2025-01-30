import React, { forwardRef } from "react"
import { NumberInput, type NumberInputProps as MantineNumberInputProps } from "@mantine/core"
import Label from "./Label"
import { withInjectedProps, type BaseInputProps } from "."
import InputWrapper from "./InputWrapper"

export interface NumberInputProps extends MantineNumberInputProps, BaseInputProps {}

const NumberInputComponent = forwardRef<HTMLInputElement, NumberInputProps>((
	{
		label,
		name,
		required = false,
		value,
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
})

export default NumberInputComponent
