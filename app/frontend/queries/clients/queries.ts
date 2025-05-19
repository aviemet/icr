import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { VIEW_NAMES } from "@/components/Calendar/views/index"
import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetClientsAsOptions: ReactQueryFunction<Schema.ClientsOptions[]> = (options) => {
	return useQuery({
		queryKey: ["clients"],
		queryFn: async() => {
			const res = await axios.get(Routes.apiClientsOptions())
			return res.data
		},
		...options,
	})
}

export const useGetClientSchedules: ReactQueryFunction<Schema.CalendarEventsClient[], {
	slug: string
	view?: VIEW_NAMES
	date?: string | Date
	timezone?: string
}> = ({ slug, ...params }, options) => {
	return useQuery({
		queryKey: [`clients/${slug}/schedule`, params],
		queryFn: async() => {
			const res = await axios.get(Routes.apiClientSchedule(slug, params))
			return res.data
		},
		...options,
	})
}
