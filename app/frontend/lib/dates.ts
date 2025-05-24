import dayjs from "dayjs"

import { CalendarLocalizer, dayJsLocalizer } from "@/components/Calendar/lib/localizers"

export const ensureDate = (value: unknown): Date => {
	if(value instanceof Date) return dayjs(value).toDate()

	if(typeof value === "string" || typeof value === "number") {
		const date = dayjs(value)
		if(date.isValid()) return date.toDate()
	}

	return new Date()
}

export const isDate = (value: unknown): value is Date => {
	return value instanceof Date
}

type Duration = {
	start: Date
	end: Date
}

export const eventsOverlap = (eventA: Duration, eventB: Duration, localizer: CalendarLocalizer = dayJsLocalizer(dayjs)) => {
	return localizer.isBefore(eventA.start, eventB.end) && localizer.isAfter(eventA.end, eventB.start)
}
