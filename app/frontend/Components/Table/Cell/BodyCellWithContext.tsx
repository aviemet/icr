import React, { useRef } from 'react'
import cx from 'clsx'
import { type ICellProps } from './index'
import { Box, type Sx } from '@mantine/core'

export interface IBodyCellWithContextProps extends Omit<ICellProps, 'hideable'> {
	hideable?: false|string
	model?: string
	sx?: Sx
}

const BodyCellWithContext = ({ children, nowrap, fitContent, hideable, model, sx, ...props }: IBodyCellWithContextProps) => {
	const tdRef = useRef<HTMLTableCellElement>(null)

	return (
		<Box
			component="td"
			ref={ tdRef }
			className={ cx({ 'table-column-fit': fitContent }) }
			sx={ [{ whiteSpace: nowrap ? 'nowrap' : 'normal' }, sx ] }
			{ ...props }
		>
			{ children }
		</Box>
	)
}

export default BodyCellWithContext
