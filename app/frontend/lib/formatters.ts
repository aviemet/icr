import dayjs from "dayjs"

import { ensureDate } from "./dates"

export const currency = (amount: number, currency = "USD") => {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	})
	return formatter.format(amount)
}

export const datetime = {
	// Date formatters
	dateShort: (date: string | Date) => dayjs(ensureDate(date)).format("M/DD/YY"),
	dateLong: (date: string | Date) => dayjs(ensureDate(date)).format("MM/DD/YYYY HH:mm:ss"),
	dateEnglish: (date: string | Date) => dayjs(ensureDate(date)).format("MM/DD/YYYY"),
	dateUrl: (date: string | Date) => dayjs(ensureDate(date)).format("YYYY-MM-DD"),

	// Time formatters
	timeShort: (date: string | Date) => {
		const d = dayjs(ensureDate(date))
		return d.format(`${d.get("minutes") > 0 ? "h:mm" : "h"}a`)
	},
	timeLong: (date: string | Date) => dayjs(ensureDate(date)).format("hh:mm A"),
	timeFull: (date: string | Date) => dayjs(ensureDate(date)).format("HH:mm:ss"),

	// DateTime formatters
	dateTimeShort: (date: string | Date) => {
		const d = dayjs(ensureDate(date))
		return d.format(`${d.get("minutes") > 0 ? "h:mm" : "h"}a MM/DD/YY`)
	},
	dateTimeLong: (date: string | Date) => dayjs(ensureDate(date)).format("hh:mm A MM/DD/YYYY"),
	dateTimeFull: (date: string | Date) => dayjs(ensureDate(date)).format("hh:mm A dddd MM/DD/YYYY"),

	// Relative time formatters
	fromNow: (date: string | Date, relativeTime?: string | Date) => {
		return relativeTime === undefined
			? dayjs(ensureDate(date)).fromNow()
			: dayjs(ensureDate(relativeTime)).from(ensureDate(date))
	},
	toNow: (date: string | Date, relativeTime?: string | Date) => {
		return relativeTime === undefined
			? dayjs(ensureDate(date)).toNow()
			: dayjs(ensureDate(relativeTime)).to(ensureDate(date))
	},
	duration: (date: string | Date, relativeTime?: string | Date) => {
		const start = relativeTime === undefined ? dayjs() : dayjs(ensureDate(relativeTime))
		return start.from(ensureDate(date), true)
	},
}
