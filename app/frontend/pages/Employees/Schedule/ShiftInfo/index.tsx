import { Box, Text } from "@/components"
import { type BaseCalendarEvent } from "@/components/Calendar"
import { DateTimeFormatter } from "@/components/Formatters"

interface ClientShiftInfo {
	event: BaseCalendarEvent
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
