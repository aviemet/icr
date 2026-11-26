import React from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetLanguages } from "@/queries/locale"

import { type AsyncDropdown } from "."

type LanguageOption = {
	value: string
	label: string
}

export interface LanguagesDropdownProps extends AsyncDropdown<LanguageOption> {
	ref?: React.Ref<HTMLInputElement>
}

export function LanguagesDropdown({
	label = "Language",
	name = "language",
	ref,
	...props
}: LanguagesDropdownProps) {
	const { data } = useGetLanguages({
		staleTime: Infinity,
	})

	const options = (data ?? []).map(language => ({
		label: language.label,
		value: String(language.value),
	}))

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ options }
		searchable
		clearable
		{ ...props }
	/>
}
