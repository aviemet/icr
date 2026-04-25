import clsx from "clsx"
import { HTMLAttributes } from "react"

import { useStore } from "@/lib/store"

import * as classes from "./Event.css"
import { type BaseCalendarEvent, EventResources, useCalendarContext } from "../.."
import { BaseDisplayProperties } from "../../lib/displayStrategies"
import { CalendarLocalizer } from "../../lib/localizers"


export interface EventProps extends
	Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
	event: BaseCalendarEvent<EventResources>
	onClick?: (event: BaseCalendarEvent<EventResources>, element: HTMLElement) => void
	localizer: CalendarLocalizer
	displayProperties: BaseDisplayProperties
}

const CalendarEvent = ({
	children,
	className,
	event,
	onClick,
	displayProperties,
	style,
	...props
}: EventProps) => {
	const { onClick: onClickFromContext } = useCalendarContext()
	const { getContrastingColor } = useStore()

	const indicatorVars = (event.indicatorColor && event.indicatorLabel)
		? {
			"--indicator-color": event.indicatorColor,
			"--indicator-contrast": getContrastingColor(event.indicatorColor),
		}
		: {}

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if(onClick) {
			onClick(event, e.currentTarget)
		} else if(onClickFromContext) {
			onClickFromContext({ type: "event", event, element: e.currentTarget })
		}
	}

	return (
		<div
			className={ clsx(classes.event, className, {
				[classes.hasIndicator]: Boolean(event.indicatorLabel && event.indicatorColor),
			}) }
			onClick={ handleClick }
			style={ {
				...indicatorVars,
				...style,
			} as React.CSSProperties }
			{ ...props }
		>
			{ (event.indicatorLabel && event.indicatorColor) && (
				<span
					className={ classes.indicator }
				>
					{ event.indicatorLabel }
				</span>
			) }
			<span className={ classes.title }>{ children }</span>
		</div>
	)
}

export { CalendarEvent }
