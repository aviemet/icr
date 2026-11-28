import {
	Switch as MantineSwitch,
	type SwitchProps as MantineSwitchProps,
} from "@mantine/core"
import clsx from "clsx"
import React from "react"

import { useFormField, useFormFieldError } from "@/components/Form"

import { InputWrapper } from "./InputWrapper"
import * as classes from "./Switch.css"

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
	className,
	checked,
	onChange,
	ref,
	...props
}: SwitchProps) {
	const fieldError = useFormFieldError(name)
	const [fieldValue, setFieldValue] = useFormField(name)
	const inputId = id ?? name
	const resolvedChecked = checked ?? (typeof fieldValue === "boolean" ? fieldValue : undefined)

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<MantineSwitch
				ref={ ref }
				id={ inputId }
				name={ name }
				checked={ resolvedChecked }
				onChange={ (event) => {
					setFieldValue(event.currentTarget.checked)
					onChange?.(event)
				} }
				required={ props.required }
				error={ error ?? fieldError }
				className={ clsx(classes.root, className) }
				style={ [{ paddingBlock: 14 }, style] }
				{ ...props }
			/>
		</InputWrapper>
	)
}
