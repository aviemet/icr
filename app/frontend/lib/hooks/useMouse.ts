import { useEffect, useRef, useState } from "react"

type UseMouseArgs<T extends HTMLElement = HTMLElement> = {
	resetOnExit?: boolean
	ref?: React.MutableRefObject<T> | null
}

export function useMouse<T extends HTMLElement = HTMLElement>(
	options: UseMouseArgs<T> = {
		resetOnExit: false,
		ref: null,
	}
) {
	const [position, setPosition] = useState<{ x: number | null, y: number | null }>({ x: null, y: null })

	const innerRef = useRef<T>(null)

	const usedRef = options.ref ?? innerRef

	useEffect(() => {
		const element: Document | T = usedRef.current ? usedRef.current : document

		const setMousePosition = (event: Event) => {
			const mouseEvent = event as MouseEvent
			const target = mouseEvent.currentTarget as HTMLElement | Document

			if(usedRef.current && target instanceof HTMLElement) {
				const rect = target.getBoundingClientRect()

				const x = Math.max(
					0,
					Math.round(mouseEvent.pageX - rect.left - (window.pageXOffset || window.scrollX))
				)

				const y = Math.max(
					0,
					Math.round(mouseEvent.pageY - rect.top - (window.pageYOffset || window.scrollY))
				)

				setPosition({ x, y })
			} else {
				setPosition({ x: mouseEvent.clientX, y: mouseEvent.clientY })
			}
		}

		const resetMousePosition = () => {
			setPosition({ x: null, y: null })
		}

		element.addEventListener("mousemove", setMousePosition)
		if(options.resetOnExit) {
			element.addEventListener("mouseleave", resetMousePosition)
		}

		return () => {
			element.removeEventListener("mousemove", setMousePosition)
			if(options.resetOnExit) {
				element.removeEventListener("mouseleave", resetMousePosition)
			}
		}
	}, [options.resetOnExit, usedRef])

	return { ref: usedRef, ...position }
}
