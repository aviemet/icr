import React, { useState } from 'react'
import { useTableSectionContext } from '@/Components/Table/TableContext'
import FlexMoney from './FlexMoney'
import { type Money } from '@/types'
import { useCurrency, type UseCurrencyOptions } from '@/lib/hooks'

interface MoneyProps {
	children?: number | Money | null
	currency?: string
	locale?: string
	accounting?: boolean
	options?: UseCurrencyOptions
}

const MoneyComponent = ({
	children,
	currency = 'USD',
	locale = 'en-US',
	accounting = false,
	options = {},
}: MoneyProps) => {
	const [inTable, setInTable] = useState(false)

	const useCurrencyOptions: UseCurrencyOptions = options
	useCurrencyOptions.signDisplay = accounting ? 'never' : 'auto'

	const [amount, formatter] = useCurrency({
		amount: children ?? 0,
		currency,
		locale,
		options: useCurrencyOptions,
	})

	try {
		// Throw if component is not being used inside of a table
		// (when used in a table cell, always use FlexMoney. Throwing is easiest way to check context)
		useTableSectionContext()
		if(!inTable) setInTable(true)
	} catch(e) {}

	if(accounting || (inTable && accounting === undefined)) {
		return (
			<FlexMoney
				formatter={ formatter }
				accounting={ accounting }
			>
				{ amount }
			</FlexMoney>
		)
	}

	return <>{ formatter.format(amount) }</>
}

export default MoneyComponent
