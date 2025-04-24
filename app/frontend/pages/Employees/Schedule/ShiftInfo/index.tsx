import { type Event } from "react-big-calendar"

import { Box, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"

interface ClientShiftInfo {
	event: Event
}

const ShiftInfo = ({ event }: ClientShiftInfo) => {
	return (
		<>
			<Box>
				<Text>Start: <DateTimeFormatter format="dateTimeLong">{ event.start }</DateTimeFormatter></Text>
				<Text>Start: <DateTimeFormatter format="dateTimeLong">{ event.end }</DateTimeFormatter></Text>
			</Box>
		</>
	)
}

export default ShiftInfo
