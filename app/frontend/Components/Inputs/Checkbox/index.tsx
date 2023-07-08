import React, { forwardRef } from 'react'
import { Checkbox, type CheckboxProps } from '@mantine/core'
import { ForwardRefWithStaticComponents } from '@mantine/utils'
import CheckboxGroup from './Group'
import ChipComponent from './Chip'

export interface ICheckboxProps extends CheckboxProps {}

export type InputCheckboxComponent = ForwardRefWithStaticComponents<
ICheckboxProps,
{
	Group: typeof CheckboxGroup
	Chip: typeof ChipComponent
}
>

const CheckboxComponent: InputCheckboxComponent = forwardRef<HTMLInputElement, ICheckboxProps>((
	{ id, name, mt = 'md', ...props },
	ref,
) => {
	const inputId = id ?? name

	return (
		<Checkbox
			ref={ ref }
			id={ inputId }
			name={ name }
			mt={ mt }
			{ ...props }
		/>
	)
}) as any

CheckboxComponent.Group = CheckboxGroup
CheckboxComponent.Chip = ChipComponent

export default CheckboxComponent
