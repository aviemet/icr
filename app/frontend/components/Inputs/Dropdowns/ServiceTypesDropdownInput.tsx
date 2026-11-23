import { isEmpty } from "es-toolkit/compat"
import { useMemo } from "react"

import { Select } from "@/components/Inputs"
import { useGetServiceTypesAsOptions } from "@/queries"

import { type AsyncDropdown } from "."

type ServiceTypeValueKey = "id" | "slug"

export interface ServiceTypesDropdownProps extends Omit<AsyncDropdown<Schema.ServiceTypesOptions>, "name"> {
	name?: string
	valueKey?: ServiceTypeValueKey
	defaultValue?: string
	activeOnly?: boolean
}

export function ServiceTypesDropdown({
	label = "Service type",
	name = "service_type_id",
	valueKey = "id",
	initialData,
	defaultValue,
	activeOnly = true,
	...props
}: ServiceTypesDropdownProps) {
	const { data, isStale, refetch } = useGetServiceTypesAsOptions({
		initialData,
	})

	const options = useMemo(() => {
		if(!Array.isArray(data)) return []
		const key = valueKey === "slug" ? "slug" : "id"
		return data
			.filter(serviceType => !activeOnly || serviceType.active !== false)
			.map(serviceType => ({
				label: serviceType.name,
				value: serviceType[key] ?? "",
			}))
	}, [activeOnly, data, valueKey])

	const resolvedDefault = useMemo(() => {
		if(!defaultValue || !Array.isArray(data)) return undefined
		if(valueKey === "slug") return defaultValue
		return data.find(serviceType => serviceType.slug === defaultValue || serviceType.id === defaultValue)?.id
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
