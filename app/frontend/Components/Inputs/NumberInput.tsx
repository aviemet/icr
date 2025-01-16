import React, { forwardRef } from 'react'
import { NumberInput, type NumberInputProps as MantineNumberInputProps } from '@mantine/core'
import Label from './Label'
import { withInjectedProps, type BaseInputProps } from '.'
import InputWrapper from './InputWrapper'

export interface NumberInputProps extends MantineNumberInputProps, BaseInputProps {}

const NumberInputComponent = forwardRef<HTMLInputElement, NumberInputProps>((
	{
		label,
		name,
		required = false,
		value,
		id,
		size = 'md',
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
				id={ inputId }
				value={ value }
				required={ required }
				ref={ ref }
				size={ size }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
})

export default NumberInputComponent
