import {
	NumberInput as MantineNumberInput,
	type NumberInputProps as MantineNumberInputProps,
} from "@mantine/core"
import React from "react"

import { useFormField, useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { withInjectedProps, type BaseInputProps } from "."

export interface NumberInputProps extends MantineNumberInputProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
}

function numberInputValue(value: unknown) {
	if(value === null || value === undefined || value === "") return undefined
	if(typeof value === "number") return Number.isFinite(value) ? value : undefined

	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : undefined
}

export function NumberInput({
	label,
	name,
	required = false,
	value,
	onChange,
	id,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	error,
	ref,
	...props
}: NumberInputProps) {
	const fieldError = useFormFieldError(name)
	const [fieldValue, setFieldValue] = useFormField(name)
	const inputId = id || name
	const resolvedValue = value !== undefined ? value : numberInputValue(fieldValue)

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantineNumberInput
				ref={ ref }
				id={ inputId }
				name={ name }
				value={ resolvedValue }
				required={ required }
				error={ error ?? fieldError }
				onChange={ (nextValue) => {
					setFieldValue(nextValue ?? "")
					onChange?.(nextValue)
				} }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
