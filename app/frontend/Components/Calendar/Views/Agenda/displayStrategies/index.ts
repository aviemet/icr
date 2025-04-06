import { agendaStackStrategy as overlapStrategy } from "./stack"

export const agendaDisplayStrategies = {
	overlap: overlapStrategy,
} as const

export type AgendaStrategyType = keyof typeof agendaDisplayStrategies
