import React from 'react'
import { useTableSectionContext } from '../TableContext'
import { TDProps } from 'react-html-props'
import BodyCell from './BodyCell'
import HeadCell from './HeadCell'
import { type BoxProps } from '@mantine/core'

export interface ICellProps extends TDProps, BoxProps {
	fitContent?: boolean
	sort?: string
	nowrap?: boolean
	hideable?: false|string
	ref?: React.RefObject<HTMLTableCellElement>
}

const RenderedCell = ({ children = true, hideable, ...props }: ICellProps) => {
	const { section } = useTableSectionContext()

	if(section === 'head') {
		return <HeadCell hideable={ hideable } { ...props }>{ children }</HeadCell>
	}

	const bodyProps: ICellProps = props
	if(typeof hideable === 'string') {
		bodyProps.hideable = hideable
	}

	return <BodyCell { ...bodyProps }>{ children }</BodyCell>
}

export default RenderedCell
