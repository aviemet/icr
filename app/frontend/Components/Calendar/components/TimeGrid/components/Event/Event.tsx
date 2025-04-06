import clsx from "clsx"

import { Box } from "@/Components"
import { CalendarGenerics } from "@/Components/Calendar"
import { EventDisplayProperties } from "@/Components/Calendar/lib/displayStrategies"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import useStore from "@/lib/store"

interface EventProps<T extends CalendarGenerics> {
	event: T["Event"]
	displayProperties: EventDisplayProperties
	localizer: CalendarLocalizer
	startTime: Date
	timeIncrement: number
	className?: string
	onEventClick?: (event: T["Event"], element: HTMLElement) => void
}

const Event = <T extends CalendarGenerics>({
	event,
	displayProperties,
	localizer,
	startTime,
	timeIncrement,
	className,
	onEventClick,
}: EventProps<T>) => {
	const { getContrastingColor } = useStore()
	const eventColor = event.color || "var(--mantine-primary-color-filled)"
	const contrastingColor = getContrastingColor(eventColor)

	return (
		<Box
			className={ clsx(className) }
			style={ {
				"--event-start-row": localizer.duration(displayProperties.displayStart, startTime) / timeIncrement,
				"--event-span": localizer.duration(displayProperties.displayEnd, displayProperties.displayStart) / timeIncrement,
				"--event-color": eventColor,
				"--contrasting-color": contrastingColor,
			} as React.CSSProperties }
			onClick={ (e) => onEventClick?.(event, e.currentTarget) }
		>
			{ typeof event.title === "function"
				? event.title({
					start: displayProperties.displayStart,
					end: displayProperties.displayEnd,
				})
				: event.title }
		</Box>
	)
}

export { Event }
