import { CalendarEvent } from "@/Components/CalendarCustom"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/CalendarCustom/Views"

interface WeekViewProps<TEvent extends CalendarEvent = CalendarEvent> extends BaseViewProps<TEvent> {}

const WeekViewComponent = (props: WeekViewProps) => {
	return (
		<div>WeekView</div>
	)
}

export const WeekView = createViewComponent(WeekViewComponent, {
	range: (date, { localizer }) => {
		let start = localizer.firstVisibleDay(date, VIEWS.week)
		let end = localizer.lastVisibleDay(date, VIEWS.week)
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 1, "week")
			case NAVIGATION.next:
				return localizer.add(date, 1, "week")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.weekTitle),
})
