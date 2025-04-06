import { weekOverlapStrategy } from "./overlap"

export const weekDisplayStrategies = {
	overlap: weekOverlapStrategy,
} as const

export type WeekStrategyType = keyof typeof weekDisplayStrategies
