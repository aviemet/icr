import { Paper, Stack, Text, Title, Group, Box } from "@mantine/core"
import clsx from "clsx"
import React, { forwardRef, useEffect, useState } from "react"

import { CalendarEvent, useCalendarContext } from "@/Components/Calendar"
import { vars } from "@/lib"

import * as classes from "./EventDetailsPopover.css"

interface EventDetailsPopoverProps {
	event: CalendarEvent
	position: { top: number, left: number }
}

const EventDetailsPopover = forwardRef<HTMLDivElement | null, EventDetailsPopoverProps>((
	{ event, position },
	ref
) => {
	const { localizer } = useCalendarContext()
	const [isEntering, setIsEntering] = useState(true)

	useEffect(() => {
		setIsEntering(true)
		const timer = setTimeout(() => {
			setIsEntering(false)
		}, 10)

		return () => clearTimeout(timer)
	}, [])

	const color = event.color || vars.colors.primaryColors.filled

	return (
		<div
			ref={ ref }
			className={ clsx(classes.container) }
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
				<Stack gap="xs">
					<Group justify="space-between">
						<Group gap="xs">
							<Box
								className={ clsx(classes.eventColor) }
								style={ { backgroundColor: color } }
							/>
							<Title order={ 4 }>{ event.title }</Title>
						</Group>
					</Group>

					<Text size="sm">
						<strong>Start:</strong> { localizer.format(event.start, "M/D h:mma") }
					</Text>

					<Text size="sm">
						<strong>End:</strong> { localizer.format(event.end, "M/D h:mma") }
					</Text>

					<Text size="sm">
						<strong>Hours:</strong> { Math.round(localizer.duration(event.start, event.end) / 60) }
					</Text>

					{ event.allDay && (
						<Text size="sm">All day event</Text>
					) }
				</Stack>
			</Paper>
		</div>
	)
})

export default EventDetailsPopover
