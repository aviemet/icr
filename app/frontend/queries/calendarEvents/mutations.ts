import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { type PartialDeep } from "type-fest"

import { Routes, exclude, assertStatus, HTTP_STATUS } from "@/lib"

import { ReactMutationFunction } from ".."

export type CalendarEventRecurringPatternAttributes = {
	recurring_type: "daily" | "weekly" | "monthly" | "yearly"
	offset: number
	day_of_week?: number
	day_of_month?: number
	week_of_month?: number
	month_of_year?: number
	end_date?: string
	max_occurrences?: number
}

export type CalendarEventEditScope = "one" | "future" | "all"

export type CalendarEventParticipantAttributes = {
	participant_type: string
	participant_id: string
}

export type CalendarEventData = {
	calendar_event: {
		id?: string
		category_slug?: string
		name?: string
		all_day?: boolean
		starts_at?: Date | string
		ends_at?: Date | string
		notes?: string
		mileage?: number | string | null
		shift?: PartialDeep<Schema.Shift>
		shift_attributes?: PartialDeep<Schema.Shift>
		event_participants?: CalendarEventParticipantAttributes[]
		event_participants_attributes?: CalendarEventParticipantAttributes[]
		recurring_patterns?: CalendarEventRecurringPatternAttributes[]
		recurring_patterns_attributes?: CalendarEventRecurringPatternAttributes[]
		edit_scope?: CalendarEventEditScope
		occurrence_starts_at?: string
	}
}


export const useCreateCalendarEvent: ReactMutationFunction<Schema.CalendarEventsShow, CalendarEventData> = (
	options = {}
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data) => {
			const res = await axios.post(Routes.apiCalendarEvents(), data)
			assertStatus(res, HTTP_STATUS.CREATED)
			return res.data
		},
		mutationKey: ["calendar_events"],
		...exclude(options, "params"),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["calendar_events"] })
			options?.onSuccess?.(data, variables)
		},
	})
}

export type CalendarEventTimeUpdate = {
	calendar_event: {
		starts_at: string
		ends_at: string
	}
}

export const useUpdateCalendarEvent: ReactMutationFunction<Schema.CalendarEventsShow, CalendarEventData | CalendarEventTimeUpdate, { id: string }> = (
	options
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (data) => {
			const res = await axios.patch(Routes.apiCalendarEvent(options.params.id), data)
			assertStatus(res, [HTTP_STATUS.OK, HTTP_STATUS.CREATED])
			return res.data
		},
		mutationKey: ["calendar_events", options.params.id],
		...exclude(options, "params"),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["calendar_events"] })
			options?.onSuccess?.(data, variables)
		},
	})
}

export const useDeleteCalendarEvent: ReactMutationFunction<void, void, { id: string }> = (options) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async () => {
			const res = await axios.delete(Routes.apiCalendarEvent(options.params.id))
			assertStatus(res, HTTP_STATUS.NO_CONTENT)
		},
		mutationKey: ["calendar_events", "delete", options.params.id],
		...exclude(options, "params"),
		onSuccess: (_data, _variables) => {
			queryClient.invalidateQueries({ queryKey: ["calendar_events"] })
			options?.onSuccess?.()
		},
	})
}
