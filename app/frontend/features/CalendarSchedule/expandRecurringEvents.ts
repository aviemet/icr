import dayjs from "dayjs"

import { type BaseCalendarEvent, type EventResources } from "@/components/Calendar"
import { ensureDate } from "@/lib/dates"

export type ExpandablePattern = {
	recurring_type?: string
	offset?: number
	day_of_week?: number | null
	day_of_month?: number | null
	week_of_month?: number | null
	month_of_year?: number | null
	end_date?: string | Date | null
	max_occurrences?: number | null
}

export type ScheduleRecurrenceResources = {
	masterId: string
	occurrenceStartsAt: string
	isRecurring: boolean
	patterns: ExpandablePattern[]
}

export type ExpandableScheduleEvent = {
	id: string
	name?: string | null
	starts_at: string | Date
	ends_at: string | Date
	all_day?: boolean
	recurring_patterns?: ExpandablePattern[]
	event_exceptions?: Array<{
		cancelled?: string | Date | null
		rescheduled?: string | Date | null
		starts_at?: string | Date | null
		ends_at?: string | Date | null
	}>
}

type MapOccurrenceArgs<TMaster extends ExpandableScheduleEvent> = {
	master: TMaster
	originalOccurrenceStart: Date
	displayStart: Date
	displayEnd: Date
	isRecurring: boolean
}

export function expansionWindow(date: Date, view: string) {
	const cursor = dayjs(date)
	if(view === "day") {
		return {
			start: cursor.startOf("day").toDate(),
			end: cursor.endOf("day").toDate(),
		}
	}
	if(view === "week") {
		return {
			start: cursor.startOf("week").toDate(),
			end: cursor.endOf("week").toDate(),
		}
	}
	return {
		start: cursor.startOf("month").subtract(7, "day").toDate(),
		end: cursor.endOf("month").add(7, "day").toDate(),
	}
}

function occurrenceKey(masterId: string, occurrenceStart: Date) {
	return `${masterId}__${occurrenceStart.toISOString()}`
}

function sameInstant(left: Date, right: Date) {
	return left.getTime() === right.getTime()
}

function atMasterClock(day: dayjs.Dayjs, masterStart: Date) {
	return day
		.hour(masterStart.getHours())
		.minute(masterStart.getMinutes())
		.second(masterStart.getSeconds())
		.millisecond(masterStart.getMilliseconds())
		.toDate()
}

function inVisibleRange(occurrence: Date, masterStart: Date, rangeStart: Date, rangeEnd: Date) {
	return occurrence.getTime() >= masterStart.getTime()
		&& occurrence.getTime() < rangeEnd.getTime()
		&& (occurrence.getTime() + 1) > rangeStart.getTime()
}

function seriesEndFromPatterns(patterns: ExpandablePattern[]) {
	const endDates = patterns
		.map((pattern) => pattern.end_date)
		.filter((value): value is string | Date => value !== null && value !== undefined && value !== "")
		.map((value) => dayjs(value).endOf("day").toDate())
	if(endDates.length === 0) return null
	return new Date(Math.min(...endDates.map((value) => value.getTime())))
}

function maxOccurrencesFromPatterns(patterns: ExpandablePattern[]) {
	const counts = patterns
		.map((pattern) => pattern.max_occurrences)
		.filter((value): value is number => typeof value === "number" && value > 0)
	if(counts.length === 0) return null
	return Math.min(...counts)
}

function dailyStarts(
	masterStart: Date,
	offset: number,
	seriesEnd: Date | null,
	maxOccurrences: number | null,
	rangeStart: Date,
	rangeEnd: Date,
) {
	const starts: Date[] = []
	let cursor = dayjs(masterStart)
	let count = 0
	const step = Math.max(offset, 1)

	while(cursor.valueOf() < rangeEnd.getTime()) {
		if(seriesEnd && cursor.valueOf() > seriesEnd.getTime()) break
		if(maxOccurrences !== null && count >= maxOccurrences) break

		const occurrence = cursor.toDate()
		if(inVisibleRange(occurrence, masterStart, rangeStart, rangeEnd)) {
			starts.push(occurrence)
		}
		count += 1
		cursor = cursor.add(step, "day")
	}
	return starts
}

function weeklyStarts(
	masterStart: Date,
	weekdays: number[],
	offset: number,
	seriesEnd: Date | null,
	maxOccurrences: number | null,
	rangeStart: Date,
	rangeEnd: Date,
) {
	const starts: Date[] = []
	const masterWeekStart = dayjs(masterStart).startOf("week")
	let cursor = dayjs(masterStart).startOf("day")
	const rangeEndDay = dayjs(rangeEnd).endOf("day")
	let count = 0

	while(cursor.isBefore(rangeEndDay) || cursor.isSame(rangeEndDay, "day")) {
		if(seriesEnd && cursor.valueOf() > seriesEnd.getTime()) break
		if(maxOccurrences !== null && count >= maxOccurrences) break

		const dayOfWeek = cursor.day()
		if(weekdays.includes(dayOfWeek)) {
			const weeks = cursor.startOf("week").diff(masterWeekStart, "week")
			const onInterval = offset <= 1 || (weeks >= 0 && weeks % offset === 0)
			if(onInterval) {
				const occurrence = atMasterClock(cursor, masterStart)
				if(occurrence.getTime() >= masterStart.getTime()) {
					count += 1
					if(maxOccurrences !== null && count > maxOccurrences) break
					if(inVisibleRange(occurrence, masterStart, rangeStart, rangeEnd)) {
						starts.push(occurrence)
					}
				}
			}
		}
		cursor = cursor.add(1, "day")
	}
	return starts
}

function monthlyDayStarts(
	masterStart: Date,
	dayOfMonth: number,
	offset: number,
	seriesEnd: Date | null,
	maxOccurrences: number | null,
	rangeStart: Date,
	rangeEnd: Date,
) {
	const starts: Date[] = []
	let cursor = dayjs(masterStart).startOf("month")
	let count = 0
	const step = Math.max(offset, 1)

	while(cursor.valueOf() < rangeEnd.getTime() + 32 * 24 * 60 * 60 * 1000) {
		if(seriesEnd && cursor.valueOf() > seriesEnd.getTime()) break
		if(maxOccurrences !== null && count >= maxOccurrences) break

		const daysInMonth = cursor.daysInMonth()
		const day = Math.min(dayOfMonth, daysInMonth)
		const occurrence = atMasterClock(cursor.date(day), masterStart)
		if(occurrence.getTime() >= masterStart.getTime()) {
			count += 1
			if(maxOccurrences !== null && count > maxOccurrences) break
			if(inVisibleRange(occurrence, masterStart, rangeStart, rangeEnd)) {
				starts.push(occurrence)
			}
		}
		cursor = cursor.add(step, "month").startOf("month")
	}
	return starts
}

function monthlyNthWeekdayStarts(
	masterStart: Date,
	dayOfWeek: number,
	weekOfMonth: number,
	offset: number,
	seriesEnd: Date | null,
	maxOccurrences: number | null,
	rangeStart: Date,
	rangeEnd: Date,
) {
	const starts: Date[] = []
	let cursor = dayjs(masterStart).startOf("month")
	let count = 0
	const step = Math.max(offset, 1)

	while(cursor.valueOf() < rangeEnd.getTime() + 32 * 24 * 60 * 60 * 1000) {
		if(seriesEnd && cursor.valueOf() > seriesEnd.getTime()) break
		if(maxOccurrences !== null && count >= maxOccurrences) break

		let occurrenceDay: dayjs.Dayjs
		if(weekOfMonth < 0) {
			const end = cursor.endOf("month").startOf("day")
			let walk = end
			while(walk.day() !== dayOfWeek) {
				walk = walk.subtract(1, "day")
			}
			occurrenceDay = walk
		} else {
			let walk = cursor
			while(walk.day() !== dayOfWeek) {
				walk = walk.add(1, "day")
			}
			occurrenceDay = walk.add((weekOfMonth - 1) * 7, "day")
			if(occurrenceDay.month() !== cursor.month()) {
				cursor = cursor.add(step, "month").startOf("month")
				continue
			}
		}

		const occurrence = atMasterClock(occurrenceDay, masterStart)
		if(occurrence.getTime() >= masterStart.getTime()) {
			count += 1
			if(maxOccurrences !== null && count > maxOccurrences) break
			if(inVisibleRange(occurrence, masterStart, rangeStart, rangeEnd)) {
				starts.push(occurrence)
			}
		}
		cursor = cursor.add(step, "month").startOf("month")
	}
	return starts
}

function yearlyStarts(
	masterStart: Date,
	monthOfYear: number,
	dayOfMonth: number,
	offset: number,
	seriesEnd: Date | null,
	maxOccurrences: number | null,
	rangeStart: Date,
	rangeEnd: Date,
) {
	const starts: Date[] = []
	let year = masterStart.getFullYear()
	let count = 0
	const step = Math.max(offset, 1)

	while(year <= rangeEnd.getFullYear() + 1) {
		if(seriesEnd && dayjs(`${year}-12-31`).valueOf() > seriesEnd.getTime() && count > 0) {
			const probe = dayjs(`${year}-${String(monthOfYear).padStart(2, "0")}-01`)
			if(probe.valueOf() > seriesEnd.getTime()) break
		}
		if(maxOccurrences !== null && count >= maxOccurrences) break

		const monthCursor = dayjs(new Date(year, monthOfYear - 1, 1))
		const day = Math.min(dayOfMonth, monthCursor.daysInMonth())
		const occurrence = atMasterClock(monthCursor.date(day), masterStart)
		if(occurrence.getTime() >= masterStart.getTime()) {
			count += 1
			if(maxOccurrences !== null && count > maxOccurrences) break
			if(seriesEnd && occurrence.getTime() > seriesEnd.getTime()) break
			if(inVisibleRange(occurrence, masterStart, rangeStart, rangeEnd)) {
				starts.push(occurrence)
			}
		}
		year += step
	}
	return starts
}

function occurrenceStartsForPatterns(
	masterStart: Date,
	patterns: ExpandablePattern[],
	rangeStart: Date,
	rangeEnd: Date,
) {
	const offset = Math.max(...patterns.map((pattern) => pattern.offset ?? 1), 1)
	const seriesEnd = seriesEndFromPatterns(patterns)
	const maxOccurrences = maxOccurrencesFromPatterns(patterns)
	const type = patterns[0]?.recurring_type

	if(type === "daily") {
		return dailyStarts(masterStart, offset, seriesEnd, maxOccurrences, rangeStart, rangeEnd)
	}

	if(type === "weekly") {
		const weekdays = patterns
			.map((pattern) => pattern.day_of_week)
			.filter((day): day is number => typeof day === "number")
		return weeklyStarts(masterStart, weekdays, offset, seriesEnd, maxOccurrences, rangeStart, rangeEnd)
	}

	if(type === "monthly") {
		const nth = patterns.find((pattern) => typeof pattern.week_of_month === "number" && typeof pattern.day_of_week === "number")
		if(nth && typeof nth.week_of_month === "number" && typeof nth.day_of_week === "number") {
			return monthlyNthWeekdayStarts(
				masterStart,
				nth.day_of_week,
				nth.week_of_month,
				offset,
				seriesEnd,
				maxOccurrences,
				rangeStart,
				rangeEnd,
			)
		}
		const dayOfMonth = patterns.find((pattern) => typeof pattern.day_of_month === "number")?.day_of_month
		if(typeof dayOfMonth === "number") {
			return monthlyDayStarts(masterStart, dayOfMonth, offset, seriesEnd, maxOccurrences, rangeStart, rangeEnd)
		}
		return []
	}

	if(type === "yearly") {
		const pattern = patterns[0]
		const monthOfYear = pattern?.month_of_year
		const dayOfMonth = pattern?.day_of_month
		if(typeof monthOfYear === "number" && typeof dayOfMonth === "number") {
			return yearlyStarts(
				masterStart,
				monthOfYear,
				dayOfMonth,
				offset,
				seriesEnd,
				maxOccurrences,
				rangeStart,
				rangeEnd,
			)
		}
		return []
	}

	return []
}

export function expandRecurringEvents<
	TMaster extends ExpandableScheduleEvent,
	TResources extends EventResources
>(
	masters: TMaster[],
	rangeStart: Date,
	rangeEnd: Date,
	mapOccurrence: (args: MapOccurrenceArgs<TMaster>) => BaseCalendarEvent<TResources>,
) {
	const expanded: BaseCalendarEvent<TResources>[] = []

	for(const master of masters) {
		const patterns = master.recurring_patterns ?? []
		const masterStart = ensureDate(master.starts_at)
		const masterEnd = ensureDate(master.ends_at)
		const durationMs = masterEnd.getTime() - masterStart.getTime()
		const exceptions = master.event_exceptions ?? []

		if(patterns.length === 0) {
			if(masterStart < rangeEnd && masterEnd > rangeStart) {
				expanded.push(mapOccurrence({
					master,
					originalOccurrenceStart: masterStart,
					displayStart: masterStart,
					displayEnd: masterEnd,
					isRecurring: false,
				}))
			}
			continue
		}

		const starts = occurrenceStartsForPatterns(masterStart, patterns, rangeStart, rangeEnd)

		for(const originalOccurrenceStart of starts) {
			const cancelled = exceptions.some((exception) => {
				if(exception.cancelled === null || exception.cancelled === undefined) return false
				return sameInstant(ensureDate(exception.cancelled), originalOccurrenceStart)
			})
			if(cancelled) continue

			const reschedule = exceptions.find((exception) => {
				if(exception.rescheduled === null || exception.rescheduled === undefined) return false
				return sameInstant(ensureDate(exception.rescheduled), originalOccurrenceStart)
			})

			const displayStart = reschedule?.starts_at
				? ensureDate(reschedule.starts_at)
				: originalOccurrenceStart
			const displayEnd = reschedule?.starts_at && reschedule.ends_at
				? ensureDate(reschedule.ends_at)
				: new Date(originalOccurrenceStart.getTime() + durationMs)

			expanded.push(mapOccurrence({
				master,
				originalOccurrenceStart,
				displayStart,
				displayEnd,
				isRecurring: true,
			}))
		}
	}

	return expanded
}

export function recurrenceResources(
	masterId: string,
	occurrenceStartsAt: Date,
	isRecurring: boolean,
	patterns: ExpandablePattern[] = [],
): ScheduleRecurrenceResources {
	return {
		masterId,
		occurrenceStartsAt: occurrenceStartsAt.toISOString(),
		isRecurring,
		patterns,
	}
}

export function calendarEventId(masterId: string, occurrenceStartsAt: Date, isRecurring: boolean) {
	if(!isRecurring) return masterId
	return occurrenceKey(masterId, occurrenceStartsAt)
}
