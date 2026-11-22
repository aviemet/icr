import { Button, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import clsx from "clsx"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { ActionIcon, Box, Group, Link, Stack, Title, Tooltip } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { BaseCalendarEvent, useCalendarContext } from "@/components/Calendar"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { TrashIcon } from "@/components/Icons"
import { EventForm } from "@/domains/Clients/schedule/EventForm"
import { type ScheduleRecurrenceResources } from "@/features/CalendarSchedule"
import { Routes } from "@/lib"
import { useDeleteClientCalendarEvent } from "@/queries/clients"

import * as iconActionClasses from "@/components/Button/IconActionButton.css"
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

	return typeof value.id === "string" && typeof value.slug === "string"
}

function getRecurrenceResources(
	resources: BaseCalendarEvent["resources"],
): ScheduleRecurrenceResources | undefined {
	if(typeof resources !== "object" || resources === null || !("recurrence" in resources)) return undefined
	const recurrence = resources.recurrence
	if(typeof recurrence !== "object" || recurrence === null) return undefined
	if(!("masterId" in recurrence) || !("occurrenceStartsAt" in recurrence) || !("isRecurring" in recurrence)) {
		return undefined
	}
	if(typeof recurrence.masterId !== "string") return undefined
	if(typeof recurrence.occurrenceStartsAt !== "string") return undefined
	if(typeof recurrence.isRecurring !== "boolean") return undefined
	const patterns = ("patterns" in recurrence && Array.isArray(recurrence.patterns))
		? recurrence.patterns.filter((pattern): pattern is NonNullable<typeof pattern> => {
			return typeof pattern === "object" && pattern !== null
		})
		: []
	return {
		masterId: recurrence.masterId,
		occurrenceStartsAt: recurrence.occurrenceStartsAt,
		isRecurring: recurrence.isRecurring,
		patterns,
	}
}

export function EventPopoverContent({ event, localizer, primaryResource = "employee" }: EventPopoverContentProps) {
	const { t } = useTranslation()
	const [editing, setEditing] = useState(false)
	const { closePopover } = useCalendarContext()
	const recurrence = getRecurrenceResources(event.resources)

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
		params: {
			slug: client?.slug ?? "",
			id: recurrence?.masterId ?? String(event.id),
		},
	})

	const handleRecurringDelete = () => {
		if(!recurrence) return

		modals.open({
			title: t("views.clients.schedule.event_form.delete_recurring_title"),
			children: (
				<Stack gap="md">
					<Text size="sm">
						{ t("views.clients.schedule.event_form.delete_recurring_body") }
					</Text>
					<Group justify="flex-end">
						<Button
							variant="default"
							color="red"
							onClick={ () => {
								modals.closeAll()
								deleteEvent.mutate({
									edit_scope: "one",
									occurrence_starts_at: recurrence.occurrenceStartsAt,
								}, {
									onSuccess: () => closePopover(),
								})
							} }
						>
							{ t("views.clients.schedule.event_form.delete_this_occurrence") }
						</Button>
						<Button
							variant="default"
							color="red"
							onClick={ () => {
								modals.closeAll()
								deleteEvent.mutate({
									edit_scope: "future",
									occurrence_starts_at: recurrence.occurrenceStartsAt,
								}, {
									onSuccess: () => closePopover(),
								})
							} }
						>
							{ t("views.clients.schedule.event_form.delete_this_and_future") }
						</Button>
						<Button
							color="red"
							onClick={ () => {
								modals.closeAll()
								deleteEvent.mutate({ edit_scope: "all" }, {
									onSuccess: () => closePopover(),
								})
							} }
						>
							{ t("views.clients.schedule.event_form.delete_entire_series") }
						</Button>
					</Group>
				</Stack>
			),
		})
	}

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
						{ recurrence?.isRecurring
							? (
								<Tooltip label={ t("views.clients.schedule.event_form.delete_recurring_title") } withArrow position="left">
									<ActionIcon
										variant="transparent"
										aria-label={ t("views.clients.schedule.event_form.delete_recurring_title") }
										className={ clsx(iconActionClasses.iconAction, iconActionClasses.deleteAction) }
										onClick={ handleRecurringDelete }
									>
										<TrashIcon size={ 14 } />
									</ActionIcon>
								</Tooltip>
							)
							: (
								<DeleteButton
									label="shift"
									onDelete={ () => {
										deleteEvent.mutate(undefined, {
											onSuccess: () => closePopover(),
										})
									} }
								/>
							) }
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
