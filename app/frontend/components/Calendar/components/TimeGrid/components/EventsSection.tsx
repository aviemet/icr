import React, { useMemo } from "react"

import { EventResources, useCalendarContext } from "@/components/Calendar"

import TimeColumn from "./TimeColumn"
import * as classes from "../TimeGrid.css"

interface EventsSectionProps<
// eslint-disable-next-line no-unused-vars
	TEventResources extends EventResources,
	V extends "week" | "day" = "week"
> {

}

const EventsSection = <
	TEventResources extends EventResources,
	V extends "week" | "day" = "week"
>({}: EventsSectionProps<TEventResources, V>) => {
	const { localizer, onEventClick, groupByResource } = useCalendarContext<TEventResources>()
	return (
		<div className={ classes.eventsSection }>
			<TimeColumn timeSlots={ useMemo(() => {
				const slots: Date[] = []

				let current = localizer.startOf(localStartTime, "hour")
				const boundaryTime = localizer.add(localizer.startOf(localEndTime, "hour"), 1, "hour")

				while(localizer.isBefore(current, boundaryTime)) {
					slots.push(current)
					current = localizer.add(current, timeIncrement, "minute")
				}

				return slots
			}, [localStartTime, localEndTime, timeIncrement, localizer]) } />

			<div className={ classes.contentArea } style={ { "--rows-per-day": rowsPerDay } as React.CSSProperties }>
				<div className={ classes.gridLines } />
				<div className={ classes.eventsContainer }>
					{ columnHeadings.map((heading, columnIndex) => {
						// Determine the correct key based on grouping
						const key = groupByResource && heading.resourceId !== undefined
							? String(heading.resourceId)
							: localizer.startOf(heading.date, "day").toISOString()

						const columnEvents = eventsByColumn?.get(key)

						if(!columnEvents) return null

						return columnEvents.map(({ event, displayProperties }) => {
							return (
								<EventWrapper<TEventResources>
									key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
									event={ event }
									displayProperties={ displayProperties }
								>
									<Event<TEventResources>
										key={ event.id }
										event={ event }
										localizer={ localizer }
										displayProperties={ displayProperties }
										startTime={ localStartTime }
										timeIncrement={ timeIncrement }
										className={ clsx(displayProperties.className, classes.timeGridEvent) }
										onEventClick={ onEventClick }
									/>
								</EventWrapper>
							)
						})
					}) }
				</div>
			</div>
		</div>
	)
}

export default EventsSection
