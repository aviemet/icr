import dayjs from "dayjs"

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
