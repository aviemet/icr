import { useEffect, useState } from "react"

import { VIEW_NAMES } from "@/Components/CalendarCustom/Views"
import { DisplayStrategy, DisplayStrategyFunction } from "@/Components/CalendarCustom/Views/Month/displayStrategies"

import { CalendarEvent } from "../.."
import { CalendarMessages, defaultMessages } from "../messages"

export { dayJsLocalizer } from "./dayJsLocalizer"

export type TIME_UNIT = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

export type CalendarLocalizerFactory<TLib extends unknown> = (lib: TLib) => CalendarLocalizer

type CalendarLocalizerMethods = {
	weekdays: () => string[]
	firstVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	lastVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	visibleDays: (date: Date, view: VIEW_NAMES) => Date[]
	isBefore: (date: Date, compareDate: Date) => boolean
	isAfter: (date: Date, compareDate: Date) => boolean
	add: (date: Date, amount: number, unit: TIME_UNIT) => Date
	subtract: (date: Date, amount: number, unit: TIME_UNIT) => Date
	groupedEventsForPeriod: <TEvent extends CalendarEvent = CalendarEvent>(
		events: TEvent[],
		date: Date,
		view: VIEW_NAMES,
		localizer: CalendarLocalizer,
		displayStrategy?: DisplayStrategy | DisplayStrategyFunction
	) => Map<string, TEvent[]>
	calculateGridPlacement: <TEvent extends CalendarEvent = CalendarEvent>(event: TEvent) => { columnStart: number, columnSpan: number }
	format: (date: Date, format: string) => string
	messages: CalendarMessages
	dayOfWeek: (date: Date) => number
	startOf: (date: Date, unit: TIME_UNIT) => Date
	endOf: (date: Date, unit: TIME_UNIT) => Date
	dateWithinRange: (view: VIEW_NAMES, date: Date, compareDate?: Date) => boolean
}

export class CalendarLocalizer {
	weekdays: CalendarLocalizerMethods["weekdays"]
	firstVisibleDay: CalendarLocalizerMethods["firstVisibleDay"]
	lastVisibleDay: CalendarLocalizerMethods["lastVisibleDay"]
	visibleDays: CalendarLocalizerMethods["visibleDays"]
	isBefore: CalendarLocalizerMethods["isBefore"]
	isAfter: CalendarLocalizerMethods["isAfter"]
	groupedEventsForPeriod: CalendarLocalizerMethods["groupedEventsForPeriod"]
	calculateGridPlacement: CalendarLocalizerMethods["calculateGridPlacement"]
	add: CalendarLocalizerMethods["add"]
	subtract: CalendarLocalizerMethods["subtract"]
	format: CalendarLocalizerMethods["format"]
	messages: CalendarLocalizerMethods["messages"]
	dayOfWeek: CalendarLocalizerMethods["dayOfWeek"]
	startOf: CalendarLocalizerMethods["startOf"]
	endOf: CalendarLocalizerMethods["endOf"]
	dateWithinRange: CalendarLocalizerMethods["dateWithinRange"]

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
