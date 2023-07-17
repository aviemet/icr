import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
	EventApi,
	DateSelectArg,
	EventClickArg,
	EventContentArg,
	formatDate,
	CalendarApi,
} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Box, Button, Group, SegmentedControl, Title, useMantineTheme } from '@mantine/core'
import { useLocation } from '@/lib/hooks'
import { ModalPrompt } from '../Modal'
import NewShiftForm from './NewShiftForm'
import EventContent from './EventContent'
import dayjs from 'dayjs'
import useFullCalendar from './useFullCalendar'

interface IShiftCalendar {
	shifts: Schema.ShiftsCalendar[]
	client?: Schema.Client
	employee?: Schema.Employee
}

const ShiftCalendar = ({
	shifts,
	client,
	employee,
	...props
}: IShiftCalendar) => {
	const theme = useMantineTheme()

	const calendarRef = useRef<FullCalendar>(null)

	const [formModalOpen, setFormModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>()

	/**
	 * Runs when clicking on an empty part of the calendar
	 * Displays a modal containing a form to create a new Shift
	 */
	const showNewShiftForm = (arg: DateClickArg) => {
		setNewShiftStart(arg.date)
		setFormModalOpen(true)
	}

	const eventsFromShifts = useCallback(() => (
		shifts.map(shift => ({
			id: String(shift.id),
			title: shift.title || shift.employee.person.name,
			start: shift.starts_at,
			end: shift.ends_at,
			backgroundColor: shift.employee.settings?.shift_color,
		}))
	), [shifts])

	const { Calendar, api } = useFullCalendar({
		plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
		initialView: 'dayGridMonth',
		headerToolbar: false,
		editable: true,
		selectable: true,
		selectMirror: true,
		dateClick: showNewShiftForm,
		initialEvents: eventsFromShifts(),
		eventDisplay: 'block',
		displayEventEnd: true,
		eventTextColor: theme.black,
		eventBorderColor: theme.black,
		eventContent: shift => <EventContent eventInfo={ shift } />,
		// select: handleDateSelect,
		// initialEvents: {INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
		// eventContent: {renderEventContent} // custom render function
		// eventClick: {this.handleEventClick}
		// eventsSet: {this.handleEvents} // called after events are initialized/added/changed/removed
		// eventAdd: {function(){}}
		// eventChange: {function(){}}
		// eventRemove: {function(){}}
	})

	const handlePrev = () => {
		api?.prev()
	}

	const handleNext = () => {
		if(!api) return
		console.log({ data: api.currentData })
		api?.next()
	}

	const handleToday = () => {
		api?.today()
	}

	useEffect(() => {
		if(!api) return
		console.log({ api })
	}, [api])
	return (
		<>
			<Group position="apart" mb="md">
				<Box>
					<Group>
						<Button.Group>
							<Button radius="sm" onClick={ () => api?.prev() }>Prev</Button>
							<Button radius="sm" onClick={ handleNext }>Next</Button>
						</Button.Group>
						<Button
							radius="sm"
							onClick={ handleToday }
							disabled={ api?.isTodayInView() }
						>Today</Button>
					</Group>
				</Box>
				<Box>
					<Title order={ 2 }>{ api?.getTitle() }</Title>
				</Box>
				<Box>
					<SegmentedControl
						radius="sm"
						color={ theme.fn.primaryColor() }
						data={ [
							{ label: 'Month', value: 'dayGridMonth' },
							{ label: 'Week', value: 'timeGridWeek' },
							{ label: 'Day', value: 'timeGridDay' },
						] }
						onChange={ value => api?.changeView(value) }
					/>
				</Box>
			</Group>
			{ Calendar }


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

/**
 *
 *
 * <FullCalendar
				ref={ calendarRef }
				plugins={ [ dayGridPlugin, timeGridPlugin, interactionPlugin ] }
				initialView="dayGridMonth"
				headerToolbar={ false }

				editable={ true }
				selectable={ true }
				selectMirror={ true }

				// select={ handleDateSelect }
				dateClick={ showNewShiftForm }

				initialEvents={ eventsFromShifts() }

				eventDisplay='block'
				displayEventEnd={ true }
				eventTextColor={ theme.black }
				eventBorderColor={ theme.black }
				eventContent={ shift => <EventContent eventInfo={ shift } /> }

			// initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
			// eventContent={renderEventContent} // custom render function
			// eventClick={this.handleEventClick}
			// eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
			// eventAdd={function(){}}
			// eventChange={function(){}}
			// eventRemove={function(){}}
			/>
 */
