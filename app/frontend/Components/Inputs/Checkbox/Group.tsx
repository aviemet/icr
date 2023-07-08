import { Checkbox, type CheckboxGroupProps } from '@mantine/core'
import React from 'react'

export interface InputCheckboxGroupProps extends CheckboxGroupProps {
	name?: string
}

const CheckboxGroup = ({ children, ...props }: InputCheckboxGroupProps) => {
	return (
		<Checkbox.Group { ...props }>
			{ children }
		</Checkbox.Group>
	)
}

export default CheckboxGroup
