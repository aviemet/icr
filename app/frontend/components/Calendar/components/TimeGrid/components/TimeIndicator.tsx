import { css } from "@linaria/core"
import { useEffect, useState } from "react"

import { vars } from "@/lib"

const indicator = css`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  border-top: 1px dotted ${vars.colors.blue[6]};
  pointer-events: none;
  z-index: 1;
`

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

	return <div className={ indicator } style={ { top: position } } />
}
