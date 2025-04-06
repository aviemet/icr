import { CalendarGenerics, useCalendarContext } from "../.."
import { DisplayStrategyFunction, StrategyType } from "./DisplayStrategyRegistry"
import { VIEW_NAMES } from "../../Views"

import { displayStrategyRegistry } from "."


export const useDisplayStrategy = <T extends CalendarGenerics>(view: VIEW_NAMES, displayStrategy: StrategyType | DisplayStrategyFunction<T>) => {
	const { date, localizer, events } = useCalendarContext()

	const strategy = displayStrategyRegistry.getStrategy(view, displayStrategy)

	const groupAndFilterEvents = () => displayStrategyRegistry.groupedEventsForPeriod(events, date, view, localizer, strategy)

	return { groupAndFilterEvents }
}
