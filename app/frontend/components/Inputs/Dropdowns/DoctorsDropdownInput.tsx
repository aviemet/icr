import { isEmpty } from "es-toolkit/compat"
import React from "react"

import { Select } from "@/components/Inputs"
import { useGetDoctorsAsOptions } from "@/queries"

import { type AsyncDropdown } from "."

interface ItemsDropdownProps extends Omit<AsyncDropdown<Schema.DoctorsOptions>, "name"> {
	ref?: React.Ref<HTMLInputElement>
	name?: string
}

export function DoctorsDropdown({
	label = "Doctor",
	name = "doctor_id",
	initialData,
	value,
	ref,
	...props
}: ItemsDropdownProps) {
	const { data, isStale, refetch } = useGetDoctorsAsOptions({
		initialData,
	})

	return <Select
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(doctor => ({
				label: doctor.name,
				value: doctor.id,
			}))
		}
		onDropdownOpen={ () => {
			if(isEmpty(data) || isStale) refetch()
		} }
		searchable
		clearable
		value={ value }
		{ ...props }
	/>
}
