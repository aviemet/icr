import { EventResources, BaseCalendarEvent, useCalendarContext } from "@/components/Calendar"
import { TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"

import { Event } from "./Event"
import { EventWrapper } from "./EventWrapper"
import * as classes from "../../TimeGrid.css"

export { Event } from "./Event"
export { EventWrapper } from "./EventWrapper"

interface EventNodeProps<TEventResources extends EventResources> {
	event: BaseCalendarEvent<EventResources>
	displayProperties: TimeGridDisplayProperties
	startTime: Date
	timeIncrement: number
	onEventClick?: (event: BaseCalendarEvent<EventResources>, element: HTMLElement) => void
}

export const EventNode = <TEventResources extends EventResources>({
	event,
	displayProperties,
	startTime,
	timeIncrement,
	onEventClick,
}: EventNodeProps<TEventResources>) => {
	const { localizer } = useCalendarContext()


	return (
		<EventWrapper
			key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
			event={ event }
			displayProperties={ displayProperties }
		>
			<Event
				key={ event.id }
				event={ event }
				localizer={ localizer }
				displayProperties={ displayProperties }
				startTime={ startTime }
				timeIncrement={ timeIncrement }
				className={ classes.timeGridEvent }
				onEventClick={ onEventClick }
			/>
		</EventWrapper>
	)
}
