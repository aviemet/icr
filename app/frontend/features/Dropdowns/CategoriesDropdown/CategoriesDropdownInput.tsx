import { isEmpty } from "lodash-es"
import React, { useMemo } from "react"

import { Select } from "@/components/Inputs"
import { useGetCategoriesAsOptions } from "@/queries/categories"
import { type CategoryType } from "@/types/CategoryType"

import { type AsyncDropdown } from ".."

type CategoryValueKey = "id" | "slug"

interface CategoriesDropdownInputProps extends Omit<AsyncDropdown<Schema.CategoriesOptions>, "name"> {
	name?: string
	categoryType: CategoryType
	valueKey?: CategoryValueKey
	defaultValue?: string
}

const CategoriesDropdownInput = ({
	label = "Category",
	name = "category_id",
	categoryType,
	valueKey = "id",
	initialData,
	defaultValue,
	...props
}: CategoriesDropdownInputProps) => {
	const { data, isStale, refetch } = useGetCategoriesAsOptions(
		{ categoryType },
		{ initialData },
	)

	const options = useMemo(() => {
		if(!data) return []
		const key = valueKey === "slug" ? "slug" : "id"
		return data.map(category => ({
			label: category.name,
			value: category[key] ?? "",
		}))
	}, [data, valueKey])

	const resolvedDefault = useMemo(() => {
		if(!defaultValue || !data) return undefined
		if(valueKey === "slug") return defaultValue
		return data.find(c => c.name === defaultValue)?.id
	}, [defaultValue, data, valueKey])

	return (
		<Select
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

export default CategoriesDropdownInput
