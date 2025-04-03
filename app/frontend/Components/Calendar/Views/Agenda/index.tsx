import { CalendarEvent } from "@/Components/Calendar"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/Calendar/Views"

interface AgendaViewProps<TEvent extends CalendarEvent = CalendarEvent> extends BaseViewProps<TEvent> {}

const AgendaViewComponent = (props: AgendaViewProps) => {
	return (
		<div>AgendaView</div>
	)
}

export const AgendaView = createViewComponent(AgendaViewComponent, {
	range: (date, { localizer }) => {
		let start = localizer.firstVisibleDay(date, VIEWS.agenda)
		let end = localizer.lastVisibleDay(date, VIEWS.agenda)
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 7, "day")
			case NAVIGATION.next:
				return localizer.add(date, 7, "day")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.agendaTitle),
})
