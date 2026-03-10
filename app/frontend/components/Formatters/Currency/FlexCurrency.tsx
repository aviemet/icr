import { Box, Group } from "@/components"
import { type Money } from "@/types"

interface FlexCurrencyFormatterProps {
	children: number | Money | null
	formatter: Intl.NumberFormat
	accounting?: boolean
}

const getParts = (formatter: Intl.NumberFormat, value: number | Money | null) => {
	let numberValue = 0
	if(typeof value === "number") {
		numberValue = value
	} else if(value?.hasOwnProperty("amount")) {
		numberValue = value.amount
	}

	const parts = formatter.formatToParts(numberValue)
	const symbol = parts.find(part => part.type === "currency")

	const formattedValue = value === 0 ? "-" : parts.filter(part => part.type !== "currency").map(part => part.value).join("")

	return {
		symbol: symbol?.value ?? "",
		value: numberValue,
		formattedValue,
	}
}

export function FlexCurrencyFormatter({ children, formatter, accounting }: FlexCurrencyFormatterProps) {
	const { symbol, value, formattedValue } = getParts(formatter, children)

	return (
		<Group wrap="nowrap" justify="space-between">
			<Box>{ symbol }</Box>
			<Box>{ value < 0 && accounting ? `(${formattedValue})` : formattedValue }</Box>
			{ formattedValue === "-" && <Box></Box> }
		</Group>
	)
}
