import { router } from "@inertiajs/react"
import {
	MultiSelect as MantineMultiSelect,
	type ComboboxData,
	type MultiSelectProps as MantineMultiSelectInputProps,
} from "@mantine/core"
import React from "react"

import { useFormField, useFormFieldError } from "@/components/Form"
import { coerceArray } from "@/lib"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { withInjectedProps, type BaseInputProps } from "."

export interface MultiSelectInputProps extends Omit<MantineMultiSelectInputProps, "data">, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	options?: ComboboxData
	fetchOnOpen?: string
}

function multiSelectValueFromField(value: unknown) {
	if(value === undefined) return undefined
	if(value === null || value === "") return []
	if(Array.isArray(value)) return value.map(String)

	return [String(value)]
}

export function MultiSelect({
	options = [],
	label,
	required,
	id,
	name,
	maxDropdownHeight = 400,
	wrapper,
	wrapperProps,
	fetchOnOpen,
	onDropdownOpen,
	onChange,
	value,
	disableAutofill = true,
	error,
	ref,
	...props
}: MultiSelectInputProps) {
	const fieldError = useFormFieldError(name)
	const [fieldValue, setFieldValue] = useFormField(name)
	const inputId = id || name
	const resolvedValue = value !== undefined
		? value
		: multiSelectValueFromField(fieldValue)

	const handleDropdownOpen = () => {
		if(fetchOnOpen) {
			router.reload({ only: coerceArray(fetchOnOpen) })
		}

		onDropdownOpen?.()
	}

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ `${inputId}-search` }>
				{ label }
			</Label> }
			<MantineMultiSelect
				ref={ ref }
				// Add "search" suffix to prevent password managers trying to autofill dropdowns
				id={ `${inputId}-search` }
				autoComplete="off"
				name={ name }
				data={ options }
				required={ required }
				value={ resolvedValue }
				error={ error ?? fieldError }
				maxDropdownHeight={ maxDropdownHeight }
				onDropdownOpen={ handleDropdownOpen }
				nothingFoundMessage="No Results"
				onChange={ (nextValue) => {
					setFieldValue(nextValue)
					onChange?.(nextValue)
				} }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
