import { useContextMenu, ContextMenuItemOptions } from "mantine-contextmenu"
import { useCallback } from "react"

import { DateTimeFormatter, Popover, Text } from "@/Components"
import { CalendarEvent } from "@/Components/CalendarCustom"
import { SearchIcon } from "@/Components/Icons"

import * as classes from "./MonthView.css"

interface Event<TEvent extends CalendarEvent = CalendarEvent> {
	children: React.ReactNode
	event: TEvent
	columnStart: number
	columnSpan: number
	onClick?: (event: TEvent) => void
	contextMenuOptions?: (event: TEvent) => ContextMenuItemOptions[]
}

const Event = ({
	children,
	event,
	columnStart,
	columnSpan,
	onClick,
	contextMenuOptions,
}: Event) => {
	const { showContextMenu } = useContextMenu()

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		onClick?.(event)
	}

	const customMenuItemsWithDivider = useCallback(() => {
		if(!contextMenuOptions) return []

		return [
			{ key: "divider" },
			...contextMenuOptions?.(event),
		]
	}, [contextMenuOptions, event])

	return (
		<Popover withArrow middlewares={ { shift: true } }>
			<Popover.Target>
				<div
					className={ classes.event }
					style={ {
						"--column-start": columnStart,
						"--column-span": columnSpan,
					} as React.CSSProperties }
					onClick={ handleClick }
					onContextMenu={ showContextMenu([
						...customMenuItemsWithDivider(),
					]) }
				>
					{ children }
				</div>
			</Popover.Target>
			<Popover.Dropdown>
				<Text>{ event.title }</Text>
				<Text>From <DateTimeFormatter>{ event.start }</DateTimeFormatter> to <DateTimeFormatter>{ event.end }</DateTimeFormatter></Text>
			</Popover.Dropdown>
		</Popover>
	)
}

export default Event
