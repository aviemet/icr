import { router } from "@inertiajs/react"
import { Checkbox } from "@mantine/core"
import dayjs from "dayjs"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Group, Table, Text } from "@/components"
import { Form } from "@/components/Form"
import { formatter, Routes } from "@/lib"
import { parseTimeString } from "@/lib/dates"
import { useUpdateCalendarEvent } from "@/queries/calendarEvents/mutations"

import { ReviewRowFormFields, type ReviewRowFormData } from "./ReviewRowFormFields"

function shiftRowHours(startDate: Date, endDate: Date): number {
	return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
}

function mergedDateTime(baseDate: Date, timeString: string): Date | null {
	const parsed = parseTimeString(timeString)

	if(parsed === null) return null

	const base = dayjs(baseDate)

	return base.hour(parsed.hour).minute(parsed.minute).second(0).millisecond(0).toDate()
}

interface ReviewRowProps {
	shift: Schema.ShiftsReview
	shiftExceptionReasons: Record<string, string[]>
	shiftOtHours: Record<string, number>
	approvalWindowOpen: boolean
	employeeId: string
}

export function ReviewRow({
	shift,
	shiftExceptionReasons,
	shiftOtHours,
	approvalWindowOpen,
	employeeId,
}: ReviewRowProps) {
	const { t } = useTranslation()

	const startDate = useMemo(() => new Date(String(shift.starts_at)), [shift.starts_at])
	const endDate = useMemo(() => new Date(String(shift.ends_at)), [shift.ends_at])
	const [startTime, setStartTime] = useState(() => dayjs(String(shift.starts_at)).format("HH:mm"))
	const [endTime, setEndTime] = useState(() => dayjs(String(shift.ends_at)).format("HH:mm"))

	const displayStart = mergedDateTime(startDate, startTime) ?? startDate
	const displayEnd = mergedDateTime(endDate, endTime) ?? endDate
	const hours = shiftRowHours(displayStart, displayEnd)

	const dateWithWeekday = formatter.datetime.dateWithWeekday(String(shift.starts_at))
	const [datePart, weekday] = dateWithWeekday.split(" - ")

	const updateEvent = useUpdateCalendarEvent({
		params: { id: shift.calendar_event_id },
		onSuccess: () => {
			router.get(Routes.payrollEmployeeReview(employeeId))
		},
	})

	const initialData = useMemo<ReviewRowFormData>(
		() => ({
			start_time: dayjs(startDate).format("HH:mm"),
			end_time: dayjs(endDate).format("HH:mm"),
		}),
		[startDate, endDate]
	)

	const submitWith = useCallback(
		(data: ReviewRowFormData) => {
			const startsAt = mergedDateTime(startDate, data.start_time)
			const endsAt = mergedDateTime(endDate, data.end_time)
			if(startsAt === null || endsAt === null) return Promise.reject(new Error("Invalid times"))
			return updateEvent.mutateAsync({
				calendar_event: {
					starts_at: startsAt.toISOString(),
					ends_at: endsAt.toISOString(),
				},
			})
		},
		[startDate, endDate, updateEvent]
	)

	const onTimesChange = useCallback((start: string, end: string) => {
		setStartTime(start)
		setEndTime(end)
	}, [])

	return (
		<Table.Row key={ shift.id }>
			<Table.Cell>
				<Checkbox size="sm" />
			</Table.Cell>
			<Table.Cell>
				<Group gap={ 4 }>
					<Text size="sm">{ datePart }</Text>
					<Text size="sm" c="blue" style={ { textDecoration: "underline" } }>
						{ weekday }
					</Text>
				</Group>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm">{ shift.client_name ?? t("views.timesheets.index.no_value") }</Text>
			</Table.Cell>
			<Table.Cell>
				<Form
					method="post"
					action={ Routes.payrollEmployeeReview(employeeId) }
					initialData={ initialData }
					submitWith={ submitWith }
					onBefore={ () => true }
					railsAttributes={ false }
				>
					<ReviewRowFormFields initialData={ initialData } onTimesChange={ onTimesChange } />
				</Form>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm">{ formatter.number.decimal(hours, 2) }</Text>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm">{ formatter.number.decimal(shiftOtHours[shift.id] ?? 0, 2) }</Text>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm" c="dimmed">
					{ (shiftExceptionReasons[shift.id]?.length ?? 0) > 0
						? shiftExceptionReasons[shift.id].join("; ")
						: t("views.timesheets.index.no_value") }
				</Text>
			</Table.Cell>
		</Table.Row>
	)
}

