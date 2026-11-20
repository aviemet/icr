import dayjs from "dayjs"

export function resolveOffboardingEffectiveAt(date: string, time: string): Date | null {
	if(date.trim() === "") return null

	if(time.trim() !== "") {
		const withTime = dayjs(`${date} ${time}`, ["YYYY-MM-DD HH:mm", "YYYY-MM-DD H:mm"], true)
		return withTime.isValid() ? withTime.toDate() : null
	}

	const beginningOfDay = dayjs(date, "YYYY-MM-DD", true)
	return beginningOfDay.isValid() ? beginningOfDay.startOf("day").toDate() : null
}

export function isOffboardingDateToday(date: string): boolean {
	if(date.trim() === "") return false
	return dayjs(date, "YYYY-MM-DD", true).isSame(dayjs(), "day")
}

export function isOffboardingEffectiveFuture(date: string, time: string): boolean {
	const effectiveAt = resolveOffboardingEffectiveAt(date, time)
	if(effectiveAt === null) return false
	return dayjs(effectiveAt).isAfter(dayjs())
}
