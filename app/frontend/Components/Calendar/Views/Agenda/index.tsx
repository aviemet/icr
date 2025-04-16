import { Box, Text } from "@mantine/core"
import clsx from "clsx"
import { useMemo } from "react"

import { EventResources, BaseCalendarEvent } from "@/Components/Calendar"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/Calendar/Views"

import * as classes from "./AgendaView.css"
import { AgendaDisplayProperties, ViewStrategyName, useDisplayStrategy } from "../../lib/displayStrategies"


interface AgendaViewProps<TEventResources extends EventResources> extends BaseViewProps<TEventResources> {
	className?: string
	style?: React.CSSProperties
	displayStrategy: ViewStrategyName<"agenda">
	titleBuilder?: (event: BaseCalendarEvent<TEventResources>, displayProperties: AgendaDisplayProperties) => string
}

const AgendaViewComponent = <TEventResources extends EventResources>({
	className,
	style,
	displayStrategy,
	titleBuilder,
}: AgendaViewProps<TEventResources>) => {
	const eventsByDay = useDisplayStrategy<TEventResources, "agenda", AgendaDisplayProperties>(
		VIEWS.agenda,
		displayStrategy
	)

	const sortedDays = useMemo(() => {
		return Array.from(eventsByDay.keys()).sort()
	}, [eventsByDay])

	if(sortedDays.length === 0) {
		return (
			<Box className={ clsx(classes.agendaView, className) } style={ style }>
				<Text c="dimmed" ta="center" py="xl">No events to display</Text>
			</Box>
		)
	}

	const renderEvent = (event: BaseCalendarEvent<TEventResources>, displayProperties: AgendaDisplayProperties) => {
		const title = titleBuilder
			? titleBuilder(event, displayProperties)
			: event.titleBuilder
				? event.titleBuilder({
					start: displayProperties.displayStart,
					end: displayProperties.displayEnd,
					allDay: event.allDay,
					title: event.title,
					resources: event.resources,
					resourceId: event.resourceId,
				})
				: event.title

		return (
			<Box
				key={ event.id }
				className={ clsx(classes.eventItem, {
					"all-day": !!event.allDay,
				}) }
				style={ event.color ? { borderLeftColor: event.color } : undefined }
			>
				<Box>
					<span className={ classes.eventTime }>
						{ event.allDay
							? <Text size="sm">All Day</Text>
							: <Text size="sm">
								{ displayProperties.displayStart.toLocaleTimeString(undefined, {
									hour: "numeric",
									minute: "2-digit",
								}) }
								{ " - " }
								{ displayProperties.displayEnd.toLocaleTimeString(undefined, {
									hour: "numeric",
									minute: "2-digit",
								}) }
							</Text>
						}
					</span>

					<span>{ title }</span>
				</Box>

				<Box className={ classes.eventContent }>
					<Text className="title">{ event.title }</Text>
					{ event.description && (
						<Text>{ event.description }</Text>
					) }
				</Box>
			</Box>
		)
	}

	return (
		<Box className={ clsx(classes.agendaView, className) } style={ style }>
			{ sortedDays.map(dayKey => {
				const dayEvents = eventsByDay.get(dayKey)
				if(!dayEvents) return null

				const date = new Date(dayKey)
				const sortedEvents = [...dayEvents].sort((a, b) => {
					// All day events first
					if(!!a.event.allDay !== !!b.event.allDay) {
						return !!a.event.allDay ? - 1 : 1
					}
					// Then by start time
					return a.event.start.getTime() - b.event.start.getTime()
				})

				return (
					<Box key={ dayKey } className={ classes.dayGroup }>
						<Text className={ classes.dayHeader }>
							{ date.toLocaleDateString(undefined, {
								weekday: "long",
								month: "long",
								day: "numeric",
							}) }
						</Text>

						{ sortedEvents.map(({ event, displayProperties }) =>
							renderEvent(event, displayProperties)
						) }
					</Box>
				)
			}) }
		</Box>
	)
}

export const AgendaView = createViewComponent(AgendaViewComponent, {
	range: (date, { localizer }) => {
		// Show a month's worth of events by default
		const start = localizer.startOf(date, "month")
		const end = localizer.endOf(date, "month")
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 1, "month")
			case NAVIGATION.next:
				return localizer.add(date, 1, "month")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.agendaTitle),
})
