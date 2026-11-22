import { motion, AnimatePresence } from "framer-motion"
import { PropsWithChildren, RefObject } from "react"

import { useCalendarContext } from "@/components/Calendar"

import { transitionPeriodKey } from "./transitionPeriodKey"
import { useCalendarTransition } from "./useCalendarTransition"

interface CalendarTransitionContainerProps<T extends HTMLElement = HTMLDivElement> extends PropsWithChildren {
	className?: string
	containerRef?: RefObject<T | null>
}

const defaultStyles: React.CSSProperties = {
	position: "relative",
	display: "flex",
	flexDirection: "column",
	flex: "1 1 auto",
	minHeight: 0,
	width: "100%",
}

export function CalendarTransitionContainer<T extends HTMLElement = HTMLDivElement>({
	children,
	className,
	containerRef,
}: CalendarTransitionContainerProps<T>) {
	const { date, currentView, localizer } = useCalendarContext()
	const { direction, variants } = useCalendarTransition({ containerRef })
	const periodKey = transitionPeriodKey(date, currentView, localizer)

	return (
		<AnimatePresence initial={ false } mode="popLayout" custom={ direction }>
			<motion.div
				key={ periodKey }
				custom={ direction }
				variants={ variants }
				initial="enter"
				animate="center"
				exit="exit"
				transition={ {
					x: { type: "tween", duration: 0.2, ease: "linear" },
					opacity: { duration: 0.2 },
				} }
				className={ className }
				style={ defaultStyles }
			>
				{ children }
			</motion.div>
		</AnimatePresence>
	)
}
