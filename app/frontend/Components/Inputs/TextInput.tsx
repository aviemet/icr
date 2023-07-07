import React, { forwardRef } from 'react'
import { TextInput, type TextInputProps } from '@mantine/core'

export interface ITextInputProps extends TextInputProps {}

const TextInputComponent = forwardRef<HTMLInputElement, ITextInputProps>((
	{ name, id, size = 'md', radius = 'xs', mt = 'md', ...props },
	ref,
) => {
	const inputId = id || name

	return (
		<TextInput
			ref={ ref }
			name={ name }
			id={ inputId }
			size={ size }
			radius={ radius }
			mt={ mt }
			{ ...props }
		/>
	)
})

export default TextInputComponent
