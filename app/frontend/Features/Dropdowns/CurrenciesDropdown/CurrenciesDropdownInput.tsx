import React, { forwardRef } from 'react'
import { Select as InputSelect } from '@/Components/Inputs'
import { useGetCurrencies } from '@/queries/locale'
import { isEmpty } from 'lodash'
import { type AsyncDropdown } from '..'

interface CurrenciesDropdownProps extends AsyncDropdown<Schema.CurrencyOption> {}

const CurrenciesDropdown = forwardRef<HTMLInputElement, CurrenciesDropdownProps>((
	{
		label = 'Currency',
		name = 'currency',
		...props
	},
	ref,
) => {
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
})

export default CurrenciesDropdown
