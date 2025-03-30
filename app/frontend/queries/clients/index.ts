import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetClientsAsOptions: ReactQueryFunction<Schema.ClientsOptions[]> = (options) => {
	return useQuery({
		queryKey: ["clients"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiClientsOptions())
			return res.data
		},
		...options,
	})
}

export const useGetClientSchedules: ReactQueryFunction<Schema.Schedule[]> = (options) => {
	return useQuery({
		queryKey: ["clients/schedule"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiClientSchedule())
			return res.data
		},
	})
}
