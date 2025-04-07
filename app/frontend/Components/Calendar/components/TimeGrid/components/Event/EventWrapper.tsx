import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import { TimeGridDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/types"

import * as classes from "./Event.css"

interface EventWrapperProps<T extends CalendarGenerics, P extends TimeGridDisplayProperties = TimeGridDisplayProperties> {
	event: T["Event"]
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: P
}

const EventWrapper = <T extends CalendarGenerics, P extends TimeGridDisplayProperties = TimeGridDisplayProperties>({
	children,
	style,
	displayProperties,
}: EventWrapperProps<T, P>) => {
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
