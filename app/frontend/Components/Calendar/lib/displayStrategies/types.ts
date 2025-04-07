import { CalendarGenerics } from "@/Components/Calendar"

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

export type CompareFunction<T extends CalendarGenerics, P extends BaseDisplayProperties> = (
	a: EventDisplayDetails<T, P>,
	b: EventDisplayDetails<T, P>
) => number


export interface EventDisplayDetails<
	T extends CalendarGenerics,
	P extends BaseDisplayProperties
> {
	event: T["Event"]
	displayProperties: P
	compare: CompareFunction<T, P>
}
