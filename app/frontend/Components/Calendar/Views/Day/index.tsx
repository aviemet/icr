import { Resources } from "@/Components/Calendar"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/Calendar/Views"

interface DayViewProps<TResources extends Resources> extends BaseViewProps<TResources> {
	className?: string
	style?: React.CSSProperties
}

const DayViewComponent = <TResources extends Resources>(props: DayViewProps<TResources>) => {
	return (
		<div>DayView</div>
	)
}

export const DayView = createViewComponent(DayViewComponent, {
	range: (date, { localizer }) => {
		let start = localizer.firstVisibleDay(date, VIEWS.day)
		let end = localizer.lastVisibleDay(date, VIEWS.day)
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 1, "day")
			case NAVIGATION.next:
				return localizer.add(date, 1, "day")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.dayTitle),
})
