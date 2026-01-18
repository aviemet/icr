import { useDisclosure } from "@mantine/hooks"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"

interface PopoverPosition {
	top: number
	left: number
}

interface UseEventPopoverReturn<TEventResources extends EventResources> {
	popoverOpen: boolean
	selectedEvent: BaseCalendarEvent<TEventResources> | null
	popoverPosition: PopoverPosition | null
	popoverRef: React.RefObject<HTMLDivElement>
	handleEventClick: (event: BaseCalendarEvent<TEventResources>, element: HTMLElement) => void
}

const useEventPopover = <TEventResources extends EventResources>(): UseEventPopoverReturn<TEventResources> => {
	const [selectedEvent, setSelectedEvent] = useState<BaseCalendarEvent<TEventResources> | null>(null)
	const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null)
	const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null)

	const [opened, { close, open }] = useDisclosure(false)
	const popoverRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if(!opened) return

		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if(
				popoverRef.current &&
				event.target instanceof Node &&
				!popoverRef.current.contains(event.target)
			) {
				close()
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		document.addEventListener("touchstart", handleClickOutside)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			document.removeEventListener("touchstart", handleClickOutside)
		}
	}, [opened, close])

	const closePopover = useCallback(() => {
		close()
		setSelectedEvent(null)
		setPopoverPosition(null)
		setClickedElement(null)
	}, [close])

	const openPopover = useCallback((event: BaseCalendarEvent<TEventResources>, position: PopoverPosition) => {
		setSelectedEvent(event)
		setPopoverPosition(position)
		open()
	}, [open])

	const handleEventClick = useCallback((event: BaseCalendarEvent<TEventResources>, element: HTMLElement) => {
		const rect = element.getBoundingClientRect()
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft

		// Check if the clicked element is inside a TimeGrid
		const isTimeGrid = element.closest('[data-calendar-view="time-grid"]') !== null

		// Default position is bottom
		let topPosition = rect.bottom + scrollTop

		if(isTimeGrid) {
			// For TimeGrid, position above the element initially
			// We don't know the popover height yet, so we use rect.top.
			// The useLayoutEffect will adjust it precisely later.
			topPosition = rect.top + scrollTop
		}

		setClickedElement(element)
		openPopover(event, {
			// Use the calculated initial top position
			top: topPosition,
			// Keep initial left calculation simple, layout effect centers it
			left: rect.left + scrollLeft,
		})
	}, [openPopover])

	// Close popover with escape key
	useLayoutEffect(() => {
		const handleEscKey = (e: KeyboardEvent) => {
			if(e.key === "Escape") {
				closePopover()
			}
		}
		document.addEventListener("keydown", handleEscKey)

		return () => {
			document.removeEventListener("keydown", handleEscKey)
		}
	}, [closePopover])

	const pagePadding = 28

	// Adjust popover position if near viewport edges
	useLayoutEffect(() => {
		if(opened && popoverRef.current && popoverPosition && clickedElement) {
			const popoverRect = popoverRef.current.getBoundingClientRect()
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const scrollLeft = window.scrollX || document.documentElement.scrollLeft

			const eventRect = clickedElement.getBoundingClientRect()
			const isTimeGrid = clickedElement.closest('[data-calendar-view="time-grid"]') !== null

			// Define potential positions
			const topAlignTop = eventRect.top + scrollTop // Align popover top to event top
			const bottomAlignBottom = eventRect.bottom + scrollTop + 5 // Align popover top below event bottom (gap)
			const topAlignBottom = eventRect.top + scrollTop - popoverRect.height - 5 // Align popover bottom above event top (gap)

			let top: number

			if(isTimeGrid) {
				// Prefer top-to-top alignment for TimeGrid
				if(topAlignTop + popoverRect.height <= viewportHeight + scrollTop) {
					top = topAlignTop
				} else {
					// Fallback: position below event if top-to-top doesn't fit
					top = bottomAlignBottom
				}
			} else {
				// Prefer positioning below event for Month/Other views
				if(bottomAlignBottom + popoverRect.height <= viewportHeight + scrollTop) {
					top = bottomAlignBottom
				} else {
					// Fallback: position above event if below doesn't fit
					top = topAlignBottom
				}
			}

			// Center horizontally on the event
			let left = eventRect.left + (eventRect.width / 2) - (popoverRect.width / 2) + scrollLeft

			// Ensure horizontal bounds
			if(left < scrollLeft + pagePadding) {
				left = scrollLeft + pagePadding
			}
			if(left + popoverRect.width > viewportWidth + scrollLeft - pagePadding) {
				left = viewportWidth + scrollLeft - popoverRect.width - pagePadding
			}

			// Update position if calculated values differ from current state
			if(popoverPosition.top !== top || popoverPosition.left !== left) {
				setPopoverPosition(() => ({ top, left }))
			}
		}
	}, [opened, popoverPosition, popoverRef, clickedElement])

	return {
		popoverOpen: opened,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
	}
}

export { useEventPopover }
export type { UseEventPopoverReturn }
