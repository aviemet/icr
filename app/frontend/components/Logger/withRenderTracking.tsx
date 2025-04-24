import React, { useEffect, useRef } from "react"

/* eslint-disable no-console */

const withRenderTracking = <P extends object>(
	WrappedComponent: React.ComponentType<P>,
	componentName: string
) => {
	return function WithRenderTracking(props: P) {
		const renderCount = useRef(0)

		// Track renders
		useEffect(() => {
			renderCount.current += 1
			console.log(`${componentName} rendered ${renderCount.current} times`)

			// Log what props changed
			const propsEntries = Object.entries(props)
			console.group(`${componentName} props:`)
			propsEntries.forEach(([key, value]) => {
				console.log(`${key}:`, value)
			})
			console.groupEnd()
		})

		// Track specific prop changes
		const prevPropsRef = useRef<P>()
		useEffect(() => {
			if(prevPropsRef.current) {
				const changes: Record<string, { previous: unknown, current: unknown }> = {}
				Object.entries(props).forEach(([key, value]) => {
					if(prevPropsRef.current?.[key as keyof P] !== value) {
						changes[key] = {
							previous: prevPropsRef.current?.[key as keyof P],
							current: value,
						}
					}
				})

				if(Object.keys(changes).length > 0) {
					console.group(`${componentName} prop changes:`)
					Object.entries(changes).forEach(([key, { previous, current }]) => {
						console.log(`${key}:`, { previous, current })
					})
					console.groupEnd()
				}
			}
			prevPropsRef.current = props
		})

		return <WrappedComponent { ...props } />
	}
}

export default withRenderTracking
