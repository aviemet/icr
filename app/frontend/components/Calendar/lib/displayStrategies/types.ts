import { EventResources, BaseCalendarEvent } from "@/components/Calendar"

export interface BaseDisplayProperties {
	displayStart: Date
	displayEnd: Date
	allDay?: boolean
	className?: string
	overlap?: number
	hasSameStart?: number
	index?: number
	slotIndex?: number
	groupSize?: number
}

export interface GridDisplayProperties extends BaseDisplayProperties {
	columnStart: number
	columnSpan: number
}

export interface TimeGridDisplayProperties extends GridDisplayProperties {
	rowStart: number
	rowEnd: number
}

export interface AgendaDisplayProperties extends BaseDisplayProperties {
	// No additional properties needed for agenda view
}

export type CompareFunction<TEventResources extends EventResources, P extends BaseDisplayProperties> = (
	a: EventDisplayDetails<TEventResources, P>,
	b: EventDisplayDetails<TEventResources, P>
) => number


export interface EventDisplayDetails<
	TEventResources extends EventResources,
	P extends BaseDisplayProperties
> {
	event: BaseCalendarEvent<TEventResources>
	displayProperties: P
	compare: CompareFunction<TEventResources, P>
}
