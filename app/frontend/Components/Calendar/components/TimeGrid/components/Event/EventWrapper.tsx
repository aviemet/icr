import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"

import * as classes from "./Event.css"

interface EventWrapperProps<T extends CalendarGenerics> {
	event: T["Event"]
	columnStart: number
	columnSpan: number
	children: React.ReactNode
}

const EventWrapper = <T extends CalendarGenerics>({
	columnStart,
	columnSpan,
	children,
}: EventWrapperProps<T>) => {
	return (
		<div
			className={ clsx(classes.event) }
			style={ {
				"--event-column": columnStart,
				"--event-width": `${100 / columnSpan}%`,
				"--event-left": `${(columnStart - 1) * (100 / columnSpan)}%`,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
