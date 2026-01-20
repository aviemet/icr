import { Paper } from "@mantine/core"
import clsx from "clsx"
import React, { useState } from "react"

import { BaseCalendarEvent, CalendarClickTarget } from "@/components/Calendar"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { vars } from "@/lib"
import { useInit } from "@/lib/hooks"

import * as classes from "./CalendarPopover.css"
import { BackgroundPopoverContent } from "./content/BackgroundPopoverContent"
import { EventDetails } from "./content/EventDetails"

export interface PopoverContentMap {
	event?: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => React.ReactNode
	background?: (context: { date: Date, time?: Date, resourceId?: string | number }, localizer: CalendarLocalizer) => React.ReactNode
}

interface CalendarPopoverProps {
	target: CalendarClickTarget
	position: { top: number, left: number }
	className: string
	popoverContent?: Partial<PopoverContentMap>
	localizer: CalendarLocalizer
	popoverRef: React.RefObject<HTMLDivElement>
}

export function CalendarPopover({
	target,
	position,
	className,
	popoverContent,
	localizer,
	popoverRef,
}: CalendarPopoverProps) {
	const [isEntering, setIsEntering] = useState(true)

	useInit(() => {
		if(!isEntering) return

		const timer = setTimeout(() => {
			setIsEntering(false)
		}, 10)

		return () => clearTimeout(timer)
	})

	const getContent = () => {
		switch(target.type) {
			case "event": {
				const customRenderer = popoverContent?.event
				return customRenderer
					? customRenderer(target.event, localizer)
					: <EventDetails event={ target.event } />
			}
			case "background": {
				const customRenderer = popoverContent?.background
				const context = {
					date: target.date,
					time: target.time,
					resourceId: target.resourceId,
				}
				return customRenderer
					? customRenderer(context, localizer)
					: <BackgroundPopoverContent date={ target.date } time={ target.time } resourceId={ target.resourceId } />
			}
		}
	}

	const color = target.type === "event"
		? (target.event.color || vars.colors.primaryColors.filled)
		: vars.colors.primaryColors.filled

	return (
		<div
			ref={ popoverRef }
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
				{ getContent() }
			</Paper>
		</div>
	)
}
