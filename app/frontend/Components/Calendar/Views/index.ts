import { Resources, CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"


import { AgendaView } from "./Agenda"
import { DayView } from "./Day"
import { MonthView } from "./Month"
import { WeekView } from "./Week"
import { AllViewStrategyNames } from "../lib/displayStrategies"

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

// eslint-disable-next-line no-unused-vars
export interface BaseViewProps<TResources extends Resources> {
	className?: string
	style?: React.CSSProperties
	displayStrategy: AllViewStrategyNames
	onSelectSlot?: (date: Date) => void
}

export type DateRange = { start: Date, end: Date }

export type ViewStaticMethodProps<TResources extends Resources> = {
	date: Date
	today: Date
	localizer: CalendarLocalizer
	events: CalendarEvent<TResources>[]
}

export type ViewComponent<TResources extends Resources, Props extends BaseViewProps<TResources> = BaseViewProps<TResources>> = React.ComponentType<Props> & {
	range: (date: Date, props: ViewStaticMethodProps<TResources>) => DateRange
	navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<TResources>) => Date
	title: (date: Date, props: ViewStaticMethodProps<TResources>) => string
}

export function validateViewComponent<TResources extends Resources, Props extends BaseViewProps<TResources>>(
	component: ViewComponent<TResources, Props>
) {
	if(typeof component.range !== "function")
		throw new Error("View component must implement static range method")
	if(typeof component.navigate !== "function")
		throw new Error("View component must implement static navigate method")
	if(typeof component.title !== "function")
		throw new Error("View component must implement static title method")
}

export function createViewComponent<TResources extends Resources, Props extends BaseViewProps<TResources> = BaseViewProps<TResources>>(
	component: React.ComponentType<Props>,
	staticProps: {
		range: ViewComponent<TResources, Props>["range"]
		navigate: ViewComponent<TResources, Props>["navigate"]
		title: ViewComponent<TResources, Props>["title"]
	}
): ViewComponent<TResources, Props> {
	const viewComponent = component as ViewComponent<TResources, Props>
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
