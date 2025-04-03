import { darken, isLightColor, lighten } from "@mantine/core"
import clsx from "clsx"
import { CSSProperties, PropsWithChildren } from "react"

import { CalendarEvent } from "@/Components/CalendarCustom"
import { vars } from "@/lib"
import useStore from "@/lib/store"

import * as classes from "./Event.css"

interface EventWrapperProps<TEvent extends CalendarEvent = CalendarEvent> extends PropsWithChildren {
	columnStart: number
	columnSpan: number
	className?: string
	style?: CSSProperties
	event: TEvent
}

/**
 * EventWrapper
 * Internal only, used solely to position the event on the calendar view.
 * Event component is passed as children, which can be customized.
 */
const EventWrapper = <TEvent extends CalendarEvent = CalendarEvent>({
	columnStart,
	columnSpan,
	children,
	style,
	event,
}: EventWrapperProps<TEvent>) => {
	const { getContrastingColor } = useStore()

	const eventColor = event.color || vars.colors.primaryColors.filled

	const contrastingColor = getContrastingColor(eventColor)

	return (
		<div
			className={ clsx(classes.eventWrapper, {
				[classes.eventContinues]: columnSpan > 1,
			}) }
			style={ {
				"--column-start": columnStart,
				"--column-span": columnSpan,
				"--event-color": eventColor,
				"--contrasting-color": contrastingColor,
				"--hover-color": isLightColor(eventColor) ? lighten(eventColor, 0.15) : darken(eventColor, 0.15),
				...style,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
