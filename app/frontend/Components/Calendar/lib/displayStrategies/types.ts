import { Resources, CalendarEvent } from "@/Components/Calendar"

export interface BaseDisplayProperties {
	displayStart: Date
	displayEnd: Date
	className?: string
	allDay?: boolean
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

}

export type CompareFunction<TResources extends Resources, P extends BaseDisplayProperties> = (
	a: EventDisplayDetails<TResources, P>,
	b: EventDisplayDetails<TResources, P>
) => number


export interface EventDisplayDetails<
	TResources extends Resources,
	P extends BaseDisplayProperties
> {
	event: CalendarEvent<TResources>
	displayProperties: P
	compare: CompareFunction<TResources, P>
}
