import { Box, darken, isLightColor, lighten, Popover, Text } from "@mantine/core"
import clsx from "clsx"
import { ContextMenuItemOptions, useContextMenu } from "mantine-contextmenu"
import { CSSProperties, PropsWithChildren, useCallback } from "react"

import { CalendarEvent } from "@/Components/Calendar"
import { DateTimeFormatter } from "@/Components/Formatters"
import { vars } from "@/lib"
import useStore from "@/lib/store"

import * as classes from "./Event.css"

interface EventWrapperProps<TEvent extends CalendarEvent = CalendarEvent> extends PropsWithChildren {
	columnStart: number
	columnSpan: number
	className?: string
	style?: CSSProperties
	event: TEvent
	contextMenuOptions?: (event: TEvent) => ContextMenuItemOptions[]
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
	contextMenuOptions,
}: EventWrapperProps<TEvent>) => {
	const { getContrastingColor } = useStore()

	const { showContextMenu } = useContextMenu()

	const eventColor = event.color || vars.colors.primaryColors.filled

	const contrastingColor = getContrastingColor(eventColor)

	const customMenuItemsWithDivider = useCallback(() => {
		if(!contextMenuOptions) return []

		return [
			{ key: "divider" },
			...contextMenuOptions?.(event),
		]
	}, [contextMenuOptions, event])

	return (
		<Box
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
			data-event-id={ event.id }
			onContextMenu={ contextMenuOptions
				? showContextMenu([
					...customMenuItemsWithDivider(),
				])
				: undefined
			}
		>
			<Popover withArrow middlewares={ { shift: true } }>
				<Popover.Target>
					{ children }
				</Popover.Target>
				<Popover.Dropdown>
					<Text>{ event.title }</Text>
					<Text>From <DateTimeFormatter format="dateTimeShort">{ event.start }</DateTimeFormatter> to <DateTimeFormatter format="dateTimeShort">{ event.end }</DateTimeFormatter></Text>
				</Popover.Dropdown>
			</Popover>
		</Box>
	)
}

export { EventWrapper }
