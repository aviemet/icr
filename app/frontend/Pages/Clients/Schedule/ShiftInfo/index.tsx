import React from 'react'
import { type Event } from 'react-big-calendar'
import { Box, DateTimeDisplay, Text } from '@/Components'

interface ClientShiftInfo {
	event: Event
}

const ShiftInfo = ({ event }: ClientShiftInfo) => {
	return (
		<>
			<Box>
				<Text>Start: <DateTimeDisplay type="datetime" format="full">{ event.start }</DateTimeDisplay></Text>
				<Text>Start: <DateTimeDisplay type="datetime" format="full">{ event.end }</DateTimeDisplay></Text>
			</Box>
		</>
	)
}

export default ShiftInfo
