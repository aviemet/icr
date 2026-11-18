import {
	TextInput as MantineTextInput,
	type TextInputProps as MantineTextInputProps,
} from "@mantine/core"
import React, { useRef } from "react"

import { useFormFieldError } from "@/components/Form"
import { mergeRefs } from "@/lib/mergeRefs"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"
import { CrossIcon } from "../Icons"

import { withInjectedProps, type BaseInputProps } from "."

export interface TextInputProps extends MantineTextInputProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
	clearable?: boolean
}

export function TextInput({
	name,
	label,
	required = false,
	id,
	wrapper,
	wrapperProps,
	clearable = false,
	value,
	onChange,
	readOnly,
	disableAutofill = true,
	error,
	ref,
	...props
}: TextInputProps) {
	const fieldError = useFormFieldError(name)
	const inputRef = useRef<HTMLInputElement>(null)
	const resolvedRef = mergeRefs([ref, inputRef])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e)
	}

	const handleClear = () => {
		const input = inputRef.current
		if(input === null) {
			return
		}

		const nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
		if(nativeValueSetter === undefined) {
			input.value = ""
		} else {
			nativeValueSetter.call(input, "")
		}

		input.dispatchEvent(new Event("input", { bubbles: true }))
	}

	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantineTextInput
				ref={ resolvedRef }
				name={ name }
				id={ inputId }
				{ ...(value !== undefined && { value }) }
				onChange={ handleChange }
				required={ required }
				error={ error ?? fieldError }
				rightSection={
					!readOnly && clearable && value !== "" && value !== undefined &&
					<CrossIcon onClick={ handleClear } />
				}
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}
