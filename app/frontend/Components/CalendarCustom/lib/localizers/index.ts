import { useEffect, useState } from "react"

import { VIEW_NAMES } from "@/Components/CalendarCustom/Views"

export { dayJsLocalizer } from "./dayJsLocalizer"

export type TIME_UNIT = "year" | "month" | "week" | "day" | "hour" | "minute" | "second"

export type DateLocalizerFactory<TLib extends unknown> = (lib: TLib) => DateLocalizer

type DateLocalizerMethods = {
	weekdays: () => string[]
	firstVisibleDay: (date: Date, view: TIME_UNIT) => Date
	lastVisibleDay: (date: Date, view: TIME_UNIT) => Date
	visibleDays: (date: Date) => Date[]
}

export class DateLocalizer {
	weekdays: DateLocalizerMethods["weekdays"]
	firstVisibleDay: DateLocalizerMethods["firstVisibleDay"]
	lastVisibleDay: DateLocalizerMethods["lastVisibleDay"]
	visibleDays: DateLocalizerMethods["visibleDays"]

	constructor(fns: DateLocalizerMethods) {
		this.weekdays = fns.weekdays
		this.firstVisibleDay = fns.firstVisibleDay
		this.lastVisibleDay = fns.lastVisibleDay
		this.visibleDays = fns.visibleDays
	}
}

export const useDefaultLocalizer = (localizer: DateLocalizer | undefined) => {
	const [localLocalizer, setLocalLocalizer] = useState<DateLocalizer | undefined>(localizer)

	useEffect(() => {
		if(!localLocalizer && !localizer) {
			const loadLocalizer = async() => {
				const dayjsModule = await import("dayjs")
				const { dayJsLocalizer } = await import("@/Components/CalendarCustom/lib/localizers")
				setLocalLocalizer(dayJsLocalizer(dayjsModule.default))
			}
			loadLocalizer()
		} else if(localizer && !localLocalizer) {
			setLocalLocalizer(localizer)
		}
	}, [localizer, localLocalizer])

	return localLocalizer
}
