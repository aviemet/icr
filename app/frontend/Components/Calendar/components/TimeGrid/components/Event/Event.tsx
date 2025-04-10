import clsx from "clsx"

import { Box } from "@/Components"
import { EventResources, CalendarEvent } from "@/Components/Calendar"
import { TimeGridDisplayProperties } from "@/Components/Calendar/lib/displayStrategies"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import useStore from "@/lib/store"

import * as classes from "./Event.css"

interface EventProps<TEventResources extends EventResources> {
	event: CalendarEvent<TEventResources>
	displayProperties: TimeGridDisplayProperties
	localizer: CalendarLocalizer
	startTime: Date
	timeIncrement: number
	className?: string
	style?: React.CSSProperties
	onEventClick?: (event: CalendarEvent<TEventResources>, element: HTMLElement) => void
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
			{ typeof event.title === "function"
				? event.title({
					start: displayProperties.displayStart,
					end: displayProperties.displayEnd,
					allDay: displayProperties.allDay,
					resources: event.resources,
				})
				: event.title }
		</Box>
	)
}

export { Event }
