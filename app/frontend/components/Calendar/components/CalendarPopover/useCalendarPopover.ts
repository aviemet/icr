import { useDisclosure } from "@mantine/hooks"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { EventResources, CalendarClickTarget } from "@/components/Calendar"

interface PopoverPosition {
	top: number
	left: number
}

const defaultPopoverPosition = { top: 0, left: 0 }

interface UseCalendarPopoverReturn<TEventResources extends EventResources> {
	popoverOpen: boolean
	target: CalendarClickTarget<TEventResources> | null
	popoverPosition: PopoverPosition
	popoverRef: React.RefObject<HTMLDivElement>
	handleClick: (target: CalendarClickTarget<TEventResources>) => void
	close: () => void
}

const useCalendarPopover = <TEventResources extends EventResources>(): UseCalendarPopoverReturn<TEventResources> => {
	const [target, setTarget] = useState<CalendarClickTarget<TEventResources> | null>(null)
	const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>(defaultPopoverPosition)
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
		setTarget(null)
		setClickedElement(null)
	}, [close])

	const openPopover = useCallback((newTarget: CalendarClickTarget<TEventResources>, position: PopoverPosition) => {
		setTarget(newTarget)
		setPopoverPosition(position)
		open()
	}, [open])

	const handleClick = useCallback((newTarget: CalendarClickTarget<TEventResources>) => {
		const rect = newTarget.element.getBoundingClientRect()
		const scrollTop = window.scrollY || document.documentElement.scrollTop
		const scrollLeft = window.scrollX || document.documentElement.scrollLeft

		const isTimeGrid = newTarget.element.closest('[data-calendar-view="time-grid"]') !== null

		let topPosition = rect.bottom + scrollTop

		if(isTimeGrid) {
			topPosition = rect.top + scrollTop
		}

		setClickedElement(newTarget.element)
		openPopover(newTarget, {
			top: topPosition,
			left: rect.left + scrollLeft,
		})
	}, [openPopover])

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

	useLayoutEffect(() => {
		if(opened && popoverRef.current && clickedElement) {
			const popoverRect = popoverRef.current.getBoundingClientRect()
			const viewportWidth = window.innerWidth
			const viewportHeight = window.innerHeight
			const scrollTop = window.scrollY || document.documentElement.scrollTop
			const scrollLeft = window.scrollX || document.documentElement.scrollLeft

			const elementRect = clickedElement.getBoundingClientRect()
			const isTimeGrid = clickedElement.closest('[data-calendar-view="time-grid"]') !== null

			const topAlignTop = elementRect.top + scrollTop
			const bottomAlignBottom = elementRect.bottom + scrollTop + 5
			const topAlignBottom = elementRect.top + scrollTop - popoverRect.height - 5

			let top: number

			if(isTimeGrid) {
				if(topAlignTop + popoverRect.height <= viewportHeight + scrollTop) {
					top = topAlignTop
				} else {
					top = bottomAlignBottom
				}
			} else {
				if(bottomAlignBottom + popoverRect.height <= viewportHeight + scrollTop) {
					top = bottomAlignBottom
				} else {
					top = topAlignBottom
				}
			}

			let left = elementRect.left + (elementRect.width / 2) - (popoverRect.width / 2) + scrollLeft

			if(left < scrollLeft + pagePadding) {
				left = scrollLeft + pagePadding
			}
			if(left + popoverRect.width > viewportWidth + scrollLeft - pagePadding) {
				left = viewportWidth + scrollLeft - popoverRect.width - pagePadding
			}

			if(popoverPosition.top !== top || popoverPosition.left !== left) {
				setPopoverPosition(() => ({ top, left }))
			}
		}
	}, [opened, popoverPosition, popoverRef, clickedElement])

	return {
		popoverOpen: opened,
		target,
		popoverPosition,
		popoverRef,
		handleClick,
		close: closePopover,
	}
}

export { useCalendarPopover }
export type { UseCalendarPopoverReturn }
