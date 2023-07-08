import React, { forwardRef } from 'react'
import { Chip, Sx, type ChipProps } from '@mantine/core'

const hideCheckMarkSx = {
	'.mantine-Chip-iconWrapper': {
		display: 'none',
	},
	'.mantine-Chip-label': {
		paddingLeft: 10,
		paddingRight: 10,
	},
}

export interface IChipProps extends ChipProps {
	sx?: Sx
	noCheck?: boolean
}

const ChipComponent = forwardRef<HTMLInputElement, IChipProps>((
	{ id, name, mt = 'md', noCheck = false, variant, sx = {}, ...props },
	ref,
) => {
	const inputId = id ?? name

	return (
		<Chip
			ref={ ref }
			id={ inputId }
			name={ name }
			mt={ mt }
			sx={ [sx, noCheck ? hideCheckMarkSx : {}] }
			variant={ noCheck ? 'filled' : variant }
			{ ...props }
		/>
	)
})

export default ChipComponent
