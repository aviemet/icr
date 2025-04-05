import { splitStrategy } from "./split"
import { stackStrategy } from "./stack"
import { TimeGridDisplayStrategy } from "./types"

export type { TimeGridDisplayStrategy, EventPosition } from "./types"

const strategies = {
	stack: stackStrategy,
	split: splitStrategy,
} as const

export type DisplayStrategyName = keyof typeof strategies

export function getDisplayStrategy(name: DisplayStrategyName = "stack"): TimeGridDisplayStrategy {
	return strategies[name]
}
