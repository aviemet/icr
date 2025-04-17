import { useState, useEffect, useRef, RefObject } from "react"

interface StickyOptions {
	/**
   * Intersection observer threshold (0 to 1)
   * @default 0
   */
	threshold?: number

	/**
   * Intersection observer root margin
   * @default '0px'
   */
	rootMargin?: string
}

/**
 * React hook to detect when a sticky element becomes stuck or unstuck
 * @param options - Configuration options for the Intersection Observer
 * @returns Tuple containing ref to attach to the sticky element and boolean indicating if element is stuck
 */
const useStickySentinel = <T extends HTMLElement>(options: StickyOptions = {}): [RefObject<T>, boolean] => {
	const [isStuck, setIsStuck] = useState<boolean>(false)
	const stickyRef = useRef<T>(null)
	const sentinelRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const stickyElement = stickyRef.current
		if(!stickyElement) return

		// Create and insert the sentinel element
		const sentinel = document.createElement("div")
		sentinel.style.height = "1px"
		sentinel.style.width = "1px"
		sentinel.style.visibility = "hidden"
		sentinelRef.current = sentinel

		if(stickyElement.parentNode) {
			stickyElement.parentNode.insertBefore(sentinel, stickyElement)
		}

		// Set up the intersection observer
		const observer = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]): void => {
				const [entry] = entries
				setIsStuck(!entry.isIntersecting)
			},
			{
				threshold: options.threshold ?? 0,
				rootMargin: options.rootMargin ?? "0px",
			}
		)

		observer.observe(sentinel)

		return () => {
			observer.disconnect()
			if(sentinel.parentNode) {
				sentinel.parentNode.removeChild(sentinel)
			}
		}
	}, [options.threshold, options.rootMargin])

	return [stickyRef, isStuck]
}

export default useStickySentinel
