import React from "react"

import { NumberInput, type NumberInputProps } from "./NumberInput"

import { type BaseInputProps } from "."

export interface CurrencyInputProps extends NumberInputProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	symbol?: string | React.ReactNode
}

export function CurrencyInput({
	symbol = "$",
	...props
}: CurrencyInputProps) {
	return (
		<NumberInput
			leftSection={ symbol }
			hideControls
			{ ...props }
		/>
	)
}
