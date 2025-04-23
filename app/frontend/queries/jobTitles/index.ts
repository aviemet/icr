import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetJobTitlesAsOptions: ReactQueryFunction<Schema.EmployeeJobTitlesOptions[]> = (options) => {
	return useQuery({
		queryKey: ["job_titles"],
		queryFn: async() => {
			const res = await axios.get(Routes.apiJobTitlesOptions())
			if(res.statusText !== "OK") {
				throw new Error("Failed to fetch job titles")
			}
			return res.data
		},
		...options,
	})
}
