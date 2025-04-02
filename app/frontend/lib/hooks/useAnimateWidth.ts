import { CSSProperties, useEffect, useRef } from "react"

type UseAnimateWidthOptions = {
	speed?: number
	transition?: CSSProperties["transitionTimingFunction"]
}

export function useAnimateWidth<TW extends HTMLElement, TC extends HTMLElement>(options?: UseAnimateWidthOptions) {
	const wrapperRef = useRef<TW>(null)
	const contentRef = useRef<TC>(null)

	const mergedOptions: UseAnimateWidthOptions = Object.assign({
		speed: 200,
		transition: "ease-in-out",
	}, options ?? {})

	useEffect(() => {
		if(!contentRef.current || !wrapperRef.current) return

		wrapperRef.current.style.width = "var(--content-width, fit-content)"
		wrapperRef.current.style.transition = `width ${mergedOptions.speed}ms ${mergedOptions.transition}`
		wrapperRef.current.style.overflow = "hidden"

		contentRef.current.style.width = "fit-content"

		const resizeObserver = new ResizeObserver(entries => {
			const width = entries[0].borderBoxSize[0].inlineSize
			wrapperRef.current?.style.setProperty("--content-width", `${width}px`)
		})

		resizeObserver.observe(contentRef.current)
		return () => resizeObserver.disconnect()
	}, [mergedOptions])

	return [wrapperRef, contentRef] as const
}
