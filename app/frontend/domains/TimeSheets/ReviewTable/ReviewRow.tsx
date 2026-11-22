import { router } from "@inertiajs/react"
import { ActionIcon, Checkbox } from "@mantine/core"
import dayjs from "dayjs"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Group, Table, Text, Tooltip } from "@/components"
import { Form } from "@/components/Form"
import { CalendarIcon, TrashIcon } from "@/components/Icons"
import { LastEditorAvatar } from "@/domains/TimeSheets/LastEditorAvatar"
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
	canEditTimes: boolean
	selected: boolean
	onSelectedChange: (selected: boolean) => void
	onDelete: () => void
	deleting: boolean
	employeeId: string
	employeeSlug: string
	payPeriodId: string
}

export function ReviewRow({
	shift,
	shiftExceptionReasons,
	shiftOtHours,
	canEditTimes,
	selected,
	onSelectedChange,
	onDelete,
	deleting,
	employeeId,
	employeeSlug,
	payPeriodId,
}: ReviewRowProps) {
	const { t } = useTranslation()

	const startDate = useMemo(() => new Date(String(shift.starts_at)), [shift.starts_at])
	const endDate = useMemo(() => new Date(String(shift.ends_at)), [shift.ends_at])
	const [startTime, setStartTime] = useState(() => dayjs(String(shift.starts_at)).format("HH:mm"))
	const [endTime, setEndTime] = useState(() => dayjs(String(shift.ends_at)).format("HH:mm"))

	const displayStart = mergedDateTime(startDate, startTime) ?? startDate
	const displayEnd = mergedDateTime(endDate, endTime) ?? endDate
	const hours = shiftRowHours(displayStart, displayEnd)
	const shiftDateParam = formatter.datetime.dateUrl(String(shift.starts_at))
	const weekdayLabel = dayjs(String(shift.starts_at)).format("ddd")

	const reloadReview = useCallback(() => {
		router.get(Routes.periodEmployeeReview(payPeriodId, employeeId))
	}, [payPeriodId, employeeId])

	const updateEvent = useUpdateCalendarEvent({
		params: { id: shift.calendar_event_id },
		onSuccess: reloadReview,
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

	const clientScheduleHref = shift.client_slug
		? Routes.scheduleClient(shift.client_slug, { date: shiftDateParam, view: "week" })
		: null
	const employeeScheduleHref = Routes.scheduleEmployee(employeeSlug, {
		date: shiftDateParam,
		view: "week",
	})
	const clientCalendarLabel = t("views.timesheets.employee_review.client_calendar")
	const employeeCalendarLabel = t("views.timesheets.employee_review.employee_calendar")
	const deleteShiftLabel = t("views.timesheets.employee_review.delete_shift")

	return (
		<Table.Row key={ shift.id }>
			{ canEditTimes && (
				<Table.Cell>
					<Checkbox
						size="sm"
						checked={ selected }
						aria-label={ t("views.timesheets.employee_review.select_shift") }
						onChange={ (event) => onSelectedChange(event.currentTarget.checked) }
					/>
				</Table.Cell>
			) }
			<Table.Cell>
				<Group gap={ 6 } wrap="nowrap">
					<Text size="sm">{ dayjs(String(shift.starts_at)).format("MMM D") }</Text>
					<Text size="xs" c="dimmed">{ weekdayLabel }</Text>
				</Group>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm">{ shift.client_name ?? t("views.timesheets.index.no_value") }</Text>
			</Table.Cell>
			<Table.Cell>
				<Group gap={ 8 } wrap="nowrap" align="center">
					{ canEditTimes
						? (
							<Form
								method="post"
								action={ Routes.periodEmployeeReview(payPeriodId, employeeId) }
								initialData={ initialData }
								submitWith={ submitWith }
								onBefore={ () => true }
								railsAttributes={ false }
							>
								<ReviewRowFormFields initialData={ initialData } onTimesChange={ onTimesChange } />
							</Form>
						)
						: (
							<Text size="sm">
								{ dayjs(String(shift.starts_at)).format("HH:mm") }
								{ " - " }
								{ dayjs(String(shift.ends_at)).format("HH:mm") }
							</Text>
						) }
					{ shift.last_editor && (
						<LastEditorAvatar editor={ shift.last_editor } />
					) }
				</Group>
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
			<Table.Cell>
				<Group gap={ 4 } wrap="nowrap">
					{ clientScheduleHref && (
						<Tooltip label={ clientCalendarLabel } withArrow>
							<ActionIcon
								component="a"
								href={ clientScheduleHref }
								color="teal"
								variant="light"
								size="sm"
								aria-label={ clientCalendarLabel }
								onClick={ (event) => {
									event.preventDefault()
									router.visit(clientScheduleHref)
								} }
							>
								<CalendarIcon size={ 14 } />
							</ActionIcon>
						</Tooltip>
					) }
					<Tooltip label={ employeeCalendarLabel } withArrow>
						<ActionIcon
							component="a"
							href={ employeeScheduleHref }
							color="indigo"
							variant="light"
							size="sm"
							aria-label={ employeeCalendarLabel }
							onClick={ (event) => {
								event.preventDefault()
								router.visit(employeeScheduleHref)
							} }
						>
							<CalendarIcon size={ 14 } />
						</ActionIcon>
					</Tooltip>
					{ canEditTimes && (
						<Tooltip label={ deleteShiftLabel } withArrow>
							<ActionIcon
								color="red"
								variant="light"
								size="sm"
								aria-label={ deleteShiftLabel }
								loading={ deleting }
								disabled={ deleting }
								onClick={ onDelete }
							>
								<TrashIcon size={ 14 } />
							</ActionIcon>
						</Tooltip>
					) }
				</Group>
			</Table.Cell>
		</Table.Row>
	)
}
