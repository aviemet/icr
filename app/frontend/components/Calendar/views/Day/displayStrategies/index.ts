import { DayOverlapStrategy } from "./overlap"

export { DayOverlapStrategy }

export const dayDisplayStrategies = {
	overlap: DayOverlapStrategy,
} as const

export type DayStrategyType = keyof typeof dayDisplayStrategies
