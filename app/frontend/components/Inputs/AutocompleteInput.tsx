import { Autocomplete, type AutocompleteProps as MantineAutocompleteProps } from "@mantine/core"
import React, { forwardRef } from "react"

import InputWrapper from "./InputWrapper"

import { withInjectedProps, type BaseInputProps } from "."


export interface AutocompleteProps extends MantineAutocompleteProps, BaseInputProps {}

const AutocompleteComponent = forwardRef<HTMLInputElement, AutocompleteProps>((
	{
		id,
		name,
		wrapper,
		wrapperProps,
		disableAutofill = true,
		...props
	},
	ref,
) => {
	const inputId = id ?? name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<Autocomplete
				ref={ ref }
				id={ inputId }
				name={ name }
				wrapperProps={ wrapper ? undefined : wrapperProps }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
})

export default AutocompleteComponent
