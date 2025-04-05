import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { createContext } from "@/lib/hooks"

import { VIEW_NAMES, NAVIGATION_ACTION } from "./Views"

export type CalendarEventTitleCallback = (event: Pick<CalendarEvent, "start" | "end" | "allDay">) => string

export interface CalendarEvent {
	id: string | number
	title: string | CalendarEventTitleCallback
	start: Date
	end: Date
	allDay?: boolean
	color?: string
}

type CalendarContext<TEvent extends CalendarEvent = CalendarEvent> = {
	date: Date
	events: TEvent[]
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
	onEventClick: (event: TEvent, element: HTMLElement) => void
}

const [useCalendarContext, CalendarProvider] = createContext<CalendarContext>()
export { useCalendarContext, CalendarProvider }

export { Calendar } from "./Calendar"
