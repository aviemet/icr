import { useEffect, useRef } from "react"
import Calendar, { EventObject, ExternalEventTypes, Options } from "@toast-ui/calendar"
import { useDefaultCalendarOptions } from "./useDefaultCalendarOptions"
import { useInit } from "@/lib/hooks"

import cx from "clsx"
import * as classes from "./TUICalendar.css"
import "@toast-ui/calendar/dist/toastui-calendar.min.css"

type CalendarExternalEventNames = Extract<keyof ExternalEventTypes, string>;
type ReactCalendarEventNames = `on${Capitalize<CalendarExternalEventNames>}`;
type ReactCalendarEventHandler = ExternalEventTypes[CalendarExternalEventNames];
type ReactCalendarExternalEvents = {
	[events in ReactCalendarEventNames]: ReactCalendarEventHandler;
};

interface CalendarProps extends Omit<Options, "defaultView"> {
	height?: string
	events: Partial<EventObject>[]
	view?: Required<Options>["defaultView"]
	onSelectDateTime?: ExternalEventTypes["selectDateTime"]
	onBeforeCreateEvent?: ExternalEventTypes["beforeCreateEvent"]
	onBeforeUpdateEvent?: ExternalEventTypes["beforeUpdateEvent"]
	onBeforeDeleteEvent?: ExternalEventTypes["beforeDeleteEvent"]
	onAfterRenderEvent?: ExternalEventTypes["afterRenderEvent"]
	onClickDayName?: ExternalEventTypes["clickDayName"]
	onClickEvent?: ExternalEventTypes["clickEvent"]
	onClickMoreEventsBtn?: ExternalEventTypes["clickMoreEventsBtn"]
	onClickTimezonesCollapseBtn?: ExternalEventTypes["clickTimezonesCollapseBtn"]
}

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
			console.log({ key })
			const eventName = key[2].toLowerCase() + key.slice(3)

			if(calendarRef.current) {
				calendarRef.current.off(eventName)
				calendarRef.current.on(eventName, externalEvents[key as ReactCalendarEventNames])
			}
		})
	}

	return <div ref={ containerRef } className={ cx(classes.calendar) } style={ { height } } />
}

export default TUICalendar
