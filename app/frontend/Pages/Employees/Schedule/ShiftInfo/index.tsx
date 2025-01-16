import { type Event } from 'react-big-calendar'
import { Box, DateTimeDisplay, Text } from '@/Components'

interface ClientShiftInfo {
	event: Event
}

const ShiftInfo = ({ event }: ClientShiftInfo) => {
	return (
		<>
			<Box>
				<Text>Start: <DateTimeDisplay format="dateTimeLong">{ event.start }</DateTimeDisplay></Text>
				<Text>Start: <DateTimeDisplay format="dateTimeLong">{ event.end }</DateTimeDisplay></Text>
			</Box>
		</>
	)
}

export default ShiftInfo
