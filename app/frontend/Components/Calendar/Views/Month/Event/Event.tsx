import { ElementProps } from "@mantine/core"
import clsx from "clsx"
import { useContextMenu, ContextMenuItemOptions } from "mantine-contextmenu"
import { useCallback } from "react"

import { Box, BoxProps, DateTimeFormatter, Popover, Text } from "@/Components"
import { CalendarEvent } from "@/Components/Calendar"
import { useEventDisplay } from "@/Components/Calendar/hooks/useEventDisplay"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import { DisplayStrategy, DisplayStrategyFunction } from "../displayStrategies"
import * as classes from "./Event.css"

interface Event<TEvent extends CalendarEvent = CalendarEvent> extends
	BoxProps, Omit<ElementProps<"div", keyof BoxProps>, "onClick"> {
	event: TEvent
	onClick?: (event: TEvent) => void
	contextMenuOptions?: (event: TEvent) => ContextMenuItemOptions[]
	strategy: DisplayStrategy | DisplayStrategyFunction<TEvent>
	localizer: CalendarLocalizer
}

const Event = ({
	children,
	className,
	event,
	onClick,
	contextMenuOptions,
	strategy,
	localizer,
}: Event) => {
	const { showContextMenu } = useContextMenu()
	const { className: displayClassName } = useEventDisplay(event, typeof strategy === "string" ? strategy : "span", localizer)

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
				<Box
					className={ clsx(
						classes.event,
						displayClassName,
						className
					) }
					onClick={ handleClick }
					onContextMenu={ contextMenuOptions
						? showContextMenu([
							...customMenuItemsWithDivider(),
						])
						: undefined
					}
				>
					{ children }
				</Box>
			</Popover.Target>
			<Popover.Dropdown>
				<Text>{ event.title }</Text>
				<Text>From <DateTimeFormatter format="dateTimeShort">{ event.start }</DateTimeFormatter> to <DateTimeFormatter format="dateTimeShort">{ event.end }</DateTimeFormatter></Text>
			</Popover.Dropdown>
		</Popover>
	)
}

export { Event }
