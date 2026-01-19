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
import { EventPopover } from "./components/EventPopover"
import { useEventPopover } from "./components/EventPopover/useEventPopover"
import { ViewStrategyName } from "./lib/displayStrategies"
import { VIEWS, VIEW_NAMES, NAVIGATION_ACTION, viewComponents } from "./views"

type DisplayStrategyMap = {
	[K in VIEW_NAMES]: ViewStrategyName<K>
}

export interface CalendarProps<TEventResources extends EventResources = EventResources> {
	defaultDate?: Date
	defaultView?: VIEW_NAMES
	events: BaseCalendarEvent<TEventResources>[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<DisplayStrategyMap>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	onViewChange?: (view: VIEW_NAMES) => void
	eventPopoverContent?: (event: BaseCalendarEvent<TEventResources>, localizer: CalendarLocalizer) => React.ReactNode
	onSelectSlot?: (date: Date) => void
	resources?: Resource[]
	groupByResource?: boolean
	maxEvents?: number
}

export function Calendar<TEventResources extends EventResources>({
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
}: CalendarProps<TEventResources>) {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [prevDate, setPrevDate] = useState<Date>(date)
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

	const localDisplayStrategies = useMemo((): DisplayStrategyMap => ({
		month: calendar_layout_style ?? "split",
		week: "overlap",
		day: "overlap",
		agenda: "overlap",
		...displayStrategies,
	}), [calendar_layout_style, displayStrategies])

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
	const CalendarViewComponent = viewComponents[currentView]

	const handleViewChange = useCallback((view: VIEW_NAMES) => {
		setCurrentView(view)
		onViewChange?.(view)
	}, [onViewChange])

	const handleDateChange = useCallback((action: NAVIGATION_ACTION, newDate?: Date) => {
		if(!localLocalizer) return undefined

		const nextDate = CalendarViewComponent.navigate(
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

		setPrevDate(date)
		setDate(nextDate)

		onNavigate?.(nextDate, action, currentView)

		return nextDate
	}, [CalendarViewComponent, date, events, localLocalizer, onNavigate, currentView, resourcesById])

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
		prevDate,
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
		prevDate,
	])

	return (
		<Box className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<CalendarProvider<TEventResources> value={ calendarProviderState }>
				<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

				<div className={ clsx(classes.calendar) }>
					<div className={ clsx(classes.calendarInnerContainer) }>
						<CalendarViewComponent
							displayStrategy={ localDisplayStrategies[currentView] }
							onSelectSlot={ handleSelectSlot }
						/>
					</div>

					{ /* Overlay - Rendered when popover is open */ }
					{ popoverOpen && <Overlay opacity={ 0.33 } /> }
				</div>


				{ /* Event Details Popover */ }
				{ popoverOpen && selectedEvent && (
					<EventPopover<TEventResources>
						ref={ popoverRef }
						className={ clsx(classes.eventPopover) }
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
