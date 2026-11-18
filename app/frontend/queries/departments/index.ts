import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetDepartmentsAsOptions: ReactQueryFunction<Schema.EmployeeDepartmentsOptions[]> = (options) => {
	return useQuery({
		queryKey: ["departments"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiDepartmentsOptions())
			if(res.statusText !== "OK") {
				throw new Error("Failed to fetch departments")
			}
			return res.data
		},
		...options,
	})
}
