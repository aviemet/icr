import clsx from "clsx"
import { HTMLAttributes } from "react"

import * as classes from "./Event.css"
import { type BaseCalendarEvent, EventResources, useCalendarContext } from "../.."
import { BaseDisplayProperties } from "../../lib/displayStrategies"
import { CalendarLocalizer } from "../../lib/localizers"


export interface EventProps<TEventResources extends EventResources> extends
	Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
	event: BaseCalendarEvent<TEventResources>
	onClick?: (event: BaseCalendarEvent<TEventResources>, element: HTMLElement) => void
	localizer: CalendarLocalizer
	displayProperties: BaseDisplayProperties
}

const CalendarEvent = <TEventResources extends EventResources>({
	children,
	className,
	event,
	onClick,
	displayProperties,
	...props
}: EventProps<TEventResources>) => {
	const { onClick: onClickFromContext } = useCalendarContext()

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if(onClick) {
			onClick(event, e.currentTarget)
		} else if(onClickFromContext) {
			onClickFromContext({ type: "event", event, element: e.currentTarget })
		}
	}

	return (
		<div
			className={ clsx(classes.event, className) }
			onClick={ handleClick }
			{ ...props }
		>
			<span>{ children }</span>
		</div>
	)
}

export { CalendarEvent }
