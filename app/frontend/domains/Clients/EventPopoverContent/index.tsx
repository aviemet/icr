import clsx from "clsx"
import { useState } from "react"

import { Box, Group, Link, Stack, Text, Title } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { BaseCalendarEvent, useCalendarContext } from "@/components/Calendar"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { EventForm } from "@/domains/Clients/schedule/EventForm"
import { Routes } from "@/lib"
import { useDeleteClientCalendarEvent } from "@/queries/clients"

import * as classes from "./EventPopoverContent.css"

export interface EventPopoverContentProps {
	event: BaseCalendarEvent
	localizer: CalendarLocalizer
	primaryResource?: "client" | "employee"
}

function isEmployeeResource(value: unknown): value is Schema.ShiftsClient["employee"] {
	if(typeof value !== "object" || value === null) return false
	if(!("slug" in value) || !("name" in value)) return false

	return typeof value.slug === "string" && typeof value.name === "string"
}

function isClientResource(value: unknown): value is Schema.ClientsPersisted {
	if(typeof value !== "object" || value === null) return false
	if(!("id" in value) || !("slug" in value)) return false

	return typeof (value as { id: unknown }).id === "string" && typeof (value as { slug: unknown }).slug === "string"
}

export function EventPopoverContent({ event, localizer, primaryResource = "employee" }: EventPopoverContentProps) {
	const [editing, setEditing] = useState(false)
	const { closePopover } = useCalendarContext()

	const color = event.color || "#000000"
	const isOpenShift = event.open === true

	const employee = isEmployeeResource(event.resources?.employee) ? event.resources?.employee : undefined
	const client = isClientResource(event.resources?.client) ? event.resources.client : undefined

	let primaryLink: { href: string, label: string } | null = null
	if(primaryResource === "client" && client) {
		primaryLink = { href: Routes.client(client.slug), label: client.full_name || client.name }
	} else if(employee) {
		primaryLink = { href: Routes.employee(employee.slug), label: employee.name }
	}

	let secondaryLink: { href: string, label: string } | null = null
	if(primaryResource === "client" && employee) {
		secondaryLink = { href: Routes.employee(employee.slug), label: employee.name }
	} else if(primaryResource === "employee" && client) {
		secondaryLink = { href: Routes.client(client.slug), label: client.full_name || client.name }
	}

	const deleteEvent = useDeleteClientCalendarEvent({
		params: { slug: client?.slug ?? "", id: String(event.id) },
	})

	if(editing && client) {
		return (
			<EventForm
				client={ client }
				event={ event }
				onSuccess={ () => {
					closePopover()
				} }
				onCancel={ () => setEditing(false) }
			/>
		)
	}

	return (
		<Stack gap="xs">
			<Group justify="space-between">
				<Group gap="xs">
					<Box
						className={ clsx(classes.eventColor) }
						style={ {
							backgroundColor: color,
							...(isOpenShift ? { boxShadow: "inset 3px 0 0 var(--mantine-color-teal-6)" } : {}),
						} }
					/>
					<Title order={ 4 }>
						{ isOpenShift
							? "Open shift"
							: (primaryLink && (
								<Link href={ primaryLink.href }>{ primaryLink.label }</Link>
							)) }
					</Title>
				</Group>
				{ client && (
					<Group gap="xs">
						<EditButton label="shift" onClick={ () => setEditing(true) } />
						<DeleteButton
							label="shift"
							onDelete={ () => deleteEvent.mutate() }
						/>
					</Group>
				) }
			</Group>

			{ secondaryLink && (
				<Text size="sm">
					<Link href={ secondaryLink.href }>{ secondaryLink.label }</Link>
				</Text>
			) }

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
