import { DateTimePicker, DateTimePickerProps } from "@mantine/dates"
import dayjs from "dayjs"
import React from "react"

import { isUnset } from "@/lib"

import Label from "./Label"
import { CalendarIcon } from "../Icons"
import InputWrapper from "./InputWrapper"

import { type BaseInputProps } from "."

export interface DateTimeProps
	extends
	DateTimePickerProps,
	Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLButtonElement>
	name?: string
	id?: string
	value?: string | Date
	onChange?: (value: string | null) => void
	error?: string | string[]
}

const DateTime = ({
	label,
	id,
	name,
	required,
	value,
	radius = "xs",
	valueFormat = "L LT",
	wrapper,
	wrapperProps,
	ref,
	...props
}: DateTimeProps) => {
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
				value={ isUnset(value) ? null : dayjs(value).toISOString() }
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
}

export default DateTime
