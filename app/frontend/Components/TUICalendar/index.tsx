import { useEffect, useRef } from "react"
import Calendar, { EventObject, ExternalEventTypes, Options } from "@toast-ui/calendar"
import { useDefaultCalendarOptions } from "./useDefaultCalendarOptions"
import { useInit } from "@/lib/hooks"

import cx from "clsx"
import * as classes from "./TUICalendar.css"
import "@toast-ui/calendar/dist/toastui-calendar.min.css"

type ReactCalendarOptions = Omit<Options, "defaultView">;
type CalendarView = Required<Options>["defaultView"];

type CalendarExternalEventNames = Extract<keyof ExternalEventTypes, string>;
type ReactCalendarEventNames = `on${Capitalize<CalendarExternalEventNames>}`;
type ReactCalendarEventHandler = ExternalEventTypes[CalendarExternalEventNames];
type ReactCalendarExternalEvents = {
	[events in ReactCalendarEventNames]: ReactCalendarEventHandler;
};

type CalendarProps = ReactCalendarOptions & {
	height?: string
	events: Partial<EventObject>[]
	view?: CalendarView
} & ReactCalendarExternalEvents;

// const optionsProps: (keyof ReactCalendarOptions)[] = [
// 	"useFormPopup",
// 	"useDetailPopup",
// 	"isReadOnly",
// 	"week",
// 	"month",
// 	"gridSelection",
// 	"usageStatistics",
// 	"eventFilter",
// 	"timezone",
// 	"template",
// ]

const reactCalendarEventNames: ReactCalendarEventNames[] = [
	"onSelectDateTime",
	"onBeforeCreateEvent",
	"onBeforeUpdateEvent",
	"onBeforeDeleteEvent",
	"onAfterRenderEvent",
	"onClickDayName",
	"onClickEvent",
	"onClickMoreEventsBtn",
	"onClickTimezonesCollapseBtn",
]

const TUICalendar = ({
	events = [],
	calendars,
	theme,
	view = "month",
	height = "900px",
	...options
}: CalendarProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const calendarRef = useRef<Calendar | null>(null)

	const defaultCalendarOptions = useDefaultCalendarOptions()

	useInit(() => {
		if(containerRef.current && !calendarRef.current) {
			calendarRef.current = new Calendar(containerRef.current, defaultCalendarOptions({ ...options, defaultView: view }))
		}

		return () => {
			if(calendarRef.current) {
				calendarRef.current.destroy()
			}
		}
	})

	useEffect(() => {
		if(calendarRef.current) {
			calendarRef.current.clear()

			if(events) calendarRef.current.createEvents(events)
		}
	}, [events])

	useEffect(() => {
		if(calendarRef.current && theme) {
			calendarRef.current.setTheme(theme)
		}
	}, [theme])

	useEffect(() => {
		if(calendarRef.current && view) {
			calendarRef.current.changeView(view)
		}
	}, [view])

	useEffect(() => {
		if(calendarRef.current && calendars) {
			calendarRef.current.setCalendars(calendars)
		}
	}, [calendars])

	useEffect(() => {
		if(calendarRef.current && options) {
			calendarRef.current.setOptions(options)
			bindEventHandlers(options)
		}
	}, [options])

	const bindEventHandlers = (externalEvents: ReactCalendarExternalEvents) => {
		const eventNames = Object.keys(externalEvents).filter((key) =>
			reactCalendarEventNames.includes(key as ReactCalendarEventNames)
		)

		eventNames.forEach((key) => {
			const eventName = key[2].toLowerCase() + key.slice(3)

			if(calendarRef.current) {
				calendarRef.current.off(eventName)
				calendarRef.current.on(eventName, externalEvents[key as ReactCalendarEventNames])
			}
		})
	}

	return <div id="CALENDARHERE" ref={ containerRef } className={ cx(classes.calendar) } style={ { height } } />
}

export default TUICalendar
