import { type Event } from "react-big-calendar"

import { Box, Text } from "@/Components"
import { DateTimeFormatter } from "@/Components/Formatters"

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
