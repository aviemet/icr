import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"

import { type VIEW_NAMES } from "@/components/Calendar/views"
import { ensureViewName } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"

interface ServerScheduleHydrationSnapshot {
	date: string
	view: VIEW_NAMES
	timezone: string
}

export function useCalendarScheduleQueryInitialData<T>(
	scheduleQueryKeyRoot: string,
	locationSearchParams: URLSearchParams,
	calendarDate: Date,
	calendarView: VIEW_NAMES,
	userTimezone: string,
	initialSchedules: T,
): T | undefined {
	const queryClient = useQueryClient()
	const previousMatchedServerRangeRef = useRef<boolean | null>(null)

	const [serverHydrationSnapshot] = useState<ServerScheduleHydrationSnapshot>(() => ({
		date: datetime.dateUrl(ensureDate(locationSearchParams.get("date"))),
		view: ensureViewName(locationSearchParams.get("view")),
		timezone: userTimezone,
	}))

	const [hasLeftServerHydratedRange, setHasLeftServerHydratedRange] = useState(false)

	const matchesServerHydrationRange = useMemo(
		() =>
			datetime.dateUrl(calendarDate) === serverHydrationSnapshot.date &&
			calendarView === serverHydrationSnapshot.view &&
			userTimezone === serverHydrationSnapshot.timezone,
		[calendarDate, calendarView, userTimezone, serverHydrationSnapshot],
	)

	const snapshotQueryKey = useMemo(
		() =>
			[
				scheduleQueryKeyRoot,
				{
					date: serverHydrationSnapshot.date,
					view: serverHydrationSnapshot.view,
					timezone: serverHydrationSnapshot.timezone,
				},
			] as const,
		[scheduleQueryKeyRoot, serverHydrationSnapshot],
	)

	useEffect(() => {
		const previous = previousMatchedServerRangeRef.current
		const current = matchesServerHydrationRange
		previousMatchedServerRangeRef.current = current

		if(previous === true && current === false) {
			void queryClient.invalidateQueries({ queryKey: snapshotQueryKey, exact: true })
		}

		if(!current && !hasLeftServerHydratedRange) {
			queueMicrotask(() => {
				setHasLeftServerHydratedRange(true)
			})
		}
	}, [
		queryClient,
		snapshotQueryKey,
		matchesServerHydrationRange,
		hasLeftServerHydratedRange,
	])

	return useMemo(() => {
		if(matchesServerHydrationRange && !hasLeftServerHydratedRange) {
			return initialSchedules
		}
		return undefined
	}, [matchesServerHydrationRange, hasLeftServerHydratedRange, initialSchedules])
}
