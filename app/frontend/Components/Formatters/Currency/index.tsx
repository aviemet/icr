import { useState } from "react"
import { useTableSectionContext } from "@/Components/Table/TableContext"
import FlexCurrency from "./FlexCurrency"
import { type Money } from "@/types"
import { useCurrency, type UseCurrencyOptions } from "@/lib/hooks"

interface CurrencyFormatterProps {
	children?: number | Money | null
	currency?: string
	locale?: string
	accounting?: boolean
	options?: UseCurrencyOptions
}

const CurrencyFormatter = ({
	children,
	currency = "USD",
	locale = "en-US",
	accounting = false,
	options = {},
}: CurrencyFormatterProps) => {
	const [inTable, setInTable] = useState(false)

	const useCurrencyOptions: UseCurrencyOptions = options
	useCurrencyOptions.signDisplay = accounting ? "never" : "auto"

	const [amount, formatter] = useCurrency({
		amount: children ?? 0,
		currency,
		locale,
		options: useCurrencyOptions,
	})

	try {
		// Throw if component is not being used inside of a table
		// (when used in a table cell, always use FlexCurrency. Throwing is easiest way to check context)
		useTableSectionContext()
		if(!inTable) setInTable(true)
	} catch(e) {}

	if(accounting || (inTable && accounting === undefined)) {
		return (
			<FlexCurrency
				formatter={ formatter }
				accounting={ accounting }
			>
				{ amount }
			</FlexCurrency>
		)
	}

	return <>{ formatter.format(amount) }</>
}

export default CurrencyFormatter
