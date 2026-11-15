import { router } from "@inertiajs/react"
import {
	Select as MantineSelect,
	type ComboboxData,
	type SelectProps,
} from "@mantine/core"
import React from "react"

import { useFormField, useFormFieldError } from "@/components/Form"
import { coerceArray } from "@/lib"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { withInjectedProps, type BaseInputProps } from "."

export interface SelectInputProps extends Omit<SelectProps, "data">, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	options?: ComboboxData
	fetchOnOpen?: string
}

function selectValueFromField(value: unknown) {
	if(value === undefined) return undefined
	if(value === null || value === "") return null

	return String(value)
}

export function Select({
	options = [],
	label,
	required,
	id,
	name,
	maxDropdownHeight = 400,
	fetchOnOpen,
	onDropdownOpen,
	onChange,
	value,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	error,
	ref,
	...props
}: SelectInputProps) {
	const fieldError = useFormFieldError(name)
	const [fieldValue, setFieldValue] = useFormField(name)
	const inputId = id || name
	const resolvedValue = value !== undefined
		? selectValueFromField(value)
		: selectValueFromField(fieldValue)

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
			<MantineSelect
				ref={ ref }
				// Add "search" suffix to prevent password managers trying to autofill dropdowns
				id={ `${inputId}-search` }
				autoComplete="off"
				name={ name }
				data={ options }
				required={ required }
				{ ...(resolvedValue !== undefined && { value: resolvedValue }) }
				error={ error ?? fieldError }
				maxDropdownHeight={ maxDropdownHeight }
				onDropdownOpen={ handleDropdownOpen }
				nothingFoundMessage="No Results"
				onChange={ (nextValue, option) => {
					setFieldValue(nextValue ?? "")
					onChange?.(nextValue, option)
				} }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
