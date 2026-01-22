import { useResizeObserver } from "@mantine/hooks"
import { Variants } from "framer-motion"
import { RefObject, useMemo } from "react"

import { useCalendarContext } from "@/components/Calendar"
import { ensureDate } from "@/lib/dates"
import { mergeRefs } from "@/lib/mergeRefs"

interface UseCalendarTransitionOptions<T extends HTMLElement = HTMLDivElement> {
	containerRef?: RefObject<T>
}

export interface UseCalendarTransitionResult<T extends HTMLElement = HTMLDivElement> {
	containerRef: RefObject<T | null> | ((instance: T | null) => void)
	direction: number
	variants: Variants
}

export function useCalendarTransition<T extends HTMLElement = HTMLDivElement>(
	options: UseCalendarTransitionOptions<T> = {}
): UseCalendarTransitionResult<T> {
	const { date, localizer, prevDate } = useCalendarContext()
	const [internalRef, containerRect] = useResizeObserver<T>()

	const containerRef = useMemo(
		() => options.containerRef ? mergeRefs([internalRef, options.containerRef]) : internalRef,
		[internalRef, options.containerRef]
	)

	const rect = options.containerRef ? options.containerRef.current?.getBoundingClientRect() : containerRect

	const direction = localizer.isBefore(date, ensureDate(prevDate)) ? - 1 : 1

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
