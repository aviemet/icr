import { Box } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useState, useCallback, useRef, useLayoutEffect } from "react"

import { CalendarEvent, CalendarProvider } from "@/Components/Calendar"
import { CalendarLocalizer, useDefaultLocalizer } from "@/Components/Calendar/lib/localizers"
import Toolbar from "@/Components/Calendar/Toolbar"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import EventDetailsPopover from "./EventDetailsPopover"
import { useEventPopover } from "./EventDetailsPopover/useEventPopover"
import { viewComponents, VIEWS, VIEW_NAMES, NAVIGATION_ACTION } from "./Views"
import { ErrorBoundary } from "../ErrorBoundary"
import { DisplayStrategy } from "./Views/Month/displayStrategies"

interface CalendarProps<TEvent extends CalendarEvent = CalendarEvent> {
	defaultDate: Date
	defaultView: VIEW_NAMES
	events: TEvent[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategy?: DisplayStrategy
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
}

const Calendar = <TEvent extends CalendarEvent = CalendarEvent>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
	displayStrategy,
	onNavigate,
}: CalendarProps<TEvent>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const { settings: { calendar_layout_style } } = usePageProps()

	const {
		popoverOpen,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
	} = useEventPopover()

	const toolbarRef = useRef<HTMLDivElement>(null)

	// Account for toolbar height in calendar wrapper height
	const [minHeight, setMinHeight] = useState("100%")
	useLayoutEffect(() => {
		if(!toolbarRef.current) return

		const { height } = toolbarRef.current.getBoundingClientRect()
		setMinHeight(`calc(100% - ${height}px)`)
	}, [])

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

		onNavigate?.(nextDate, action, currentView)

		return nextDate
	}, [ViewComponent, date, events, localLocalizer, onNavigate, currentView])

	const calendarProviderState = useMemo(() => ({
		date,
		events,
		localizer: localLocalizer as CalendarLocalizer,
		handleViewChange,
		handleDateChange,
		onEventClick: handleEventClick,
	}), [
		date,
		events,
		localLocalizer,
		handleViewChange,
		handleDateChange,
		handleEventClick,
	])

	if(!localLocalizer) return <></>

	return (
		<Box className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<ErrorBoundary>
				<CalendarProvider value={ calendarProviderState }>
					<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

					<div className={ clsx(classes.calendar) }>
						<div className={ clsx(classes.calendarInnerContainer) }>
							<ViewComponent displayStrategy={ displayStrategy || calendar_layout_style }/>
						</div>
					</div>

					{ /* Event Details Popover */ }
					{ popoverOpen && selectedEvent && popoverPosition && (
						<EventDetailsPopover
							ref={ popoverRef }
							event={ selectedEvent }
							position={ popoverPosition }
						/>
					) }

				</CalendarProvider>
			</ErrorBoundary>
		</Box>
	)
}

export { Calendar }
