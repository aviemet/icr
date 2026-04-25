import { isEmpty } from "lodash-es"
import React from "react"

import { Select as FormSelect } from "@/components/Form"
import { useGetJobTitlesAsOptions } from "@/queries/jobTitles"

import { type FormAsyncDropdown } from ".."

export interface FormJobTitlesDropdownProps extends Omit<FormAsyncDropdown<Schema.EmployeeJobTitlesOptions>, "name"> {
	name?: string
}

export function FormJobTitlesDropdown({
	label = "Job Title",
	name = "job_title_id",
	initialData,
	...props
}: FormJobTitlesDropdownProps) {
	const { data, isStale, refetch } = useGetJobTitlesAsOptions({
		initialData,
	})

	return (
		<FormSelect
			label={ label }
			name={ name }
			options={ data === undefined
				? []
				: data.map(jobTitle => ({
					label: jobTitle.name,
					value: jobTitle.id,
				})) }
			onDropdownOpen={ () => {
				if(isEmpty(data) || isStale) refetch()
			} }
			searchable
			clearable
			{ ...props }
		/>
	)
}
