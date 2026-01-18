import { EventResources } from "../.."
import { StrategyConfig, BaseDisplayStrategy } from "./BaseDisplayStrategy"
import { agendaDisplayStrategies } from "../../views/Agenda/displayStrategies"
import { dayDisplayStrategies } from "../../views/Day/displayStrategies"
import { monthDisplayStrategies } from "../../views/Month/displayStrategies"
import { weekDisplayStrategies } from "../../views/Week/displayStrategies"

export * from "./types"
export * from "./BaseDisplayStrategy"
export * from "./useDisplayStrategy"

export const displayStrategyClasses = {
	month: monthDisplayStrategies,
	week: weekDisplayStrategies,
	day: dayDisplayStrategies,
	agenda: agendaDisplayStrategies,
} as const

export type DisplayStrategyClasses = typeof displayStrategyClasses

export type ViewStrategyName<V extends keyof DisplayStrategyClasses> = keyof DisplayStrategyClasses[V]

export type StrategyConstructor<TEventResources extends EventResources> = new (config: StrategyConfig) => BaseDisplayStrategy<TEventResources>
