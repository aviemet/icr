import { Box } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useState, useCallback, useRef, useLayoutEffect } from "react"

import { CalendarProvider, CalendarContext, Resources, CalendarEvent } from "@/Components/Calendar"
import Toolbar from "@/Components/Calendar/components/Toolbar"
import { CalendarLocalizer, useDefaultLocalizer } from "@/Components/Calendar/lib/localizers"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import { ErrorBoundary } from "../ErrorBoundary"
import EventDetailsPopover from "./components/EventDetailsPopover"
import { useEventPopover } from "./components/EventDetailsPopover/useEventPopover"
import { StrategyNameMap } from "./lib/displayStrategies"
import { viewComponents, VIEWS, VIEW_NAMES, NAVIGATION_ACTION, ViewComponent } from "./Views"

interface CalendarProps<TResources extends Resources> {
	defaultDate: Date
	defaultView: VIEW_NAMES
	events: CalendarEvent<TResources>[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<StrategyNameMap>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	eventPopoverContent?: (event: CalendarEvent<TResources>, localizer: CalendarLocalizer) => React.ReactNode
	onSelectSlot?: (date: Date) => void
}

const Calendar = <TResources extends Resources>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
	displayStrategies = {},
	onNavigate,
	eventPopoverContent,
	...props
}: CalendarProps<TResources>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(VIEWS.month)

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
	} = useEventPopover<TResources>()

	const toolbarRef = useRef<HTMLDivElement>(null)

	// Account for toolbar height in calendar wrapper height
	const [minHeight, setMinHeight] = useState("100%")
	useLayoutEffect(() => {
		if(!toolbarRef.current) return

		const { height } = toolbarRef.current.getBoundingClientRect()
		setMinHeight(`calc(100% - ${height}px)`)
	}, [])

	const ViewComponent = useMemo(() => viewComponents[currentView] as unknown as ViewComponent<TResources>, [currentView])

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
	]) as CalendarContext<TResources>

	if(!localLocalizer) return <></>

	return (
		<Box className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<ErrorBoundary>
				<CalendarProvider<TResources> value={ calendarProviderState }>
					<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

					<div className={ clsx(classes.calendar) }>
						<div className={ clsx(classes.calendarInnerContainer) }>
							<ErrorBoundary>
								<ViewComponent displayStrategy={ localDisplayStrategies[currentView] } { ...props }/>
							</ErrorBoundary>
						</div>
					</div>

					{ /* Event Details Popover */ }
					{ popoverOpen && selectedEvent && popoverPosition && localLocalizer && (
						<EventDetailsPopover<TResources>
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
