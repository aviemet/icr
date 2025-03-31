import { AgendaView } from "./Agenda"
import { DayView } from "./Day"
import { MonthView } from "./Month"
import { WeekView } from "./Week"

export const VIEWS = {
	month: "month",
	week: "week",
	day: "day",
	agenda: "agenda",
} as const
export type VIEW_NAMES = keyof typeof VIEWS

export const viewComponents = {
	month: MonthView,
	week: WeekView,
	day: DayView,
	agenda: AgendaView,
}

export interface BaseViewProps {

}
