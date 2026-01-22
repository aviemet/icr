import { AgendaStackStrategy } from "./stack"

export { AgendaStackStrategy }

export const agendaDisplayStrategies = {
	overlap: AgendaStackStrategy,
} as const

export type AgendaStrategyType = keyof typeof agendaDisplayStrategies
