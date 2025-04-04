import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import { AgendaView } from "./Agenda"
import { DayView } from "./Day"
import { MonthView } from "./Month"
import { DisplayStrategy, DisplayStrategyFunction } from "./Month/displayStrategies"
import { WeekView } from "./Week"

export const VIEWS = {
	month: "month",
	week: "week",
	day: "day",
	agenda: "agenda",
} as const
export type VIEW_NAMES = keyof typeof VIEWS

export const NAVIGATION = {
	previous: "previous",
	today: "today",
	next: "next",
	date: "date",
} as const
export type NAVIGATION_ACTION = keyof typeof NAVIGATION

export interface BaseViewProps<TEvent extends CalendarEvent = CalendarEvent> {
	className?: string
	style?: React.CSSProperties
	displayStrategy?: DisplayStrategy | DisplayStrategyFunction
}

export type DateRange = { start: Date, end: Date }

export type ViewStaticMethodProps<TEvent extends CalendarEvent = CalendarEvent> = {
	date: Date
	today: Date
	localizer: CalendarLocalizer
	events: TEvent[] | undefined
}

export type ViewComponent<TProps extends BaseViewProps = BaseViewProps, TEvent extends CalendarEvent = CalendarEvent> = React.ComponentType<TProps> & {
	range: (date: Date, props: ViewStaticMethodProps<TEvent>) => DateRange
	navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<TEvent>) => Date
	title: (date: Date, props: ViewStaticMethodProps<TEvent>) => string
}

export function validateViewComponent<TProps extends BaseViewProps, TEvent extends CalendarEvent>(
	component: ViewComponent<TProps, TEvent>
) {
	if(typeof component.range !== "function")
		throw new Error("View component must implement static range method")
	if(typeof component.navigate !== "function")
		throw new Error("View component must implement static navigate method")
	if(typeof component.title !== "function")
		throw new Error("View component must implement static title method")
}

export function createViewComponent<
	TEvent extends CalendarEvent = CalendarEvent,
	TProps extends BaseViewProps<TEvent> = BaseViewProps<TEvent>
>(
	component: React.ComponentType<TProps>,
	staticProps: {
		range: ViewComponent<TProps, TEvent>["range"]
		navigate: ViewComponent<TProps, TEvent>["navigate"]
		title: ViewComponent<TProps, TEvent>["title"]
	}
): ViewComponent<TProps, TEvent> {
	const viewComponent = component as ViewComponent<TProps, TEvent>
	viewComponent.range = staticProps.range
	viewComponent.navigate = staticProps.navigate
	viewComponent.title = staticProps.title

	validateViewComponent(viewComponent)

	return viewComponent
}

export const viewComponents: Record<VIEW_NAMES, ViewComponent> = {
	[VIEWS.month]: MonthView,
	[VIEWS.week]: WeekView,
	[VIEWS.day]: DayView,
	[VIEWS.agenda]: AgendaView,
}
