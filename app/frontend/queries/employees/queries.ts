import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { VIEW_NAMES } from "@/components/Calendar/views/index"
import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetEmployeesAsOptions: ReactQueryFunction<Schema.EmployeesOptions[]> = (options) => {
	return useQuery({
		queryKey: ["employees"],
		queryFn: async() => {
			const res = await axios.get(Routes.apiEmployeesOptions())
			return res.data
		},
		...options,
	})
}

export const useGetEmployeeSchedules: ReactQueryFunction<Schema.CalendarEventsEmployee[], {
	slug: string
	view?: VIEW_NAMES
	date?: string | Date
	timezone?: string
}> = ({ slug, ...params }, options) => {
	return useQuery({
		queryKey: [`employees/${slug}/schedule`, params],
		queryFn: async() => {
			const res = await axios.get(Routes.apiEmployeeSchedule(slug, params))
			return res.data
		},
		...options,
	})
}
