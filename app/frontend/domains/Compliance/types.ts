export type ComplianceQueueTab = "due" | "overdue" | "open_actions" | "submitted" | "all"

export interface ComplianceQueueCounts {
	due: number
	overdue: number
	open_actions: number
	submitted: number
	all: number
}
