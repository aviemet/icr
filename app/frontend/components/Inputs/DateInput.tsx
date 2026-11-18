import {
	DatePickerInput,
	type DatePickerInputProps,
} from "@mantine/dates"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

import { useFormFieldError } from "@/components/Form"
import { CalendarIcon } from "@/components/Icons"
import { isUnset } from "@/lib"
import { isDate } from "@/lib/dates"

import { InputWrapper } from "./InputWrapper"
import { Label } from "./Label"

import { type DateInputValue, type BaseInputProps } from "."

export interface DateInputProps
	extends
	Omit<DatePickerInputProps, "onChange" | "value">,
	Omit<BaseInputProps, "disableAutofill"> {
	ref?: React.Ref<HTMLButtonElement>
	name?: string
	id?: string
	value?: DateInputValue
	error?: string | string[]
	onChange?: (date: DateInputValue) => void
}

function toLocalDateInputValue(value: DateInputValue, valueFormat: string): DateInputValue {
	if(isUnset(value)) return undefined
	if(isDate(value)) return dayjs(value).format(valueFormat)
	if(Array.isArray(value)) {
		return value.map((entry) => {
			if(isDate(entry)) return dayjs(entry).format(valueFormat)
			if(typeof entry === "string") return entry
			return ""
		})
	}
	return value
}

export function DateInput({
	label,
	id,
	name,
	type = "default",
	valueFormat = "L",
	required,
	wrapper,
	wrapperProps,
	value,
	onChange,
	error,
	ref,
	...props
}: DateInputProps) {
	const fieldError = useFormFieldError(name)
	const inputId = id || name

	const [localValue, setLocalValue] = useState<DateInputValue>(() => toLocalDateInputValue(value, valueFormat))
	const [trackedValue, setTrackedValue] = useState(value)
	const [trackedFormat, setTrackedFormat] = useState(valueFormat)
	const [datePickerType, setDatePickerType] = useState(type)

	if(value !== trackedValue || valueFormat !== trackedFormat) {
		setTrackedValue(value)
		setTrackedFormat(valueFormat)
		setLocalValue(toLocalDateInputValue(value, valueFormat))
	}

	const handleChange = (changeValue: DateInputValue | undefined) => {
		setLocalValue(changeValue)
		onChange?.(changeValue)
	}

	useEffect(() => {
		if(datePickerType === type) return

		const nextType = type
		queueMicrotask(() => {
			if(nextType === "range") {
				if(Array.isArray(localValue)) {
					if(localValue.length !== 2) {
						setLocalValue([localValue[0], ""])
					}
				} else if(localValue) {
					setLocalValue([localValue, ""])
				} else {
					setLocalValue(undefined)
				}
			} else {
				setLocalValue(Array.isArray(localValue) ? localValue[0] : undefined)
			}
			setDatePickerType(nextType)
		})
	}, [type, datePickerType, localValue])

	return (
		<InputWrapper wrapper={ wrapper } wrapperProps={ wrapperProps }>
			{ label && <Label required={ required } htmlFor={ inputId }>
				{ label }
			</Label> }
			<DatePickerInput
				ref={ ref }
				id={ inputId }
				name={ name }
				value={ localValue as DatePickerInputProps["value"] }
				type={ datePickerType }
				onChange={ handleChange }
				valueFormat={ valueFormat }
				leftSection={ <CalendarIcon /> }
				leftSectionPointerEvents="none"
				clearable
				error={ error ?? fieldError }
				{ ...props }
			/>
		</InputWrapper>
	)
}
