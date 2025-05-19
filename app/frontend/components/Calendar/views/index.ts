import { BaseCalendarEvent, Resource, EventResources } from "@/components/Calendar"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"

import { AgendaView } from "./Agenda"
import { DayView } from "./Day"
import { MonthView } from "./Month"
import { WeekView } from "./Week"
import { ViewStrategyName, DisplayStrategyFactories } from "../lib/displayStrategies"
import { BaseDisplayProperties } from "../lib/displayStrategies/types"

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

export type ViewTitleBuilder<TEventResources extends EventResources> = (
	event: BaseCalendarEvent<TEventResources>,
	displayProperties: BaseDisplayProperties
) => string

export interface BaseViewProps<TEventResources extends EventResources = EventResources, V extends VIEW_NAMES = VIEW_NAMES> {
	className?: string
	style?: React.CSSProperties
	displayStrategy: V extends keyof DisplayStrategyFactories ? ViewStrategyName<V> : never
	onSelectSlot?: (date: Date) => void
	titleBuilder?: ViewTitleBuilder<TEventResources>
}

export type DateRange = { start: Date, end: Date }

export interface ViewStaticMethodProps<TEventResources extends EventResources = EventResources> {
	date: Date
	today: Date
	localizer: CalendarLocalizer
	events: BaseCalendarEvent<TEventResources>[]
	resourcesById: Map<string | number, Resource>
}

export type ViewComponent<TEventResources extends EventResources, V extends VIEW_NAMES> = React.ComponentType<BaseViewProps<TEventResources, V>> & {
	range: (date: Date, props: ViewStaticMethodProps<TEventResources>) => DateRange
	navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<TEventResources>) => Date
	title: (date: Date, props: ViewStaticMethodProps<TEventResources>) => string
}

export function validateViewComponent<TEventResources extends EventResources, V extends VIEW_NAMES>(
	component: ViewComponent<TEventResources, V>
) {
	if(typeof component.range !== "function")
		throw new Error("View component must implement static range method")
	if(typeof component.navigate !== "function")
		throw new Error("View component must implement static navigate method")
	if(typeof component.title !== "function")
		throw new Error("View component must implement static title method")
}

export function createViewComponent<TEventResources extends EventResources, V extends VIEW_NAMES>(
	component: React.ComponentType<BaseViewProps<TEventResources, V>>,
	staticProps: {
		range: (date: Date, props: ViewStaticMethodProps<TEventResources>) => DateRange
		navigate: (date: Date, action: NAVIGATION_ACTION, props: ViewStaticMethodProps<TEventResources>) => Date
		title: (date: Date, props: ViewStaticMethodProps<TEventResources>) => string
	}
): ViewComponent<TEventResources, V> {
	const viewComponent = component as ViewComponent<TEventResources, V>
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
