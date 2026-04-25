import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Routes } from "@/lib"

import { type ReactQueryFunction } from ".."

export type SpotlightResult =
	| Schema.EmployeesSpotlight
	| Schema.ClientsSpotlight
	| Schema.DoctorsSpotlight
	| Schema.EmployeeTrainingsSpotlight
	| Schema.HouseholdsSpotlight
	| Schema.VendorsSpotlight

export const useGetSpotlights: ReactQueryFunction<
	SpotlightResult[],
	{ q: string }
> = ({ q }, options) => {
	const enabled = !!q.trim() && (options?.enabled ?? true)

	return useQuery({
		queryKey: ["spotlights", q],
		queryFn: async() => {
			const res = await axios.get<SpotlightResult[]>(Routes.apiSpotlights(), {
				params: { q },
			})
			return res.data
		},
		enabled,
		...options,
	})
}

