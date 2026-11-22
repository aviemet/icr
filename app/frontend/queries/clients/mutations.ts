import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { Routes, exclude, assertStatus, HTTP_STATUS } from "@/lib"
import { type CalendarEventData, type CalendarEventEditScope } from "@/queries/calendarEvents"

import { ReactMutationFunction } from ".."

export const useCreateClientCalendarEvent: ReactMutationFunction<
	Schema.CalendarEventsShow,
	CalendarEventData,
	{ slug: string }
> = (options) => {
	const queryClient = useQueryClient()
	const slug = options.params.slug

	return useMutation({
		mutationFn: async (data) => {
			const res = await axios.post(Routes.apiCalendarEvents(), data)
			assertStatus(res, HTTP_STATUS.CREATED)
			return res.data
		},
		mutationKey: ["clients", slug, "schedule", "create"],
		...exclude(options, "params"),
		onSuccess: (data, variables) => {
			if(slug) queryClient.invalidateQueries({ queryKey: [`clients/${slug}/schedule`] })
			options?.onSuccess?.(data, variables)
		},
	})
}

export const useUpdateClientCalendarEvent: ReactMutationFunction<
	Schema.CalendarEventsShow,
	CalendarEventData,
	{ slug: string, id: string }
> = (options) => {
	const queryClient = useQueryClient()
	const { slug, id } = options.params

	return useMutation({
		mutationFn: async (data) => {
			const res = await axios.patch(Routes.apiCalendarEvent(id), data)
			assertStatus(res, [HTTP_STATUS.OK, HTTP_STATUS.CREATED])
			return res.data
		},
		mutationKey: ["clients", slug, "schedule", "update", id],
		...exclude(options, "params"),
		onSuccess: (data, variables) => {
			if(slug) queryClient.invalidateQueries({ queryKey: [`clients/${slug}/schedule`] })
			options?.onSuccess?.(data, variables)
		},
	})
}

export type DeleteClientCalendarEventVariables = {
	edit_scope?: CalendarEventEditScope
	occurrence_starts_at?: string
}

export const useDeleteClientCalendarEvent: ReactMutationFunction<
	void,
	DeleteClientCalendarEventVariables | void,
	{ slug: string, id: string }
> = (options) => {
	const queryClient = useQueryClient()
	const { slug, id } = options.params

	return useMutation({
		mutationFn: async (variables) => {
			const params = new URLSearchParams()
			if(variables && variables.edit_scope) params.set("edit_scope", variables.edit_scope)
			if(variables && variables.occurrence_starts_at) {
				params.set("occurrence_starts_at", variables.occurrence_starts_at)
			}
			const query = params.toString()
			const res = await axios.delete(
				query === "" ? Routes.apiCalendarEvent(id) : `${Routes.apiCalendarEvent(id)}?${query}`,
			)
			assertStatus(res, HTTP_STATUS.NO_CONTENT)
		},
		mutationKey: ["clients", slug, "schedule", "delete", id],
		...exclude(options, "params"),
		onSuccess: () => {
			if(slug) queryClient.invalidateQueries({ queryKey: [`clients/${slug}/schedule`] })
			options?.onSuccess?.()
		},
	})
}
