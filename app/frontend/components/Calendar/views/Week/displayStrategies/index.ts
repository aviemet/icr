import { WeekOverlapStrategy } from "./overlap"

export const weekDisplayStrategies = {
	overlap: WeekOverlapStrategy,
	split: WeekOverlapStrategy,
	stack: WeekOverlapStrategy,
	span: WeekOverlapStrategy,
} as const

export type WeekStrategyType = keyof typeof weekDisplayStrategies
