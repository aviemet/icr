import { Autocomplete, type AutocompleteProps as MantineAutocompleteProps } from "@mantine/core"
import React from "react"

import InputWrapper from "./InputWrapper"

import { withInjectedProps, type BaseInputProps } from "."


export interface AutocompleteProps extends MantineAutocompleteProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
}

const AutocompleteComponent = ({
	id,
	name,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	ref,
	...props
}: AutocompleteProps) => {
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
}

export default AutocompleteComponent
