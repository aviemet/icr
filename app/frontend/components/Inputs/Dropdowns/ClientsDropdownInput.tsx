import { isEmpty } from "es-toolkit/compat"
import React from "react"

import { Select } from "@/components/Inputs"
import { useGetClientsAsOptions } from "@/queries"

import { type AsyncDropdown } from "."

interface ItemsDropdownProps extends Omit<AsyncDropdown<Schema.ClientsOptions>, "name"> {
	ref?: React.Ref<HTMLInputElement>
	name?: string
}

export function ClientsDropdown({
	label = "Client",
	name = "client_id",
	initialData,
	value,
	ref,
	...props
}: ItemsDropdownProps) {
	const { data, isStale, refetch } = useGetClientsAsOptions({
		initialData,
	})

	return <Select
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(client => ({
				label: client.name,
				value: client.id,
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
