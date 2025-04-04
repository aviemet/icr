import { ElementProps } from "@mantine/core"
import clsx from "clsx"

import { Box, BoxProps } from "@/Components"
import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { EventDisplayProperties } from "@/Components/Calendar/Views/Month/displayStrategies"

import * as classes from "./Event.css"

interface Event<TEvent extends CalendarEvent = CalendarEvent> extends
	BoxProps, Omit<ElementProps<"div", keyof BoxProps>, "onClick"> {
	event: TEvent
	onClick?: (event: TEvent) => void
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
	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		onClick?.(event)
	}

	return (
		<Box
			className={ clsx(
				classes.event,
				className
			) }
			onClick={ handleClick }
		>
			<Box component="span">{ children }</Box>
		</Box>

	)
}

export { Event }
