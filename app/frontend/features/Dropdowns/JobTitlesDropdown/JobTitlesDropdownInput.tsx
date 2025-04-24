import { isEmpty } from "lodash-es"
import React from "react"

import { Select } from "@/components/Inputs"
import { useGetJobTitlesAsOptions } from "@/queries/jobTitles"

import { type AsyncDropdown } from ".."

interface JobTitlesDropdownProps extends Omit<AsyncDropdown<Schema.EmployeeJobTitlesOptions>, "name"> {
	name?: string
}

const JobTitlesDropdownInput = ({
	label = "Job Title",
	name = "job_title_id",
	initialData,
	...props
}: JobTitlesDropdownProps) => {
	const { data, isStale, refetch } = useGetJobTitlesAsOptions({
		initialData,
	})

	return (
		<Select
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

export default JobTitlesDropdownInput
