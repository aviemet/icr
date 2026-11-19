import clsx from "clsx"

import { CalendarEvent, EventProps } from "@/components/Calendar/components/Event"

import * as classes from "./Event.css"

export function MonthEvent({
	className,
	...props
}: EventProps) {
	return (
		<CalendarEvent
			className={ clsx(classes.monthEvent, className) }
			{ ...props }
		/>
	)
}
