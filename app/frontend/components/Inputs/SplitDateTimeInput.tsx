import dayjs from "dayjs"
import React, { useCallback, useMemo } from "react"

import { DateInput, TimeInput } from "@/components/Inputs"
import { parseTimeString } from "@/lib/dates"

import { useFormField } from "../Form/formFieldUtils"

function parseValue(value: unknown): Date | undefined {
	if(value === null || value === undefined || value === "") return undefined
	if(value instanceof Date) return value
	if(typeof value === "string" && dayjs(value).isValid()) return dayjs(value).toDate()
	return undefined
}

export interface SplitDateTimeInputDateProps {
	label: string
	wrapper?: boolean
}

export interface SplitDateTimeInputTimeProps {
	label: string
	wrapper?: boolean
}

function SplitDateTimeInputDate({ label, wrapper = false }: SplitDateTimeInputDateProps) {
	const context = useSplitDateTimeContext()
	return (
		<DateInput
			label={ label }
			id={ context.inputId }
			value={ context.dateValue }
			onChange={ context.onDateChange }
			wrapper={ wrapper }
			clearable={ false }
			popoverProps={ { withinPortal: false } }
		/>
	)
}

function SplitDateTimeInputTime({ label, wrapper = false }: SplitDateTimeInputTimeProps) {
	const context = useSplitDateTimeContext()
	return (
		<TimeInput
			label={ label }
			id={ `${context.inputId}-time` }
			value={ context.timeValue }
			onChange={ context.onTimeChange }
			wrapper={ wrapper }
		/>
	)
}

type SplitDateTimeContextValue = {
	inputId: string
	dateValue: Date | undefined
	timeValue: string
	onDateChange: (newDate: Parameters<typeof DateInput>[0]["value"]) => void
	onTimeChange: (timeString: string) => void
}

const SplitDateTimeContext = React.createContext<SplitDateTimeContextValue | null>(null)

function useSplitDateTimeContext() {
	const ctx = React.useContext(SplitDateTimeContext)
	if(!ctx) throw new Error("SplitDateTimeInput.Date/Time must be used inside SplitDateTimeInput")
	return ctx
}

export interface SplitDateTimeInputRootProps {
	name: string
	children: React.ReactNode
}

export function SplitDateTimeInputRoot({ name, children }: SplitDateTimeInputRootProps) {
	const [value, setValue] = useFormField(name)
	const dateValue = useMemo(() => parseValue(value), [value])
	const timeValue = dateValue ? dayjs(dateValue).format("HH:mm") : ""
	const inputId = name.replace(/\./g, "-")

	const onDateChange = useCallback(
		(newDate: Parameters<typeof DateInput>[0]["value"]) => {
			let selected: Date | null = null
			if(newDate !== null && newDate !== undefined && !Array.isArray(newDate)) {
				if(newDate instanceof Date) selected = newDate
				else if(typeof newDate === "string" && dayjs(newDate).isValid()) selected = dayjs(newDate).toDate()
			}
			if(selected === null) {
				setValue("")
				return
			}
			const keepTime = dateValue ? dayjs(dateValue) : null
			const merged = keepTime
				? dayjs(selected).hour(keepTime.hour()).minute(keepTime.minute()).second(0).millisecond(0)
				: dayjs(selected)
			setValue(merged.toISOString())
		},
		[dateValue, setValue]
	)

	const onTimeChange = useCallback(
		(timeString: string) => {
			const parsed = parseTimeString(timeString)
			if(parsed === null) return
			const base = dateValue ? dayjs(dateValue) : dayjs().startOf("day")
			const merged = base.hour(parsed.hour).minute(parsed.minute).second(0).millisecond(0)
			setValue(merged.toISOString())
		},
		[dateValue, setValue]
	)

	const contextValue: SplitDateTimeContextValue = useMemo(
		() => ({
			inputId,
			dateValue: dateValue ?? undefined,
			timeValue,
			onDateChange,
			onTimeChange,
		}),
		[inputId, dateValue, timeValue, onDateChange, onTimeChange]
	)

	return (
		<SplitDateTimeContext.Provider value={ contextValue }>
			<input type="hidden" name={ name } value={ typeof value === "string" ? value : "" } />
			{ children }
		</SplitDateTimeContext.Provider>
	)
}

export const SplitDateTimeInput = Object.assign(SplitDateTimeInputRoot, {
	Date: SplitDateTimeInputDate,
	Time: SplitDateTimeInputTime,
})
