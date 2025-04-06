import { spanStrategy } from "./span"
import { splitStrategy } from "./split"
import { stackStrategy } from "./stack"

export const monthDisplayStrategies = {
	split: splitStrategy,
	stack: stackStrategy,
	span: spanStrategy,
} as const

export type MonthStrategyType = keyof typeof monthDisplayStrategies
