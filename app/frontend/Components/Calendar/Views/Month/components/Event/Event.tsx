import { ElementProps } from "@mantine/core"
import clsx from "clsx"

import { Box, BoxProps } from "@/Components"
import { useCalendarContext, CalendarGenerics } from "@/Components/Calendar"
import { EventDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/DisplayStrategyManager"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import * as classes from "./Event.css"

interface Event<T extends CalendarGenerics> extends
	BoxProps, Omit<ElementProps<"div", keyof BoxProps>, "onClick"> {
	event: T["Event"]
	onClick?: (event: T["Event"], element: HTMLElement) => void
	localizer: CalendarLocalizer
	displayProperties: EventDisplayProperties
}

const Event = <T extends CalendarGenerics>({
	children,
	className,
	event,
	onClick,
	displayProperties,
}: Event<T>) => {
	// Get the onEventClick handler from context
	const { onEventClick } = useCalendarContext()

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		// Use the provided onClick handler or the default one from context
		if(onClick) {
			onClick(event, e.currentTarget)
		} else if(onEventClick) {
			onEventClick(event as T["Event"], e.currentTarget)
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
