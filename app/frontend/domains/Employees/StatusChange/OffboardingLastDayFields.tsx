import dayjs from "dayjs"
import { useState } from "react"

import { Grid, Text } from "@/components"
import { DateInput, TimeInput } from "@/components/Inputs"
import { HiddenInput } from "@/components/Inputs/HiddenInput"
import { formatter } from "@/lib"

import {
	isOffboardingEffectiveFuture,
	resolveOffboardingEffectiveAt,
} from "./offboardingSchedule"

export function useOffboardingLastDayState() {
	const [date, setDate] = useState(() => dayjs().format("YYYY-MM-DD"))
	const [time, setTime] = useState("")

	return {
		date,
		time,
		setDate,
		setTime,
		effectiveAt: resolveOffboardingEffectiveAt(date, time),
		isFuture: isOffboardingEffectiveFuture(date, time),
	}
}

export interface OffboardingLastDayFieldsProps {
	date: string
	time: string
	onDateChange: (date: string) => void
	onTimeChange: (time: string) => void
}

export function OffboardingLastDayFields({
	date,
	time,
	onDateChange,
	onTimeChange,
}: OffboardingLastDayFieldsProps) {
	return (
		<>
			<HiddenInput name="employee.inactive_at" value={ date } />
			<HiddenInput name="employee.inactive_at_time" value={ time } />

			<Grid.Col span={ { xxs: 12, xs: 4 } }>
				<DateInput
					label="Last Day"
					required
					value={ date }
					valueFormat="YYYY-MM-DD"
					onChange={ (value) => {
						if(typeof value === "string") {
							onDateChange(value)
							return
						}
						if(value instanceof Date) {
							onDateChange(dayjs(value).format("YYYY-MM-DD"))
							return
						}
						onDateChange("")
					} }
				/>
			</Grid.Col>

			<Grid.Col span={ { xxs: 12, xs: 4 } }>
				<TimeInput
					label="Time"
					value={ time }
					onChange={ (value) => {
						onTimeChange(typeof value === "string" ? value : "")
					} }
					clearable
				/>
			</Grid.Col>
		</>
	)
}

export function OffboardingScheduleNotice({
	label,
	date,
	time,
}: {
	label: string
	date: string
	time: string
}) {
	const effectiveAt = resolveOffboardingEffectiveAt(date, time)
	if(effectiveAt === null || !isOffboardingEffectiveFuture(date, time)) return null

	return (
		<Text size="sm" c="dimmed">
			{ `${label} ${formatter.datetime.dateTimeLong(effectiveAt)}.` }
		</Text>
	)
}
