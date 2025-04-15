import { useResizeObserver } from "@mantine/hooks"
import { Variants } from "framer-motion"
import { RefObject } from "react"

import { useCalendarContext, EventResources } from "@/Components/Calendar"
import { ensureDate } from "@/lib/dates"

export interface UseCalendarTransitionResult {
	containerRef: RefObject<HTMLDivElement>
	direction: number
	variants: Variants
}

export function useCalendarTransition<TEventResources extends EventResources>(): UseCalendarTransitionResult {
	const { date, localizer, prevDateRef } = useCalendarContext<TEventResources>()
	const [containerRef, containerRect] = useResizeObserver()

	const direction = localizer.isBefore(date, ensureDate(prevDateRef.current)) ? - 1 : 1

	const variants: Variants = {
		enter: (direction: number) => ({
			x: direction > 0 ? containerRect.width + 100 : - (containerRect.width + 100),
			opacity: 0,
		}),
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			zIndex: 0,
			x: direction < 0 ? containerRect.width + 100 : - (containerRect.width + 100),
			opacity: 0,
		}),
	}

	return {
		containerRef,
		direction,
		variants,
	}
}
