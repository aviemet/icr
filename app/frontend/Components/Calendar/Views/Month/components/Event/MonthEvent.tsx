import clsx from "clsx"

import { EventResources } from "@/Components/Calendar"
import { CalendarEvent, EventProps } from "@/Components/Calendar/components/Event"

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
