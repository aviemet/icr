import React, { forwardRef } from 'react'
import { PasswordInput, type PasswordInputProps } from '@mantine/core'

export interface IPasswordInputProps extends PasswordInputProps {}

const PasswordInputComponent = forwardRef<HTMLInputElement, IPasswordInputProps>((
	{ name, id, size = 'md', mt = 'md', ...props },
	ref,
) => {
	const inputId = id || name

	return (
		<PasswordInput
			id={ inputId }
			ref={ ref }
			size={ size }
			mt={ mt }
			{ ...props }
		/>
	)
})

export default PasswordInputComponent
