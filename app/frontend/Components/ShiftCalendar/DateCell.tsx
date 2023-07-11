import { Box } from '@mantine/core'
import React from 'react'
import { DateCellWrapperProps } from 'react-big-calendar'

const DateCell = ({ ...props }: DateCellWrapperProps) => {
	return (
		<Box { ...props } sx={ { backgroundColor: 'red', border: '10px solid orange' } }>
		</Box>
	)
}

export default DateCell
