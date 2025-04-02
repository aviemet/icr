import clsx from "clsx"
import { CSSProperties, PropsWithChildren } from "react"

import * as classes from "./Event.css"

interface EventWrapperProps extends PropsWithChildren {
	columnStart: number
	columnSpan: number
	className?: string
	style?: CSSProperties
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
