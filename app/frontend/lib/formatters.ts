import dayjs from "dayjs"

import { ensureDate } from "./dates"

export const currency = (amount: number, currency = "USD", locale = "en-US") => {
	const formatter = new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	})
	return formatter.format(amount)
}

export type CurrencyInputFormat = {
	decimalSeparator: string
	thousandSeparator: string
	currencySymbol: string
	decimalScale: number
}

export function currencyInputFormat(
	locale = "en-US",
	currencyCode = "USD",
): CurrencyInputFormat {
	const parts = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currencyCode,
	}).formatToParts(1234567.89)

	const decimalSeparator = parts.find(part => part.type === "decimal")?.value ?? "."
	const groupSeparator = parts.find(part => part.type === "group")?.value
	const currencySymbol = parts.find(part => part.type === "currency")?.value ?? currencyCode
	const fractionDigits = parts.find(part => part.type === "fraction")?.value.length

	return {
		decimalSeparator,
		thousandSeparator: groupSeparator && groupSeparator.length > 0 ? groupSeparator : ",",
		currencySymbol,
		decimalScale: fractionDigits ?? 2,
	}
}

export const number = {
	decimal: (value: number, fractionDigits = 1) =>
		new Intl.NumberFormat("en-US", { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(value),
}

export const datetime = {
	// Date formatters
	dateShort: (date: string | Date) => dayjs(ensureDate(date)).format("M/DD/YY"),
	dateLong: (date: string | Date) => dayjs(ensureDate(date)).format("MM/DD/YYYY HH:mm:ss"),
	dateEnglish: (date: string | Date) => dayjs(ensureDate(date)).format("MM/DD/YYYY"),
	dateWithWeekday: (date: string | Date) => dayjs(ensureDate(date)).format("MMM D - dddd"),
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
	range: (start: string | Date, end: string | Date) => {
		const startStr = dayjs(ensureDate(start)).format("MMMM D")
		const endStr = dayjs(ensureDate(end)).format("MMMM D")
		return `${startStr} - ${endStr}`
	},
}
