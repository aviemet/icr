import { MonthSpanStrategy } from "./span"
import { MonthSplitStrategy } from "./split"
import { MonthStackStrategy } from "./stack"

export { MonthSpanStrategy, MonthSplitStrategy, MonthStackStrategy }

const monthDisplayStrategies = {
	span: MonthSpanStrategy,
	split: MonthSplitStrategy,
	stack: MonthStackStrategy,
} as const

export type MonthStrategyType = keyof typeof monthDisplayStrategies
