import { Paper } from "@mantine/core"
import clsx from "clsx"
import React, { useState } from "react"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { vars } from "@/lib"
import { useInit } from "@/lib/hooks"

import { EventDetails } from "./content/EventDetails"
import * as classes from "./EventPopover.css"

interface EventPopoverProps<TEventResources extends EventResources> {
	event: BaseCalendarEvent<TEventResources>
	position: { top: number, left: number }
	className: string
	children?: (event: BaseCalendarEvent<TEventResources>) => React.ReactNode
	ref?: React.Ref<HTMLDivElement>
}

export function EventPopover<TEventResources extends EventResources>({
	event,
	position,
	className,
	children,
	ref,
}: EventPopoverProps<TEventResources>) {
	const [isEntering, setIsEntering] = useState(true)

	useInit(() => {
		if(!isEntering) return

		const timer = setTimeout(() => {
			setIsEntering(false)
		}, 10)

		return () => clearTimeout(timer)
	})

	const color = event.color || vars.colors.primaryColors.filled

	return (
		<div
			ref={ ref }
			className={ clsx(className, classes.container) }
			data-entering={ isEntering || undefined }
			style={ {
				top: `${position.top}px`,
				left: `${position.left}px`,
			} }
		>
			<Paper
				className={ clsx(classes.paper) }
				style={ { borderTop: `4px solid ${color}` } }
				shadow="sm"
			>
				{ children ? children(event) : <EventDetails event={ event } /> }
			</Paper>
		</div>
	)
}
