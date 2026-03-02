import { DayOverlapStrategy } from "./overlap"

export { DayOverlapStrategy }

export const dayDisplayStrategies = {
	overlap: DayOverlapStrategy,
	split: DayOverlapStrategy,
	stack: DayOverlapStrategy,
	span: DayOverlapStrategy,
} as const

export type DayStrategyType = keyof typeof dayDisplayStrategies
