import { Stack, Text, Title, Group, Box } from "@mantine/core"
import clsx from "clsx"

import { useCalendarContext, EventResources, BaseCalendarEvent } from "@/components/Calendar"
import { vars } from "@/lib"

import * as classes from "../CalendarPopover.css"

interface DefaultPopoverContentProps<TEventResources extends EventResources> {
	event: BaseCalendarEvent<TEventResources>
}

const DefaultPopoverContent = <TEventResources extends EventResources>({ event }: DefaultPopoverContentProps<TEventResources>) => {
	const { localizer } = useCalendarContext()
	const color = event.color || vars.colors.primaryColors.filled

	return (
		<Stack gap="xs">
			<Group justify="space-between">
				<Group gap="xs">
					<Box
						className={ clsx(classes.eventColor) }
						style={ { backgroundColor: color } }
					/>
					<Title order={ 4 }>
						{ event.titleBuilder
							? event.titleBuilder({
								start: event.start,
								end: event.end,
								allDay: event.allDay,
								title: event.title,
								resources: event.resources,
							})
							: event.title
						}
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

export { DefaultPopoverContent }
