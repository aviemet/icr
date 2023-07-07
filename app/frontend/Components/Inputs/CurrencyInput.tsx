import React, { forwardRef } from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'

export interface ICurrencyInputProps extends TextInputProps {}

const TextInputComponent = forwardRef<HTMLInputElement, ICurrencyInputProps>((
	{ name, value, id, pattern, size = 'md', mt = 'md', ...props },
	ref,
) => {
	const inputId = id || name

	return (
		<TextInput
			id={ inputId }
			ref={ ref }
			size={ size }
			name={ name }
			value={ value }
			mt={ mt }
			icon='$'
			{ ...props }
		/>
	)
})

export default TextInputComponent
