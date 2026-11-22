import { isPlainObject } from "es-toolkit"

/**
 * Recursively check each prop value and convert ISO strings to dates
 */
export function convertDates<T>(obj: T): T {
	if(Array.isArray(obj)) {
		return obj.map((item) => convertDates(item)) as T
	}

	if(isPlainObject(obj)) {
		const result: Record<string, unknown> = {}
		for(const [key, value] of Object.entries(obj)) {
			result[key] = convertDates(value)
		}
		return result as T
	}

	if(typeof obj === "string" && isISODateString(obj)) {
		return new Date(obj) as T
	}

	return obj
}

function isISODateString(value: string) {
	const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?$/
	return isoDateFormat.test(value)
}
