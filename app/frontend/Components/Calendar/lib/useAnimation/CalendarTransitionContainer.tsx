import { motion, AnimatePresence } from "framer-motion"
import { PropsWithChildren } from "react"

import { useCalendarContext, EventResources } from "@/Components/Calendar"

import { useCalendarTransition } from "./useCalendarTransition"

interface CalendarTransitionContainerProps extends PropsWithChildren {
	className?: string
}

export function CalendarTransitionContainer<TEventResources extends EventResources>({
	children,
	className,
}: CalendarTransitionContainerProps) {
	const { date } = useCalendarContext<TEventResources>()
	const { containerRef, direction, variants } = useCalendarTransition<TEventResources>()

	return (
		<div ref={ containerRef }>
			<AnimatePresence initial={ false } mode="popLayout" custom={ direction }>
				<motion.div
					key={ date.toISOString() }
					custom={ direction }
					variants={ variants }
					initial="enter"
					animate="center"
					exit="exit"
					transition={ {
						x: { type: "tween", duration: 0.2, ease: "easeInOut" },
						opacity: { duration: 0.2 },
					} }
					className={ className }
				>
					{ children }
				</motion.div>
			</AnimatePresence>
		</div>
	)
}
