import { useModals } from "@mantine/modals"
import clsx from "clsx"
import { useState } from "react"

import { ActionIcon, Box, Group, Link, Stack, Text, Title } from "@/components"
import { BaseCalendarEvent } from "@/components/Calendar"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { EditIcon, TrashIcon } from "@/components/Icons"
import { EventForm } from "@/features/Clients/schedule/EventForm"
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

	const modals = useModals()

	const color = event.color || "#000000"

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

	const handleDeleteClick = () => {
		modals.openConfirmModal({
			title: "Delete shift",
			children: (
				<Text size="sm">
					This shift will be permanently removed. This cannot be undone.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => deleteEvent.mutate(),
		})
	}

	if(editing && client) {
		return (
			<EventForm
				client={ client }
				event={ event }
				onSuccess={ () => setEditing(false) }
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
						style={ { backgroundColor: color } }
					/>
					<Title order={ 4 }>
						{ primaryLink && (
							<Link href={ primaryLink.href }>{ primaryLink.label }</Link>
						) }
					</Title>
				</Group>
				{ client && (
					<Group gap="xs">
						<ActionIcon variant="subtle" onClick={ () => setEditing(true) }>
							<EditIcon />
						</ActionIcon>
						<ActionIcon variant="subtle" color="gray.9" onClick={ handleDeleteClick }>
							<TrashIcon />
						</ActionIcon>
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
