import { isEmpty } from "lodash-es"
import React, { forwardRef } from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetPayPeriodTypes } from "@/queries/locale"

import { type AsyncDropdown } from ".."

interface PayPeriodsDropdownProps extends AsyncDropdown<Schema.PayPeriodOption> {}

const PayPeriodsDropdown = forwardRef<HTMLInputElement, PayPeriodsDropdownProps>((
	{
		label = "PayPeriod",
		name = "payPeriod",
		...props
	},
	ref,
) => {
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
})

export default PayPeriodsDropdown
