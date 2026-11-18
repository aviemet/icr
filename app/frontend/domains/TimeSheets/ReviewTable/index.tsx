import { router } from "@inertiajs/react"
import { Checkbox, LoadingOverlay } from "@mantine/core"
import { useModals } from "@mantine/modals"
import axios from "axios"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { Box, Button, Group, Menu, Table, type TableProps, Text } from "@/components"
import { formatter, Routes, assertStatus, HTTP_STATUS } from "@/lib"

import { confirmBusyAction } from "./confirmBusyAction"
import { ReviewRow } from "./ReviewRow"
import { nextSelectedShiftIds, selectedShiftIdsForToggleAll } from "./shiftSelection"

interface ReviewTableProps extends TableProps {
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons?: Record<string, string[]>
	shiftOtHours?: Record<string, number>
	regularHours: number
	otHours: number
	canEditTimes: boolean
	employeeId: string
	employeeSlug: string
	payPeriodId: string
}

export function ReviewTable({
	shifts,
	shiftExceptionReasons = {},
	shiftOtHours = {},
	regularHours,
	otHours,
	canEditTimes,
	employeeId,
	employeeSlug,
	payPeriodId,
	...props
}: ReviewTableProps) {
	const { t } = useTranslation()
	const modals = useModals()
	const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([])
	const [busy, setBusy] = useState(false)

	const shiftIds = useMemo(() => shifts.map(shift => shift.id), [shifts])
	const selectedShifts = useMemo(
		() => shifts.filter(shift => selectedShiftIds.includes(shift.id)),
		[shifts, selectedShiftIds],
	)
	const selectedCount = selectedShiftIds.length
	const allSelected = shiftIds.length > 0 && selectedCount === shiftIds.length
	const someSelected = selectedCount > 0 && selectedCount < shiftIds.length

	const earliestSelectedShift = useMemo(() => {
		if(selectedShifts.length === 0) return null

		return selectedShifts.reduce((earliest, shift) => {
			return new Date(String(shift.starts_at)) < new Date(String(earliest.starts_at))
				? shift
				: earliest
		})
	}, [selectedShifts])

	const sharedClientSlug = useMemo(() => {
		const slugs = [...new Set(selectedShifts.map(shift => shift.client_slug).filter(Boolean))]
		return slugs.length === 1 ? slugs[0] : null
	}, [selectedShifts])

	const reloadReview = () => {
		router.get(Routes.periodEmployeeReview(payPeriodId, employeeId))
	}

	const toggleShift = (shiftId: string, selected: boolean) => {
		setSelectedShiftIds(current => nextSelectedShiftIds(current, shiftId, selected))
	}

	const toggleAll = (selected: boolean) => {
		setSelectedShiftIds(selectedShiftIdsForToggleAll(shiftIds, selected))
	}

	const clearSelection = () => {
		setSelectedShiftIds([])
	}

	const deleteShiftsByCalendarEventIds = async (calendarEventIds: string[]) => {
		setBusy(true)
		try {
			await Promise.all(calendarEventIds.map(async (calendarEventId) => {
				const response = await axios.delete(Routes.apiCalendarEvent(calendarEventId))
				assertStatus(response, HTTP_STATUS.NO_CONTENT)
			}))
			setSelectedShiftIds([])
			reloadReview()
		} catch (error) {
			setBusy(false)
			throw error
		}
	}

	const handleDeleteSelected = () => {
		confirmBusyAction({
			modals,
			title: t("views.timesheets.employee_review.delete_selected"),
			children: (
				<Text size="sm">
					{ t("views.timesheets.employee_review.delete_selected_confirm", { count: selectedCount }) }
				</Text>
			),
			confirmLabel: t("views.timesheets.employee_review.delete_shift_confirm_button"),
			cancelLabel: t("views.timesheets.employee_review.delete_shift_cancel"),
			run: () => deleteShiftsByCalendarEventIds(
				selectedShifts.map(shift => shift.calendar_event_id),
			),
		})
	}

	const handleDeleteShift = (shift: Schema.ShiftsReview) => {
		confirmBusyAction({
			modals,
			title: t("views.timesheets.employee_review.delete_shift"),
			children: (
				<Text size="sm">
					{ t("views.timesheets.employee_review.delete_shift_confirm") }
				</Text>
			),
			confirmLabel: t("views.timesheets.employee_review.delete_shift_confirm_button"),
			cancelLabel: t("views.timesheets.employee_review.delete_shift_cancel"),
			run: () => deleteShiftsByCalendarEventIds([shift.calendar_event_id]),
		})
	}

	const openEmployeeCalendar = () => {
		if(!earliestSelectedShift) return

		router.visit(Routes.scheduleEmployee(employeeSlug, {
			date: formatter.datetime.dateUrl(String(earliestSelectedShift.starts_at)),
			view: "week",
		}))
	}

	const openClientCalendar = () => {
		if(!sharedClientSlug || !earliestSelectedShift) return

		router.visit(Routes.scheduleClient(sharedClientSlug, {
			date: formatter.datetime.dateUrl(String(earliestSelectedShift.starts_at)),
			view: "week",
		}))
	}

	return (
		<Box style={ { position: "relative" } }>
			<LoadingOverlay visible={ busy } overlayProps={ { blur: 1 } } />

			{ canEditTimes && selectedCount > 0 && (
				<Group justify="space-between" mb="sm" wrap="wrap">
					<Text size="sm" c="dimmed">
						{ t("views.timesheets.employee_review.selected_count", { count: selectedCount }) }
					</Text>
					<Group gap="xs" wrap="wrap">
						<Menu withinPortal position="bottom-end">
							<Menu.Target>
								<Button variant="default" size="sm">
									{ t("views.timesheets.employee_review.bulk_actions") }
								</Button>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item onClick={ openEmployeeCalendar }>
									{ t("views.timesheets.employee_review.open_employee_calendar") }
								</Menu.Item>
								{ sharedClientSlug && (
									<Menu.Item onClick={ openClientCalendar }>
										{ t("views.timesheets.employee_review.open_client_calendar") }
									</Menu.Item>
								) }
								<Menu.Divider />
								<Menu.Item color="red" onClick={ handleDeleteSelected }>
									{ t("views.timesheets.employee_review.delete_selected") }
								</Menu.Item>
								<Menu.Item onClick={ clearSelection }>
									{ t("views.timesheets.employee_review.clear_selection") }
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
						<Button
							color="red"
							variant="light"
							size="sm"
							disabled={ busy }
							onClick={ handleDeleteSelected }
						>
							{ t("views.timesheets.employee_review.delete_selected") }
						</Button>
					</Group>
				</Group>
			) }

			<Table.TableProvider>
				<Table { ...props }>
					<Table.Head>
						<Table.Row>
							{ canEditTimes && (
								<Table.HeadCell style={ { width: 40 } }>
									<Checkbox
										size="sm"
										checked={ allSelected }
										indeterminate={ someSelected }
										aria-label={ t("views.timesheets.employee_review.select_all") }
										onChange={ (event) => toggleAll(event.currentTarget.checked) }
									/>
								</Table.HeadCell>
							) }
							<Table.HeadCell>{ t("views.timesheets.employee_review.date") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.client") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.in_out_times") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.hours") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.ot") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.exception") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.actions") }</Table.HeadCell>
						</Table.Row>
					</Table.Head>

					<Table.Body>
						{ shifts.length === 0
							? (
								<Table.Row>
									<Table.Cell colSpan={ canEditTimes ? 8 : 7 }>
										<Text size="sm" c="dimmed">{ t("views.timesheets.employee_review.no_shifts") }</Text>
									</Table.Cell>
								</Table.Row>
							)
							: (
								shifts.map(shift => (
									<ReviewRow
										key={ shift.id }
										shift={ shift }
										shiftExceptionReasons={ shiftExceptionReasons }
										shiftOtHours={ shiftOtHours }
										canEditTimes={ canEditTimes }
										selected={ selectedShiftIds.includes(shift.id) }
										onSelectedChange={ (selected) => toggleShift(shift.id, selected) }
										onDelete={ () => handleDeleteShift(shift) }
										deleting={ busy }
										employeeId={ employeeId }
										employeeSlug={ employeeSlug }
										payPeriodId={ payPeriodId }
									/>
								))
							) }
					</Table.Body>

					{ shifts.length > 0 && (
						<Table.Footer>
							<Table.Row>
								<Table.Cell colSpan={ canEditTimes ? 5 : 4 }>
									<Text fw={ 500 }>{ t("views.timesheets.employee_review.total") }</Text>
								</Table.Cell>
								<Table.Cell colSpan={ 3 }>
									<Group gap="md">
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.footer_regular") }: { formatter.number.decimal(regularHours, 2) } hrs
										</Text>
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.footer_overtime") }: { formatter.number.decimal(otHours, 2) } hrs
										</Text>
									</Group>
								</Table.Cell>
							</Table.Row>
						</Table.Footer>
					) }
				</Table>
			</Table.TableProvider>
		</Box>
	)
}
