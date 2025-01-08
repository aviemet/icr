import { Event, EventProps } from 'react-big-calendar'

const MonthEvent = ({
	event,
	title,
	continuesPrior,
	continuesAfter,
	isAllDay,
	localizer,
	slotStart,
	slotEnd,
}: EventProps<Event>) => {
	return (
		<div>{ title }</div>
	)
}

export default MonthEvent
