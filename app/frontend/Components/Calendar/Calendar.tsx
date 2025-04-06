import { Box } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useState, useCallback, useRef, useLayoutEffect } from "react"

import { CalendarProvider, CalendarContext, CalendarGenerics } from "@/Components/Calendar"
import Toolbar from "@/Components/Calendar/components/Toolbar"
import { CalendarLocalizer, useDefaultLocalizer } from "@/Components/Calendar/lib/localizers"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import EventDetailsPopover from "./components/EventDetailsPopover"
import { useEventPopover } from "./components/EventDetailsPopover/useEventPopover"
import { viewComponents, VIEWS, VIEW_NAMES, NAVIGATION_ACTION, ViewComponent } from "./Views"
import { ErrorBoundary } from "../ErrorBoundary"
import { DisplayStrategyFunction, StrategyType } from "./lib/displayStrategies/DisplayStrategyManager"

interface CalendarProps<T extends CalendarGenerics> {
	defaultDate: Date
	defaultView: VIEW_NAMES
	events: T["Event"][]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<Record<VIEW_NAMES, StrategyType | DisplayStrategyFunction<T>>>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	eventPopoverContent?: (event: T["Event"], localizer: CalendarLocalizer) => React.ReactNode
}

const Calendar = <T extends CalendarGenerics>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
	displayStrategies = {},
	onNavigate,
	eventPopoverContent,
}: CalendarProps<T>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const { settings: { calendar_layout_style } } = usePageProps()

	const localDisplayStrategies = Object.assign({
		month: calendar_layout_style,
		week: "overlap",
		day: "overlap",
		agenda: "overlap",
	}, displayStrategies)

	const {
		popoverOpen,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
	} = useEventPopover<T>()

	const toolbarRef = useRef<HTMLDivElement>(null)

	// Account for toolbar height in calendar wrapper height
	const [minHeight, setMinHeight] = useState("100%")
	useLayoutEffect(() => {
		if(!toolbarRef.current) return

		const { height } = toolbarRef.current.getBoundingClientRect()
		setMinHeight(`calc(100% - ${height}px)`)
	}, [])

	const ViewComponent = useMemo(() => viewComponents[currentView] as unknown as ViewComponent<T>, [currentView])

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
	]) as CalendarContext<T>

	if(!localLocalizer) return <></>

	return (
		<Box className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<ErrorBoundary>
				<CalendarProvider<T> value={ calendarProviderState }>
					<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

					<div className={ clsx(classes.calendar) }>
						<div className={ clsx(classes.calendarInnerContainer) }>
							<ViewComponent displayStrategy={ localDisplayStrategies[currentView] }/>
						</div>
					</div>

					{ /* Event Details Popover */ }
					{ popoverOpen && selectedEvent && popoverPosition && localLocalizer && (
						<EventDetailsPopover<T>
							ref={ popoverRef }
							event={ selectedEvent }
							position={ popoverPosition }
						>
							{ eventPopoverContent && ((event) => eventPopoverContent(event, localLocalizer)) }
						</EventDetailsPopover>
					) }

				</CalendarProvider>
			</ErrorBoundary>
		</Box>
	)
}

export { Calendar }
