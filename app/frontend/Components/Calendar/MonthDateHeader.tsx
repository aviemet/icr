import React from 'react'
import NewShiftButton from './NewShiftButton'
import { Box } from '@/Components'
import { type DateHeaderProps } from 'react-big-calendar'

const MonthDateHeader = ({ date, drilldownView, isOffRange, label, onDrillDown }: DateHeaderProps) => {
	const dayOfWeek = date.getDay()

	return <>
		<Box component="span">
			<NewShiftButton />
			{ label }
		</Box>
	</>
}

export default MonthDateHeader
