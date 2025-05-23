import { DateTimePicker, DateTimePickerProps } from "@mantine/dates"
import { forwardRef } from "react"

import { isUnset } from "@/lib"

import Label from "./Label"
import { CalendarIcon } from "../Icons"
import InputWrapper from "./InputWrapper"

import { type BaseInputProps } from "."

export interface DateTimeProps
	extends
	DateTimePickerProps,
	Omit<BaseInputProps, "disableAutofill"> {
	name?: string
	id?: string
	value?: string
	onChange?: (value: string | null) => void
	error?: string | string[]
}

const DateTime = forwardRef<HTMLButtonElement, DateTimeProps>((
	{
		label,
		id,
		name,
		required,
		value,
		radius = "xs",
		valueFormat = "L LT",
		wrapper,
		wrapperProps,
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
			<DateTimePicker
				ref={ ref }
				id={ inputId }
				name={ name }
				value={ isUnset(value) ? null : value }
				radius={ radius }
				valueFormat={ valueFormat }
				leftSection={ <CalendarIcon /> }
				leftSectionPointerEvents="none"
				timePickerProps={ {
					withDropdown: true,
					popoverProps: { withinPortal: false },
					format: "12h",
				} }
				{ ...props }
			/>
		</InputWrapper>
	)
})

export default DateTime
