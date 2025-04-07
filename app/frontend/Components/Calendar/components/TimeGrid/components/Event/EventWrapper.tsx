import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import { EventDisplayProperties } from "@/Components/Calendar/lib/displayStrategies"

import * as classes from "./Event.css"

interface EventWrapperProps<T extends CalendarGenerics> {
	event: T["Event"]
	columnStart: number
	columnSpan: number
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: EventDisplayProperties
}

const EventWrapper = <T extends CalendarGenerics>({
	children,
	style,
	displayProperties,
}: EventWrapperProps<T>) => {
	return (
		<div
			className={ clsx(classes.eventWrapper) }
			style={ {
				...style,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
