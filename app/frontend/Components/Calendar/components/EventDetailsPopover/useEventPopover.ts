import { useClickOutside, useDisclosure } from "@mantine/hooks"
import { useCallback, useLayoutEffect, useState } from "react"

import { CalendarEvent } from "@/Components/Calendar"

interface PopoverPosition {
	top: number
	left: number
}

interface UseEventPopoverReturn<TEvent extends CalendarEvent<TResources> = CalendarEvent<any>, TResources = any> {
	popoverOpen: boolean
	selectedEvent: TEvent | null
	popoverPosition: PopoverPosition | null
	popoverRef: React.RefObject<HTMLDivElement | null>
	handleEventClick: (event: TEvent, element: HTMLElement) => void
	closePopover: () => void
}

const useEventPopover = <TEvent extends CalendarEvent<TResources> = CalendarEvent<any>, TResources = any>(): UseEventPopoverReturn<TEvent, TResources> => {
	const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null)
	const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null)
	const [clickedElement, setClickedElement] = useState<HTMLElement | null>(null)

	const [opened, { close, open }] = useDisclosure(false)
	const popoverRef = useClickOutside<HTMLDivElement>(close)

	const closePopover = useCallback(() => {
		close()
		setSelectedEvent(null)
		setPopoverPosition(null)
		setClickedElement(null)
	}, [close])

	const openPopover = useCallback((event: TEvent, position: PopoverPosition) => {
		setSelectedEvent(event)
		setPopoverPosition(position)
		open()
	}, [open])

	const handleEventClick = useCallback((event: TEvent, element: HTMLElement) => {
		const rect = element.getBoundingClientRect()
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft

		setClickedElement(element)
		openPopover(event, {
			top: rect.bottom + scrollTop,
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

	// Adjust popover position if near viewport edges
	useLayoutEffect(() => {
		if(opened && popoverRef.current && popoverPosition && clickedElement) {
			const popoverRect = popoverRef.current.getBoundingClientRect()
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const scrollLeft = window.scrollX || document.documentElement.scrollLeft

			const eventRect = clickedElement.getBoundingClientRect()

			// Center horizontally on the event
			let left = eventRect.left + (eventRect.width / 2) - (popoverRect.width / 2) + scrollLeft
			let top = popoverPosition.top

			// Ensure popover stays within viewport bounds
			if(left + popoverRect.width > viewportWidth + scrollLeft) {
				left = viewportWidth - popoverRect.width + scrollLeft - 20
			}
			if(left < scrollLeft) {
				left = scrollLeft + 20
			}
			if(top + popoverRect.height > viewportHeight + scrollTop) {
				top = top - popoverRect.height - 40
			}

			if(popoverPosition.top !== top || popoverPosition.left !== left) {
				setPopoverPosition({ top, left })
			}
		}
	}, [opened, popoverPosition, popoverRef, clickedElement])

	return {
		popoverOpen: opened,
		selectedEvent,
		popoverPosition,
		popoverRef,
		handleEventClick,
		closePopover,
	}
}

export { useEventPopover }
export type { UseEventPopoverReturn }
