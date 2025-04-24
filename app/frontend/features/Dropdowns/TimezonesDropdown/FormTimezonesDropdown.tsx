import { isEmpty } from "lodash-es"
import React from "react"

import { Flags } from "@/components"
import { Select as FormSelect } from "@/components/Form"
import { useGetTimezones } from "@/queries/locale"

import { type FormAsyncDropdown } from ".."

interface FormTimezonesDropdownProps extends Omit<FormAsyncDropdown<Schema.TimezoneOption>, "name"> {
	name?: string
}

const FormTimezonesDropdown = ({
	label = "Timezone",
	name = "timezone",
	...props
}: FormTimezonesDropdownProps) => {
	const { data, refetch } = useGetTimezones({
		staleTime: Infinity,
	})

	return (
		<FormSelect
			label={ label }
			name={ name }
			options={ !data
				? []
				: Object.entries(data).map(([region, timezones]) => ({
					group: region, items: timezones,
				}))
			}
			onDropdownOpen={ () => {
				if(isEmpty(data)) refetch()
			} }
			searchable
			clearable
			{ ...props }
		/>
	)

}

export default FormTimezonesDropdown
