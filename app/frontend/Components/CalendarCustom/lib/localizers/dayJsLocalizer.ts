import dayjsLib, { Dayjs, OpUnitType, ManipulateType } from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import localeData from "dayjs/plugin/localeData"
import localizedFormat from "dayjs/plugin/localizedFormat"
import minMax from "dayjs/plugin/minMax"
import utc from "dayjs/plugin/utc"

import { DateLocalizer, DateLocalizerFactory, TIME_UNIT } from "@/Components/CalendarCustom/lib/localizers"
import { VIEW_NAMES } from "@/Components/CalendarCustom/Views"

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
		view: TIME_UNIT,
		asDate: T = true as T
	): T extends true ? Date : dayjsLib.Dayjs => {
		const d = dayjs(date).startOf(view).startOf("week")
		return (asDate ? d.toDate() : d) as T extends true ? Date : dayjsLib.Dayjs
	}

	const lastVisibleDay = <T extends boolean = true>(
		date: Date,
		view: TIME_UNIT,
		asDate: T = true as T
	): T extends true ? Date : dayjsLib.Dayjs => {
		const d = dayjs(date).endOf(view).endOf("week")
		return (asDate ? d.toDate() : d) as T extends true ? Date : dayjsLib.Dayjs
	}

	const visibleDays = (date: Date ) => {
		let current = dayjs(firstVisibleDay(date, "month", false))
		const last = dayjs(lastVisibleDay(date, "month", false))
		const days = []

		while(current.isBefore(last)) {
			days.push(current.clone().toDate())
			current = current.add(1, "day")
		}

		return days
	}

	return new DateLocalizer({
		weekdays: dayjsLib.weekdays,
		firstVisibleDay: (date: Date, view: TIME_UNIT): Date => firstVisibleDay(date, view, true),
		lastVisibleDay: (date: Date, view: TIME_UNIT): Date => lastVisibleDay(date, view, true),
		visibleDays,
	})
}
