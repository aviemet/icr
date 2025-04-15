import { router } from "@inertiajs/react"
import { Select, type ComboboxData, type SelectProps } from "@mantine/core"
import React, { forwardRef } from "react"

import { coerceArray } from "@/lib"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { withInjectedProps, type BaseInputProps } from "."

export interface SelectInputProps extends Omit<SelectProps, "data">, BaseInputProps {
	options?: ComboboxData
	fetchOnOpen?: string
}

const SelectComponent = forwardRef<HTMLInputElement, SelectInputProps>((
	{
		options = [],
		label,
		required,
		id,
		name,
		maxDropdownHeight = 400,
		fetchOnOpen,
		onDropdownOpen,
		wrapper,
		wrapperProps,
		disableAutofill = true,
		...props
	},
	ref,
) => {
	const inputId = id || name

	const handleDropdownOpen = () => {
		if(fetchOnOpen) {
			router.reload({ only: coerceArray(fetchOnOpen) })
		}

		onDropdownOpen?.()
	}

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<Select
				ref={ ref }
				// Add "search" suffix to prevent password managers trying to autofill dropdowns
				id={ `${inputId}-search` }
				autoComplete="off"
				name={ name }
				data={ options }
				required={ required }
				maxDropdownHeight={ maxDropdownHeight }
				onDropdownOpen={ handleDropdownOpen }
				nothingFoundMessage="No Results"
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
})

export default SelectComponent
