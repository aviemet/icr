import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

import { CalendarLocalizer, dayJsLocalizer } from "@/components/Calendar/lib/localizers"

dayjs.extend(customParseFormat)

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

export function nearestHalfHour(date: Date = new Date()) {
	const d = dayjs(date)
	return d.startOf("hour").add(Math.round(d.minute() / 30) * 30, "minute").toDate()
}

const TIME_FORMATS = ["h:mm A", "hh:mm A", "H:mm", "HH:mm", "h:mm a", "hh:mm a"]

export function parseTimeString(timeString: string) {
	const trimmed = timeString.trim()
	if(!trimmed) return null

	for(const format of TIME_FORMATS) {
		const d = dayjs(trimmed, format, true)
		if(d.isValid()) {
			return {
				hour: Math.min(23, Math.max(0, d.hour())),
				minute: Math.min(59, Math.max(0, d.minute())),
			}
		}
	}
	return null
}
