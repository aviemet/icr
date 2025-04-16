import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/Components/Calendar"
import { TimeGridDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/types"

import * as classes from "./Event.css"

interface EventWrapperProps<TEventResources extends EventResources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties> {
	event: BaseCalendarEvent<TEventResources>
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: P
}

const EventWrapper = <TEventResources extends EventResources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties>({
	children,
	style,
	displayProperties,
}: EventWrapperProps<TEventResources, P>) => {
	return (
		<div
			className={ clsx(
				classes.eventWrapper,
				displayProperties.className
			) }
			style={ {
				"--column-start": displayProperties.columnStart,
				"--column-span": displayProperties.columnSpan,
				"--row-start": displayProperties.rowStart,
				"--row-span": displayProperties.rowEnd - displayProperties.rowStart,
				...style,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
