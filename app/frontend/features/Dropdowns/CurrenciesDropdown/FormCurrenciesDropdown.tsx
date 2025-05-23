import { isEmpty } from "lodash-es"
import React from "react"

import { Select as FormSelect } from "@/components/Form"
import { useGetCurrencies } from "@/queries/locale"

import { type FormAsyncDropdown } from ".."

interface FormCurrenciesDropdownProps extends Omit<FormAsyncDropdown<Schema.CurrencyOption>, "name"> {
	name?: string
}

const FormCurrenciesDropdown = ({
	label = "Currency",
	name = "currency",
	...props
}: FormCurrenciesDropdownProps) => {
	const { data, refetch } = useGetCurrencies({
		staleTime: Infinity,
	})

	return (
		<FormSelect
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
	)

}

export default FormCurrenciesDropdown
