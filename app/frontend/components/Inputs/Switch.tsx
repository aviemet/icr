import { Switch, type SwitchProps as MantineSwitchProps } from "@mantine/core"
import React from "react"

import InputWrapper from "./InputWrapper"

import { type BaseInputProps } from "."


export interface SwitchProps extends MantineSwitchProps, Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLInputElement>
}

const SwitchComponent = ({
	id,
	name,
	style,
	wrapper,
	wrapperProps,
	ref,
	...props
}: SwitchProps) => {
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
}

export default SwitchComponent
