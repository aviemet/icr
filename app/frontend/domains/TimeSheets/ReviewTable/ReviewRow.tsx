import { router } from "@inertiajs/react"
import { ActionIcon } from "@mantine/core"
import axios from "axios"
import dayjs from "dayjs"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Group, Table, Text, Tooltip } from "@/components"
import { CalendarIcon, TrashIcon } from "@/components/Icons"
import { Checkbox } from "@/components/Inputs"
import { ServiceTypesDropdown } from "@/components/Inputs/Dropdowns"
import { type IhssToggleDelta } from "@/domains/TimeSheets/ihssToggle"
import { LastEditorAvatar } from "@/domains/TimeSheets/LastEditorAvatar"
import { formatter, Routes } from "@/lib"
import { parseTimeString } from "@/lib/dates"
import { useUpdateCalendarEvent } from "@/queries/calendarEvents/mutations"

import { type ReviewRowFormData } from "./ReviewRowFormFields"
import { ReviewRowTimes } from "./ReviewRowTimes"
import { ReviewStatusCell } from "./ReviewStatusCell"

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
	onDelete: () => void
	deleting: boolean
	employeeSlug: string
	payPeriodId: string
	clientId?: string
	reloadHref: string
	showClientColumn: boolean
	canFacilitatorApprove: boolean
	showIhss: boolean
	canEditIhss: boolean
	canEditShiftType: boolean
	onIhssToggle?: (delta: IhssToggleDelta) => void
}

export function ReviewRow({
	shift,
	shiftExceptionReasons,
	shiftOtHours,
	canEditTimes,
	onDelete,
	deleting,
	employeeSlug,
	payPeriodId,
	clientId,
	reloadHref,
	showClientColumn,
	canFacilitatorApprove,
	showIhss,
	canEditIhss,
	canEditShiftType,
	onIhssToggle,
}: ReviewRowProps) {
	const { t } = useTranslation()

	const startDate = useMemo(() => new Date(String(shift.starts_at)), [shift.starts_at])
	const endDate = useMemo(() => new Date(String(shift.ends_at)), [shift.ends_at])
	const [startTime, setStartTime] = useState(() => dayjs(String(shift.starts_at)).format("HH:mm"))
	const [endTime, setEndTime] = useState(() => dayjs(String(shift.ends_at)).format("HH:mm"))
	const [ihssSaving, setIhssSaving] = useState(false)

	const displayStart = mergedDateTime(startDate, startTime) ?? startDate
	const displayEnd = mergedDateTime(endDate, endTime) ?? endDate
	const hours = shiftRowHours(displayStart, displayEnd)
	const shiftDateParam = formatter.datetime.dateUrl(String(shift.starts_at))
	const weekdayLabel = dayjs(String(shift.starts_at)).format("ddd")

	const reloadReview = useCallback(() => {
		router.get(reloadHref)
	}, [reloadHref])

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
					...(shift.is_recurring && shift.occurrence_starts_at
						? {
							edit_scope: "one" as const,
							occurrence_starts_at: new Date(String(shift.occurrence_starts_at)).toISOString(),
						}
						: {}),
				},
			})
		},
		[startDate, endDate, updateEvent, shift.is_recurring, shift.occurrence_starts_at]
	)

	const onTimesChange = useCallback((start: string, end: string) => {
		setStartTime(start)
		setEndTime(end)
	}, [])

	const onCancelEditTimes = useCallback(() => {
		setStartTime(dayjs(String(shift.starts_at)).format("HH:mm"))
		setEndTime(dayjs(String(shift.ends_at)).format("HH:mm"))
	}, [shift.ends_at, shift.starts_at])

	const toggleIhss = useCallback(async (nextIhss: boolean) => {
		if(nextIhss === shift.ihss || ihssSaving) return

		setIhssSaving(true)
		try {
			const response = await axios.patch<IhssToggleDelta>(
				Routes.ihssShift(shift.shift_id),
				{
					ihss: nextIhss,
					pay_period_id: payPeriodId,
					client_id: clientId,
					occurrence_starts_at: shift.occurrence_starts_at
						? new Date(String(shift.occurrence_starts_at)).toISOString()
						: new Date(String(shift.starts_at)).toISOString(),
				},
			)
			onIhssToggle?.(response.data)
		} finally {
			setIhssSaving(false)
		}
	}, [
		clientId,
		ihssSaving,
		onIhssToggle,
		payPeriodId,
		shift.ihss,
		shift.occurrence_starts_at,
		shift.shift_id,
		shift.starts_at,
	])

	const clientScheduleHref = shift.client_slug
		? Routes.scheduleClient(shift.client_slug, { date: shiftDateParam, view: "month" })
		: null
	const employeeScheduleHref = Routes.scheduleEmployee(employeeSlug, {
		date: shiftDateParam,
		view: "month",
	})
	const clientCalendarLabel = t("views.timesheets.employee_review.client_calendar")
	const employeeCalendarLabel = t("views.timesheets.employee_review.employee_calendar")
	const deleteShiftLabel = t("views.timesheets.employee_review.delete_shift")
	const ihssLabel = t("views.timesheets.employee_review.ihss")

	return (
		<Table.Row key={ shift.id }>
			<Table.Cell>
				<Group gap={ 6 } wrap="nowrap">
					<Text size="sm">{ dayjs(String(shift.starts_at)).format("MMM D") }</Text>
					<Text size="xs" c="dimmed">{ weekdayLabel }</Text>
				</Group>
			</Table.Cell>
			{ showClientColumn && (
				<Table.Cell>
					<Text size="sm">{ shift.client_name ?? t("views.timesheets.index.no_value") }</Text>
				</Table.Cell>
			) }
			<Table.Cell>
				<Group gap={ 8 } wrap="nowrap" align="center">
					<ReviewRowTimes
						canEdit={ canEditTimes }
						startsAt={ displayStart }
						endsAt={ displayEnd }
						initialData={ initialData }
						reloadHref={ reloadHref }
						submitWith={ submitWith }
						onTimesChange={ onTimesChange }
						onCancelEdit={ onCancelEditTimes }
					/>
					{ shift.last_editor && (
						<LastEditorAvatar editor={ shift.last_editor } />
					) }
				</Group>
			</Table.Cell>
			<Table.Cell>
				<Text size="sm">{ formatter.number.decimal(hours, 2) }</Text>
			</Table.Cell>
			<Table.Cell>
				{ canEditShiftType
					? (
						<ServiceTypesDropdown
							label=""
							valueKey="id"
							value={ shift.service_type_id ?? shift.service_type?.id ?? null }
							clearable={ false }
							searchable
							size="xs"
							comboboxProps={ { withinPortal: true } }
							onChange={ (nextValue) => {
								if(!nextValue || nextValue === (shift.service_type_id ?? shift.service_type?.id)) return
								router.patch(Routes.serviceTypeShift(shift.shift_id), {
									service_type_id: nextValue,
									pay_period_id: payPeriodId,
									occurrence_starts_at: shift.occurrence_starts_at
										? new Date(String(shift.occurrence_starts_at)).toISOString()
										: new Date(String(shift.starts_at)).toISOString(),
								})
							} }
						/>
					)
					: (
						<Text size="sm">
							{ shift.service_type?.name ?? t("views.timesheets.index.no_value") }
						</Text>
					) }
			</Table.Cell>
			{ showIhss && (
				<Table.Cell>
					<Checkbox
						aria-label={ ihssLabel }
						checked={ shift.ihss }
						disabled={ !canEditIhss || ihssSaving }
						onChange={ event => {
							void toggleIhss(event.currentTarget.checked)
						} }
					/>
				</Table.Cell>
			) }
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
			{ canFacilitatorApprove && (
				<Table.Cell>
					<ReviewStatusCell shift={ shift } payPeriodId={ payPeriodId } />
				</Table.Cell>
			) }
			<Table.Cell className="actionsCell">
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
