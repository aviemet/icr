import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { type PartialDeep } from "type-fest"

import { Routes, exclude, assertStatus, HTTP_STATUS } from "@/lib"

import { ReactMutationFunction } from ".."

export type CalendarEventData = {
	calendar_event: Omit<PartialDeep<Schema.CalendarEventsFormData>, "event_participants"> & {
		category_slug?: string
		shift: PartialDeep<Schema.Shift>
		event_participants: PartialDeep<Schema.EventParticipantsFormData>[]
	}
}

export const useCreateCalendarEvent: ReactMutationFunction<Schema.CalendarEventsShow, CalendarEventData> = (
	options
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async(data) => {
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

export const useUpdateCalendarEvent: ReactMutationFunction<Schema.CalendarEventsShow, CalendarEventData, { id: string }> = (
	options
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async(data) => {
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
		mutationFn: async() => {
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

