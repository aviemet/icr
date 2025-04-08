export const ensureDate = (value: unknown): Date => {
	if(value instanceof Date) return value

	if(typeof value === "string" || typeof value === "number") {
		const date = new Date(value)
		if(!isNaN(date.getTime())) return date
	}

	return new Date()
}
