import clsx from "clsx"

import { Box } from "@/Components"
import { EventResources, BaseCalendarEvent } from "@/Components/Calendar"
import { TimeGridDisplayProperties } from "@/Components/Calendar/lib/displayStrategies"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import useStore from "@/lib/store"

import * as classes from "./Event.css"

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
	localizer,
	startTime,
	timeIncrement,
	className,
	style,
	onEventClick,
}: EventProps<TEventResources>) => {
	const { getContrastingColor } = useStore()
	const eventColor = event.color || "var(--mantine-primary-color-filled)"
	const contrastingColor = getContrastingColor(eventColor)

	return (
		<Box
			className={ clsx(classes.event, className) }
			style={ {
				"--event-color": eventColor,
				"--contrasting-color": contrastingColor,
				...style,
			} as React.CSSProperties }
			onClick={ (e) => onEventClick?.(event, e.currentTarget) }
		>
			{ event.titleBuilder
				? event.titleBuilder({
					start: displayProperties.displayStart,
					end: displayProperties.displayEnd,
					allDay: displayProperties.allDay,
					title: event.title,
					resources: event.resources,
				})
				: event.title }
		</Box>
	)
}

export { Event }
