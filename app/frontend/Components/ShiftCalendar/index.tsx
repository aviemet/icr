import React, { useCallback, useState } from 'react'
import { Box, useMantineTheme } from '@mantine/core'
import { useLocation } from '@/lib/hooks'
import { router } from '@inertiajs/react'
import { ModalPrompt } from '../Modal'
import NewShiftForm from './NewShiftForm'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import {
	Calendar,
	dayjsLocalizer,
	type CalendarProps,
	type View,
	type SlotInfo,
	NavigateAction,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const DragAndDropCalendar = withDragAndDrop(Calendar<Schema.Shift>)

dayjs.extend(timezone)
const localizer = dayjsLocalizer(dayjs)

type OmittedCalendarProps = 'localizer'|'onRangeChange'|'events'|'startAccessor'|'endAccessor'|'eventPropGetter'
interface ShiftCalendarProps extends Omit<CalendarProps<Schema.Shift>, OmittedCalendarProps> {
	shifts: Schema.ShiftsCalendar[]
	client?: Schema.Client
	employee?: Schema.Employee
	onRangeChange?: (start: Date, end: Date, view?: View) => void
}

const ShiftCalendar = ({
	shifts,
	client,
	employee,
	onRangeChange,
	showAllEvents = true,
	...props
}: ShiftCalendarProps) => {
	const theme = useMantineTheme()
	const location = useLocation()

	const [formModalOpen, setFormModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>()

	const navigateParams = useCallback((params) => {
		router.get(location.path, params, {
			preserveScroll: true,
			preserveState: true,
		})
	}, [])

	// Change onRangeChange signature to be consistent
	const handleRangeChange = (range: Date[] | {
		start: Date
		end: Date
	}, view?: View | undefined) => {
		let start, end

		if(Array.isArray(range)) {
			start = range[0]

			if(range.length === 1) {
				end = dayjs(start).endOf('day').toDate()
			} else {
				end = range[range.length - 1]
			}
		} else {
			start = range.start
			end = range.end
		}

		navigateParams({ start, end, view })

		if(onRangeChange) onRangeChange(start, end, view)
	}

	// TODO: Clear search params when navigating to today
	const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
		// navigateParams({ start: '', end: '', view: '' })
		// console.log({ newDate, view, action })
	}

	const defaultDate = () => {
		const start = location.params.get('start')
		const end = location.params.get('end')

		if(start && end) {
			const startDate = dayjs(start)
			const endDate = dayjs(end)

			const days = Math.abs(startDate.diff(endDate, 'day')) / 2
			const defaultDate = startDate.add(days, 'day')
			return defaultDate.toDate()
		}
	}

	const getTitle = (event: Schema.Shift) => {
		const start = dayjs(event.starts_at)
		const end = dayjs(event.ends_at)

		return `${start.format('ha')} - ${end.format('ha')}: ${event.title || event.employee.person.first_name}`
	}

	const eventStyleGetter = (event: Schema.Shift, start: Date, end: Date, isSelected: boolean) => {
		var backgroundColor = event.employee.settings?.shift_color

		var style = {
			backgroundColor: backgroundColor || theme.fn.primaryColor(),
			borderRadius: '0px',
			opacity: 0.8,
			color: 'black',
			border: '0px',
			display: 'block',
		}

		return {
			style: style,
		}
	}

	const handleSelectSlot = (slot: SlotInfo) => {
		setNewShiftStart(slot.start)
		setFormModalOpen(true)
	}

	return (
		<>
			<Box sx={ (theme) => {
				const styles = {}

				if(theme.colorScheme === 'dark') {
					styles['.rbc-toolbar'] = {
						'button': {
							color: theme.white,
							'&.rbc-active': {
								backgroundColor: theme.fn.primaryColor(),
							},
						},
					}

					styles['.rbc-off-range-bg'] = {
						backgroundColor: theme.colors.gray[9],
					}

					styles['.rbc-today'] = {
						backgroundColor: theme.colors.gray[8],
					}

					styles['.rbc-day-bg + .rbc-day-bg'] = {
						borderLeft: `1px solid ${theme.colors.gray[9]}`,
					}
				}

				return styles
			} }>
				<DragAndDropCalendar
					selectable
					showAllEvents={ showAllEvents }
					localizer={ localizer }
					events={ shifts }
					defaultDate={ defaultDate() }
					startAccessor={ event => new Date(event.starts_at!) }
					endAccessor={ event => new Date(event.ends_at!) }
					titleAccessor={ getTitle }
					eventPropGetter={ eventStyleGetter }
					style={ { height: '100vh' } }
					onRangeChange={ handleRangeChange }
					onNavigate={ handleNavigate }
					onSelectSlot={ handleSelectSlot }
					{ ...props }
				/>
			</Box>
			<ModalPrompt
				title="New Shift"
				opened={ formModalOpen }
				onClose={ () => setFormModalOpen(false) }
			>
				<NewShiftForm
					start={ newShiftStart }
					client={ client }
					employee={ employee }
				/>
			</ModalPrompt>
		</>
	)
}

export default ShiftCalendar
