import { useQuery } from "@tanstack/react-query"
import { ReactQueryFunction } from ".."
import { Routes } from "@/lib"
import axios from "axios"

export const useGetEmployeesAsOptions: ReactQueryFunction<Schema.EmployeesOptions[]> = (options) => {
	return useQuery({
		queryKey: ["employees"],
		queryFn: async () => {
			const res = await axios.get(Routes.apiEmployeesOptions())
			return res.data
		},
		...options,
	})
}
