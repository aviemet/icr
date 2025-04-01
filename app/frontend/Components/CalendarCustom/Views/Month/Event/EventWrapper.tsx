import clsx from "clsx"

import * as classes from "./Event.css"

interface EventWrapperProps {
	children: React.ReactNode
	columnStart: number
	columnSpan: number
}

/**
 * EventWrapper
 * Internal only, used solely to position the event on the calendar view.
 * Event component is passed as children, which can be customized.
 */
const EventWrapper = ({
	columnStart,
	columnSpan,
	children,
}: EventWrapperProps) => {
	return (
		<div
			className={ clsx(classes.eventWrapper) }
			style={ {
				"--column-start": columnStart,
				"--column-span": columnSpan,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
