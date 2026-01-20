import React, { createContext as ReactCreateContext, useContext as ReactUseContext } from "react"

import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"

import { BaseDisplayProperties } from "./lib/displayStrategies"
import { VIEW_NAMES, NAVIGATION_ACTION } from "./views"

export interface Resource {
	id: string | number
	title: string
}

export type EventResources = Record<string, object>

export interface BaseCalendarEvent<TEventResources extends EventResources = EventResources> {
	id: string | number
	title: string
	titleBuilder?: CalendarEventTitleCallback
	start: Date
	end: Date
	allDay?: boolean
	color?: string
	description?: string
	resources?: TEventResources
	resourceId?: string | number
}

export type CalendarEventTitleCallback<TEventResources extends EventResources = EventResources> = (event: Pick<BaseCalendarEvent<TEventResources>, "start" | "end" | "allDay" | "title" | "resources" | "resourceId">) => string

export type CalendarClickTarget =
	| { type: "event", event: BaseCalendarEvent, element: HTMLElement }
	| { type: "background", date: Date, time?: Date, resourceId?: string | number, element: HTMLElement }

interface CalendarContextValue {
	date: Date
	events: BaseCalendarEvent[]
	draftEvents: BaseCalendarEvent[]
	upsertDraftEvent: (event: BaseCalendarEvent) => void
	patchDraftEvent: (id: BaseCalendarEvent["id"], patch: Partial<BaseCalendarEvent>) => void
	removeDraftEvent: (id: BaseCalendarEvent["id"]) => void
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
	onClick: (target: CalendarClickTarget) => void
	resourcesById: Map<string | number, Resource>
	groupByResource: boolean
	maxEvents: number
	prevDate: Date
	defaultTitleBuilder?: CalendarEventTitleCallback
	getEventTitle: <TEventResources extends EventResources>(
		event: BaseCalendarEvent<TEventResources>,
		displayProperties: BaseDisplayProperties
	) => string
}

export type CalendarContext = CalendarContextValue

const ContextObject = ReactCreateContext<CalendarContextValue | undefined>(undefined)

export const useCalendarContext = (): CalendarContextValue => {
	const context = ReactUseContext(ContextObject)
	if(context === undefined) {
		throw new Error("useCalendarContext must be used within a CalendarProvider")
	}
	return context
}

export const CalendarProvider = (
	props: React.PropsWithChildren<{ value: CalendarContextValue }>
): JSX.Element => {
	return <ContextObject.Provider value={ props.value }>{ props.children }</ContextObject.Provider>
}

export { DefaultCalendar as Calendar } from "./DefaultCalendar"
