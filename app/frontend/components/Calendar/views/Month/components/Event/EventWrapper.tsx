import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Box, darken, isLightColor, lighten } from "@mantine/core"
import clsx from "clsx"
import { ContextMenuItemOptions, useContextMenu } from "mantine-contextmenu"
import { CSSProperties, PropsWithChildren, useCallback } from "react"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { GridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"
import { vars } from "@/lib"
import useStore from "@/lib/store"

import * as classes from "./Event.css"

interface EventWrapperProps<P extends GridDisplayProperties = GridDisplayProperties> extends PropsWithChildren {
	style?: CSSProperties
	event: BaseCalendarEvent<EventResources>
	displayProperties: P
	contextMenuOptions?: (event: BaseCalendarEvent<EventResources>) => ContextMenuItemOptions[]
	setHoverId: React.Dispatch<React.SetStateAction<string>>
}

/**
 * EventWrapper
 * Internal only, used solely to position the event on the calendar view.
 * Event component is passed as children, which can be customized.
 */
const EventWrapper = <P extends GridDisplayProperties = GridDisplayProperties>({
	children,
	style,
	event,
	displayProperties,
	contextMenuOptions,
	setHoverId,
}: EventWrapperProps<P>) => {
	const [animationParent] = useAutoAnimate()

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
			ref={ animationParent }
			className={ clsx(classes.monthEventWrapper, displayProperties.className) }
			style={ {
				"--column-start": displayProperties.columnStart,
				"--column-span": displayProperties.columnSpan,
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
			data-id={ event.id }
			onMouseOver={ () => setHoverId(String(event.id)) }
			onMouseOut={ () => setHoverId("") }
		>
			{ children }
		</Box>
	)
}

export { EventWrapper }
