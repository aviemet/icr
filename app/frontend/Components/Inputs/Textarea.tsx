import React from 'react'
import { Textarea, type TextareaProps } from '@mantine/core'

export interface ITextareaProps extends TextareaProps { }

const TextareaComponent = ({
	name,
	value,
	id,
	radius = 'xs',
	mt = 'md',
	...props
}: ITextareaProps) => {
	const inputId = id || name

	return (
		<Textarea
			id={ inputId }
			name={ name }
			value={ value ? String(value) : '' }
			radius={ radius }
			{ ...props }
		>
		</Textarea>
	)
}

export default TextareaComponent
