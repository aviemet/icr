import { CalendarGenerics } from "@/Components/Calendar"

import { CalendarLocalizer } from "../localizers"

export interface EventDisplayProperties {
	displayStart: Date
	displayEnd: Date
	columnStart: number
	columnSpan: number
	className?: string
}

export type CompareFunction<T extends CalendarGenerics> = (
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => number

export interface EventDisplayDetails<T extends CalendarGenerics> {
	event: T["Event"]
	displayProperties: EventDisplayProperties
	compare: CompareFunction<T>
}

export type DisplayStrategyFunction<T extends CalendarGenerics> = (
	event: T["Event"],
	localizer: CalendarLocalizer
) => EventDisplayDetails<T>[]

export type ViewStrategies<T extends string> = {
	[K in T]: DisplayStrategyFunction<any>
}
