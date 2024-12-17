/**
 * Recursively check each prop value and convert ISO strings to dates
 */
export function convertDates<T extends string | Record<string, unknown> | Record<string, unknown>[]>(obj: T): T {
	if(Array.isArray(obj)) {
		return obj.map(convertDates) as unknown as T
	} else if(obj !== null && typeof obj === 'object') {
		return Object.keys(obj).reduce((acc, key) => {
			(acc as any)[key] = convertDates((obj as any)[key])
			return acc
		}, {} as T)
	} else if(isISODateString(obj)) {
		return new Date(obj) as unknown as T
	}

	return obj
}

function isISODateString(value: string) {
	const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?$/
	return typeof value === 'string' && isoDateFormat.test(value)
}
