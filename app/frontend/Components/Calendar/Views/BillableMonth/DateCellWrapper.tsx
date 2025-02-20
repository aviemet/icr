import { type Event, type DateCellWrapperProps } from "react-big-calendar"
import dayjs from "dayjs"
import { Box, Text } from "@/Components"

// Extend the DateCellWrapper props to include events
interface CustomDateCellWrapperProps extends DateCellWrapperProps {
	events: Event[]
}

const CustomDateCellWrapper = ({ children, value, events }: CustomDateCellWrapperProps) => {
	const dayEvents = events.filter(event =>
		dayjs(event.start).isSame(value, "day")
	)

	const totalHours = dayEvents.reduce((total, event) => {
		const start = dayjs(event.start)
		const end = dayjs(event.end)
		const duration = end.diff(start, "hour", true)
		return total + duration
	}, 0)

	return (
		<Box className="rbc-date-cell" style={ { display: "flex", flexDirection: "column", height: "100%" } }>
			{ children }
			<Box>
				<Text size="xs" c="dimmed" style={ { marginTop: "auto", padding: "4px" } }>
					{ totalHours.toFixed(1) }h
				</Text>
			</Box>
		</Box>
	)
}

export default CustomDateCellWrapper
