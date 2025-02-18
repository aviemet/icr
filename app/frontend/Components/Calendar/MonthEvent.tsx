import React from "react"
import { Event, EventProps } from "react-big-calendar"
import { Box } from "@/Components"

const MonthEvent = ({
	event,
	title,
	continuesPrior,
	continuesAfter,
	isAllDay,
	localizer,
	slotStart,
	slotEnd,
}: EventProps<Event>) => {
	return (
		<Box>{ title }</Box>
	)
}

export default React.memo(MonthEvent)
