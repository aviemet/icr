import React from 'react'
import {
	Box,
	Heading,
	ShiftCalendar,
} from '@/Components'

import 'react-big-calendar/lib/css/react-big-calendar.css'

interface ScheduleProps {
	client: Schema.Client
	shifts: Schema.Shift[]
}

const Schedule = ({ client, shifts }: ScheduleProps) => {
	return (
		<>
			<Heading>{ client.person.name }</Heading>
			<Box sx={ { padding: '10px' } }>
				<ShiftCalendar
					client={ client }
					shifts={ shifts }
				/>
			</Box>
		</>
	)
}

export default Schedule
