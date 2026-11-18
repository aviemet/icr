import { Autocomplete, type AutocompleteProps as MantineAutocompleteProps } from "@mantine/core"
import React from "react"

import { useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"

import { withInjectedProps, type BaseInputProps } from "."

export interface AutocompleteProps extends MantineAutocompleteProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
}

export function AutocompleteInput({
	id,
	name,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	error,
	ref,
	...props
}: AutocompleteProps) {
	const fieldError = useFormFieldError(name)
	const inputId = id ?? name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<Autocomplete
				ref={ ref }
				id={ inputId }
				name={ name }
				error={ error ?? fieldError }
				wrapperProps={ wrapper ? undefined : wrapperProps }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
