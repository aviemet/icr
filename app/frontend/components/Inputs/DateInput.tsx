import {
	DatePickerInput,
	type DatePickerInputProps,
} from "@mantine/dates"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"

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
	value: DateInputValue
	error?: string | string[]
	onChange?: (date: DateInputValue) => void
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
	ref,
	...props
}: DateInputProps) {
	const inputId = id || name

	const [localValue, setLocalValue] = useState<DateInputValue>(() => {
		if(isUnset(value)) return undefined
		if(isDate(value)) return dayjs(value).format(valueFormat)
		if(Array.isArray(value)) {
			const formattedValues = (value as Array<unknown>).map((v) => {
				if(isDate(v)) return dayjs(v).format(valueFormat)
				if(typeof v === "string") return v
				return ""
			})

			return formattedValues as string[]
		}
		return value
	})
	const [datePickerType, setDatePickerType] = useState(type)

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
				{ ...props }
			/>
		</InputWrapper>
	)
}

