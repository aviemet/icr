import React, { useMemo } from 'react'
import { Calendar, Views, dateFnsLocalizer, type CalendarProps } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, set, add, differenceInDays, endOfDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { Box, useMantineTheme } from '@mantine/core'

const DragAndDropCalendar = withDragAndDrop(Calendar)

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales: {
		'en-US': enUS,
	},
})

const getDateRange = data => {
	let start, end

	if(Array.isArray(data)) {
		start = data[0]
		if(data.length > 1) {
			end = data[data.length - 1]
		} else {
			end = data[0]
		}
	} else if(typeof data === 'object') {
		start = data.start
		end = data.end
	}
	end = endOfDay(end)
	return { start, end }
}

interface ShiftCalendarProps extends CalendarProps {
	shifts: Schema.Shift[]
}

const ShiftCalendar = ({ shifts, onSelectEvent, onSelectSlot, onNavigate, onView, onRangeChange }: ShiftCalendarProps) => {
	const theme = useMantineTheme()

	const searchParams = new URLSearchParams(window.location.search)

	const handleSelectEvent = data => {
		if(onSelectEvent) onSelectEvent(data)
	}

	const handleSelectSlot = data => {
		if(onSelectSlot) onSelectSlot(data)
	}

	const handleNavigate = data => {
		if(onNavigate) onNavigate(data)
	}

	const handleView = data => {
		if(onView) onView(data)
	}

	const handleRangeChange = data => {
		const { start, end } = data

		if(onRangeChange) onRangeChange(data, start, end)
	}

	const defaultDate = () => {
		const start = searchParams.get('start')
		const end = searchParams.get('end')

		if(start && end) {
			const startDate = new Date(start)
			const days = Math.abs(differenceInDays(startDate, new Date(end))) / 2
			const defaultDate = add(startDate, { days: days })
			return defaultDate
		}
	}

	const eventStyleGetter = (event: Schema.Shift, start, end, isSelected) => {
		var backgroundColor = event.employee.settings?.shift_color

		// console.log({ event, backgroundColor, start, end, isSelected })
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

	return (
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
				showAllEvents={ true }
				localizer={ localizer }
				events={ shifts }
				defaultDate={ defaultDate() }
				startAccessor="starts_at"
				endAccessor="ends_at"
				eventPropGetter={ eventStyleGetter }
				style={ { height: '100vh' } }
				onSelectEvent={ handleSelectEvent }
				onSelectSlot={ handleSelectSlot }
				onNavigate={ handleNavigate }
				onView={ handleView }
				onRangeChange={ handleRangeChange }
			/>
		</Box>
	)
}

export default ShiftCalendar
