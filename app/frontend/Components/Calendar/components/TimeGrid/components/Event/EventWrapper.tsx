import clsx from "clsx"

import { Resources, CalendarEvent } from "@/Components/Calendar"
import { TimeGridDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/types"

import * as classes from "./Event.css"

interface EventWrapperProps<TResources extends Resources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties> {
	event: CalendarEvent<TResources>
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: P
}

const EventWrapper = <TResources extends Resources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties>({
	children,
	style,
	displayProperties,
}: EventWrapperProps<TResources, P>) => {
	return (
		<div
			className={ clsx(classes.eventWrapper) }
			style={ {
				"--column-start": displayProperties.columnStart,
				"--grid-row-start": displayProperties.rowStart,
				"--grid-row-end": displayProperties.rowEnd,
				...style,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
