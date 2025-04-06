import { CalendarGenerics } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import { AgendaView } from "./Agenda"
import { DayView } from "./Day"
import { MonthView } from "./Month"
import { WeekView } from "./Week"
import { DisplayStrategyFunction, StrategyType } from "../lib/displayStrategies/DisplayStrategyManager"

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

export interface BaseViewProps<T extends CalendarGenerics> {
	className?: string
	style?: React.CSSProperties
	displayStrategy: StrategyType | DisplayStrategyFunction<T>
}

export type DateRange = { start: Date, end: Date }

export type ViewStaticMethodProps<T extends CalendarGenerics> = {
	date: Date
	today: Date
	localizer: CalendarLocalizer
	events: T["Event"][]
}

export type ViewComponent<T extends CalendarGenerics, Props extends BaseViewProps<T> = BaseViewProps<T>> = React.ComponentType<Props> & {
	range: (date: Date, props: ViewStaticMethodProps<T>) => DateRange
	navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<T>) => Date
	title: (date: Date, props: ViewStaticMethodProps<T>) => string
}

export function validateViewComponent<T extends CalendarGenerics, Props extends BaseViewProps<T>>(
	component: ViewComponent<T, Props>
) {
	if(typeof component.range !== "function")
		throw new Error("View component must implement static range method")
	if(typeof component.navigate !== "function")
		throw new Error("View component must implement static navigate method")
	if(typeof component.title !== "function")
		throw new Error("View component must implement static title method")
}

export function createViewComponent<T extends CalendarGenerics, Props extends BaseViewProps<T> = BaseViewProps<T>>(
	component: React.ComponentType<Props>,
	staticProps: {
		range: ViewComponent<T, Props>["range"]
		navigate: ViewComponent<T, Props>["navigate"]
		title: ViewComponent<T, Props>["title"]
	}
): ViewComponent<T, Props> {
	const viewComponent = component as ViewComponent<T, Props>
	viewComponent.range = staticProps.range
	viewComponent.navigate = staticProps.navigate
	viewComponent.title = staticProps.title

	validateViewComponent(viewComponent)

	return viewComponent
}

export const viewComponents = {
	[VIEWS.month]: MonthView,
	[VIEWS.week]: WeekView,
	[VIEWS.day]: DayView,
	[VIEWS.agenda]: AgendaView,
} as const
