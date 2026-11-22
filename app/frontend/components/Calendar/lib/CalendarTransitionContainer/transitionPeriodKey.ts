import { type CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { type VIEW_NAMES } from "@/components/Calendar/views"

export function transitionPeriodKey(
	date: Date,
	view: VIEW_NAMES,
	localizer: CalendarLocalizer,
) {
	if(view === "week") {
		return localizer.startOf(date, "week").toISOString()
	}
	if(view === "day") {
		return localizer.startOf(date, "day").toISOString()
	}
	return localizer.startOf(date, "month").toISOString()
}
