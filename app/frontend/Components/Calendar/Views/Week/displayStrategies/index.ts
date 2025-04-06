import { weekStackStrategy as overlapStrategy } from "./stack"

export const weekDisplayStrategies = {
	overlap: overlapStrategy,
} as const

export type WeekStrategyType = keyof typeof weekDisplayStrategies
