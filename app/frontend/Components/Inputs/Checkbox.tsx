import React, { forwardRef } from 'react'
import { Checkbox, Sx, type CheckboxProps } from '@mantine/core'

export interface ICheckboxProps extends CheckboxProps {
	sx?: Sx
}

const CheckboxComponent = forwardRef<HTMLInputElement, ICheckboxProps>((
	{ id, name, sx, ...props },
	ref,
) => {
	const inputId = id ?? name

	return (
		<Checkbox
			ref={ ref }
			id={ inputId }
			name={ name }
			sx={ [{  }, sx] }
			{ ...props }
		/>
	)
})

export default CheckboxComponent
