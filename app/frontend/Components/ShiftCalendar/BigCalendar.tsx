import React, { useCallback, useEffect, useState } from 'react'
import { useMantineTheme } from '@mantine/core'
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
import useCalendarStyles from './useCalendarStyles'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const DragAndDropCalendar = withDragAndDrop(Calendar<Schema.ShiftsCalendar>)

dayjs.extend(timezone)
const localizer = dayjsLocalizer(dayjs)

type OmittedCalendarProps = 'localizer'|'onRangeChange'|'events'|'startAccessor'|'endAccessor'|'eventPropGetter'
interface ShiftCalendarProps extends Omit<CalendarProps<Schema.ShiftsCalendar>, OmittedCalendarProps> {
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
	defaultView = 'month',
	...props
}: ShiftCalendarProps) => {
	const theme = useMantineTheme()
	const location = useLocation()

	const [formModalOpen, setFormModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>()

	const [currentView, setCurrentView] = useState<View>(defaultView)

	const { classes } = useCalendarStyles()

	const navigateWithGetParams = (params) => {
		router.get(location.path, params, {
			preserveScroll: true,
			preserveState: true,
		})
	}

	/**
	 * Passed to the calendar, runs whenever the range buttons are pressed
	 * Using to redefine the onChange signature so that it's consistent across views
	 */
	const handleRangeChange = (range: Date[] | {
		start: Date
		end: Date
	}, view?: View | undefined) => {
		let start, end

		if(Array.isArray(range)) {
			start = range[0]

			if(range.length === 1) {
				end = start
			} else {
				end = range[range.length - 1]
			}
		} else {
			start = range.start
			end = range.end
		}

		start = dayjs(start).startOf('day').toDate()
		end = dayjs(end).endOf('day').toDate()

		navigateWithGetParams({ start, end, view: view || currentView })

		if(onRangeChange) onRangeChange(start, end, view || currentView)
	}

	// TODO: Clear search params when navigating to today
	/**
	 * Passed to the calendar, run whenever the date navigation buttons are pressed
	 */
	const handleNavigate = (newDate: Date, view: View, action: NavigateAction) => {
		// navigateParams({ start: '', end: '', view: '' })
		// console.log('handleNavigate')
	}

	useEffect(() => {
		const paramsView = location.params.get('view') as View

		if(!paramsView) return

		setCurrentView(paramsView)
	}, [])

	/**
	 * Passed to the calendar to determine highlighted date and date range
	 * Reads url params to adjust first render to correct range
	 */
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

	/**
	 * Passed to the calendar to run on each event
	 */
	const getTitle = (event: Schema.ShiftsCalendar) => {
		const start = dayjs(event.starts_at)
		const end = dayjs(event.ends_at)

		if(currentView === 'agenda') {
			return `${event.title || event.employee.person.first_name}`
		}

		return `${start.format('ha')} - ${end.format('ha')}: ${event.title || event.employee.person.first_name}`
	}

	/**
	 * Passed to the calendar to add extra styles to each event element
	 * In most views, applies to the top level div
	 * In agenda view, applies to the <tr> surrounding each event (including the `rowspan`ed date cell)
	 */
	const eventStyleGetter = useCallback((event: Schema.ShiftsCalendar, start: Date, end: Date, isSelected: boolean) => {
		var backgroundColor = event.employee.settings?.shift_color

		var style = {
			backgroundColor: backgroundColor || theme.fn.primaryColor(),
			color: 'black',
		}

		return {
			style: style,
		}
	}, [currentView])

	/**
	 * Runs when clicking on an empty part of the calendar
	 * Displays a modal containing a form to create a new Shift
	 */
	const handleSelectSlot = (slot: SlotInfo) => {
		setNewShiftStart(slot.start)
		setFormModalOpen(true)
	}

	return (
		<>
			<DragAndDropCalendar
				className={ classes.calendar }
				selectable
				showAllEvents={ showAllEvents }
				localizer={ localizer }
				events={ shifts }
				defaultDate={ defaultDate() }
				startAccessor={ event => new Date(event.starts_at!) }
				endAccessor={ event => new Date(event.ends_at!) }
				titleAccessor={ getTitle }
				eventPropGetter={ eventStyleGetter }
				style={ { minHeight: '100vh' } }
				onRangeChange={ handleRangeChange }
				onNavigate={ handleNavigate }
				onSelectSlot={ handleSelectSlot }
				onView={ setCurrentView }
				view={ currentView }
				{ ...props }
			/>
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
