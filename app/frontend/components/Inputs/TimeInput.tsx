import { TimePicker, type TimePickerProps as MantineTimePickerProps } from "@mantine/dates"
import { forwardRef } from "react"

import { ClockIcon } from "@/components/Icons"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { type BaseInputProps } from "."

export interface TimeInputProps
	extends
	Omit<BaseInputProps, "disableAutofill">,
	MantineTimePickerProps {
	name?: string
	id?: string
}

const TimeInput = forwardRef<HTMLDivElement, TimeInputProps>((
	{
		label,
		id,
		name,
		wrapper,
		wrapperProps,
		format = "12h",
		required = false,
		value,
		withDropdown = true,
		popoverProps,
		...props
	},
	ref
) => {
	const inputId = id || name

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<TimePicker
				ref={ ref }
				name={ name }
				value={ value }
				withDropdown={ withDropdown }
				format={ format }
				leftSection={ <ClockIcon /> }
				leftSectionPointerEvents="none"
				hiddenInputProps={ { id: inputId, required } }
				popoverProps={ { withinPortal: false, ...popoverProps } }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default TimeInput
