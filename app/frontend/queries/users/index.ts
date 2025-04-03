import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import { exclude, Routes } from "@/lib"
import { UserPreferences, UserTablePreferences } from "@/types"

import { type ReactMutationFunction } from ".."

export const useUpdateUserPreferences: ReactMutationFunction<Schema.User, UserPreferences, { userId: string }> = (
	options,
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async(data) => {
			const res = await axios.patch(Routes.apiUpdateUserPreferences(options.params.userId), {
				user: { user_preferences: data },
			})
			if(res.statusText !== "OK") {
				throw new Error("Failed to update user preferences")
			}
			return res.data
		},
		mutationKey: ["user", options.params.userId, "user_preferences"],
		...exclude(options, "params"),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["user", options.params.userId, "user_preferences"] })
			options?.onSuccess?.(data, variables)
		},
	})
}

export const useUpdateTablePreferences: ReactMutationFunction<Schema.User, UserTablePreferences, { userId: string }> = (
	options,
) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async(data) => {
			const res = await axios.patch(Routes.apiUpdateTablePreferences(options.params.userId), {
				user: { table_preferences: data },
			})
			if(res.statusText !== "OK") {
				throw new Error("Failed to update user table preferences")
			}
			return res.data
		},
		mutationKey: ["user", options.params.userId, "table_preferences"],
		...exclude(options, "params"),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["user", options.params.userId, "table_preferences"] })
			options?.onSuccess?.(data, variables)
		},
	})
}
