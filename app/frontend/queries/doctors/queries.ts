import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Routes } from "@/lib"

import { ReactQueryFunction } from ".."

export const useGetDoctorsAsOptions: ReactQueryFunction<Schema.DoctorsOptions[]> = (options) => {
	return useQuery({
		queryKey: ["doctors"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiDoctorsOptions())
			return res.data
		},
		...options,
	})
}
