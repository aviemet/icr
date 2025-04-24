import {
	SegmentedControl,
	useMantineTheme,
	type SegmentedControlProps as MantineSegmentedControlProps,
	type SegmentedControlItem,
} from "@mantine/core"
import React, { forwardRef } from "react"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { type BaseInputProps } from "."


export interface SegmentedControlProps
	extends
	Omit<MantineSegmentedControlProps, "data">,
	Omit<BaseInputProps, "disableAutofill"> {
	label?: string
	labelPosition?: "start" | "end"
	name: string
	options: SegmentedControlItem[]
	id?: string
	required?: boolean
}

const SegmentedControlComponent = forwardRef<HTMLDivElement, SegmentedControlProps>((
	{
		label,
		labelPosition = "start",
		options,
		name,
		id,
		value,
		required,
		onChange,
		wrapper,
		...props
	},
	ref,
) => {
	const theme = useMantineTheme()

	const LabelComponent = () => <Label required={ required } htmlFor={ id }>{ label }</Label>

	return (
		<InputWrapper wrapper={ wrapper }>
			{ label && labelPosition === "start" && <LabelComponent /> }
			<SegmentedControl
				ref={ ref }
				value={ value }
				onChange={ (choice: string) => {
					onChange?.(choice)
				} }
				data={ options }
				color={ theme.primaryColor }
				{ ...props }
			/>
			{ label && labelPosition === "end" && <LabelComponent /> }
		</InputWrapper>
	)
})

export default SegmentedControlComponent
