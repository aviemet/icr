import { useResizeObserver } from "@mantine/hooks"
import { Variants } from "framer-motion"
import { RefObject } from "react"

import { useCalendarContext } from "@/components/Calendar"
import { ensureDate } from "@/lib/dates"

interface UseCalendarTransitionOptions<T extends HTMLElement = HTMLDivElement> {
	containerRef?: RefObject<T>
}

export interface UseCalendarTransitionResult<T extends HTMLElement = HTMLDivElement> {
	containerRef: RefObject<T>
	direction: number
	variants: Variants
}

export function useCalendarTransition<T extends HTMLElement = HTMLDivElement>(
	options: UseCalendarTransitionOptions<T> = {}
): UseCalendarTransitionResult<T> {
	const { date, localizer, prevDateRef } = useCalendarContext()
	const [internalRef, containerRect] = useResizeObserver()

	const containerRef = options.containerRef || (internalRef as RefObject<T>)
	const rect = options.containerRef ? options.containerRef.current?.getBoundingClientRect() : containerRect

	const direction = localizer.isBefore(date, ensureDate(prevDateRef.current)) ? - 1 : 1

	const variants: Variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? (rect?.width || 0) + 100 : - ((rect?.width || 0) + 100),
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? (rect?.width || 0) + 100 : - ((rect?.width || 0) + 100),
			opacity: 0,
		}),
	}

	return {
		containerRef,
		direction,
		variants,
	}
}
