import clsx from "clsx"
import React, { useMemo, useState, useEffect } from "react"

import { DateLocalizer, useDefaultLocalizer } from "@/Components/CalendarCustom/lib/localizers"
import { createContext } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import { viewComponents, VIEWS, VIEW_NAMES } from "./Views"

export interface CalendarEvent {
	id?: string | number
	allDay?: boolean | undefined
	title?: React.ReactNode | undefined
	start?: Date | undefined
	end?: Date | undefined
	resource?: any
	style?: React.CSSProperties
}

type CalendarContext<TEvent extends CalendarEvent = CalendarEvent> = {
	date: Date
	events: TEvent[]
	localizer: DateLocalizer
	setCurrentView: React.Dispatch<React.SetStateAction<VIEW_NAMES>>
}

const [useCalendarContext, CalendarProvider] = createContext<CalendarContext>()
export { useCalendarContext }

interface CalendarProps<TEvent extends CalendarEvent = CalendarEvent> {
	defaultDate: Date
	defaultView: VIEW_NAMES
	events: TEvent[]
	localizer?: DateLocalizer
}

const Calendar = <TEvent extends CalendarEvent = CalendarEvent>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
}: CalendarProps<TEvent>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const calendarProviderState = useMemo(() => ({
		date,
		events,
		localizer: localLocalizer as DateLocalizer,
		setCurrentView,
	}), [events, date, localLocalizer])

	const ViewComponent = viewComponents[currentView]

	if(!localLocalizer) return null

	return (
		<CalendarProvider value={ calendarProviderState }>
			<div className={ clsx(classes.calendar) }>
				<div className={ clsx(classes.calendarContainer) }>
					<ViewComponent

					/>
				</div>
			</div>
		</CalendarProvider>
	)
}

export default Calendar
