import { CalendarGenerics, useCalendarContext } from "../.."
import { VIEW_NAMES } from "../../Views"

import { DisplayStrategyFunction, displayStrategies, groupAndFilterEvents } from "."

export const useDisplayStrategy = <T extends CalendarGenerics, V extends VIEW_NAMES>(
	view: V,
	displayStrategy: keyof (typeof displayStrategies)[V]
) => {
	const { date, localizer, events } = useCalendarContext()

	const strategy = displayStrategies[view][displayStrategy] as DisplayStrategyFunction<T>
	if(!strategy) {
		throw new Error(`Invalid strategy "${String(displayStrategy)}" for view "${view}"`)
	}

	return groupAndFilterEvents(
		view,
		strategy,
		events,
		date,
		localizer
	)
}
