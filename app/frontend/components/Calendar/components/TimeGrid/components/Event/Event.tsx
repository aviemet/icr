import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import useStore from "@/lib/store"

import * as classes from "./Event.css"
import { CalendarEvent } from "../../../Event"

interface EventProps<TEventResources extends EventResources> {
	event: BaseCalendarEvent<TEventResources>
	displayProperties: TimeGridDisplayProperties
	localizer: CalendarLocalizer
	startTime: Date
	timeIncrement: number
	className?: string
	style?: React.CSSProperties
	onEventClick?: (event: BaseCalendarEvent<TEventResources>, element: HTMLElement) => void
}

const Event = <TEventResources extends EventResources>({
	event,
	displayProperties,
	className,
	style,
	onEventClick,
	...props
}: EventProps<TEventResources>) => {
	const { getContrastingColor } = useStore()
	const eventColor = event.color || "var(--mantine-primary-color-filled)"
	const contrastingColor = getContrastingColor(eventColor)

	return (
		<CalendarEvent
			event={ event }
			displayProperties={ displayProperties }
			className={ clsx(classes.timeGridEvent, className, {
				[classes.allDayEvent]: event.allDay,
			}) }
			style={ {
				"--event-color": eventColor,
				"--contrasting-color": contrastingColor,
				...style,
			} as React.CSSProperties }
			onClick={ onEventClick }
			{ ...props }
		>
			{ event.titleBuilder
				? event.titleBuilder({
					start: displayProperties.displayStart,
					end: displayProperties.displayEnd,
					allDay: event.allDay,
					title: event.title,
					resources: event.resources,
				})
				: event.title }
		</CalendarEvent>
	)
}

export { Event }
