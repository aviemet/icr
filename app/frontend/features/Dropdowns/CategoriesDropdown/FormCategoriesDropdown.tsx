import { isEmpty } from "lodash-es"
import React, { useMemo } from "react"

import { Select as FormSelect } from "@/components/Form"
import { useGetCategoriesAsOptions } from "@/queries/categories"
import { type CategoryType } from "@/types/CategoryType"

import { type FormAsyncDropdown } from ".."

type CategoryValueKey = "id" | "slug"

export interface FormCategoriesDropdownProps extends Omit<FormAsyncDropdown<Schema.CategoriesOptions>, "name"> {
	name?: string
	categoryType: CategoryType
	valueKey?: CategoryValueKey
	defaultValue?: string
}

export function FormCategoriesDropdown({
	label = "Category",
	name = "category_id",
	categoryType,
	valueKey = "id",
	initialData,
	defaultValue,
	...props
}: FormCategoriesDropdownProps) {
	const { data, isStale, refetch } = useGetCategoriesAsOptions(
		{ categoryType },
		{ initialData },
	)

	const resolvedDefault = useMemo(() => {
		if(!defaultValue || !data) return undefined

		if(valueKey === "slug") return defaultValue

		return data.find(cat => cat.name === defaultValue)?.id
	}, [defaultValue, data, valueKey])

	const options = useMemo(() => {
		if(!data) return []

		return data.map(category => ({
			label: category.name,
			value: category[valueKey] ?? "",
		}))
	}, [data, valueKey])

	return (
		<FormSelect
			label={ label }
			name={ name }
			options={ options }
			defaultValue={ resolvedDefault }
			onDropdownOpen={ () => {
				if(isEmpty(data) || isStale) refetch()
			} }
			searchable
			clearable
			{ ...props }
		/>
	)
}
