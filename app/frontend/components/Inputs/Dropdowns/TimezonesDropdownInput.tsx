import { isEmpty } from "lodash-es"
import React, { useMemo } from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetTimezones } from "@/queries/locale"

import { type AsyncDropdown } from "."

export interface TimezonesDropdownProps extends AsyncDropdown<Schema.TimezoneOption> {
	ref?: React.Ref<HTMLInputElement>
}

export function TimezonesDropdown({
	label = "Timezone",
	name = "timezone",
	ref,
	...props
}: TimezonesDropdownProps) {
	const { data, refetch } = useGetTimezones({
		staleTime: Infinity,
	})

	const timezoneOptions = useMemo(() => {
		if(!data) return []

		return Object.entries(data).map(([region, timezones]) => ({
			group: region, items: timezones,
		}))
	}, [data])

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ timezoneOptions }
		onDropdownOpen={ () => {
			if(isEmpty(data)) refetch()
		} }
		searchable
		clearable
		{ ...props }
	/>
}
