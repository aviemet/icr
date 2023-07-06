import React, { forwardRef } from 'react'
import { PasswordInput, type PasswordInputProps } from '@mantine/core'
import Label from './Label'

export interface IPasswordInputProps extends PasswordInputProps {}

const PasswordInputComponent = forwardRef<HTMLInputElement, IPasswordInputProps>((
	{ label, name, required = false, id, size = 'md', mt = 'md', ...props },
	ref,
) => {
	const inputId = id || name

	return (
		<>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<PasswordInput
				id={ inputId }
				required={ required }
				ref={ ref }
				size={ size }
				mt={ mt }
				{ ...props }
			/>
		</>
	)
})

export default PasswordInputComponent
