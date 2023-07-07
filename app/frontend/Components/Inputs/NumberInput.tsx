import React, { forwardRef } from 'react'
import { NumberInput, type NumberInputProps } from '@mantine/core'

export interface INumberInputProps extends NumberInputProps {}

const NumberInputComponent = forwardRef<HTMLInputElement, INumberInputProps>((
	{ name, value, id, size = 'md', mt = 'md', ...props },
	ref,
) => {
	const inputId = id || name

	return (
		<NumberInput
			id={ inputId }
			value={ Number(value) }
			ref={ ref }
			size={ size }
			mt={ mt }
			{ ...props }
		/>
	)
})

export default NumberInputComponent
