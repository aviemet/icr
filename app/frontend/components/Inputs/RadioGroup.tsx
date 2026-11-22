import { Radio as MantineRadio, type RadioGroupProps as MantineRadioGroupProps } from "@mantine/core"
import React from "react"

import { Group } from "@/components"
import { useFormField, useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type BaseInputProps } from "."

export interface RadioGroupOption {
	value: string
	label: string
}

export interface RadioGroupProps
	extends
	Omit<MantineRadioGroupProps, "children" | "onChange" | "value" | "defaultValue">,
	Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLDivElement>
	label?: string
	name: string
	options: RadioGroupOption[]
	id?: string
	value?: string | null
	onChange?: (value: string) => void
}

function radioValueFromField(value: unknown) {
	if(value === undefined || value === null || value === "") return null

	return String(value)
}

export function RadioGroup({
	label,
	name,
	options,
	id,
	required,
	value,
	onChange,
	wrapper,
	wrapperProps,
	error,
	ref,
	...props
}: RadioGroupProps) {
	const fieldError = useFormFieldError(name)
	const [fieldValue, setFieldValue] = useFormField(name)
	const inputId = id || name
	const resolvedValue = value !== undefined
		? radioValueFromField(value)
		: radioValueFromField(fieldValue)

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<MantineRadio.Group
				ref={ ref }
				id={ inputId }
				name={ name }
				value={ resolvedValue }
				required={ required }
				error={ error ?? fieldError }
				onChange={ (nextValue) => {
					setFieldValue(nextValue)
					onChange?.(nextValue)
				} }
				{ ...props }
			>
				<Group mt="xs">
					{ options.map((option) => (
						<MantineRadio
							key={ option.value }
							value={ option.value }
							label={ option.label }
						/>
					)) }
				</Group>
			</MantineRadio.Group>
		</InputWrapper>
	)
}
