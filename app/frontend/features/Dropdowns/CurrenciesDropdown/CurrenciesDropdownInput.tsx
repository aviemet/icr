import { isEmpty } from "lodash-es"
import React from "react"

import { Select as InputSelect } from "@/components/Inputs"
import { useGetCurrencies } from "@/queries/locale"

import { type AsyncDropdown } from ".."

interface CurrenciesDropdownProps extends AsyncDropdown<Schema.CurrencyOption> {
	ref?: React.Ref<HTMLInputElement>
}

const CurrenciesDropdown = ({
	label = "Currency",
	name = "currency",
	ref,
	...props
}: CurrenciesDropdownProps) => {
	const { data, refetch } = useGetCurrencies({
		staleTime: Infinity,
	})

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(currency => ({
				label: `${currency.code} (${currency.symbol})`,
				value: String(currency.code),
			})) }
		onDropdownOpen={ () => {
			if(isEmpty(data)) refetch()
		} }
		searchable
		clearable
		{ ...props }
	/>
}

export default CurrenciesDropdown
