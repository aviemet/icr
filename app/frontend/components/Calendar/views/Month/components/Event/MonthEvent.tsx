import clsx from "clsx"

import { CalendarEvent, EventProps } from "@/components/Calendar/components/Event"

import * as classes from "./Event.css"

const MonthEvent = ({
	className,
	...props
}: EventProps) => {
	return (
		<CalendarEvent
			className={ clsx(classes.monthEvent, className) }
			{ ...props }
		/>
	)
}

export { MonthEvent }
