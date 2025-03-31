import dayjsLib, { Dayjs, OpUnitType, ManipulateType } from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import localeData from "dayjs/plugin/localeData"
import localizedFormat from "dayjs/plugin/localizedFormat"
import minMax from "dayjs/plugin/minMax"
import utc from "dayjs/plugin/utc"

import { DateLocalizer, DateLocalizerFactory } from "@/Components/CalendarCustom/lib/localizers"
import { VIEW_NAMES } from "@/Components/CalendarCustom/Views"

import { CalendarEvent } from "../.."

dayjsLib.extend(localeData)

interface TZ {
	(date: number | Date | string | Dayjs, timezone?: string): Dayjs
	guess(): string
}

type DayjsLib = typeof dayjsLib & {
	tz?: TZ
}

export const dayJsLocalizer: DateLocalizerFactory<DayjsLib> = (dayjs) => {

	const firstVisibleDay = <T extends boolean = true>(
		date: Date,
		view: VIEW_NAMES,
		asDate: T = true as T
	): T extends true ? Date : dayjsLib.Dayjs => {
		let d: dayjsLib.Dayjs

		switch(view) {
			case "month":
				d = dayjs(date).startOf(view).startOf("week").startOf("day")
				break
			case "week":
				d = dayjs(date).startOf(view).startOf("day")
				break
			case "day":
				d = dayjs(date).startOf("day")
				break
			case "agenda":
				d = dayjs(date).startOf("day")
				break
			default:
				d = dayjs(date).startOf("day")
		}

		return (asDate ? d.toDate() : d) as T extends true ? Date : dayjsLib.Dayjs
	}

	const lastVisibleDay = <T extends boolean = true>(
		date: Date,
		view: VIEW_NAMES,
		asDate: T = true as T
	): T extends true ? Date : dayjsLib.Dayjs => {
		let d: dayjsLib.Dayjs

		switch(view) {
			case "month":
				d = dayjs(date).endOf(view).endOf("week").endOf("day")
				break
			case "week":
				d = dayjs(date).endOf(view).endOf("day")
				break
			case "day":
				d = dayjs(date).endOf("day")
				break
			case "agenda":
				d = dayjs(date).endOf("day")
				break
			default:
				d = dayjs(date).endOf("day")
		}

		return (asDate ? d.toDate() : d) as T extends true ? Date : dayjsLib.Dayjs
	}

	const visibleDays = (date: Date, view: VIEW_NAMES) => {
		let current = dayjs(firstVisibleDay(date, view, false))
		const last = dayjs(lastVisibleDay(date, view, false))
		const days = []

		while(current.isBefore(last)) {
			days.push(current.clone().toDate())
			current = current.add(1, "day")
		}

		return days
	}

	const isBefore = (date: Date, compareDate: Date) => {
		return dayjs(date).isBefore(compareDate)
	}

	const isAfter = (date: Date, compareDate: Date) => {
		return dayjs(date).isAfter(compareDate)
	}

	const groupedEventsForPeriod = <TEvent extends CalendarEvent = CalendarEvent>(events: TEvent[], date: Date, view: VIEW_NAMES) => {
		const firstDay = firstVisibleDay(date, view)
		const lastDay = lastVisibleDay(date, view)

		const groupedEvents = new Map<string, TEvent[]>()
		events.forEach(event => {
			if(dayjs(event.start).isBetween(firstDay, lastDay)) {
				const eventGroupingString = dayjs(event.start).startOf("day").toISOString()
				const daysEvents = groupedEvents.get(eventGroupingString) ?? []
				daysEvents.push(event)
				groupedEvents.set(eventGroupingString, daysEvents)
			}
		})

		return groupedEvents
	}

	return new DateLocalizer({
		weekdays: dayjsLib.weekdays,
		firstVisibleDay: (date: Date, view: VIEW_NAMES): Date => firstVisibleDay(date, view, true),
		lastVisibleDay: (date: Date, view: VIEW_NAMES): Date => lastVisibleDay(date, view, true),
		visibleDays,
		isBefore,
		isAfter,
		groupedEventsForPeriod,
	})
}
