import { EventResources, BaseCalendarEvent, useCalendarContext } from "@/Components/Calendar"
import { TimeGridDisplayProperties } from "@/Components/Calendar/lib/displayStrategies"

import { Event } from "./Event"
import { EventWrapper } from "./EventWrapper"
import * as classes from "../../TimeGrid.css"

export { Event } from "./Event"
export { EventWrapper } from "./EventWrapper"

interface EventNodeProps<TEventResources extends EventResources> {
	event: BaseCalendarEvent<TEventResources>
	displayProperties: TimeGridDisplayProperties
	startTime: Date
	timeIncrement: number
	onEventClick?: (event: BaseCalendarEvent<TEventResources>, element: HTMLElement) => void
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
				startTime={ startTime }
				timeIncrement={ timeIncrement }
				className={ classes.timeGridEvent }
				onEventClick={ onEventClick }
			/>
		</EventWrapper>
	)
}
