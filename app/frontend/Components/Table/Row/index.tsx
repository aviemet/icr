import React from 'react'
import { useTableContext } from '../TableContext'
import RowInContext from './RowInContext'
import { Box, type BoxProps } from '@mantine/core'
import { ElementProps } from '@mantine/core'

export interface TableRowProps extends BoxProps, ElementProps<'tr'> {
	children?: JSX.Element | JSX.Element[]
}

interface RowComponentProps extends Omit<TableRowProps, 'ref'> {
	render?: any
	name?: string
}

const Row = ({ children, render, name, ...props }: RowComponentProps) => {
	try {
		const { tableState: { rows, selectable, selected } } = useTableContext()

		return (
			<RowInContext
				name={ name }
				rows={ rows }
				selectable={ selectable }
				selected={ selected }
				{ ...props }
			>
				{ children }
			</RowInContext>
		)
	} catch(e) {
		return (
			<Box component="tr" { ...props }>
				{ children }
			</Box>
		)
	}
}

export default Row
