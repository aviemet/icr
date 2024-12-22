import React from 'react'
import { Group } from '@mantine/core'
import { type Money } from '@/types'

interface FlexMoneyProps {
	children: number | Money | null
	formatter: Intl.NumberFormat
	accounting?: boolean
}

const getParts = (formatter: Intl.NumberFormat, value: number | Money | null) => {
	let numberValue = 0
	if(typeof value === 'number') {
		numberValue = value
	} else if(value?.hasOwnProperty('amount')) {
		numberValue = value.amount
	}

	const parts = formatter.formatToParts(numberValue)
	const symbol = parts.find(part => part.type === 'currency')

	const formattedValue = value === 0 ? '-' : parts.filter(part => part.type !== 'currency').map(part => part.value).join('')

	return {
		symbol: symbol?.value ?? '',
		value: numberValue,
		formattedValue,
	}
}

const FlexMoney = ({ children, formatter, accounting }: FlexMoneyProps) => {
	const { symbol, value, formattedValue } = getParts(formatter, children)

	return (
		<Group wrap="nowrap" justify="space-between">
			<div>{ symbol }</div>
			<div>{ value < 0 && accounting ? `(${formattedValue})` : formattedValue }</div>
			{ formattedValue === '-' && <div></div> }
		</Group>
	)
}


export default FlexMoney
