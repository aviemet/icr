import { motion, AnimatePresence } from "framer-motion"
import { PropsWithChildren, RefObject } from "react"

import { useCalendarContext } from "@/Components/Calendar"

import { useCalendarTransition } from "./useCalendarTransition"

interface CalendarTransitionContainerProps<T extends HTMLElement = HTMLDivElement> extends PropsWithChildren {
	className?: string
	containerRef?: RefObject<T>
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
	const { date } = useCalendarContext()
	const { direction, variants } = useCalendarTransition({ containerRef })

	return (
		<AnimatePresence initial={ false } mode="popLayout" custom={ direction }>
			<motion.div
				key={ date.toISOString() }
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
