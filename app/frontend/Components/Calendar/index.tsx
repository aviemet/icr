import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { createContext } from "@/lib/hooks"

import { VIEW_NAMES, NAVIGATION_ACTION } from "./Views"

export type Resources = Record<string, object>

export interface CalendarEvent<TResources extends Resources> {
	id: string | number
	title: string | ((event: Pick<CalendarEvent<TResources>, "start" | "end" | "allDay" | "resources">) => string)
	start: Date
	end: Date
	allDay?: boolean
	color?: string
	resources?: TResources
}

export type CalendarEventTitleCallback<TResources extends Resources> = (event: Pick<CalendarEvent<TResources>, "start" | "end" | "allDay" | "resources">) => string

type CalendarContext<TResources extends Resources> = {
	date: Date
	events: CalendarEvent<TResources>[]
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
	onEventClick: (event: CalendarEvent<TResources>, element: HTMLElement) => void
}

const [useBaseCalendarContext, ContextProvider] = createContext<CalendarContext<Resources>>()

export function useCalendarContext<TResources extends Resources>(): CalendarContext<TResources> {
	const baseContext = useBaseCalendarContext()
	return baseContext as unknown as CalendarContext<TResources>
}

export const CalendarProvider = ContextProvider as unknown as <TResources extends Resources>(
	props: React.PropsWithChildren<{ value: CalendarContext<TResources> }>
) => JSX.Element

export type { CalendarContext }

export { Calendar } from "./Calendar"
