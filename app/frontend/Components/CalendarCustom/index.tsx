import clsx from "clsx"
import React, { useMemo, useState, useCallback } from "react"

import { CalendarLocalizer, useDefaultLocalizer } from "@/Components/CalendarCustom/lib/localizers"
import Toolbar from "@/Components/CalendarCustom/Toolbar"
import { createContext } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import { viewComponents, VIEWS, VIEW_NAMES, NAVIGATION_ACTION } from "./Views"

export interface CalendarEvent {
	id: string | number
	title: React.ReactNode
	start: Date
	end: Date
	allDay?: boolean
	color?: string
}

type CalendarContext<TEvent extends CalendarEvent = CalendarEvent> = {
	date: Date
	events: TEvent[]
	localizer: CalendarLocalizer
	handleViewChange: (view: VIEW_NAMES) => void
	handleDateChange: (action: NAVIGATION_ACTION, newDate?: Date) => void
}

const [useCalendarContext, CalendarProvider] = createContext<CalendarContext>()
export { useCalendarContext }

interface CalendarProps<TEvent extends CalendarEvent = CalendarEvent> {
	defaultDate: Date
	defaultView: VIEW_NAMES
	events: TEvent[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
}

const Calendar = <TEvent extends CalendarEvent = CalendarEvent>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
}: CalendarProps<TEvent>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const ViewComponent = useMemo(() => viewComponents[currentView], [currentView])

	const handleViewChange = useCallback((view: VIEW_NAMES) => {
		setCurrentView(view)
	}, [])

	const handleDateChange = useCallback((action: NAVIGATION_ACTION, newDate?: Date) => {
		if(!localLocalizer) return undefined

		const nextDate = ViewComponent.navigate(
			newDate || date,
			action,
			{
				date: date,
				today: new Date(),
				localizer: localLocalizer,
				events: events,
			}
		)
		setDate(nextDate)
	}, [ViewComponent, date, events, localLocalizer])

	const calendarProviderState = useMemo(() => ({
		date,
		events,
		localizer: localLocalizer as CalendarLocalizer,
		handleViewChange,
		handleDateChange,
	}), [date, events, localLocalizer, handleViewChange, handleDateChange])


	if(!localLocalizer) return null

	return (
		<CalendarProvider value={ calendarProviderState }>
			<Toolbar views={ views } view={ currentView } />

			<div className={ clsx(classes.calendar) }>
				<div className={ clsx(classes.calendarContainer) }>
					<ViewComponent />
				</div>
			</div>
		</CalendarProvider>
	)
}

export default Calendar
