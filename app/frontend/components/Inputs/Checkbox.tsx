import { Checkbox as MantineCheckbox, type CheckboxProps as MantineCheckboxProps } from "@mantine/core"
import React from "react"

import { InputWrapper } from "./InputWrapper"

import { withInjectedProps, type BaseInputProps } from "."


export interface CheckboxProps extends MantineCheckboxProps, BaseInputProps {
	ref?: React.Ref<HTMLInputElement>
}

type CheckboxComponentType = React.FC<CheckboxProps> & {
	Group: typeof MantineCheckbox.Group
}

const Checkbox: CheckboxComponentType = ({
	id,
	name,
	wrapper,
	wrapperProps,
	disableAutofill = true,
	ref,
	...props
}: CheckboxProps) => {
	const inputId = id ?? name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<MantineCheckbox
				ref={ ref }
				id={ inputId }
				name={ name }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}

Checkbox.Group = MantineCheckbox.Group

export { Checkbox }
