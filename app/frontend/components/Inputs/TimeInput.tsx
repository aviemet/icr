import {
	TimePicker,
	type TimePickerProps as MantineTimePickerProps,
} from "@mantine/dates"
import dayjs from "dayjs"
import React from "react"

import { ClockIcon } from "@/components/Icons"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type BaseInputProps } from "."

function normalizeTimeValue(value: unknown): string | undefined {
	if(value === null || value === undefined) return undefined
	if(typeof value === "string") return dayjs(value).isValid() ? dayjs(value).format("HH:mm") : value
	if(typeof value === "object" && value instanceof Date) return dayjs(value).format("HH:mm")
	return undefined
}

export interface TimeInputProps
	extends
	Omit<BaseInputProps, "disableAutofill">,
	MantineTimePickerProps {
	ref?: React.Ref<HTMLDivElement>
	name?: string
	id?: string
}

export function TimeInput({
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
	ref,
	...props
}: TimeInputProps) {
	const inputId = id || name
	const pickerValue = normalizeTimeValue(value)

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<TimePicker
				ref={ ref }
				name={ name }
				value={ pickerValue }
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
}
