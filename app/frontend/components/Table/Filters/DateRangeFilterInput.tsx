import { ActionIcon, Group, Stack, Text } from "@mantine/core"
import { DatePicker, type DatesRangeValue } from "@mantine/dates"
import { useState } from "react"

import { CrossIcon } from "@/components/Icons"
import { formatter } from "@/lib"

export type DateRangeFilterValue = {
	start: string
	end: string
}

export const emptyDateRangeFilterValue: DateRangeFilterValue = {
	start: "",
	end: "",
}

function toPickerValue(value: DateRangeFilterValue): DatesRangeValue {
	return [
		value.start === "" ? null : value.start,
		value.end === "" ? null : value.end,
	]
}

function toFilterValue(value: DatesRangeValue | null): DateRangeFilterValue {
	if(value === null) {
		return emptyDateRangeFilterValue
	}

	const [startValue, endValue] = value
	return {
		start: startValue ? formatter.datetime.dateUrl(startValue) : "",
		end: endValue ? formatter.datetime.dateUrl(endValue) : "",
	}
}

function rangesEqual(left: DateRangeFilterValue, right: DateRangeFilterValue) {
	return left.start === right.start && left.end === right.end
}

function isCompleteRange(value: DateRangeFilterValue) {
	return value.start !== "" && value.end !== ""
}

function isEmptyRange(value: DateRangeFilterValue) {
	return value.start === "" && value.end === ""
}

function formatRangeLabel(value: DateRangeFilterValue) {
	if(isEmptyRange(value)) {
		return null
	}

	if(isCompleteRange(value)) {
		return `${formatter.datetime.dateShort(value.start)} - ${formatter.datetime.dateShort(value.end)}`
	}

	if(value.start !== "") {
		return `${formatter.datetime.dateShort(value.start)} - ...`
	}

	return null
}

export function DateRangeFilterInput({
	label,
	value,
	onChange,
	close,
}: {
	label?: string
	placeholder?: string
	value: DateRangeFilterValue
	onChange: (value: DateRangeFilterValue) => void
	close?: () => void
}) {
	const [localValue, setLocalValue] = useState<DatesRangeValue>(() => toPickerValue(value))
	const [trackedValue, setTrackedValue] = useState(value)

	if(!rangesEqual(value, trackedValue)) {
		setTrackedValue(value)
		setLocalValue(toPickerValue(value))
	}

	const commit = (nextFilter: DateRangeFilterValue) => {
		onChange(nextFilter)
		close?.()
	}

	const handleChange = (nextValue: DatesRangeValue | null) => {
		const nextLocal = nextValue ?? [null, null]
		setLocalValue(nextLocal)

		const nextFilter = toFilterValue(nextValue)
		if(isCompleteRange(nextFilter) || isEmptyRange(nextFilter)) {
			commit(nextFilter)
		}
	}

	const handleClear = () => {
		setLocalValue([null, null])
		commit(emptyDateRangeFilterValue)
	}

	const rangeLabel = formatRangeLabel(toFilterValue(localValue))

	return (
		<Stack gap="xs">
			{ (label || rangeLabel) && (
				<Group justify="space-between" gap="xs" wrap="nowrap">
					<Text size="sm" fw={ 500 }>
						{ label }
					</Text>
					{ rangeLabel && (
						<Group gap={ 4 } wrap="nowrap">
							<Text size="xs" c="dimmed">
								{ rangeLabel }
							</Text>
							<ActionIcon
								size="sm"
								variant="transparent"
								aria-label="Clear date range"
								onClick={ handleClear }
							>
								<CrossIcon size={ 14 } />
							</ActionIcon>
						</Group>
					) }
				</Group>
			) }
			<DatePicker
				type="range"
				value={ localValue }
				onChange={ handleChange }
				allowSingleDateInRange
				firstDayOfWeek={ 0 }
			/>
		</Stack>
	)
}
