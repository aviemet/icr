import { Calendar, CalendarProps } from "./Calendar"

const DefaultCalendar = (props: CalendarProps) => {
	// const {
	// 	defaultDate,
	// 	defaultView = VIEWS.month,
	// 	events,
	// 	localizer,
	// 	views = Object.values(VIEWS),
	// 	displayStrategies = {},
	// 	onNavigate,
	// 	onViewChange,
	// 	eventPopoverContent,
	// 	onClick,
	// 	resources = [],
	// 	groupByResource = false,
	// 	maxEvents = Infinity,
	// } = props

	return <Calendar { ...props } />
}

export { DefaultCalendar }
