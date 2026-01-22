import { Box, Overlay } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useState, useCallback, useRef, useLayoutEffect } from "react"

import {
	CalendarProvider,
	CalendarContext,
	BaseCalendarEvent,
	Resource,
	CalendarClickTarget,
	CalendarEventTitleCallback,
	EventResources,
} from "@/components/Calendar"
import Toolbar from "@/components/Calendar/components/Toolbar"
import { CalendarLocalizer, useDefaultLocalizer } from "@/components/Calendar/lib/localizers"
import { invariant } from "@/lib"
import { hasUniqueValues } from "@/lib/collections"
import { usePageProps } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import { CalendarPopover, PopoverContentMap } from "./components/CalendarPopover"
import { useCalendarPopover } from "./components/CalendarPopover/useCalendarPopover"
import { ViewStrategyName, BaseDisplayProperties } from "./lib/displayStrategies"
import { useDraftEvents } from "./lib/draftEvents/useDraftEvents"
import { VIEWS, VIEW_NAMES, NAVIGATION_ACTION, viewComponents } from "./views"

type DisplayStrategyMap = {
	[K in VIEW_NAMES]: ViewStrategyName<K>
}

export interface CalendarProps {
	defaultDate?: Date
	defaultView?: VIEW_NAMES
	events: BaseCalendarEvent[]
	localizer?: CalendarLocalizer
	views?: readonly VIEW_NAMES[]
	displayStrategies?: Partial<DisplayStrategyMap>
	onNavigate?: (newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => void
	onViewChange?: (view: VIEW_NAMES) => void
	popoverContent?: Partial<PopoverContentMap>
	onClick?: (target: CalendarClickTarget) => boolean | void
	resources?: Resource[]
	groupByResource?: boolean
	maxEvents?: number
	defaultTitleBuilder?: CalendarEventTitleCallback
}

export function Calendar({
	defaultDate,
	defaultView = VIEWS.month,
	events,
	localizer,
	views = Object.values(VIEWS),
	displayStrategies = {},
	onNavigate,
	onViewChange,
	popoverContent,
	onClick,
	resources = [],
	groupByResource = false,
	maxEvents = Infinity,
	defaultTitleBuilder,
}: CalendarProps) {
	const localLocalizer = useDefaultLocalizer(localizer)

	const [date, setDate] = useState<Date>(defaultDate || new Date())
	const [prevDate, setPrevDate] = useState<Date>(date)
	const [currentView, setCurrentView] = useState<VIEW_NAMES>(defaultView)

	const {
		popoverOpen,
		target,
		popoverPosition,
		popoverRef,
		handleClick: handlePopoverClick,
	} = useCalendarPopover()

	const {
		draftEvents,
		upsertDraftEvent,
		patchDraftEvent,
		removeDraftEvent,
	} = useDraftEvents<BaseCalendarEvent>()

	const combinedEvents = useMemo(() => {
		if(draftEvents.length === 0) return events
		return [...events, ...draftEvents]
	}, [events, draftEvents])

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
				events: combinedEvents,
				resourcesById: resourcesById,
			}
		)

		setPrevDate(date)
		setDate(nextDate)

		onNavigate?.(nextDate, action, currentView)

		return nextDate
	}, [CalendarViewComponent, date, combinedEvents, localLocalizer, onNavigate, currentView, resourcesById])

	const handleClick = useCallback((clickTarget: CalendarClickTarget) => {
		const wasHandled = onClick?.(clickTarget)
		if(wasHandled) {
			return
		}

		if(clickTarget.type === "background") {
			if(popoverContent?.background) {
				handlePopoverClick(clickTarget)
				return
			}
			return
		}

		if(clickTarget.type === "event") {
			if(popoverContent?.event || !popoverContent) {
				handlePopoverClick(clickTarget)
				return
			}
		}
	}, [onClick, popoverContent, handlePopoverClick])

	const getEventTitle = useCallback(<TEventResources extends EventResources>(
		event: BaseCalendarEvent<TEventResources>,
		displayProperties: BaseDisplayProperties
	): string => {
		const titleBuilder = event.titleBuilder || defaultTitleBuilder

		if(titleBuilder) {
			return titleBuilder({
				start: displayProperties.displayStart ?? event.start,
				end: displayProperties.displayEnd ?? event.end,
				allDay: event.allDay,
				title: event.title,
				resources: event.resources,
				resourceId: event.resourceId,
			})
		}

		return event.title
	}, [defaultTitleBuilder])

	const calendarProviderState = useMemo<CalendarContext>(() => ({
		date,
		events: combinedEvents,
		draftEvents,
		upsertDraftEvent,
		patchDraftEvent,
		removeDraftEvent,
		localizer: localLocalizer,
		handleViewChange,
		handleDateChange,
		onClick: handleClick,
		resourcesById,
		groupByResource,
		maxEvents,
		prevDate,
		defaultTitleBuilder,
		getEventTitle,
	}), [
		date,
		combinedEvents,
		draftEvents,
		upsertDraftEvent,
		patchDraftEvent,
		removeDraftEvent,
		localLocalizer,
		handleViewChange,
		handleDateChange,
		handleClick,
		resourcesById,
		groupByResource,
		maxEvents,
		prevDate,
		defaultTitleBuilder,
		getEventTitle,
	])

	return (
		<Box className={ clsx(classes.calendarOuterContainer) } style={ { minHeight } }>
			<CalendarProvider value={ calendarProviderState }>
				<Toolbar ref={ toolbarRef } views={ views } view={ currentView } />

				<div className={ clsx(classes.calendar) }>
					<div className={ clsx(classes.calendarInnerContainer) }>
						<CalendarViewComponent
							displayStrategy={ localDisplayStrategies[currentView] }
						/>
					</div>

					{ /* Overlay - Rendered when popover is open */ }
					{ popoverOpen && <Overlay opacity={ 0.33 } /> }
				</div>


				{ /* Calendar Popover */ }
				{ popoverOpen && target && (
					<CalendarPopover
						className={ clsx(classes.eventPopover) }
						target={ target }
						position={ popoverPosition }
						popoverContent={ popoverContent }
						localizer={ localLocalizer }
						popoverRef={ popoverRef }
					/>
				) }

			</CalendarProvider>
		</Box>
	)
}
