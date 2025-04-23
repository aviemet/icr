import { ColorSwatch, Group, Popover } from "@mantine/core"
import React, { forwardRef } from "react"

import { theme, vars } from "@/lib"

import { ColorPickerComponent } from "../ColorPicker"
import HiddenInput from "./HiddenInput"
import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { type BaseInputProps } from "."

export interface ColorPickerInputProps extends Omit<BaseInputProps, "disableAutofill"> {
	label?: React.ReactNode
	value?: string
	initialValue?: string
	id?: string
	onChange?: (color: string) => void
	onFocus?: () => void
	wrapperProps?: Record<string, any>
	children?: React.ReactNode
}

const ColorPickerInput = forwardRef<HTMLInputElement, ColorPickerInputProps>((
	{
		label,
		id,
		name,
		required,
		onChange,
		onFocus,
		value,
		initialValue,
		wrapper = true,
		wrapperProps,
		children,
		...props
	},
	ref,
) => {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<Group>
				<Popover position="bottom" withArrow>
					<Popover.Target>
						<ColorSwatch
							component="button"
							type="button"
							color={ value || initialValue || theme.primaryColor }
							size={ 36 }
							radius="sm"
							style={ {
								cursor: "pointer",
								border: `1px solid ${ vars.colors.gray[3] }`,
							} }
						/>
					</Popover.Target>
					<Popover.Dropdown>
						<ColorPickerComponent
							value={ value }
							initialValue={ initialValue }
							onChange={ onChange }
							onFocus={ onFocus }
							{ ...props }
						/>
					</Popover.Dropdown>
				</Popover>
				{ children && children }
			</Group>
			<HiddenInput value={ value || "" } id={ inputId } name={ name } ref={ ref } />
		</InputWrapper>
	)
})

export default ColorPickerInput
