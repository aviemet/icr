import { MouseEvent, useCallback, useEffect, useRef, useState } from "react"

type UseMouseArgs<T extends HTMLElement = any> = {
	resetOnExit?: boolean
	ref?: React.MutableRefObject<T> | null
}

export function useMouse<T extends HTMLElement = any>(
	options: UseMouseArgs = {
		resetOnExit: false,
		ref: null,
	}
) {
	const [position, setPosition] = useState<{ x: number | null, y: number | null }>({ x: null, y: null })

	const innerRef = useRef<T>(null)

	const usedRef = options.ref ?? innerRef

	const setMousePosition = (event: MouseEvent<HTMLElement>) => {
		if(usedRef.current) {
			const rect = event.currentTarget.getBoundingClientRect()

			const x = Math.max(
				0,
				Math.round(event.pageX - rect.left - (window.pageXOffset || window.scrollX))
			)

			const y = Math.max(
				0,
				Math.round(event.pageY - rect.top - (window.pageYOffset || window.scrollY))
			)

			setPosition({ x, y })
		} else {
			setPosition({ x: event.clientX, y: event.clientY })
		}
	}

	const resetMousePosition = useCallback(() => {
		setPosition({ x: null, y: null })
	}, [])

	const removeListeners = (element: any) => {
		element.removeEventListener("mousemove", setMousePosition)
		if(options.resetOnExit) {
			element.removeEventListener("mouseleave", resetMousePosition)
		}
	}

	useEffect(() => {
		const element = usedRef?.current ? usedRef.current : document

		removeListeners(element)

		element.addEventListener("mousemove", setMousePosition)
		if(options.resetOnExit) {
			element.addEventListener("mouseleave", resetMousePosition)
		}

		return () => {
			removeListeners(element)
		}
	}, [options.resetOnExit, usedRef])

	return { ref: usedRef, ...position }
}
