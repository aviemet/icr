import { useEffect, useState } from "react"

import { VIEW_NAMES } from "@/Components/CalendarCustom/Views"
import {
	DisplayStrategy,
	DisplayStrategyFunction,
	EventDisplayDetails,
} from "@/Components/CalendarCustom/Views/Month/displayStrategies"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { CalendarEvent } from "../.."
import { CalendarMessages, defaultMessages } from "../messages"

export { dayJsLocalizer } from "./dayJsLocalizer"

export type TIME_UNIT = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

export type CalendarLocalizerFactory<TLib extends unknown> = (lib: TLib) => CalendarLocalizer

export interface CalendarLocalizerMethods {
	weekdays: () => string[]
	firstVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	lastVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	visibleDays: (date: Date, view: VIEW_NAMES) => Date[]
	isBefore: (date: Date, compareDate: Date) => boolean
	isAfter: (date: Date, compareDate: Date) => boolean
	add: (date: Date, amount: number, unit: TIME_UNIT) => Date
	subtract: (date: Date, amount: number, unit: TIME_UNIT) => Date
	dayOfWeek: (date: Date) => number
	startOf: (date: Date, unit: TIME_UNIT) => Date
	endOf: (date: Date, unit: TIME_UNIT) => Date
	dateWithinRange: (view: VIEW_NAMES, date: Date, compareDate?: Date) => boolean
	/**
	 * Subtracts 1 millisecond if the time is midnight.
	 * Ensures reading the date for an event ending at midnight returns the starting day
	 * rather than the next day, which would cause the event to flow to the next date cell
	 */
	adjustMidnightTime: (date: Date) => Date

	/**
	 * Filters events outside of view window.
	 * Groups events by start date into a Map.
	 * Breaks long events into multiples based on the display strategy.
	 */
	groupedEventsForPeriod: <TEvent extends CalendarEvent = CalendarEvent>(
		events: TEvent[],
		date: Date,
		view: VIEW_NAMES,
		localizer: CalendarLocalizer,
		displayStrategy?: DisplayStrategy | DisplayStrategyFunction<TEvent>
	) => Map<string, SortedArray<EventDisplayDetails<TEvent>>>
	calculateGridPlacement: <TEvent extends CalendarEvent = CalendarEvent>(event: TEvent) => { columnStart: number, columnSpan: number }
	format: (date: Date, format: string) => string
	messages: CalendarMessages
}

export class CalendarLocalizer {
	weekdays: CalendarLocalizerMethods["weekdays"]
	firstVisibleDay: CalendarLocalizerMethods["firstVisibleDay"]
	lastVisibleDay: CalendarLocalizerMethods["lastVisibleDay"]
	visibleDays: CalendarLocalizerMethods["visibleDays"]
	isBefore: CalendarLocalizerMethods["isBefore"]
	isAfter: CalendarLocalizerMethods["isAfter"]
	add: CalendarLocalizerMethods["add"]
	subtract: CalendarLocalizerMethods["subtract"]
	dayOfWeek: CalendarLocalizerMethods["dayOfWeek"]
	startOf: CalendarLocalizerMethods["startOf"]
	endOf: CalendarLocalizerMethods["endOf"]
	dateWithinRange: CalendarLocalizerMethods["dateWithinRange"]
	adjustMidnightTime: CalendarLocalizerMethods["adjustMidnightTime"]
	groupedEventsForPeriod: CalendarLocalizerMethods["groupedEventsForPeriod"]
	calculateGridPlacement: CalendarLocalizerMethods["calculateGridPlacement"]
	format: CalendarLocalizerMethods["format"]
	messages: CalendarLocalizerMethods["messages"]

	constructor(fns: CalendarLocalizerMethods) {
		this.weekdays = fns.weekdays
		this.firstVisibleDay = fns.firstVisibleDay
		this.lastVisibleDay = fns.lastVisibleDay
		this.visibleDays = fns.visibleDays
		this.isBefore = fns.isBefore
		this.isAfter = fns.isAfter
		this.groupedEventsForPeriod = fns.groupedEventsForPeriod
		this.calculateGridPlacement = fns.calculateGridPlacement
		this.add = fns.add
		this.subtract = fns.subtract
		this.format = fns.format
		this.messages = fns.messages || defaultMessages
		this.dayOfWeek = fns.dayOfWeek
		this.startOf = fns.startOf
		this.endOf = fns.endOf
		this.dateWithinRange = fns.dateWithinRange
		this.adjustMidnightTime = fns.adjustMidnightTime
	}
}

/**
 * Lazy loads default dayjs localizer if none is provided
 */
export const useDefaultLocalizer = (localizer: CalendarLocalizer | undefined) => {
	const [localLocalizer, setLocalLocalizer] = useState<CalendarLocalizer | undefined>(localizer)

	useEffect(() => {
		if(!localLocalizer && !localizer) {
			const loadLocalizer = async() => {
				const dayjsModule = await import("dayjs")
				const { dayJsLocalizer } = await import("@/Components/CalendarCustom/lib/localizers")
				setLocalLocalizer(dayJsLocalizer(dayjsModule.default))
			}
			loadLocalizer()
		} else if(localizer && !localLocalizer) {
			setLocalLocalizer(localizer)
		}
	}, [localizer, localLocalizer])

	return localLocalizer
}
