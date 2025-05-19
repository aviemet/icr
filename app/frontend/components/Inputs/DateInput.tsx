import {
	DatePickerInput,
	type DatePickerInputProps,
	type DatesRangeValue,
} from "@mantine/dates"
import dayjs from "dayjs"
import { useEffect, useState, forwardRef } from "react"

import { CalendarIcon } from "@/components/Icons"
import { isUnset } from "@/lib"
import { isDate } from "@/lib/dates"

import InputWrapper from "./InputWrapper"
import Label from "./Label"

import { type DateInputValue, type BaseInputProps } from "."

export interface DateInputProps
	extends
	Omit<DatePickerInputProps, "onChange" | "value">,
	Omit<BaseInputProps, "disableAutofill"> {
	name?: string
	id?: string
	value: DateInputValue
	error?: string | string[]
	onChange?: (date: DateInputValue) => void
}

const DateInputComponent = forwardRef<HTMLButtonElement, DateInputProps>((
	{
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
		...props
	},
	ref,
) => {
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

		if(type === "range") {
			if(Array.isArray(localValue)) {
				if(localValue.length !== 2) {
					setLocalValue([localValue[0], ""] as DatesRangeValue)
				}
			} else if(localValue) {
				setLocalValue([localValue, ""] as DatesRangeValue)
			} else {
				setLocalValue(undefined)
			}
		} else {
			setLocalValue(Array.isArray(localValue) ? localValue[0] : undefined)
		}

		setDatePickerType(type)
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
				value={ localValue }
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
})

export default DateInputComponent

