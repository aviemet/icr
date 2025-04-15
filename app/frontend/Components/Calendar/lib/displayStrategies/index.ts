import { StrategyConfig } from "./BaseDisplayStrategy"
import { VIEW_NAMES } from "../../Views"
import { DayOverlapStrategy } from "../../Views/Day/displayStrategies/overlap"
import { MonthSpanStrategy } from "../../Views/Month/displayStrategies/span"
import { MonthSplitStrategy } from "../../Views/Month/displayStrategies/split"
import { MonthStackStrategy } from "../../Views/Month/displayStrategies/stack"
import { WeekOverlapStrategy } from "../../Views/Week/displayStrategies/overlap"

export * from "./types"
export * from "./BaseDisplayStrategy"
export * from "./useDisplayStrategy"

export const displayStrategyFactories = {
	month: {
		split: (config: StrategyConfig) => new MonthSplitStrategy(config),
		stack: (config: StrategyConfig) => new MonthStackStrategy(config),
		span: (config: StrategyConfig) => new MonthSpanStrategy(config),
	},
	week: {
		overlap: (config: StrategyConfig) => new WeekOverlapStrategy(config),
	},
	day: {
		overlap: (config: StrategyConfig) => new DayOverlapStrategy(config),
	},
	agenda: {
		// overlap: (config: StrategyConfig) => new AgendaOverlapStrategy(config),
	},
} as const

export type DisplayStrategyFactories = typeof displayStrategyFactories
export type ViewStrategyName<V extends keyof DisplayStrategyFactories> = keyof DisplayStrategyFactories[V]

export type AllViewStrategyNames = {
	[V in keyof DisplayStrategyFactories]: ViewStrategyName<V>
}[keyof DisplayStrategyFactories];

export type StrategyNameMap = {
	[V in VIEW_NAMES]: V extends keyof DisplayStrategyFactories ? ViewStrategyName<V> : never
}
