import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies/types"

import * as classes from "./Event.css"

interface EventWrapperProps<TEventResources extends EventResources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties> {
	event: BaseCalendarEvent<TEventResources>
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: P
}

function calculateWidth(groupSize: number) {
	if(groupSize <= 1) return "calc(100% - 2px)"
	return `calc(${100 / groupSize}% - 2px)`
}

function calculateLeft(groupSize: number, slotIndex: number) {
	if(groupSize <= 1) return "0"
	return `calc(${(100 / groupSize) * slotIndex}%)`
}

const EventWrapper = <TEventResources extends EventResources, P extends TimeGridDisplayProperties = TimeGridDisplayProperties>({
	children,
	event,
	style,
	displayProperties,
}: EventWrapperProps<TEventResources, P>) => {
	const groupSize = displayProperties.groupSize || 1
	const slotIndex = displayProperties.slotIndex || 0

	const cssVars = event.allDay
		? {
			"--column-start": displayProperties.columnStart,
			"--column-span": displayProperties.columnSpan,
			"--row-start": displayProperties.rowStart,
			"--row-span": displayProperties.rowEnd - displayProperties.rowStart,
		}
		: {
			top: `calc(${(displayProperties.rowStart - 1) * 100}% / var(--rows-per-day))`,
			height: `calc((${(displayProperties.rowEnd - displayProperties.rowStart) * 100}% / var(--rows-per-day)) - 1px)`,
			width: calculateWidth(groupSize),
			left: calculateLeft(groupSize, slotIndex),
		}

	return (
		<div
			className={ clsx(
				classes.eventWrapper,
				displayProperties.className
			) }
			style={ {
				...cssVars,
				...style,
			} as unknown as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
