import clsx from "clsx"

import { EventResources } from "@/components/Calendar"
import { CalendarEvent, EventProps } from "@/components/Calendar/components/Event"

import * as classes from "./Event.css"

const MonthEvent = <TEventResources extends EventResources>({
	className,
	...props
}: EventProps<TEventResources>) => {
	return (
		<CalendarEvent
			className={ clsx(classes.monthEvent, className) }
			{ ...props }
		/>
	)
}

export { MonthEvent }
