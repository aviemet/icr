import { isEmpty } from "lodash-es"
import React from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetTimezones } from "@/queries/locale"

import { type AsyncDropdown } from ".."

interface TimezonesDropdownProps extends AsyncDropdown<Schema.TimezoneOption> {
	ref?: React.Ref<HTMLInputElement>
}

const TimezonesDropdown = ({
	label = "Timezone",
	name = "timezone",
	ref,
	...props
}: TimezonesDropdownProps) => {
	const { data, refetch } = useGetTimezones({
		staleTime: Infinity,
	})

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: Object.entries(data).map(([region, timezones]) => ({
				group: region, items: timezones,
			})) }
		onDropdownOpen={ () => {
			if(isEmpty(data)) refetch()
		} }
		searchable
		clearable
		{ ...props }
	/>
}

export default TimezonesDropdown
