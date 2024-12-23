import React from 'react'
import { Box } from '@/Components'
import NewShiftButton from './NewShiftButton'
import { type DateCellWrapperProps } from 'react-big-calendar'

const DateCellWrapper = ({ children, range, value }: DateCellWrapperProps) => {

	return (
		<Box className="rbc-date-cell">
			{ children }
		</Box>
	)
}

export default DateCellWrapper
