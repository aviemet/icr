import { Box, Overlay } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useState, useCallback, useRef, useLayoutEffect } from "react"

import { CalendarProvider, CalendarContext, EventResources, BaseCalendarEvent, Resource } from "@/components/Calendar"
import Toolbar from "@/components/Calendar/components/Toolbar"
import { CalendarLocalizer, useDefaultLocalizer } from "@/components/Calendar/lib/localizers"
import { invariant } from "@/lib"
import { hasUniqueValues } from "@/lib/collections"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import { ErrorBoundary } from "../ErrorBoundary"
import { EventPopover } from "./components/EventPopover"
import { useEventPopover } from "./components/EventPopover/useEventPopover"
import { StrategyNameMap } from "./lib/displayStrategies"
import { VIEWS, VIEW_NAMES, NAVIGATION_ACTION, viewComponents } from "./views"

export interface CalendarProps<TEventResources extends EventResources = EventResources> {
	defaultDate?: Date
	defaultView?: VIEW_NAMES
	events: BaseCalendarEvent<TEventResources>[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<StrategyNameMap>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	onViewChange?: (view: VIEW_NAMES) => void
	eventPopoverContent?: (event: BaseCalendarEvent<TEventResources>, localizer: CalendarLocalizer) => React.ReactNode
	onSelectSlot?: (date: Date) => void
	resources?: Resource[]
	groupByResource?: boolean
	maxEvents?: number
}

const Calendar = <TEventResources extends EventResources>({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
	displayStrategies = {},
	onNavigate,
	onViewChange,
	eventPopoverContent,
	onSelectSlot,
	resources = [],
	groupByResource = false,
	maxEvents = Infinity,
}: CalendarProps<TEventResources>) => {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const prevDateRef = useRef<Date>(date) // Track previous date for animation direction
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const {
		popoverOpen,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
	} = useEventPopover<TEventResources>()

	/**
	 * Read and build display strategy preferences object from settings
	 */
	const { settings: { calendar_layout_style } } = usePageProps()

	const localDisplayStrategies = useMemo(() => Object.assign({
		month: calendar_layout_style ?? "overlap",
		week: "overlap",
		day: "overlap",
		agenda: "stack",
	}, displayStrategies), [calendar_layout_style, displayStrategies])

	/**
	 * Collect resources for building headings
	 */
	const resourcesById = useMemo(() => {
		const resourcesMap = new Map<string | number, Resource>()

		invariant(hasUniqueValues(resources, "id"), "[CalendarComponent] Duplicate resource IDs found: Ensure IDs are unique.")

		for(const resource of resources) {
			resourcesMap.set(resource.id, resource)
		}

		return resourcesMap
	}, [resources])

	/**
	 * Compensate for toolbar height
	 */
	const [minHeight, setMinHeight] = useState("100%")
	const toolbarRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if(!toolbarRef.current) return

		const { height } = toolbarRef.current.getBoundingClientRect()
		setMinHeight(`calc(100% - ${height}px)`)
	}, [])

	/**
	 * Dynamically load the currently chosen calendar view type
	 */
	// const ViewComponent = useMemo(() => getViewComponent<TEventResources, typeof currentView>(currentView), [currentView])
	const ViewComponent = viewComponents[currentView]

	const handleViewChange = useCallback((view: VIEW_NAMES) => {
		setCurrentView(view)
		onViewChange?.(view)
	}, [onViewChange])

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
				resourcesById: resourcesById,
			}
		)

		prevDateRef.current = date
		setDate(nextDate)

		onNavigate?.(nextDate, action, currentView)

		return nextDate
	}, [ViewComponent, date, events, localLocalizer, onNavigate, currentView, resourcesById])

	const handleSelectSlot = useCallback((date: Date) => {
		onSelectSlot?.(date)
	}, [onSelectSlot])

	const calendarProviderState = useMemo<CalendarContext<TEventResources>>(() => ({
		date,
		events,
		localizer: localLocalizer,
		handleViewChange,
		handleDateChange,
		onEventClick: handleEventClick,
		resourcesById,
		groupByResource,
		maxEvents,
		prevDateRef,
	}), [
		date,
		events,
		localLocalizer,
		handleViewChange,
		handleDateChange,
		handleEventClick,
		resourcesById,
		groupByResource,
		maxEvents,
		prevDateRef,
	])

	return (
		<Box className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<CalendarProvider<TEventResources> value={ calendarProviderState }>
				<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

				<div className={ clsx(classes.calendar) }>
					<div className={ clsx(classes.calendarInnerContainer) }>
						<ViewComponent
							displayStrategy={ localDisplayStrategies[currentView] }
							onSelectSlot={ handleSelectSlot }
						/>
					</div>

					{ /* Overlay - Rendered when popover is open */ }
					{ popoverOpen && <Overlay opacity={ 0 } /> }
				</div>


				{ /* Event Details Popover */ }
				{ popoverOpen && selectedEvent && popoverPosition && localLocalizer && (
					<EventPopover<TEventResources>
						ref={ popoverRef }
						event={ selectedEvent }
						position={ popoverPosition }
					>
						{ eventPopoverContent && ((event) => eventPopoverContent(event, localLocalizer)) }
					</EventPopover>
				) }

			</CalendarProvider>
		</Box>
	)
}

export { Calendar }
