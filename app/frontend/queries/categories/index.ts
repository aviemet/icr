import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"

import { exclude, Routes } from "@/lib"
import { type CategoryType } from "@/types/CategoryType"

import { type ReactQueryFunction, type ReactMutationFunction } from ".."

export const useGetCategoriesAsOptions: ReactQueryFunction<
	Schema.Category[],
	{ categoryType: CategoryType }
> = (params, options) => {
	return useQuery({
		queryKey: ["categories", "options", params?.categoryType],
		queryFn: async() => {
			if(!params?.categoryType) return []
			const res = await axios.get(Routes.apiCategoryOptions(params.categoryType))
			return res.data
		},
		enabled: Boolean(params?.categoryType),
		...options,
	})
}

export const useGetCategories: ReactQueryFunction<Schema.Category[], { type: string }> = (params, options) => {
	return useQuery({
		queryKey: ["shift_types"],
		queryFn: async() => {
			const res = await axios.get(Routes.apiCategories(params))
			return res.data
		},
		...options,
	})
}

type CreateCategoryParams = {
	name: string
}

export const useCreateCategory: ReactMutationFunction<Schema.Category, CreateCategoryParams> = (
	options
) => {
	return useMutation({
		mutationFn: async(variables) => {
			const res = await axios.post(
				Routes.apiCategories(),
				Object.assign({ type: "Shift" }, variables)
			)
			return res.data
		},
		mutationKey: ["shift_types"],
		...exclude(options, "params"),
	})
}

type DeleteCategoryParams = {
	id: number
}

export const useDeleteCategory: ReactMutationFunction<void, DeleteCategoryParams> = (
	options
) => {
	return useMutation({
		mutationFn: async(variables) => {
			await axios.delete(Routes.apiCategories({ id: variables.id }))
		},
		mutationKey: ["shift_types"],
		...exclude(options, "params"),
	})
}
