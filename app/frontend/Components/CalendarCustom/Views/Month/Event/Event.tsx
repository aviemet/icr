import { useContextMenu, ContextMenuItemOptions } from "mantine-contextmenu"
import { useCallback } from "react"

import { DateTimeFormatter, Popover, Text } from "@/Components"
import { CalendarEvent } from "@/Components/CalendarCustom"

import * as classes from "./Event.css"

interface Event<TEvent extends CalendarEvent = CalendarEvent> {
	children: React.ReactNode
	event: TEvent
	onClick?: (event: TEvent) => void
	contextMenuOptions?: (event: TEvent) => ContextMenuItemOptions[]
}

const Event = ({
	children,
	event,
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
					onClick={ handleClick }
					onContextMenu={ contextMenuOptions
						? showContextMenu([
							...customMenuItemsWithDivider(),
						])
						: undefined
					}
				>
					{ children }
				</div>
			</Popover.Target>
			<Popover.Dropdown>
				<Text>{ event.title }</Text>
				<Text>From <DateTimeFormatter format="dateTimeShort">{ event.start }</DateTimeFormatter> to <DateTimeFormatter format="dateTimeShort">{ event.end }</DateTimeFormatter></Text>
			</Popover.Dropdown>
		</Popover>
	)
}

export { Event }
