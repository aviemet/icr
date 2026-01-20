import clsx from "clsx"

import { Box, Group, Link, Stack, Text, Title } from "@/components"
import { BaseCalendarEvent } from "@/components/Calendar"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { Routes } from "@/lib"

import * as classes from "./EventPopoverContent.css"

interface EventPopoverContentProps {
	event: BaseCalendarEvent
	localizer: CalendarLocalizer
}

function isEmployeeResource(value: unknown): value is Schema.ShiftsClient["employee"] {
	if(typeof value !== "object" || value === null) return false
	if(!("slug" in value) || !("name" in value)) return false

	return typeof value.slug === "string" && typeof value.name === "string"
}

const EventPopoverContent = ({ event, localizer }: EventPopoverContentProps) => {
	const color = event.color || "#000000"
	const employee = isEmployeeResource(event.resources?.employee) ? event.resources?.employee : undefined

	return (
		<Stack gap="xs">
			<Group justify="space-between">
				<Group gap="xs">
					<Box
						className={ clsx(classes.eventColor) }
						style={ { backgroundColor: color } }
					/>
					<Title order={ 4 }>
						{ employee && (
							<Link href={ Routes.employee(employee.slug) }>{ employee.name }</Link>
						) }
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

export default EventPopoverContent
