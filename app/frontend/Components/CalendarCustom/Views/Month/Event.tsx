import { useContextMenu, ContextMenuItemOptions } from "mantine-contextmenu"
import { useCallback } from "react"

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
		<div
			className={ classes.event }
			style={ {
				"--column-start": columnStart,
				"--column-span": columnSpan,
			} as React.CSSProperties }
			onClick={ handleClick }
			onContextMenu={ showContextMenu([
				{
					key: "test",
					icon: <SearchIcon />,
					title: "Testing",
					onClick: () => alert("TEST"),
				},
				...customMenuItemsWithDivider(),
			]) }
		>
			{ children }
		</div>
	)
}

export default Event
