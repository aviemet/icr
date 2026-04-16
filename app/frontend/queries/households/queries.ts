import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { VIEW_NAMES } from "@/components/Calendar/views/index"
import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetHouseholdSchedules: ReactQueryFunction<Schema.CalendarEventsHousehold[], {
	slug: string
	view?: VIEW_NAMES
	date?: string | Date
	timezone?: string
}> = ({ slug, ...params }, options) => {
	return useQuery({
		queryKey: [`households/${slug}/schedule`, params],
		queryFn: async() => {
			const res = await axios.get(Routes.apiHouseholdSchedule(slug, params))
			return res.data
		},
		...options,
	})
}

