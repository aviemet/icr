import { useMemo } from "react"

import { SortedArray } from "@/lib/Collections/SortedArray"

import { Resources, useCalendarContext } from "../.."
import { VIEW_NAMES } from "../../Views"

import {
	groupAndFilterEvents,
	displayStrategyFactories,
	ViewStrategyName,
	BaseDisplayStrategy,
	StrategyConfig,
	BaseDisplayProperties,
	EventDisplayDetails,
	DisplayStrategyFactories,
} from "."


export const useDisplayStrategy = <
	TResources extends Resources,
	V extends keyof DisplayStrategyFactories,
	P extends BaseDisplayProperties
>(
	view: V,
	strategyName: ViewStrategyName<V>,
	viewConfig?: Partial<StrategyConfig>
): Map<string, SortedArray<EventDisplayDetails<TResources, P>>> => {
	const { date, localizer, events } = useCalendarContext<TResources>()

	return useMemo(() => {
		const currentView = view as keyof typeof displayStrategyFactories

		const strategyFactory = displayStrategyFactories[currentView]?.[strategyName as keyof typeof displayStrategyFactories[typeof currentView]]

		if(!strategyFactory) {
			const nameStr = String(strategyName)
			// eslint-disable-next-line no-console
			console.error(`Invalid strategy factory for view="${currentView}", name="${nameStr}"`)
			throw new Error(`Invalid strategy factory for view="${currentView}", name="${nameStr}"`)
		}

		const config: StrategyConfig = {
			localizer,
			...(viewConfig || {}),
		}

		const typedFactory = strategyFactory as (config: StrategyConfig) => BaseDisplayStrategy<TResources, P>
		const strategyInstance = typedFactory(config)

		return groupAndFilterEvents<TResources, P>(
			currentView as VIEW_NAMES,
			strategyInstance,
			events,
			date,
			localizer
		) as Map<string, SortedArray<EventDisplayDetails<TResources, P>>>

	}, [view, strategyName, viewConfig, date, localizer, events])
}
