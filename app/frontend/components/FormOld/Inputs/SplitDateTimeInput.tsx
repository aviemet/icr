import dayjs from "dayjs"
import { type NestedObject, useInertiaInput } from "use-inertia-form"

import { DateInput, TimeInput, type DateInputValue } from "@/components/Inputs"
import { type DateTimeProps } from "@/components/Inputs/DateTimeInput"
import { createContext } from "@/lib/hooks"

import { type BaseFormInputProps, type InputConflicts } from "."

interface SplitDateTimeInputContextValue {
	inputId: string
	dateValue: Date | undefined
	timeValue: string
	error: string | string[] | undefined
	onDateChange: (newDate: DateInputValue) => void
	onTimeChange: (timeString: string) => void
}

const [useSplitDateTimeContext, SplitDateTimeInputProvider] = createContext<SplitDateTimeInputContextValue>()

export interface SplitDateTimeInputRootProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<DateTimeProps, InputConflicts>,
	BaseFormInputProps<Date | "", TForm> {
	children: React.ReactNode
}

function parseValue(value: Date | string | "" | undefined): Date | undefined {
	if(value === null || value === undefined || value === "") return undefined
	if(value instanceof Date) return value
	if(typeof value === "string" && dayjs(value).isValid()) return dayjs(value).toDate()
	return undefined
}

export function parseTimeString(timeString: string): { hour: number, minute: number } | null {
	const trimmed = timeString.trim()
	if(!trimmed) return null
	const upper = trimmed.toUpperCase()
	const isPm = upper.includes("PM") && !trimmed.toUpperCase().startsWith("AM")
	const isAm = upper.includes("AM")
	const digitsOnly = trimmed.replace(/[^\d:]/g, "")
	const parts = digitsOnly.split(":")
	const hour12 = parseInt(parts[0], 10)
	const minute = Math.min(59, Math.max(0, parseInt(parts[1] ?? "0", 10)))
	if(Number.isNaN(hour12)) return null
	let hour = hour12
	if(isPm && hour12 < 12) hour = hour12 + 12
	else if(isAm && hour12 === 12) hour = 0
	else if(!isPm && !isAm) hour = hour12
	hour = Math.min(23, Math.max(0, hour))
	return { hour, minute }
}

function SplitDateTimeInputRoot<TForm extends NestedObject = NestedObject>({
	children,
	name,
	required,
	onChange,
	onBlur,
	onFocus,
	id,
	model,
	field = true,
	wrapperProps,
	errorKey,
	defaultValue,
	clearErrorsOnChange,
	...props
}: SplitDateTimeInputRootProps<TForm>) {
	const { inputId, value, setValue, error } = useInertiaInput<Date | string | "", TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const dateValue = parseValue(value)
	const timeValue = dateValue ? dayjs(dateValue).format("HH:mm") : ""

	const onDateChange = (newDate: DateInputValue) => {
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
	}

	const onTimeChange = (timeString: string) => {
		const parsed = parseTimeString(timeString)
		if(parsed === null) return
		const base = dateValue ? dayjs(dateValue) : dayjs().startOf("day")
		const merged = base.hour(parsed.hour).minute(parsed.minute).second(0).millisecond(0)
		setValue(merged.toISOString())
	}

	return (
		<SplitDateTimeInputProvider
			value={ {
				inputId,
				dateValue,
				timeValue,
				error,
				onDateChange,
				onTimeChange,
			} }
		>
			{ children }
		</SplitDateTimeInputProvider>
	)
}

export interface SplitDateTimeInputDateProps {
	label: string
	wrapper?: boolean
}

function SplitDateTimeInputDate({ label, wrapper = false }: SplitDateTimeInputDateProps) {
	const { inputId, dateValue, error, onDateChange } = useSplitDateTimeContext()
	return (
		<DateInput
			label={ label }
			id={ inputId }
			value={ dateValue }
			onChange={ onDateChange }
			error={ error }
			wrapper={ wrapper }
			clearable={ false }
			popoverProps={ { withinPortal: false } }
		/>
	)
}

export interface SplitDateTimeInputTimeProps {
	label: string
	wrapper?: boolean
}

function SplitDateTimeInputTime({ label, wrapper = false }: SplitDateTimeInputTimeProps) {
	const { inputId, timeValue, onTimeChange } = useSplitDateTimeContext()
	return (
		<TimeInput
			label={ label }
			id={ `${inputId}-time` }
			value={ timeValue }
			onChange={ onTimeChange }
			wrapper={ wrapper }
		/>
	)
}

export const SplitDateTimeInput = Object.assign(SplitDateTimeInputRoot, {
	Date: SplitDateTimeInputDate,
	Time: SplitDateTimeInputTime,
})
