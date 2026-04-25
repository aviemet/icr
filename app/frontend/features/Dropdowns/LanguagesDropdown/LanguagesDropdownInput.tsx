import { isEmpty } from "lodash-es"
import React from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetLanguages } from "@/queries/locale"

import { type AsyncDropdown } from ".."

export interface LanguagesDropdownProps extends AsyncDropdown<Schema.LanguageOption> {
	ref?: React.Ref<HTMLInputElement>
}

export function LanguagesDropdown({
	label = "Language",
	name = "language",
	ref,
	...props
}: LanguagesDropdownProps) {
	const { data, refetch } = useGetLanguages({
		staleTime: Infinity,
	})

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(language => ({
				label: `${language.code} (${language.symbol})`,
				value: String(language.code),
			})) }
		onDropdownOpen={ () => {
			if(isEmpty(data)) refetch()
		} }
		searchable
		clearable
		{ ...props }
	/>
}
