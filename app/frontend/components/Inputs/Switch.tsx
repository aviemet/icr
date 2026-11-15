import {
	Switch as MantineSwitch,
	type SwitchProps as MantineSwitchProps,
} from "@mantine/core"
import React from "react"

import { useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"

import { type BaseInputProps } from "."


export interface SwitchProps extends MantineSwitchProps, Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLInputElement>
}

export function Switch({
	id,
	name,
	style,
	wrapper,
	wrapperProps,
	error,
	ref,
	...props
}: SwitchProps) {
	const fieldError = useFormFieldError(name)
	const inputId = id ?? name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<MantineSwitch
				ref={ ref }
				id={ inputId }
				name={ name }
				required={ props.required }
				error={ error ?? fieldError }
				style={ [{ padding: "14px 10px" }, style] }
				{ ...props }
			/>
		</InputWrapper>
	)
}
