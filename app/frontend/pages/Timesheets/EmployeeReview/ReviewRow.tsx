import { router } from "@inertiajs/react"
import { Checkbox } from "@mantine/core"
import dayjs from "dayjs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button, Group, Table, Text } from "@/components"
import { TimeInput } from "@/components/Inputs"
import { formatter, Routes } from "@/lib"
import { parseTimeString } from "@/lib/dates"
import { useUpdateCalendarEvent } from "@/queries/calendarEvents/mutations"

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
	approvalWindowOpen: boolean
	employeeId: string
}

export function ReviewRow({
	shift,
	shiftExceptionReasons,
	approvalWindowOpen,
	employeeId,
}: ReviewRowProps) {
	const { t } = useTranslation()
	const startDate = new Date(String(shift.starts_at))
	const endDate = new Date(String(shift.ends_at))
	const [startTime, setStartTime] = useState(() => dayjs(startDate).format("HH:mm"))
	const [endTime, setEndTime] = useState(() => dayjs(endDate).format("HH:mm"))

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

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault()
		const startsAt = mergedDateTime(startDate, startTime)
		const endsAt = mergedDateTime(endDate, endTime)
		if(startsAt === null || endsAt === null) return
		updateEvent.mutate({
			calendar_event: {
				starts_at: startsAt.toISOString(),
				ends_at: endsAt.toISOString(),
			},
		})
	}

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
				<form onSubmit={ handleSubmit }>
					<Group gap="xs" wrap="nowrap">
						<TimeInput
							value={ startTime }
							onChange={ setStartTime }
							disabled={ updateEvent.isPending }
							wrapper={ false }
							label=""
						/>
						<TimeInput
							value={ endTime }
							onChange={ setEndTime }
							disabled={ updateEvent.isPending }
							wrapper={ false }
							label=""
						/>
						<Button type="submit" size="xs" loading={ updateEvent.isPending }>
							{ t("views.timesheets.employee_review.save_times") }
						</Button>
					</Group>
				</form>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm">{ formatter.number.decimal(hours, 2) }</Text>
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

