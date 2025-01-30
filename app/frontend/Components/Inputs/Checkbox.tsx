import React, { forwardRef } from "react"
import { Checkbox, type CheckboxProps as MantineCheckboxProps } from "@mantine/core"
import { withInjectedProps, type BaseInputProps } from "."
import InputWrapper from "./InputWrapper"

export interface CheckboxProps extends MantineCheckboxProps, BaseInputProps {}

type CheckboxComponentType = React.ForwardRefExoticComponent<
CheckboxProps & React.RefAttributes<HTMLInputElement>
> & {
	Group: typeof Checkbox.Group
};

const CheckboxComponent: CheckboxComponentType = forwardRef<HTMLInputElement, CheckboxProps>((
	{
		id,
		name,
		wrapper,
		wrapperProps,
		disableAutofill = true,
		...props
	},
	ref,
) => {
	const inputId = id ?? name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			<Checkbox
				ref={ ref }
				id={ inputId }
				name={ name }
				{ ...withInjectedProps(props, {
					disableAutofill,
				}) }
			/>
		</InputWrapper>
	)
}) as CheckboxComponentType

CheckboxComponent.Group = Checkbox.Group

export default CheckboxComponent
