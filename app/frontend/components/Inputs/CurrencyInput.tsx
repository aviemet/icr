import {
	NumberInput as MantineNumberInput,
} from "@mantine/core"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import { useFormField, useFormFieldError } from "@/components/Form"
import { currencyInputFormat } from "@/lib/formatters"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"
import { type NumberInputProps } from "./NumberInput"

import { withInjectedProps, type BaseInputProps } from "."

export interface CurrencyInputProps extends NumberInputProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	symbol?: string | React.ReactNode
	currency?: string
	locale?: string
}

function toFloat(value: unknown): number | undefined {
	if(value === null || value === undefined || value === "") return undefined
	if(typeof value === "number") return Number.isFinite(value) ? value : undefined

	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : undefined
}

function commitFloat(value: number, decimalScale: number) {
	const factor = 10 ** decimalScale
	return Math.round(value * factor) / factor
}

export function CurrencyInput({
	symbol,
	currency = "USD",
	locale,
	label,
	name,
	required = false,
	value,
	onChange,
	onFocus,
	onBlur,
	id,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	error,
	ref,
	leftSection,
	thousandSeparator,
	decimalSeparator,
	allowedDecimalSeparators,
	decimalScale,
	...props
}: CurrencyInputProps) {
	const { i18n } = useTranslation()
	const resolvedLocale = locale ?? i18n.resolvedLanguage ?? i18n.language ?? "en-US"
	const format = currencyInputFormat(resolvedLocale, currency)
	const resolvedDecimalScale = decimalScale ?? format.decimalScale
	const resolvedThousandSeparator = thousandSeparator ?? format.thousandSeparator
	const resolvedDecimalSeparator = decimalSeparator ?? format.decimalSeparator
	const resolvedAllowedDecimalSeparators = allowedDecimalSeparators ?? (
		resolvedDecimalSeparator === "."
			? [resolvedDecimalSeparator]
			: [resolvedDecimalSeparator, "."]
	)

	const fieldError = useFormFieldError(name)
	const [fieldValue, setFieldValue] = useFormField(name)
	const inputId = id || name
	const numericValue = value !== undefined ? toFloat(value) : toFloat(fieldValue)

	const [draft, setDraft] = useState<string | number | "">("")
	const [editing, setEditing] = useState(false)
	const displayValue = editing ? draft : (numericValue ?? "")

	const commitValue = (nextValue: string | number) => {
		if(typeof nextValue === "number") {
			const committed = commitFloat(nextValue, resolvedDecimalScale)
			setFieldValue(committed)
			onChange?.(committed)
			return
		}

		if(nextValue === "") {
			setFieldValue("")
			onChange?.("")
		}
	}

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<input
				type="hidden"
				name={ name }
				value={ numericValue ?? "" }
				readOnly
				tabIndex={ -1 }
			/>
			<MantineNumberInput
				ref={ ref }
				id={ inputId }
				value={ displayValue === "" ? undefined : displayValue }
				required={ required }
				error={ error ?? fieldError }
				leftSection={ leftSection ?? symbol ?? format.currencySymbol }
				hideControls
				thousandSeparator={ resolvedThousandSeparator }
				decimalSeparator={ resolvedDecimalSeparator }
				allowedDecimalSeparators={ resolvedAllowedDecimalSeparators }
				decimalScale={ resolvedDecimalScale }
				thousandsGroupStyle="thousand"
				onFocus={ (event) => {
					setEditing(true)
					setDraft(numericValue ?? "")
					onFocus?.(event)
				} }
				onChange={ (nextValue) => {
					const resolved = nextValue ?? ""
					setDraft(resolved)
					commitValue(resolved)
				} }
				onBlur={ (event) => {
					setEditing(false)
					setDraft(numericValue ?? "")
					onBlur?.(event)
				} }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
