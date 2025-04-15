import { Switch, type SwitchProps as MantineSwitchProps } from "@mantine/core"
import React, { forwardRef } from "react"

import InputWrapper from "./InputWrapper"

import { type BaseInputProps } from "."


export interface SwitchProps extends MantineSwitchProps, Omit<BaseInputProps, "disableAutofill"> {}

const SwitchComponent = forwardRef<HTMLInputElement, SwitchProps>((
	{ id, name, style, wrapper, wrapperProps, ...props },
	ref,
) => {
	const inputId = id ?? name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<Switch
				ref={ ref }
				id={ inputId }
				name={ name }
				required={ props.required }
				style={ [{ padding: "14px 10px" }, style] }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default SwitchComponent
