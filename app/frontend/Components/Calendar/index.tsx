import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { createContext } from "@/lib/hooks"

import { VIEW_NAMES, NAVIGATION_ACTION } from "./Views"

export type CalendarEventTitleCallback<TEvent extends CalendarEvent<TResources> = CalendarEvent<any>, TResources = any> = (event: Pick<TEvent, "start" | "end" | "allDay">) => string

export interface CalendarEvent<TResources = any> {
	id: string | number
	title: string | CalendarEventTitleCallback<CalendarEvent<TResources>, TResources>
	start: Date
	end: Date
	allDay?: boolean
	color?: string
	resources?: TResources
}

type CalendarContext<TEvent extends CalendarEvent<TResources> = CalendarEvent<any>, TResources = any> = {
	date: Date
	events: TEvent[]
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
	onEventClick: (event: TEvent, element: HTMLElement) => void
}

const [useCalendarContext, ContextProvider] = createContext<CalendarContext<CalendarEvent<any>, any>>()

export const CalendarProvider = ContextProvider as unknown as <TEvent extends CalendarEvent<TResources> = CalendarEvent<any>, TResources = any>(
	props: React.PropsWithChildren<{ value: CalendarContext<TEvent, TResources> }>
) => JSX.Element

export { useCalendarContext }
export type { CalendarContext }

export { Calendar } from "./Calendar"
