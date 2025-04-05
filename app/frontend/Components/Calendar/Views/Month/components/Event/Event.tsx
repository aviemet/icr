import { ElementProps } from "@mantine/core"
import clsx from "clsx"

import { Box, BoxProps } from "@/Components"
import { CalendarEvent, useCalendarContext } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { EventDisplayProperties } from "@/Components/Calendar/Views/Month/displayStrategies"

import * as classes from "./Event.css"

interface Event<TEvent extends CalendarEvent = CalendarEvent> extends
	BoxProps, Omit<ElementProps<"div", keyof BoxProps>, "onClick"> {
	event: TEvent
	onClick?: (event: TEvent, element: HTMLElement) => void
	localizer: CalendarLocalizer
	displayProperties: EventDisplayProperties
}

const Event = ({
	children,
	className,
	event,
	onClick,
	displayProperties,
}: Event) => {
	// Get the onEventClick handler from context
	const { onEventClick } = useCalendarContext()

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		// Use the provided onClick handler or the default one from context
		if(onClick) {
			onClick(event, e.currentTarget)
		} else if(onEventClick) {
			onEventClick(event, e.currentTarget)
		}
	}

	return (
		<Box
			className={ clsx(classes.event, className) }
			onClick={ handleClick }
		>
			<Box component="span">{ children }</Box>
		</Box>
	)
}

export { Event }
