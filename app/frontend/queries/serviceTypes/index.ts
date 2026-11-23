import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Routes } from "@/lib"

import { type ReactQueryFunction } from ".."

export const useGetServiceTypesAsOptions: ReactQueryFunction<
	Schema.ServiceTypesOptions[]
> = (options) => {
	return useQuery({
		queryKey: ["service_types", "options"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiServiceTypesOptions())
			return res.data
		},
		...options,
	})
}

export const useGetServiceTypes: ReactQueryFunction<Schema.ServiceType[]> = (options) => {
	return useQuery({
		queryKey: ["service_types"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiServiceTypes())
			return res.data
		},
		...options,
	})
}
