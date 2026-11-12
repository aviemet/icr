import clsx from "clsx"
import { useEffect, useState } from "react"

import * as classes from "./TimeIndicator.css"

interface TimeIndicatorProps {
	containerRef: React.RefObject<HTMLDivElement>
}

export const TimeIndicator = ({ containerRef }: TimeIndicatorProps) => {
	const [position, setPosition] = useState<number | null>(null)

	useEffect(() => {
		const container = containerRef.current
		if(!container) return

		const handleMouseMove = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect()
			const y = e.clientY - rect.top
			setPosition(y)
		}

		const handleMouseLeave = () => {
			setPosition(null)
		}

		container.addEventListener("mousemove", handleMouseMove)
		container.addEventListener("mouseleave", handleMouseLeave)

		return () => {
			container.removeEventListener("mousemove", handleMouseMove)
			container.removeEventListener("mouseleave", handleMouseLeave)
		}
	}, [containerRef])

	if(position === null) return null

	return <div className={ clsx(classes.indicator) } style={ { top: position } } />
}
