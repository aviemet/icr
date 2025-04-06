import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { createContext } from "@/lib/hooks"

import { VIEW_NAMES, NAVIGATION_ACTION } from "./Views"

export type Resources = Record<string, object>

/**
 * Abstract a long type which is otherwise reused across the entire project:
 * <TEvent extends CalendarEvent<TResources>, TResources extends Resources = Resources>
 */
export type CalendarGenerics<TResources extends Resources = Resources> = {
	Event: CalendarEvent<TResources>
	Resources: TResources
}

export interface CalendarEvent<TResources extends Resources = Resources> {
	id: string | number
	title: string | ((event: Pick<CalendarEvent<TResources>, "start" | "end" | "allDay">) => string)
	start: Date
	end: Date
	allDay?: boolean
	color?: string
	resources?: TResources
}

export type CalendarEventTitleCallback<T extends CalendarGenerics> = (event: Pick<T["Event"], "start" | "end" | "allDay">) => string

type CalendarContext<T extends CalendarGenerics> = {
	date: Date
	events: T["Event"][]
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
	onEventClick: (event: T["Event"], element: HTMLElement) => void
}

const [useCalendarContext, ContextProvider] = createContext<CalendarContext<CalendarGenerics>>()

export const CalendarProvider = ContextProvider as unknown as <T extends CalendarGenerics>(
	props: React.PropsWithChildren<{ value: CalendarContext<T> }>
) => JSX.Element

export { useCalendarContext }
export type { CalendarContext }

export { Calendar } from "./Calendar"
