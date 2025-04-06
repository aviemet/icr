import { CalendarGenerics, useCalendarContext } from "../.."
import { DisplayStrategyFunction, StrategyType } from "./DisplayStrategyManager"
import { VIEW_NAMES } from "../../Views"

import { displayStrategyManager } from "."

export const useDisplayStrategy = <T extends CalendarGenerics>(
	view: VIEW_NAMES,
	displayStrategy: StrategyType | DisplayStrategyFunction<T>
) => {
	const { date, localizer, events } = useCalendarContext()

	return {
		groupAndFilterEvents: () => displayStrategyManager.groupAndFilterEvents(
			view,
			displayStrategy,
			events,
			date,
			localizer
		),
	}
}
