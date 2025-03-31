import dayjs from "dayjs"

import { formatter } from "."

export { default as aOrAn }  from "indefinite"

const WORDS_REGEX = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g

/**
 * Returns array of individual words from a string
 * Tests for many different separators
 */
const toWords = (str?: string | null) => {
	const input = str ?? ""
	return input.match(WORDS_REGEX) || []
}

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str?: string | null): string => {
	if(typeof str !== "string") return ""
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Converts a string toCamelCase
 */
export const toCamelCase = (str?: string | null) => {
	const words = toWords(str)

	return words.map((word, i) => {
		const lowered = word.toLocaleLowerCase()
		if(i === 0) {
			return lowered
		}
		return capitalize(lowered)
	}).join("")
}

/**
 * Converts a string to-kebab-case
 */
export const toKebabCase = (str?: string | null) => {
	const words = toWords(str)

	return words.map((word, i) => word.toLocaleLowerCase()).join("-")
}

/**
 * Converts a string to_snake_case
 */
export const toSnakeCase = (str?: string | null) => {
	const words = toWords(str)

	return words.map((word, i) => word.toLocaleLowerCase()).join("_")
}

/**
 * Returns the first character of the first and last (if one exists) words of a string
 */
export const initials = (str: string) => {
	if(str.length === 0) return null

	const split = str.split(/[ \-_]/)

	let initials = split[0].charAt(0).toUpperCase()

	if(split.length > 1) {
		initials += split[split.length - 1].charAt(0).toUpperCase()
	}

	return initials
}

/**
 * Returns a formatted string for a Shift event title
 */
export const buildShiftTitle = ({ start, end, name }: {
	start?: Date
	end?: Date
	name?: string
}) => {
	let title = ""
	if(start) {
		title += formatter.datetime.timeShort(start)

		if(end) {
			title += ` - ${formatter.datetime.timeShort(end)}`
		}
	}
	if(name) {
		title += ` ${name}`
	}
	return title
}

type TemplateVars = {
	first_name?: string
	last_name?: string
	full_name?: string
}

/**
 * Formats an event title using a template string and event data
 */
export const formatEventTitle = (template: string, startTime: Date, vars: TemplateVars) => {
	// Replace template variables
	let result = template
	Object.entries(vars).forEach(([key, value]) => {
		if(value === undefined) throw new Error(`Missing required variable: ${key}`)
		result = result.replace(
			new RegExp(`{${key}}`, "g"),
			value
		)
	})

	// Replace date formats
	result = result.replace(
		/{([YMDHhmsAa\-/ :]+)}/g,
		(match, format) => {
			const formatted = dayjs(startTime).format(format)
			if(formatted === format) throw new Error(`Invalid date format: ${format}`)
			return formatted
		}
	)

	return result
}
