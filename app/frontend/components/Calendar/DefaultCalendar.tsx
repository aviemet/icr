import { Calendar, CalendarProps } from "./Calendar"
// import { VIEWS } from "./Views"

import { EventResources } from "."

const DefaultCalendar = <TEventResources extends EventResources>(props: CalendarProps<TEventResources>) => {
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
	// 	onSelectSlot,
	// 	resources = [],
	// 	groupByResource = false,
	// 	maxEvents = Infinity,
	// } = props

	return <Calendar { ...props } />
}

export { DefaultCalendar }
