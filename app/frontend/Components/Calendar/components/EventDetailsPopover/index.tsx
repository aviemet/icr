import { Paper } from "@mantine/core"
import clsx from "clsx"
import React, { forwardRef, useEffect, useState } from "react"

import { CalendarGenerics } from "@/Components/Calendar"
import { vars } from "@/lib"

import { DefaultPopoverContent } from "./DefaultPopoverContent"
import * as classes from "./EventDetailsPopover.css"

interface EventDetailsPopoverProps<T extends CalendarGenerics> {
	event: T["Event"]
	position: { top: number, left: number }
	children?: (event: T["Event"]) => React.ReactNode
}

function EventDetailsPopover<T extends CalendarGenerics>(
	props: EventDetailsPopoverProps<T>,
	ref: React.ForwardedRef<HTMLDivElement | null>
) {
	const { event, position, children } = props
	const [isEntering, setIsEntering] = useState(true)

	useEffect(() => {
		setIsEntering(true)
		const timer = setTimeout(() => {
			setIsEntering(false)
		}, 10)

		return () => clearTimeout(timer)
	}, [])

	const color = event.color || vars.colors.primaryColors.filled

	return (
		<div
			ref={ ref }
			className={ clsx(classes.container) }
			data-entering={ isEntering || undefined }
			style={ {
				top: `${position.top}px`,
				left: `${position.left}px`,
			} }
		>
			<Paper
				className={ clsx(classes.paper) }
				style={ { borderTop: `4px solid ${color}` } }
				shadow="sm"
			>
				{ children ? children(event) : <DefaultPopoverContent event={ event } /> }
			</Paper>
		</div>
	)
}

export default forwardRef(EventDetailsPopover) as <T extends CalendarGenerics>(
	props: EventDetailsPopoverProps<T> & { ref?: React.ForwardedRef<HTMLDivElement | null> }
) => JSX.Element
