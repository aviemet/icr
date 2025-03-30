import { isEmpty } from "lodash"
import React, { forwardRef } from "react"

import { Select as InputSelect } from "@/Components/Inputs"
import { useGetTimezones } from "@/queries/locale"

import { type AsyncDropdown } from ".."

interface TimezonesDropdownProps extends AsyncDropdown<Schema.TimezoneOption> {}

const TimezonesDropdown = forwardRef<HTMLInputElement, TimezonesDropdownProps>((
	{
		label = "Timezone",
		name = "timezone",
		...props
	},
	ref,
) => {
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
})

export default TimezonesDropdown
