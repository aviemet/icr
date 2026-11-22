export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly"

export type RecurrenceEnds = "never" | "on_date" | "after"

export type MonthlyMode = "day_of_month" | "nth_weekday"

export type RecurrenceConfig = {
	enabled: boolean
	frequency: RecurrenceFrequency
	interval: number
	weekdays: number[]
	monthlyMode: MonthlyMode
	ends: RecurrenceEnds
	until: string | null
	count: number
}

export type RecurringPatternAttributes = {
	recurring_type: RecurrenceFrequency
	offset: number
	day_of_week?: number
	day_of_month?: number
	week_of_month?: number
	month_of_year?: number
	end_date?: string
	max_occurrences?: number
}

export const WEEKDAY_VALUES = [0, 1, 2, 3, 4, 5, 6] as const

function nthWeekdayOfMonth(date: Date) {
	const day = date.getDate()
	return Math.ceil(day / 7)
}

export function defaultRecurrenceConfig(startsAt: Date | string | undefined): RecurrenceConfig {
	const start = startsAt === undefined ? new Date() : new Date(startsAt)
	return {
		enabled: false,
		frequency: "weekly",
		interval: 1,
		weekdays: [start.getDay()],
		monthlyMode: "day_of_month",
		ends: "never",
		until: null,
		count: 10,
	}
}

export type RecurrencePatternSource = {
	recurring_type?: string | null
	offset?: number | null
	day_of_week?: number | null
	day_of_month?: number | null
	week_of_month?: number | null
	month_of_year?: number | null
	end_date?: string | Date | null
	max_occurrences?: number | null
}

function isRecurrenceFrequency(value: string | null | undefined): value is RecurrenceFrequency {
	return value === "daily" || value === "weekly" || value === "monthly" || value === "yearly"
}

function formatEndDate(value: string | Date | null | undefined) {
	if(value === null || value === undefined || value === "") return null
	if(typeof value === "string") {
		const dateOnly = value.slice(0, 10)
		if(/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return dateOnly
	}
	const parsed = value instanceof Date ? value : new Date(value)
	if(Number.isNaN(parsed.getTime())) return null
	const year = parsed.getUTCFullYear()
	const month = String(parsed.getUTCMonth() + 1).padStart(2, "0")
	const day = String(parsed.getUTCDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

export function recurrenceConfigFromPatterns(
	patterns: RecurrencePatternSource[] | undefined,
	startsAt: Date | string | undefined,
): RecurrenceConfig {
	const defaults = defaultRecurrenceConfig(startsAt)
	if(!patterns || patterns.length === 0) return defaults

	const first = patterns[0]
	if(!first || !isRecurrenceFrequency(first.recurring_type)) return defaults

	const weekdays = patterns
		.map((pattern) => pattern.day_of_week)
		.filter((day): day is number => typeof day === "number" && day >= 0 && day <= 6)

	let ends: RecurrenceEnds = "never"
	let until: string | null = null
	let count = defaults.count
	if(typeof first.max_occurrences === "number" && first.max_occurrences > 0) {
		ends = "after"
		count = first.max_occurrences
	} else {
		const endDate = formatEndDate(first.end_date)
		if(endDate) {
			ends = "on_date"
			until = endDate
		}
	}

	return {
		enabled: true,
		frequency: first.recurring_type,
		interval: typeof first.offset === "number" && first.offset > 0 ? first.offset : 1,
		weekdays: weekdays.length > 0 ? weekdays : defaults.weekdays,
		monthlyMode: typeof first.week_of_month === "number" ? "nth_weekday" : "day_of_month",
		ends,
		until,
		count,
	}
}

function endFields(config: RecurrenceConfig) {
	if(config.ends === "on_date" && config.until) {
		return { end_date: config.until }
	}
	if(config.ends === "after" && config.count > 0) {
		return { max_occurrences: config.count }
	}
	return {}
}

export type BuildRecurringPatternsOptions = {
	shiftWeekdaysFrom?: Date | string
}

function weekdaysForBuild(
	config: RecurrenceConfig,
	startsAt: Date,
	options?: BuildRecurringPatternsOptions,
) {
	if(config.weekdays.length === 0) return []
	if(!options?.shiftWeekdaysFrom) return config.weekdays

	const fromDay = new Date(options.shiftWeekdaysFrom).getDay()
	const toDay = startsAt.getDay()
	if(fromDay === toDay) return config.weekdays
	if(!config.weekdays.includes(fromDay)) return config.weekdays

	const dayDelta = (toDay - fromDay + 7) % 7
	const shifted = config.weekdays.map((day) => (day + dayDelta) % 7)
	return [...new Set(shifted)].sort((left, right) => left - right)
}

export function buildRecurringPatternsAttributes(
	config: RecurrenceConfig,
	startsAt: Date | string | undefined,
	options?: BuildRecurringPatternsOptions,
): RecurringPatternAttributes[] | undefined {
	if(!config.enabled) return undefined
	if(config.interval < 1) return undefined

	const start = startsAt === undefined ? new Date() : new Date(startsAt)
	const ends = endFields(config)

	if(config.frequency === "daily") {
		return [{
			recurring_type: "daily",
			offset: config.interval,
			...ends,
		}]
	}

	if(config.frequency === "weekly") {
		const weekdays = weekdaysForBuild(config, start, options)
		if(weekdays.length === 0) return undefined
		return weekdays.map((dayOfWeek) => ({
			recurring_type: "weekly",
			offset: config.interval,
			day_of_week: dayOfWeek,
			...ends,
		}))
	}

	if(config.frequency === "monthly") {
		if(config.monthlyMode === "nth_weekday") {
			return [{
				recurring_type: "monthly",
				offset: config.interval,
				day_of_week: start.getDay(),
				week_of_month: nthWeekdayOfMonth(start),
				...ends,
			}]
		}
		return [{
			recurring_type: "monthly",
			offset: config.interval,
			day_of_month: start.getDate(),
			...ends,
		}]
	}

	return [{
		recurring_type: "yearly",
		offset: config.interval,
		month_of_year: start.getMonth() + 1,
		day_of_month: start.getDate(),
		...ends,
	}]
}
