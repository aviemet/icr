import { isEmpty } from "lodash-es"
import React from "react"

import { Select as FormSelect } from "@/components/Inputs"
import { useGetPayPeriodTypes } from "@/queries/locale"

import { type FormAsyncDropdown } from ".."

export interface FormPayPeriodsDropdownProps extends Omit<FormAsyncDropdown<Schema.PayPeriodOption>, "name"> {
	name?: string
}

export function FormPayPeriodsDropdown({
	label = "PayPeriod",
	name = "payPeriod",
	...props
}: FormPayPeriodsDropdownProps) {
	const { data, refetch } = useGetPayPeriodTypes({
		staleTime: Infinity,
	})

	return (
		<FormSelect
			label={ label }
			name={ name }
			options={ data }
			onDropdownOpen={ () => {
				if(isEmpty(data)) refetch()
			} }
			searchable
			clearable
			{ ...props }
		/>
	)
}
