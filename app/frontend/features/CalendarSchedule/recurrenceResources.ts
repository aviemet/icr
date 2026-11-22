import { ensureDate } from "@/lib/dates"

export type ExpandablePattern = {
	recurring_type?: string
	offset?: number
	day_of_week?: number | null
	day_of_month?: number | null
	week_of_month?: number | null
	month_of_year?: number | null
	end_date?: string | Date | null
	max_occurrences?: number | null
}

export type ScheduleRecurrenceResources = {
	masterId: string
	occurrenceStartsAt: string
	isRecurring: boolean
	patterns: ExpandablePattern[]
}

type ScheduleEventRecurrenceFields = {
	id: string
	master_id?: string
	occurrence_starts_at?: string | Date
	starts_at: string | Date
	is_recurring?: boolean
	recurring_patterns?: ExpandablePattern[]
}

export function recurrenceResources(event: ScheduleEventRecurrenceFields): ScheduleRecurrenceResources {
	const occurrenceStartsAt = event.occurrence_starts_at ?? event.starts_at
	return {
		masterId: event.master_id ?? event.id,
		occurrenceStartsAt: ensureDate(occurrenceStartsAt).toISOString(),
		isRecurring: event.is_recurring === true,
		patterns: event.recurring_patterns ?? [],
	}
}
