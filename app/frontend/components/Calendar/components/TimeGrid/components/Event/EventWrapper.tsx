import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies/types"

import * as classes from "./Event.css"

const overlapOffsetPx = 12

interface EventWrapperProps<P extends TimeGridDisplayProperties = TimeGridDisplayProperties> {
	event: BaseCalendarEvent<EventResources>
	children: React.ReactNode
	style?: React.CSSProperties
	displayProperties: P
}

const EventWrapper = <P extends TimeGridDisplayProperties = TimeGridDisplayProperties>({
	children,
	event,
	style,
	displayProperties,
}: EventWrapperProps<P>) => {
	const groupSize = displayProperties.groupSize ?? 1
	const slotIndex = displayProperties.slotIndex ?? 0

	const cssVars = event.allDay
		? {
			"--column-start": displayProperties.columnStart,
			"--column-span": displayProperties.columnSpan,
			"--row-start": displayProperties.rowStart,
			"--row-span": displayProperties.rowEnd - displayProperties.rowStart,
		}
		: {
			position: "absolute",
			top: `calc(${(displayProperties.rowStart - 1) * 100}% / var(--rows-per-day))`,
			height: `calc((${(displayProperties.rowEnd - displayProperties.rowStart) * 100}% / var(--rows-per-day)) - 1px)`,
			width: groupSize > 1
				? `calc(100% - 2px - ${(groupSize - 1) * overlapOffsetPx}px)`
				: "calc(100% - 2px)",
			left: groupSize > 1 ? `${slotIndex * overlapOffsetPx}px` : "0",
			zIndex: groupSize > 1 ? slotIndex + 1 : 1,
		}

	return (
		<div
			className={ clsx(
				classes.eventWrapper,
				groupSize > 1,
				displayProperties.className
			) }
			style={ {
				...cssVars,
				...style,
			} as React.CSSProperties }
		>
			{ children }
		</div>
	)
}

export { EventWrapper }
