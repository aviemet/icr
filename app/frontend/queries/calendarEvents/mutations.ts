import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { type PartialDeep } from "type-fest"

import { Routes, exclude } from "@/lib"

import { ReactMutationFunction } from ".."

type CalendarEventData = {
	calendar_event: PartialDeep<Schema.CalendarEventsFormData> & {
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
			if(res.statusText !== "OK") {
				throw new Error("Failed to create calendar event")
			}
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

			if(res.statusText !== "OK") {
				throw new Error("Failed to update calendar event")
			}
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

