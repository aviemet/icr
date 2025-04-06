import { dayStackStrategy as overlapStrategy } from "./stack"

export const dayDisplayStrategies = {
	overlap: overlapStrategy,
} as const

export type DayStrategyType = keyof typeof dayDisplayStrategies
