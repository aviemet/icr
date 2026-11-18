import { ActionIcon, Link, Tooltip } from "@/components"
import { CalendarIcon } from "@/components/Icons"

import * as classes from "./IconActionButton.css"

interface ScheduleButtonProps {
	href: string
	label?: string
}

export function ScheduleButton({ href, label }: ScheduleButtonProps) {
	const usedLabel = `Schedule${label ? ` ${label}` : ""}`

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position="left"
			transitionProps={ { transition: "fade" } }
		>
			<ActionIcon
				component={ Link }
				href={ href }
				variant="transparent"
				aria-label={ usedLabel }
				className={ classes.iconAction }
			>
				<CalendarIcon size={ 14 } />
			</ActionIcon>
		</Tooltip>
	)
}
