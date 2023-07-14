import React, { useState, useCallback } from 'react'
import {
	EventApi,
	DateSelectArg,
	EventClickArg,
	EventContentArg,
	formatDate,
} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useMantineTheme } from '@mantine/core'
import { useLocation } from '@/lib/hooks'
import { ModalPrompt } from '../Modal'
import NewShiftForm from './NewShiftForm'

interface IShiftCalendar extends FullCalendar {
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
	const [formModalOpen, setFormModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>()

	/**
	 * Runs when clicking on an empty part of the calendar
	 * Displays a modal containing a form to create a new Shift
	 */
	const handleDateSelect = (arg: DateSelectArg) => {
		setNewShiftStart(arg.start)
		setFormModalOpen(true)
	}

	return (
		<>
			<FullCalendar
				plugins={ [ dayGridPlugin, timeGridPlugin, interactionPlugin ] }
				initialView="dayGridMonth"
				headerToolbar={ {
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek,timeGridDay',
				} }

				editable={ true }
				selectable={ true }
				selectMirror={ true }
				dayMaxEvents={ true }

				select={ handleDateSelect }

				initialEvents={ useCallback(() => (
					shifts.map(shift => ({
						id: shift.id,
						title: shift.title || shift.employee.person.name,
						start: shift.starts_at,
					}))
	 			), [shifts]) }

			// initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
			// eventContent={renderEventContent} // custom render function
			// eventClick={this.handleEventClick}
			// eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
			// eventAdd={function(){}}
			// eventChange={function(){}}
			// eventRemove={function(){}}
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
