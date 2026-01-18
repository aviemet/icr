import { useMemo } from "react"

import { EventResources, useCalendarContext } from "../.."
import { VIEW_NAMES } from "../../views"

import {
	StrategyConfig,
	BaseDisplayProperties,
	displayStrategyClasses,
	ViewStrategyName,
	StrategyConstructor,
} from "."

export const useDisplayStrategy = <
	TEventResources extends EventResources,
	V extends VIEW_NAMES,
	P extends BaseDisplayProperties
>(
	view: V,
	strategyName: ViewStrategyName<V>,
	viewConfig?: Partial<StrategyConfig>
) => {
	const { date, localizer, events, groupByResource } = useCalendarContext<TEventResources>()

	return useMemo(() => {
		const strategiesForView = displayStrategyClasses[view]
		const StrategyClassConstructor = strategiesForView[strategyName] as StrategyConstructor<TEventResources>

		const strategyInstance = new StrategyClassConstructor({
			localizer,
			...(viewConfig || {}),
		})

		return strategyInstance.groupAndFilterEvents(
			view,
			events,
			date,
			groupByResource
		)

	}, [view, strategyName, viewConfig, date, localizer, events, groupByResource])
}
