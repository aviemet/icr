import { Stack, Text, Title, Group, Box } from "@mantine/core"
import clsx from "clsx"

import { useCalendarContext, EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { vars } from "@/lib"

import * as classes from "../CalendarPopover.css"

interface EventDetailsProps<TEventResources extends EventResources> {
	event: BaseCalendarEvent<TEventResources>
}

const EventDetails = <TEventResources extends EventResources>({ event }: EventDetailsProps<TEventResources>) => {
	const { localizer, getEventTitle } = useCalendarContext()
	const color = event.color || vars.colors.primaryColors.filled

	const displayProperties = {
		displayStart: event.start,
		displayEnd: event.end,
		allDay: event.allDay,
	}

	return (
		<Stack gap="xs">
			<Group justify="space-between">
				<Group gap="xs">
					<Box
						className={ clsx(classes.eventColor) }
						style={ { backgroundColor: color } }
					/>
					<Title order={ 4 }>
						{ getEventTitle(event, displayProperties) }
					</Title>
				</Group>
			</Group>

			<Text size="sm">
				<strong>Start:</strong> { localizer.format(event.start, "M/D h:mma") }
			</Text>

			<Text size="sm">
				<strong>End:</strong> { localizer.format(event.end, "M/D h:mma") }
			</Text>

			{ event.allDay
				? <Text size="sm">All day event</Text>
				: <Text size="sm">
					<strong>Hours:</strong> { Math.round(localizer.duration(event.start, event.end) / 60) }
				</Text>
			}
		</Stack>
	)
}

export { EventDetails }
