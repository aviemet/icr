import { useEffect, useState } from "react"

import { VIEW_NAMES } from "@/Components/CalendarCustom/Views"

import { CalendarEvent } from "../.."

export { dayJsLocalizer } from "./dayJsLocalizer"

export type TIME_UNIT = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

export type DateLocalizerFactory<TLib extends unknown> = (lib: TLib) => DateLocalizer

type DateLocalizerMethods = {
	weekdays: () => string[]
	firstVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	lastVisibleDay: (date: Date, view: VIEW_NAMES) => Date
	visibleDays: (date: Date, view: VIEW_NAMES) => Date[]
	isBefore: (date: Date, compareDate: Date) => boolean
	isAfter: (date: Date, compareDate: Date) => boolean
	groupedEventsForPeriod: <TEvent extends CalendarEvent = CalendarEvent>(events: TEvent[], date: Date, view: VIEW_NAMES) => Map<string, TEvent[]>
}

export class DateLocalizer {
	weekdays: DateLocalizerMethods["weekdays"]
	firstVisibleDay: DateLocalizerMethods["firstVisibleDay"]
	lastVisibleDay: DateLocalizerMethods["lastVisibleDay"]
	visibleDays: DateLocalizerMethods["visibleDays"]
	isBefore: DateLocalizerMethods["isBefore"]
	isAfter: DateLocalizerMethods["isAfter"]
	groupedEventsForPeriod: DateLocalizerMethods["groupedEventsForPeriod"]

	constructor(fns: DateLocalizerMethods) {
		this.weekdays = fns.weekdays
		this.firstVisibleDay = fns.firstVisibleDay
		this.lastVisibleDay = fns.lastVisibleDay
		this.visibleDays = fns.visibleDays
		this.isBefore = fns.isBefore
		this.isAfter = fns.isAfter
		this.groupedEventsForPeriod = fns.groupedEventsForPeriod
	}
}

/**
 * Lazy loads default dayjs localizer if none is provided
 */
export const useDefaultLocalizer = (localizer: DateLocalizer | undefined) => {
	const [localLocalizer, setLocalLocalizer] = useState<DateLocalizer | undefined>(localizer)

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
