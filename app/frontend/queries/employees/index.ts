import { useQuery } from "@tanstack/react-query"
import axios from "axios"

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
