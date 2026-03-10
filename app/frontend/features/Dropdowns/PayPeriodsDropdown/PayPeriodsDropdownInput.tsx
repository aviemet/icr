import { isEmpty } from "lodash-es"
import React from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetPayPeriodTypes } from "@/queries/locale"

import { type AsyncDropdown } from ".."

export interface PayPeriodsDropdownProps extends AsyncDropdown<Schema.PayPeriodOption> {
	ref?: React.Ref<HTMLInputElement>
}

export function PayPeriodsDropdown({
	label = "PayPeriod",
	name = "payPeriod",
	ref,
	...props
}: PayPeriodsDropdownProps) {
	const { data, refetch } = useGetPayPeriodTypes({
		staleTime: Infinity,
	})

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(payPeriod => ({
				label: `${payPeriod.code} (${payPeriod.symbol})`,
				value: String(payPeriod.code),
			})) }
		onDropdownOpen={ () => {
			if(isEmpty(data)) refetch()
		} }
		searchable
		clearable
		{ ...props }
	/>
}
